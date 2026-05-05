import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, IconButton, Tooltip, Divider, useMediaQuery, useTheme, Drawer } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatSection from '../components/Chatting/ChatSection.jsx';
import CodingPart from '../components/Coding/CodingPart.jsx';
import { io } from 'socket.io-client';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx'; 

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  // const [username, setUsername] = useState('');
  const usernameRef = useRef(''); // Add this
  const [showActiveMembers, setShowActiveMembers] = useState(false);
  const [activeMembers, setActiveMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  // const totalMembersRef = useRef(0); // Add this
  const socketRef = useRef(socket);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1100px)');

  const {checkAuth} = useAuth(); // Import checkAuth from AuthContext

  // Code editor related things: 
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState('java');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeRunning, setCodeRunning] = useState(false);

  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value);
    socketRef.current.emit("code-change", { roomId: roomId, code: value });
  };
  const handleLanguageChange = (event) =>{
    setLanguage(event.target.value);
    socketRef.current.emit("language-change", { roomId: roomId, language: event.target.value });
  }

  const handleCodeOutputChange = (output) => {
    setCodeOutput(output);
    socketRef.current.emit("code-output-change", { roomId: roomId, codeOutput: output });
  }

  const handleCodeRunningChange = (running) => {
    setCodeRunning(running);    
    socketRef.current.emit("code-running-change", { roomId: roomId, codeRunning: running });
  }


  useEffect(() => {
    // console.log("Mounting RoomPage...");
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/rooms/getRoom/${roomId}`, {
        withCredentials: true,
      })
      .then((res) => {setRoom(res.data); 
        const total = res.data.users.length;
        setTotalMembers(total);
        // Emit to server: we send both roomId and total
        socketRef.current.emit('update-total-members', { roomId, total });
      })
      .catch((err) => console.error('Failed to fetch room:', err));

    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/auth/checkAuth`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log('username is: ', res.data.user.username);
        const name = res.data.user.username;
        usernameRef.current = name; 
        socketRef.current.connect();
        socketRef.current.emit('enter-room', { roomId, username: name });
      })
      .catch((err) => console.error('Failed to fetch user:', err));
    
    socketRef.current.on('room-users', (roomUsers) => {
      setActiveMembers(roomUsers);
    });

    socketRef.current.on('total-members-updated', (total)=> setTotalMembers(total)); // Update the ref with the new total
   
    socketRef.current.on('room-left', ({leftUsername, totalMembers}) => {
      console.log('User left:', leftUsername);
      console.log('username:', usernameRef.current);
      setActiveMembers(prevMembers => prevMembers.filter(m => m.username !== leftUsername));
      setTotalMembers(totalMembers); // Update the ref with the new total
      if (leftUsername === usernameRef.current) { 
        
        alert('You have left the room successfully!');
        navigate('/home');
      } 
      else {
        toast.info(`${leftUsername} has left the room.`);
      }  
    });
   
    socketRef.current.on('room-deleted', () => {
      alert('This room has been deleted by the owner.');
      navigate('/home');
    });

    return () => {
      console.log("Unmounting RoomPage...");
      socketRef.current.off('room-deleted');
      socketRef.current.off('code-change');
      socketRef.current.off('room-users');
      socketRef.current.off('room-left');
      socketRef.current.disconnect();
    };
  // }, [roomId, navigate]);
  }, [roomId, navigate]); // We are using it because we want to run useEffect again when userMoves to a different room on same page.


  const handleDeleteClick = async () => {

    const confirmDelete = window.confirm('Are you sure you want to delete this room? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/delete/${roomId}`,
        {},
        { withCredentials: true }
      );
      await checkAuth();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveClick = async () => {
    console.log("Leaving room...");
    const confirmLeave = window.confirm('Are you sure you want to permanently leave this room?');
    if (!confirmLeave) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/leave/${roomId}`,
        {},
        { withCredentials: true }
      );
      await checkAuth();
    } catch (err) {
      alert(err.message);
    }
  }

  const handleCopyDetails = () => {
    const details = `Room ID: ${room?._id}\nPasskey: ${room?.passkey}`;
    navigator.clipboard.writeText(details);
    toast.success('Room details copied!', { theme: 'dark' });
  };

  const handleDownloadCode = () => {
    const extensionMap = { java: 'java', cpp: 'cpp', python: 'py', javascript: 'js' };
    const ext = extensionMap[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded main.${ext}`, { theme: 'dark' });
  };

  const handleClearWorkspace = () => {
    const confirmClear = window.confirm('Are you sure you want to clear the workspace for everyone?');
    if (confirmClear) {
      handleEditorChange('');
      toast.info('Workspace cleared.', { theme: 'dark' });
    }
  };

  const handleExitWorkspace = () => {
    navigate('/');
  };

  useEffect(() => {
    socketRef.current.on("code-change", ({ code }) => {
      setCode(code);
    });
    socketRef.current.on("language-change", ({ language }) => {
      setLanguage(language);
    });
    socketRef.current.on("code-output-change", ({ codeOutput }) => {
      setCodeOutput(codeOutput);
    });
    socketRef.current.on("code-running-change", ({ codeRunning }) => {
      setCodeRunning(codeRunning);
    });
    return () => {
      socketRef.current.off("code-change");
      socketRef.current.off("language-change");
      socketRef.current.off("code-output-change");
      socketRef.current.off("code-running-change");
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', bgcolor: '#050505', overflow: 'hidden' }}>
      
      {/* 1. IDE Top Menu Bar */}
      <Box sx={{ height: '50px', bgcolor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => setShowActiveMembers(true)} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff', letterSpacing: '-0.5px' }}>
            Code<span style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Collab</span>
          </Typography>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 500 }}>
            {room?.title || 'Loading Room...'}
          </Typography>
        </Box>
      </Box>

      {/* 2. Main IDE Content Area (2-Pane with Breathing Space) */}
      <Box sx={{ display: 'flex', flexDirection: isLargeScreen ? 'row' : 'column', flexGrow: 1, overflow: 'hidden', p: 3, gap: 3 }}>
        
        {/* Center Panel (Code Editor) */}
        <Box sx={{ flex: isLargeScreen ? '0.7' : '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           <CodingPart value={code} onChange={handleEditorChange} language={language} handleLanguageChange={handleLanguageChange} codeOutput={codeOutput} handleCodeOutputChange={handleCodeOutputChange} codeRunning={codeRunning} handleCodeRunningChange={handleCodeRunningChange}/>
        </Box>

        {/* Right Sidebar (Chat) */}
        <Box sx={{ 
          flex: isLargeScreen ? '0.3' : '1', 
          height: isLargeScreen ? '100%' : '50vh',
          minHeight: isLargeScreen ? 'auto' : '400px',
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {room && usernameRef.current && (
            <ChatSection roomId={roomId} username={usernameRef.current} totalUsers={totalMembers} socket={socketRef.current}/>
          )}
        </Box>
      </Box>

      {/* Left Sidebar (Dashboard Drawer) */}
      <Drawer anchor="left" open={showActiveMembers} onClose={() => setShowActiveMembers(false)} PaperProps={{ sx: { width: 340, backgroundColor: 'rgba(5, 5, 5, 0.95)', backdropFilter: 'blur(20px)', color: 'white', borderRight: '1px solid rgba(255,255,255,0.08)' } }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
          
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CodeCollab
          </Typography>

          {/* 1. Room Details Section */}
          <Box sx={{ mb: 4, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="overline" sx={{ color: '#888', letterSpacing: '1px' }}>Room Details</Typography>
            <Box sx={{ mt: 1, mb: 2.5 }}>
              <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>ID: <span style={{ color: '#fff', userSelect: 'all' }}>{room?._id}</span></Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>Passkey: <span style={{ color: '#fff', userSelect: 'all' }}>{room?.passkey}</span></Typography>
            </Box>
            <Button fullWidth variant="outlined" startIcon={<ContentCopyIcon size="small" />} onClick={handleCopyDetails} sx={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)', borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)', borderColor: '#3b82f6' } }}>
              Copy Invite Details
            </Button>
          </Box>

          {/* 2. Project Files Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ color: '#888', letterSpacing: '1px', mb: 1.5, display: 'block' }}>Project Files</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <InsertDriveFileIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#fff' }}>main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}</Typography>
            </Box>
          </Box>

          {/* Active Members Section */}
          <Box sx={{ flexGrow: 1, mb: 4 }}>
            <Typography variant="overline" sx={{ color: '#888', letterSpacing: '1px', mb: 1.5, display: 'block' }}>Active Members ({totalMembers})</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {activeMembers.map((member) => (
                <Box key={member.socketId} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' } }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 8px #4caf50' }} />
                  <Typography variant="body2" sx={{ color: member.username === usernameRef.current ? '#fff' : '#ccc', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {member.username} {member.username === usernameRef.current && '(You)'}
                  </Typography>
                  {member.username === room?.owner.username && <span style={{ fontSize: '1rem' }} title="Room Owner">👑</span>}
                </Box>
              ))}
            </Box>
          </Box>

          {/* 3 & 4. Workspace Actions & Danger Zone */}
          <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
             <Typography variant="overline" sx={{ color: '#888', letterSpacing: '1px', mb: 1, display: 'block' }}>Workspace Actions</Typography>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
               <Button startIcon={<DownloadIcon />} onClick={handleDownloadCode} sx={{ justifyContent: 'flex-start', color: '#fff', borderRadius: 2, textTransform: 'none', py: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                 Download Code
               </Button>
               {room && usernameRef.current === room.owner.username && (
                 <Button startIcon={<DeleteSweepIcon />} onClick={handleClearWorkspace} sx={{ justifyContent: 'flex-start', color: '#fff', borderRadius: 2, textTransform: 'none', py: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                   Clear Workspace
                 </Button>
               )}
               <Button startIcon={<ExitToAppIcon />} onClick={handleExitWorkspace} sx={{ justifyContent: 'flex-start', color: '#fff', borderRadius: 2, textTransform: 'none', py: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                 Exit Workspace
               </Button>
               {room && usernameRef.current === room.owner.username ? (
                 <Button startIcon={<DeleteIcon />} color="error" onClick={handleDeleteClick} sx={{ justifyContent: 'flex-start', borderRadius: 2, textTransform: 'none', py: 1, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                   Delete Room
                 </Button>
               ) : (
                 <Button startIcon={<LogoutIcon />} color="warning" onClick={handleLeaveClick} sx={{ justifyContent: 'flex-start', borderRadius: 2, textTransform: 'none', py: 1, '&:hover': { bgcolor: 'rgba(245,158,11,0.1)' } }}>
                   Leave Room
                 </Button>
               )}
             </Box>
          </Box>

        </Box>
      </Drawer>

    </Box>
  );
}
