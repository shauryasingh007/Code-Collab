import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import messageRoutes from './routes/messageRoutes.js';
import './config/passport.js'

import axios from 'axios';

const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute";
// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'CLIENT_URL']
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     throw new Error(`Missing required environment variable: ${envVar}`)
//   }
// }

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// Passport
app.use(passport.initialize())

// DB Connect
async function connectToMongoDB() {
    try 
    {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB!');
    } 
    catch (error) 
    {
      console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is running...')
})
app.use('/api/auth', authRoutes);

app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

app.post('/run-code', async (req, res) => {
  const { language, files, stdin } = req.body

  if (!process.env.JDOODLE_CLIENT_ID || !process.env.JDOODLE_CLIENT_SECRET) {
    return res.status(400).json({ message: 'JDoodle API keys are not configured. Please add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to the server .env file.' })
  }

  // Map frontend languages to JDoodle languages and version indexes
  const languageMap = {
    javascript: { lang: 'nodejs', version: '4' }, // Node.js 16/17
    python: { lang: 'python3', version: '4' },    // Python 3.9+
    java: { lang: 'java', version: '5' },         // JDK 21 (Forces UTF-8 by Default, JEP 400)
    cpp: { lang: 'cpp17', version: '1' }          // GCC 11
  };

  const script = files[0]?.content || '';
  const jdoodleLang = languageMap[language]?.lang || language;
  const jdoodleVersion = languageMap[language]?.version || "0";

  try {
    const response = await axios.post(JDOODLE_API_URL, {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: script,
      language: jdoodleLang,
      versionIndex: jdoodleVersion,
      stdin: stdin || ''
    })
    
    // Transform JDoodle response into the format the frontend (Piston format) expects
    const output = response.data.output;
    res.json({
      run: {
        stdout: output,
        stderr: response.data.error || ""
      }
    })
  } catch (error) {
    const apiError = error.response?.data?.error || error.message || 'Error executing code';
    console.error('Error executing code:', apiError)
    res.status(500).json({ message: apiError })
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


export default app
