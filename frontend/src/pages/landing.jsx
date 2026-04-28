import React, { useState } from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { Button, Menu, MenuItem } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';

export default function LandingPage() {
    const router = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [language, setLanguage] = useState("English");

    const languages = [
        "English", "Español", "Deutsch", "简体中文", "繁體中文", "Français", "Português"
    ];

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (lang) => {
        if (lang && typeof lang === 'string') setLanguage(lang);
        setAnchorEl(null);
    };

    return (
        <div className='landingPageContainer'>
            <div className='bgImage leftImg'>
                <img src="/mobile.png" alt="Mobile Preview" />
            </div>
            <div className='bgImage rightImg'>
                <img src="/logo3.png" alt="Meeting Preview" />
            </div>

            <div className='infoBox'>
                <p><strong>Download the Apna app</strong></p>
                <p>Download Apna to access Chat, Phone, Docs, and more!</p>
            </div>

            <div className='landingMainContent'>
                <div className='logoSection'>
                    <h1 className='zoomLogo'>zoom</h1>
                    <h2 className='workplaceText'>Workplace</h2>
                </div>

                <div className='buttonStack'>
                    <Button variant="contained" className='stackButton mainBtn' onClick={() => router("/auth")}>Sign In</Button>
                    <Button variant="outlined" className='stackButton' onClick={() => router("/auth")}>Sign Up</Button>
                    <Button variant="outlined" className='stackButton' onClick={() => router("/aljk23")}>Join Meeting</Button>
                </div>
            </div>

            <footer className='landingFooter'>
                <div className="footerLinks">
                    <span>About Apna Video Call</span>
                    <span className="divider">|</span>
                    <div className="languageSelectorContainer">
                        <Button
                            className="langBtn"
                            onClick={handleClick}
                            startIcon={<LanguageIcon />}
                            endIcon={<KeyboardArrowUpIcon className={open ? 'rotate' : ''} />}
                        >
                            {language}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => handleClose()}
                            className="langMenu"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            {languages.map((lang) => (
                                <MenuItem 
                                    key={lang} 
                                    onClick={() => handleClose(lang)}
                                    className="langMenuItem"
                                >
                                    {language === lang && <CheckIcon className="checkIcon" />}
                                    <span className={language === lang ? 'selectedLang' : ''}>{lang}</span>
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                </div>
            </footer>
        </div>
    )
}
