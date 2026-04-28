import React, { Component } from 'react'
import io from 'socket.io-client';
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
import SendIcon from '@mui/icons-material/Send';
import server from '../environment';
import "../App.css"

const socket = io.connect(server);

export default class VideoMeet extends Component {
    constructor(props) {
        super(props);
        this.localVideoref = React.createRef();
        this.videoAvailable = false;
        this.audioAvailable = false;
        this.state = {
            videoPresent: false,
            audioPresent: false,
            showChat: false,
            showParticipants: false,
            messages: [],
            message: "",
            newMessages: 0,
            askForUsername: true,
            username: localStorage.getItem("username") || "",
            videos: []
        }
        this.connections = {};
    }

    componentDidMount() {
        this.getPermissions();
        this.setupSocketListeners();
    }

    setupSocketListeners = () => {
        socket.on('chat-message', (data, sender) => {
            this.setState(prevState => ({
                // Add new messages to the FRONT of the array so they appear at the TOP
                messages: [{ "sender": sender, "message": data }, ...prevState.messages],
                newMessages: prevState.newMessages + 1
            }));
        });

        socket.on('user-joined', (id, clients) => {
            clients.forEach(clientId => {
                if (!this.connections[clientId]) {
                    this.connections[clientId] = new RTCPeerConnection({
                        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
                    });
                    // Logic for WebRTC peers...
                }
            });
        });
    }

    getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.videoAvailable = true;
            this.audioAvailable = true;
            if (this.localVideoref.current) this.localVideoref.current.srcObject = stream;
        } catch (e) { console.log(e); }
    }

    handleVideo = () => this.setState({ videoPresent: !this.state.videoPresent }, this.getUserFullMedia);
    handleAudio = () => this.setState({ audioPresent: !this.state.audioPresent }, this.getUserFullMedia);

    getUserFullMedia = () => {
        if (this.state.videoPresent || this.state.audioPresent) {
            navigator.mediaDevices.getUserMedia({ video: this.state.videoPresent, audio: this.state.audioPresent })
                .then(stream => {
                    if (this.localVideoref.current) this.localVideoref.current.srcObject = stream;
                });
        }
    }

    sendMessage = () => {
        if (this.state.message.trim() === "") return;
        socket.emit('chat-message', this.state.message, this.state.username);
        // Also add our own message to the top of our list immediately
        this.setState(prevState => ({
            messages: [{ "sender": "Me", "message": this.state.message }, ...prevState.messages],
            message: ""
        }));
    }

    connect = () => this.setState({ askForUsername: false }, () => {
        this.getUserFullMedia();
        socket.emit('join-call', window.location.href);
    });

    render() {
        return (
            <div className="meetViewPage">
                {this.state.askForUsername ? (
                    <div className="lobbyContainer">
                        <div className="lobbyMain">
                            <div className="lobbyLeft">
                                <h2 className="lobbyTitle">Ready to join?</h2>
                                <p className="lobbySubtitle">Check your audio and video before starting.</p>
                                <div className="lobbyActions">
                                    <TextField 
                                        label="Username" 
                                        variant="outlined" 
                                        value={this.state.username} 
                                        onChange={e => this.setState({ username: e.target.value })}
                                        className="lobbyInput"
                                        fullWidth
                                    />
                                    <Button variant="contained" className="lobbyJoinBtn" onClick={this.connect} fullWidth>
                                        Join Meeting
                                    </Button>
                                </div>
                            </div>
                            <div className="lobbyRight">
                                <div className="videoPreviewWrapper">
                                    <video ref={this.localVideoref} autoPlay muted className="videoPreview"></video>
                                    <div className="videoBadge">Your Preview</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="meetTopBar">
                            <div className="meetBrand">
                                <span className="zoomText">zoom</span>
                                <span className="workplaceText">Workplace</span>
                            </div>
                            <div className="topRightActions">
                                <SecurityIcon className="securityIcon" />
                                <div className="viewToggle"><GridViewIcon /> <span>View</span></div>
                            </div>
                        </header>

                        {!this.state.videoPresent && (
                            <div className="cameraWarning">
                                <WarningIcon className="warningIcon" />
                                <span>Please enable access to your <u>camera</u> for the best experience.</span>
                                <CloseIcon className="closeBanner" />
                            </div>
                        )}

                        <main className="meetStage">
                            <div className={`stageCenter ${this.state.showChat || this.state.showParticipants ? 'shrunkGrid' : ''}`}>
                                <div className="participantBox">
                                    {this.state.videoPresent ? (
                                        <video ref={this.localVideoref} className="stageVideo" autoPlay muted />
                                    ) : (
                                        <div className="initialAvatar">{this.state.username.charAt(0).toUpperCase()}</div>
                                    )}
                                    <div className="nameTag">
                                        {!this.state.audioPresent && <MicOffIcon className="micOffSmall" />}
                                        {this.state.username} (You)
                                    </div>
                                </div>
                                {this.state.videos.map((video, index) => (
                                    <div className="participantBox" key={index}>
                                        <video ref={(instance) => { if (instance) instance.srcObject = video.stream; }} autoPlay className="stageVideo" />
                                        <div className="nameTag">Participant</div>
                                    </div>
                                ))}
                            </div>

                            {(this.state.showChat || this.state.showParticipants) && (
                                <div className="sidePanel">
                                    <div className="panelHeader">
                                        <span>{this.state.showChat ? "Chat" : "Participants"}</span>
                                        <IconButton onClick={() => this.setState({ showChat: false, showParticipants: false })}><CloseIcon /></IconButton>
                                    </div>
                                    <div className="panelBody">
                                        {this.state.showChat ? (
                                            this.state.messages.map((m, i) => (
                                                <div key={i} className="chatBubble">
                                                    <span className="chatSender">{m.sender}</span>
                                                    <p className="chatMsg">{m.message}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="participantItem">
                                                <div className="pAvatar">{this.state.username.charAt(0)}</div>
                                                <span className="pName">{this.state.username} (Me)</span>
                                            </div>
                                        )}
                                    </div>
                                    {this.state.showChat && (
                                        <div className="panelFooter">
                                            <TextField 
                                                fullWidth placeholder="Message..." 
                                                value={this.state.message}
                                                onChange={(e) => this.setState({ message: e.target.value })}
                                                onKeyPress={(e) => e.key === 'Enter' && this.sendMessage()}
                                            />
                                            <IconButton onClick={this.sendMessage} color="primary"><SendIcon /></IconButton>
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>

                        <footer className="meetToolbar">
                            <div className="toolGroup left">
                                <div className="toolItem" onClick={this.handleAudio}>
                                    <IconButton className={!this.state.audioPresent ? "redStatus" : ""}>
                                        {this.state.audioPresent ? <MicIcon /> : <MicOffIcon />}
                                    </IconButton>
                                    <span>{this.state.audioPresent ? "Mute" : "Unmute"}</span>
                                </div>
                                <div className="toolItem" onClick={this.handleVideo}>
                                    <IconButton className={!this.state.videoPresent ? "redStatus" : ""}>
                                        {this.state.videoPresent ? <VideocamIcon /> : <VideocamOffIcon />}
                                    </IconButton>
                                    <span>{this.state.videoPresent ? "Stop Video" : "Start Video"}</span>
                                </div>
                            </div>

                            <div className="toolGroup center">
                                <div className="toolItem" onClick={() => this.setState({ showParticipants: !this.state.showParticipants, showChat: false })}>
                                    <PeopleIcon className={this.state.showParticipants ? "activeBlue" : ""} />
                                    <span>Participants</span>
                                </div>
                                <div className="toolItem" onClick={() => this.setState({ showChat: !this.state.showChat, showParticipants: false })}>
                                    <Badge badgeContent={this.state.newMessages} color="primary" invisible={this.state.showChat}>
                                        <ChatIcon className={this.state.showChat ? "activeBlue" : ""} />
                                    </Badge>
                                    <span>Chat</span>
                                </div>
                                <div className="toolItem"><FavoriteIcon /><span>React</span></div>
                                <div className="toolItem"><div className="shareIconBox"><ScreenShareIcon /></div><span>Share</span></div>
                                <div className="toolItem"><SecurityIcon /><span>Host Tools</span></div>
                                <div className="toolItem"><AutoFixHighIcon /><span>AI Companion</span></div>
                                <div className="toolItem"><MoreHorizIcon /><span>More</span></div>
                            </div>

                            <div className="toolGroup right">
                                <Button className="endBtn" onClick={() => window.location.href = "/home"}>
                                    <CloseIcon className="endIconCircle" />
                                    <span>End</span>
                                </Button>
                            </div>
                        </footer>
                    </>
                )}
            </div>
        )
    }
}
