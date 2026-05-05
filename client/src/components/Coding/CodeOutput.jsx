import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';

function CodeOutput({ value, language, codeOutput, handleCodeOutputChange, codeRunning, handleCodeRunningChange }) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL; 
    const [stdin, setStdin] = useState('');

    const languageVersionMap = {
       javascript: "18.15.0",
       python: "3.10.0",
       java: "15.0.2",
       cpp: "11.2.0",
    };

    const handleRun = async () => {
        handleCodeRunningChange(true);
        
        const languageVersion = languageVersionMap[language];

        const requestData = {
            "language": language,
            "version": languageVersion,
            "stdin": stdin,
            "files": [{
                "content": value,
            }]
        };

        try {
            const response = await axios.post(`${SERVER_URL}/run-code`, requestData);
            const result = response.data.run;
            handleCodeOutputChange(result.stdout || result.stderr || 'No output returned');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            handleCodeOutputChange(`Error: ${errorMessage}`);
        } finally {
            handleCodeRunningChange(false);
        }
    };

    return (
        <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
        }}>
            <Box sx={{ 
                padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.3)'
            }}>
                <Button 
                    variant="contained" 
                    color="primary"
                    size="medium"
                    onClick={handleRun}
                    disabled={codeRunning}
                    sx={{
                        minWidth: '120px',
                        textTransform: 'none',
                        fontWeight: 600,
                        background: '#000000',
                        color: '#ffffff',
                        border: '1px solid #ffffff',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                            border: '1px solid transparent',
                            boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
                            transform: 'translateY(-1px)',
                        },
                        '&:disabled': {
                            background: '#1a1a1a',
                            color: '#6e6e6e',
                            borderColor: '#3e3e42',
                            boxShadow: 'none',
                            transform: 'none'
                        }
                    }}
                >
                    {codeRunning ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Run Code'
                    )}
                </Button>
            </Box>

            <Box sx={{ 
                padding: '16px',
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <Box>
                    <Typography variant="h6" sx={{ 
                        marginBottom: '8px',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '1rem'
                    }}>
                        Standard Input (stdin)
                    </Typography>
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="Type inputs here (separated by spaces or new lines)..."
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-root': {
                                color: '#d4d4d4',
                                fontFamily: "'JetBrains Mono', monospace",
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                            }
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ 
                        marginBottom: '8px',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '1rem'
                    }}>
                        Output
                    </Typography>
                    <Box sx={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        padding: '16px',
                        borderRadius: '8px',
                        flex: 1,
                        overflow: 'auto',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: codeOutput?.startsWith('Error:') ? 
                            '#ef4444' : 
                            '#10b981'
                    }}>
                        {codeOutput || (
                          <Typography variant="body2" sx={{ color: '#858585' }}>
                            Click "Run Code" to see the output here
                          </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CodeOutput;