// src/components/JoinRoomCard.jsx
import React from 'react'
import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, IconButton, InputAdornment, CircularProgress } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { toast, Slide } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { styled } from '@mui/system';

import axios from 'axios'
const serverUrl = import.meta.env.VITE_SERVER_URL;

const GradientText = styled('span')({
  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export default function JoinRoomCard() {
  const [roomDetails, setRoomDetails] = useState({ title: "", passkey: "" });
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { checkAuth } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const joinedRoom = await axios.post(
        `${serverUrl}/api/rooms/join`,
        {
          title: roomDetails.title,
          passkey: roomDetails.passkey,
        },
        { withCredentials: true }
      );
      toast.success('✅ Room joined successfully! ➡️ Redirecting...', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
        transition: Slide,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });

      setRoomDetails({ title: "", passkey: "" });
      navigate(`/room/${joinedRoom.data._id}`);
      await checkAuth();
    }
    catch(error){
      if (error.response && error.response.status !== 200) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
    finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        minHeight: 300,
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: { xs: 4, md: 5 },
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#fff',
        borderRadius: 4,
        margin: '0 auto',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Join an <GradientText>Existing Room</GradientText>
      </Typography>
      <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
        Join your friends or teammates by entering a room code.
      </Typography>
      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Room Title"
          value={roomDetails.title}
          onChange={(e) => setRoomDetails({ ...roomDetails, title: e.target.value })}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } }, '& .MuiInputLabel-root': { color: '#888' }, '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Room Passkey"
          type={showPassword ? 'text' : 'password'}
          value={roomDetails.passkey}
          onChange={(e) => setRoomDetails({ ...roomDetails, passkey: e.target.value })}
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } }, '& .MuiInputLabel-root': { color: '#888' }, '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' } }}
          InputProps={{
            sx: { color: '#fff' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(prev => !prev)}
                  edge="end"
                  sx={{ color: '#aaa' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="outlined"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1, borderColor: '#3b82f6', color: '#fff', py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none', '&:hover': { borderColor: '#60a5fa', bgcolor: 'rgba(59,130,246,0.1)' } }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Join Room'}
        </Button>
      </Box>
    </Paper>
  )
}
