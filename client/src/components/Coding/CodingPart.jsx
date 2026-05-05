import React from 'react'
import CodeEditor from './CodeEditor'
import CodeOutput from './CodeOutput'
import { Box } from '@mui/material';

function CodingPart({value, onChange, language, handleLanguageChange, codeOutput, handleCodeOutputChange, codeRunning, handleCodeRunningChange}) {
  return (
    <Box display="flex" height="100%" sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      overflow: 'hidden',
      color: '#e0e0e0'
    }}>
        <Box flex={0.6} overflow="auto" sx={{ 
          borderRight: '1px solid #2d2d2d',
          backgroundColor: '#1e1e1e'
        }}>
            <CodeEditor 
              value={value} 
              onChange={onChange} 
              language={language} 
              handleLanguageChange={handleLanguageChange}
            />
        </Box>
        <Box flex={0.4} overflow="auto" sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'transparent'
        }}>
            <CodeOutput 
              value={value} 
              language={language} 
              codeOutput={codeOutput} 
              handleCodeOutputChange={handleCodeOutputChange} 
              codeRunning={codeRunning} 
              handleCodeRunningChange={handleCodeRunningChange}
            />
        </Box>
    </Box>
  )
}

export default CodingPart