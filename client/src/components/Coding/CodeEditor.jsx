import { Editor } from "@monaco-editor/react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

function CodeEditor({value, onChange, language, handleLanguageChange}) {
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'transparent'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: '56px'
      }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel 
            id="language-select-label"
            sx={{ color: '#ffffff', '&.Mui-focused': { color: '#ffffff' } }}
          >
            Language
          </InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            onChange={handleLanguageChange}
            label="Language"
            sx={{
              color: '#ffffff',
              background: '#000000',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff',
                borderWidth: '1px',
                borderRadius: '50px',
              },
              '&:hover': {
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
                transform: 'translateY(-1px)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&.Mui-focused': {
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '& .MuiSvgIcon-root': {
                color: '#ffffff',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#111',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      backgroundColor: 'rgba(59,130,246,0.1)',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="python">Python 3</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
          </Select>
        </FormControl>  
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            wordWrap: 'on',
            smoothScrolling: true,
            'semanticHighlighting.enabled': true,
            cursorBlinking: 'smooth',
            matchBrackets: 'always',
            colorDecorators: true,
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('leetcode-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '#6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '#569CD6' },
                { token: 'number', foreground: '#B5CEA8' },
                { token: 'string', foreground: '#CE9178' },
              ],
              colors: {
                'editor.background': '#050505',
                'editor.lineHighlightBackground': '#111111',
                'editorLineNumber.foreground': '#555555',
                'editorCursor.foreground': '#3b82f6',
              }
            });
          }}
          onMount={(editor) => {
            editor.updateOptions({ theme: 'leetcode-dark' });
          }}
        />
      </Box>
    </Box>
  );
}
export default CodeEditor;