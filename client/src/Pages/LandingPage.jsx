import React from 'react';
import { Box, Typography, Button, Container, Grid, Accordion, AccordionSummary, AccordionDetails, Stack, AppBar, Toolbar, Avatar, Drawer, IconButton, Divider, List, ListItem, ListItemText, useTheme, useMediaQuery, Dialog } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import ChatIcon from '@mui/icons-material/Chat';
import FolderIcon from '@mui/icons-material/Folder';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import Footer from '../components/Shared/Footer.jsx';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import JoinRoomCard from '../components/JoinRoomCard.jsx';
import CreateRoomCard from '../components/CreateRoomCard.jsx';

const serverUrl = import.meta.env.VITE_SERVER_URL;

// --- Styled Components ---
const Root = styled(Box)({
  backgroundColor: '#050505',
  color: '#ffffff',
  minHeight: '100vh',
  fontFamily: '"Inter", "Roboto", sans-serif',
  overflowX: 'hidden'
});

const GradientText = styled('span')({
  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const GlassCard = styled(Box)({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.2)'
  }
});

// --- Mock Code Editor Component ---
const CodeEditorMockup = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: [0, -15, 0] }}
    transition={{ 
      opacity: { duration: 1, delay: 0.2 },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
    }}
    style={{ perspective: 1000 }}
  >
    <Box sx={{
      background: '#121212',
      borderRadius: '12px',
      border: '1px solid #2a2a2a',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 60px rgba(59, 130, 246, 0.2)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '700px',
      mx: 'auto',
      mt: { xs: 6, md: 0 }
    }}>
      {/* Window Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderBottom: '1px solid #2a2a2a', bgcolor: '#1a1a1a' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
        </Box>
        <Typography variant="caption" sx={{ ml: 2, color: '#888', fontFamily: 'monospace' }}>main.py - CodeCollab</Typography>
      </Box>
      {/* Editor Body */}
      <Box sx={{ p: 3, fontFamily: '"Fira Code", monospace', fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#d4d4d4', textAlign: 'left', overflowX: 'auto' }}>
        <Typography component="pre" sx={{ margin: 0, fontFamily: 'inherit', lineHeight: 1.6 }}>
          <span style={{ color: '#c678dd' }}>def</span> <span style={{ color: '#61afef' }}>solve_together</span>():<br/>
          {'    '}<span style={{ color: '#e5c07b' }}>print</span>(<span style={{ color: '#98c379' }}>"Welcome to the CodeCollab Workspace!"</span>)<br/>
          {'    '}<span style={{ color: '#e5c07b' }}>time</span>.sleep(<span style={{ color: '#d19a66' }}>1</span>)<br/>
          {'    '}<span style={{ color: '#c678dd' }}>for</span> i <span style={{ color: '#c678dd' }}>in</span> <span style={{ color: '#56b6c2' }}>range</span>(<span style={{ color: '#d19a66' }}>3</span>):<br/>
          {'        '}<span style={{ color: '#c678dd' }}>await</span> <span style={{ color: '#61afef' }}>sync_changes_with_team</span>()<br/>
          {'        '}<span style={{ color: '#e5c07b' }}>print</span>(<span style={{ color: '#98c379' }}>f"Syncing coding in seconds... {`{`}i{`}`}"</span>)<br/>
          <br/>
          <span style={{ color: '#c678dd' }}>if</span> __name__ == <span style={{ color: '#98c379' }}>"__main__"</span>:<br/>
          {'    '}solve_together()
        </Typography>
      </Box>
    </Box>
  </motion.div>
);

const MiniCodeMockup = ({ code }) => (
  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
    <Box sx={{ background: '#121212', borderRadius: '12px', border: '1px solid #2a2a2a', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderBottom: '1px solid #2a2a2a', bgcolor: '#1a1a1a' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f56' }} />
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27c93f' }} />
        </Box>
      </Box>
      <Box sx={{ p: 2, fontFamily: '"Fira Code", monospace', fontSize: '0.85rem', color: '#d4d4d4', textAlign: 'left' }}>
        <Typography component="pre" sx={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: code }} />
      </Box>
    </Box>
  </motion.div>
);


// --- Main Landing Page Component ---
export default function LandingPage() {
  const { isAuthenticated, user, setIsAuthenticated, checkAuth } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [joinModalOpen, setJoinModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setIsAuthenticated(false);
      await checkAuth();
      setDrawerOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const features = [
    { icon: <CodeIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Advanced Code Editor', desc: 'Syntax highlighting, auto-completion, and live execution powered by JDoodle.' },
    { icon: <GroupIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Real-time Collaboration', desc: 'All local events are sent instantaneously over multiple desktop and mobile interfaces.' },
    { icon: <ChatIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Integrated Communication', desc: 'Real-time chatting seamlessly integrated alongside the shared code workspace.' },
    { icon: <FolderIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Smart File Management', desc: 'Create, organize, and navigate through your project structure effortlessly.' },
    { icon: <SecurityIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Secure Environment', desc: 'End-to-end encrypted communication and robust authentication protocols.' },
    { icon: <SpeedIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Lightning Fast Sync', desc: 'Powered by WebSockets for an ultra-low latency collaboration experience.' },
  ];

  return (
    <Root>
      {/* Sticky Blurred Navbar */}
      <AppBar position="fixed" elevation={0} sx={{ pt: 1, pb: 1, backgroundColor: 'rgba(5, 5, 5, 0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', zIndex: 1000 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 } }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', letterSpacing: '-0.5px' }}>
            Code<GradientText>Collab</GradientText>
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button sx={{ color: '#aaa', textTransform: 'none', '&:hover': { color: '#fff' } }} href="#features">Features</Button>
            <Button sx={{ color: '#aaa', textTransform: 'none', '&:hover': { color: '#fff' } }} href="#workflow">Workflow</Button>
            <Button sx={{ color: '#aaa', textTransform: 'none', '&:hover': { color: '#fff' } }} href="#faq">FAQ</Button>
            {!isAuthenticated ? (
              <>
                <Button variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none', borderRadius: '8px' }} component="a" href="/login">Log In</Button>
                <Button variant="contained" sx={{ bgcolor: '#3b82f6', color: '#fff', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#2563eb' } }} component="a" href="/register">Sign Up</Button>
              </>
            ) : (
              <IconButton onClick={() => setDrawerOpen(true)}>
                {user?.avatar ? (
                  <Avatar alt={user?.username} src={user.avatar} sx={{ width: 36, height: 36 }} />
                ) : (
                  <Avatar sx={{ bgcolor: '#3b82f6', width: 36, height: 36, fontSize: '1rem', fontWeight: 'bold' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Slide-in Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: isMobile ? '80%' : 320, padding: 3, backgroundColor: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(20px)', color: 'white', borderLeft: '1px solid rgba(255,255,255,0.08)' } }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom><GradientText>{user?.username}</GradientText></Typography>
          <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>{user?.email}</Typography>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
          
          {user?.ownedRooms?.length > 0 && <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Owned Rooms</Typography>}
          <List sx={{ mb: 2 }}>
            {user?.ownedRooms?.map(room => (
              <ListItem button key={room._id} onClick={() => navigate(`/room/${room._id}`)} sx={{ borderRadius: 2, mb: 0.5, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' } }}>
                <ListItemText primary={room.title} sx={{ color: '#fff' }} />
              </ListItem>
            ))}
          </List>

          {user?.joinedRooms?.length > 0 && <Typography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 'bold', mb: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Joined Rooms</Typography>}
          <List>
            {user?.joinedRooms?.map(room => (
              <ListItem button key={room._id} onClick={() => navigate(`/room/${room._id}`)} sx={{ borderRadius: 2, mb: 0.5, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)' } }}>
                <ListItemText primary={room.title} sx={{ color: '#fff' }} />
              </ListItem>
            ))}
          </List>

          <Button variant="outlined" color="error" fullWidth sx={{ mt: 4, textTransform: 'none', borderRadius: '8px', borderWidth: '2px', '&:hover': { borderWidth: '2px' } }} onClick={handleLogout}>Log Out</Button>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Glowing Orbs for empty space */}
        <Box sx={{ position: 'absolute', top: '10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', top: '30%', right: '-10%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        
        <Container maxWidth="md" sx={{ pt: { xs: 15, md: 16 }, pb: { xs: 10, md: 15 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" fontWeight="800" sx={{ mb: 2, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1, letterSpacing: '-1px' }}>
              Code Together,<br />
              <GradientText>Build Faster</GradientText>
            </Typography>
            <Typography variant="h6" sx={{ color: '#888', mb: 6, fontWeight: 400, mx: 'auto', maxWidth: '80%', lineHeight: 1.6 }}>
              A real-time collaborative code editor designed for seamless team development. Write, share, and build together like never before.
            </Typography>
          </motion.div>

          <Box sx={{ my: 6 }}>
            <CodeEditorMockup />
          </Box>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {!isAuthenticated ? (
              <>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                  <Button variant="contained" size="large" component="a" href="/register" sx={{ bgcolor: '#3b82f6', py: 1.5, px: 5, borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#2563eb' } }}>
                    Start Coding
                  </Button>
                  <Button variant="outlined" size="large" component="a" href="#features" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', py: 1.5, px: 5, borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'none', '&:hover': { borderColor: '#fff' } }}>
                    Learn More
                  </Button>
                </Stack>

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#555', mb: 2, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                    Or continue with
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained" startIcon={<GoogleIcon />} onClick={() => window.location.href = `${serverUrl}/api/auth/google`} sx={{ bgcolor: '#DB4437', color: '#fff', px: 3, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#c53929' } }}>
                      Google
                    </Button>
                    <Button variant="contained" startIcon={<GitHubIcon />} onClick={() => window.location.href = `${serverUrl}/api/auth/github`} sx={{ bgcolor: '#24292e', color: '#fff', px: 3, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#1b1f23' } }}>
                      GitHub
                    </Button>
                  </Stack>
                </Box>
              </>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mt: 4 }}>
                <Button variant="contained" size="large" onClick={() => setCreateModalOpen(true)} sx={{ bgcolor: '#8b5cf6', py: 1.5, px: 5, borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#7c3aed' } }}>
                  Create New Room
                </Button>
                <Button variant="outlined" size="large" onClick={() => setJoinModalOpen(true)} sx={{ color: '#fff', borderColor: '#3b82f6', py: 1.5, px: 5, borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'none', '&:hover': { borderColor: '#60a5fa', bgcolor: 'rgba(59,130,246,0.1)' } }}>
                  Join Existing Room
                </Button>
              </Stack>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ bgcolor: '#0a0a0a', py: 15, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              Everything you need to <GradientText>build faster</GradientText>
            </Typography>
            <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
              Powerful tools seamlessly integrated into one collaborative environment.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={6} key={idx} sx={{ display: 'flex' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.1 }} 
                  style={{ display: 'flex', width: '100%' }}
                >
                  <GlassCard sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center',
                    gap: 2,
                    p: 4
                  }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '50%', 
                      background: 'rgba(59, 130, 246, 0.05)', 
                      border: '1px solid rgba(59, 130, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
                      mb: 1
                    }}>
                      {React.cloneElement(feature.icon, { sx: { fontSize: 32, color: '#3b82f6' } })}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: '#fff' }}>{feature.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.6 }}>{feature.desc}</Typography>
                    </Box>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Workflow Steps */}
      <Box id="workflow" sx={{ py: 15, position: 'relative', bgcolor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={12}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              Simple Steps to <GradientText>Get Started</GradientText>
            </Typography>
            <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
              Begin collaborating in minutes with our intuitive platform.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', maxWidth: '900px', mx: 'auto' }}>
            {/* Vertical Connecting Line */}
            <Box sx={{ position: 'absolute', left: { xs: '24px', md: '50%' }, top: 0, bottom: 0, width: '2px', bgcolor: 'rgba(59,130,246,0.3)', transform: { xs: 'none', md: 'translateX(-50%)' } }} />

            {/* Step 1 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', mb: { xs: 8, md: 15 }, position: 'relative' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, pr: { xs: 0, md: 8 }, pl: { xs: 8, md: 0 }, textAlign: { xs: 'left', md: 'right' }, mb: { xs: 4, md: 0 } }}>
                <Typography variant="h4" fontWeight="bold" mb={2}>Create a Room</Typography>
                <Typography sx={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.6 }}>Start a fresh project and generate a unique Room ID to share with your peers. No complex setup required.</Typography>
              </Box>
              <Box sx={{ position: 'absolute', left: { xs: '24px', md: '50%' }, top: { xs: 0, md: '50%' }, transform: { xs: 'translateX(-50%)', md: 'translate(-50%, -50%)' }, width: 48, height: 48, borderRadius: '50%', bgcolor: '#050505', border: '2px solid #3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', zIndex: 2 }}>1</Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, pl: { xs: 8, md: 8 } }}>
                 <MiniCodeMockup code={`<span style="color: #c678dd">const</span> room_id = <span style="color: #61afef">generateUniqueId</span>();\n<span style="color: #e5c07b">console</span>.<span style="color: #56b6c2">log</span>(<span style="color: #98c379">\`Room Created: \${room_id}\`</span>);`} />
              </Box>
            </Box>

            {/* Step 2 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' }, alignItems: 'center', mb: { xs: 8, md: 15 }, position: 'relative' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, pl: { xs: 8, md: 8 }, textAlign: 'left', mb: { xs: 4, md: 0 } }}>
                <Typography variant="h4" fontWeight="bold" mb={2}>Invite or Join</Typography>
                <Typography sx={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.6 }}>Share your Room ID and let your team join instantly. Everyone is synced in real-time immediately.</Typography>
              </Box>
              <Box sx={{ position: 'absolute', left: { xs: '24px', md: '50%' }, top: { xs: 0, md: '50%' }, transform: { xs: 'translateX(-50%)', md: 'translate(-50%, -50%)' }, width: 48, height: 48, borderRadius: '50%', bgcolor: '#050505', border: '2px solid #3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', zIndex: 2 }}>2</Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, pr: { xs: 0, md: 8 }, pl: { xs: 8, md: 0 } }}>
                 <MiniCodeMockup code={`<span style="color: #c678dd">const</span> user = <span style="color: #98c379">"Alex"</span>;\n<span style="color: #61afef">joinRoom</span>(room_id, user);\n<span style="color: #e5c07b">console</span>.<span style="color: #56b6c2">log</span>(<span style="color: #98c379">"Alex joined the workspace"</span>);`} />
              </Box>
            </Box>

            {/* Step 3 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', position: 'relative' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, pr: { xs: 0, md: 8 }, pl: { xs: 8, md: 0 }, textAlign: { xs: 'left', md: 'right' }, mb: { xs: 4, md: 0 } }}>
                <Typography variant="h4" fontWeight="bold" mb={2}>Code & Deploy</Typography>
                <Typography sx={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.6 }}>Write code together, execute it in the cloud, test your outputs, and ship your features faster than ever.</Typography>
              </Box>
              <Box sx={{ position: 'absolute', left: { xs: '24px', md: '50%' }, top: { xs: 0, md: '50%' }, transform: { xs: 'translateX(-50%)', md: 'translate(-50%, -50%)' }, width: 48, height: 48, borderRadius: '50%', bgcolor: '#050505', border: '2px solid #3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', zIndex: 2 }}>3</Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, pl: { xs: 8, md: 8 } }}>
                 <MiniCodeMockup code={`<span style="color: #c678dd">function</span> <span style="color: #61afef">solve</span>() {\n  <span style="color: #e5c07b">console</span>.<span style="color: #56b6c2">log</span>(<span style="color: #98c379">"Build Faster! 🚀"</span>);\n}\n\n<span style="color: #61afef">solve</span>();`} />
              </Box>
            </Box>

          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box id="faq" sx={{ bgcolor: '#0a0a0a', py: 15, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              Frequently Asked <GradientText>Questions</GradientText>
            </Typography>
            <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
              Find answers to common questions about our platform.
            </Typography>
          </Box>
          <Box sx={{ '& .MuiAccordion-root': { bgcolor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' } } }}>
            {['How many people can collaborate simultaneously?', 'Is my code secure on your platform?', 'Do I need to download any software?', 'What programming languages are supported?'].map((q, i) => (
              <Accordion key={i} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#3b82f6' }} />}>
                  <Typography fontWeight="bold">{q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: '#888' }}>
                    CodeCollab is built to handle multiple users in real-time. Everything runs smoothly in your browser with state-of-the-art WebSockets ensuring low latency and maximum security.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Modals for Create/Join Room */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}>
        <CreateRoomCard />
      </Dialog>
      <Dialog open={joinModalOpen} onClose={() => setJoinModalOpen(false)} PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}>
        <JoinRoomCard />
      </Dialog>
    </Root>
  );
}
