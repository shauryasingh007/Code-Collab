import express from 'express'
import passport from 'passport'
import { registerUser, loginUser, logoutUser, oauthCallback, checkAuth, forgotPassword, resetPassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/checkAuth', checkAuth)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Google OAuth
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(400).send('<h2>Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the server .env file.</h2><a href="' + process.env.CLIENT_URL + '">Go back</a>');
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
})
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  oauthCallback
)

// GitHub OAuth
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.status(400).send('<h2>GitHub OAuth is not configured. Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to the server .env file.</h2><a href="' + process.env.CLIENT_URL + '">Go back</a>');
  }
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
})
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  oauthCallback
)

export default router
