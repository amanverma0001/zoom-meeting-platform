import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';

const ThemeToggleButton = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const buttonStyle = {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        borderRadius: '50%',
        color: isDarkMode ? '#FF9839' : '#D97500',
        transition: 'all 0.3s ease',
    };

    return (
        <IconButton onClick={toggleTheme} style={buttonStyle}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    );
};

export default ThemeToggleButton;
