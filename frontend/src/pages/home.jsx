import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import "../App.css";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            navigate(`/${meetingCode}`);
        }
    }

    return (
        <div className="dashboardContainer">
            {/* Top Navigation Bar */}
            <nav className="dashboardNav">
                <div className="navBrand">
                    <h2 className="zoomLogoSmall">zoom</h2>
                    <span className="brandSubtitle">Workplace</span>
                </div>
                <div className="navActions">
                    <div className="navLink" onClick={() => navigate("/history")}>
                        <RestoreIcon /> <span>History</span>
                    </div>
                    <Button 
                        variant="outlined" 
                        className="logoutBtn"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.reload();
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </nav>

            {/* Main Hero Section */}
            <main className="dashboardMain">
                <div className="heroContent">
                    <h1 className="heroTitle">
                        Connect anytime, <br/>
                        <span>anywhere with anyone.</span>
                    </h1>
                    <p className="heroSubtitle">Providing quality video calls for work and education.</p>
                    
                    <div className="joinActions">
                        <TextField 
                            label="Enter Meeting Code" 
                            variant="outlined" 
                            value={meetingCode} 
                            onChange={e => setMeetingCode(e.target.value)}
                            className="meetingInput"
                        />
                        <Button 
                            variant="contained" 
                            className="joinBtn"
                            onClick={handleJoinVideoCall}
                            startIcon={<VideoCallIcon />}
                        >
                            Join
                        </Button>
                    </div>
                </div>

                <div className="heroIllustration">
                    <img src="/logo3.png" alt="Illustration" />
                </div>
            </main>
        </div>
    )
}

export default withAuth(HomeComponent)