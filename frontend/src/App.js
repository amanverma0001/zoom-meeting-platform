import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import VideoMeetComponent from './pages/VideoMeet';
import HomeComponent from './pages/home';
import History from './pages/history';
import ThemeToggleButton from './components/ThemeToggleButton';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import React, { useMemo, useContext } from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Router>
    </div>
  );
}

const AppContent = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#FF9839',
      },
      background: {
        default: isDarkMode ? '#0a0a0a' : '#f8fafc',
        paper: isDarkMode ? '#161616' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000', // Absolute black/white for best contrast
        secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#334155',
      }
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'outlined', // Always use outlined for borders
        },
        styleOverrides: {
          root: {
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#ffffff' : '#000000',
              fontWeight: 500,
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#334155',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: '#FF9839', // Accent color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF9839',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
  }), [isDarkMode]);



  return (
    <MUIThemeProvider theme={muiTheme}>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/home' element={<HomeComponent />} />
          <Route path='/history' element={<History />} />
          <Route path='/:url' element={<VideoMeetComponent />} />
        </Routes>
        <ThemeToggleButton />
      </AuthProvider>
    </MUIThemeProvider>
  );
};

export default App;
