import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            {/* Background Decorative Images */}
            <div className='bgImage leftImg'>
                <img src="/mobile.png" alt="Mobile Preview" />
            </div>
            <div className='bgImage rightImg'>
                <img src="/logo3.png" alt="Meeting Preview" />
            </div>

            {/* Top Right Info Box */}
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
                    <Button 
                        variant="contained" 
                        className='stackButton mainBtn'
                        onClick={() => router("/auth")}
                    >
                        Sign In
                    </Button>
                    <Button 
                        variant="outlined" 
                        className='stackButton'
                        onClick={() => router("/auth")}
                    >
                        Sign Up
                    </Button>
                    <Button 
                        variant="outlined" 
                        className='stackButton'
                        onClick={() => router("/aljk23")}
                    >
                        Join Meeting
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <footer className='landingFooter'>
                <p>About Apna Video Call  |  English</p>
            </footer>
        </div>
    )
}
