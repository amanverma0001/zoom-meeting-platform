import React, { useState, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField, Badge } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import "../App.css"

export default function VideoMeet() {
    // ... (Existing states and logic from your VideoMeet.jsx)
    // For this demonstration, I'm focusing on the UI structure
    const [videoPresent, setVideoPresent] = useState(false);
    const [audioPresent, setAudioPresent] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || "User");
    const [askForUsername, setAskForUsername] = useState(false);

    return (
        <div className="meetViewPage">
            {/* Top Bar */}
            <header className="meetTopBar">
                <div className="meetBrand">
                    <span className="zoomText">zoom</span>
                    <span className="workplaceText">Workplace</span>
                </div>
                <div className="topRightActions">
                    <SecurityIcon className="securityIcon" />
                    <div className="viewToggle">
                        <GridViewIcon /> <span>View</span>
                    </div>
                </div>
            </header>

            {/* Warning Banner */}
            {!videoPresent && (
                <div className="cameraWarning">
                    <WarningIcon className="warningIcon" />
                    <span>Please enable access to your <u>camera</u> for the best experience.</span>
                    <CloseIcon className="closeBanner" />
                </div>
            )}

            {/* Main Stage */}
            <main className="meetStage">
                <div className="stageCenter">
                    <div className="participantBox">
                        {videoPresent ? (
                            <video className="stageVideo" autoPlay muted />
                        ) : (
                            <div className="initialAvatar">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="nameTag">
                            {!audioPresent && <MicOffIcon className="micOffSmall" />}
                            {username}
                        </div>
                    </div>
                </div>

                {/* Glass Chat Overlay */}
                {showChat && (
                    <div className="floatingChat">
                        <div className="chatHeader">
                            <span>Chat</span>
                            <IconButton onClick={() => setShowChat(false)}><CloseIcon /></IconButton>
                        </div>
                        <div className="chatBody">
                            <p className="emptyChat">No messages yet</p>
                        </div>
                        <div className="chatInputArea">
                            <TextField fullWidth placeholder="Send a message..." variant="standard" />
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Toolbar */}
            <footer className="meetToolbar">
                <div className="toolGroup left">
                    <div className="toolItem" onClick={() => setAudioPresent(!audioPresent)}>
                        <IconButton className={!audioPresent ? "redStatus" : ""}>
                            {audioPresent ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        <span>{audioPresent ? "Mute" : "Unmute"}</span>
                    </div>
                    <div className="toolItem" onClick={() => setVideoPresent(!videoPresent)}>
                        <IconButton className={!videoPresent ? "redStatus" : ""}>
                            {videoPresent ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <span>{videoPresent ? "Stop Video" : "Start Video"}</span>
                    </div>
                </div>

                <div className="toolGroup center">
                    <div className="toolItem">
                        <PeopleIcon />
                        <span>Participants</span>
                    </div>
                    <div className="toolItem" onClick={() => setShowChat(!showChat)}>
                        <ChatIcon className={showChat ? "activeBlue" : ""} />
                        <span>Chat</span>
                    </div>
                    <div className="toolItem">
                        <FavoriteIcon />
                        <span>React</span>
                    </div>
                    <div className="toolItem">
                        <div className="shareIconBox">
                            <ScreenShareIcon />
                        </div>
                        <span>Share</span>
                    </div>
                    <div className="toolItem">
                        <SecurityIcon />
                        <span>Host Tools</span>
                    </div>
                    <div className="toolItem">
                        <AutoFixHighIcon />
                        <span>AI Companion</span>
                    </div>
                    <div className="toolItem">
                        <MoreHorizIcon />
                        <span>More</span>
                    </div>
                </div>

                <div className="toolGroup right">
                    <Button className="endBtn">
                        <CloseIcon className="endIconCircle" />
                        <span>End</span>
                    </Button>
                </div>
            </footer>
        </div>
    )
}
