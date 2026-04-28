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

    // Translation Dictionary
    const content = {
        "English": {
            signIn: "Sign In",
            signUp: "Sign Up",
            joinMeeting: "Join Meeting",
            workplace: "Workplace",
            dlTitle: "Download the Apna app",
            dlDesc: "Download Apna to access Chat, Phone, Docs, and more!",
            about: "About Apna Video Call"
        },
        "Español": {
            signIn: "Iniciar sesión",
            signUp: "Registrarse",
            joinMeeting: "Entrar a una reunión",
            workplace: "Espacio de trabajo",
            dlTitle: "Descargar la aplicación Apna",
            dlDesc: "¡Descarga Apna para acceder a chat, teléfono, documentos y más!",
            about: "Acerca de Apna Video Call"
        },
        "Deutsch": {
            signIn: "Anmelden",
            signUp: "Kostenlos registrieren",
            joinMeeting: "An einer Sitzung teilnehmen",
            workplace: "Arbeitsplatz",
            dlTitle: "Apna-App herunterladen",
            dlDesc: "Laden Sie Apna herunter, um auf Chat, Telefon, Dokumente und mehr zuzugreifen!",
            about: "Über Apna Video Call"
        },
        "简体中文": {
            signIn: "登录",
            signUp: "免费注册",
            joinMeeting: "加入会议",
            workplace: "工作场所",
            dlTitle: "下载 Apna 应用程序",
            dlDesc: "下载 Apna 以访问聊天、电话、文档等！",
            about: "关于 Apna 视频通话"
        },
        "Français": {
            signIn: "Se connecter",
            signUp: "S'inscrire gratuitement",
            joinMeeting: "Se joindre à une réunion",
            workplace: "Espace de travail",
            dlTitle: "Télécharger l'application Apna",
            dlDesc: "Téléchargez Apna pour accéder au chat, au téléphone, aux documents et plus encore !",
            about: "À propos de Apna Video Call"
        },
        "Português": {
            signIn: "Efetuar Login",
            signUp: "Inscreva-se gratuitamente",
            joinMeeting: "Ingressar em uma Reunião",
            workplace: "Ambiente de Trabalho",
            dlTitle: "Baixe o aplicativo Apna",
            dlDesc: "Baixe o Apna para acessar Chat, Telefone, Docs e muito mais!",
            about: "Sobre Apna Video Call"
        }
    };

    const languages = Object.keys(content);
    const currentContent = content[language] || content["English"];

    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
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
                <p><strong>{currentContent.dlTitle}</strong></p>
                <p>{currentContent.dlDesc}</p>
            </div>

            <div className='landingMainContent'>
                <div className='logoSection'>
                    <h1 className='zoomLogo'>zoom</h1>
                    <h2 className='workplaceText'>{currentContent.workplace}</h2>
                </div>

                <div className='buttonStack'>
                    <Button variant="contained" className='stackButton mainBtn' onClick={() => router("/auth")}>
                        {currentContent.signIn}
                    </Button>
                    <Button variant="outlined" className='stackButton' onClick={() => router("/auth")}>
                        {currentContent.signUp}
                    </Button>
                    <Button variant="outlined" className='stackButton' onClick={() => router("/aljk23")}>
                        {currentContent.joinMeeting}
                    </Button>
                </div>
            </div>

            <footer className='landingFooter'>
                <div className="footerLinks">
                    <span>{currentContent.about}</span>
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
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} onClick={() => handleClose(lang)} className="langMenuItem">
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
