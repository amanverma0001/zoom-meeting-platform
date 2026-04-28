import React, { Component } from 'react'
import io from 'socket.io-client';
import { Button, IconButton, TextField, Badge, InputAdornment } from '@mui/material';
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
var connections = {};

const peerConfig = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default class VideoMeet extends Component {
    constructor(props) {
        super(props);
        this.localVideoref = React.createRef();
        this.videoAvailable = false;
        this.audioAvailable = false;

        this.state = {
            videoPresent: false,
            audioPresent: false,
            screenPresent: false,
            showChat: false,
            showParticipants: false,
            messages: [],
            message: "",
            newMessages: 0,
            askForUsername: true,
            username: localStorage.getItem("username") || "",
            videos: [],
            screenAvailable: false
        }
        this.connections = {};
    }

    componentDidMount() {
        this.getPermissions();
    }

    getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.videoAvailable = true;
            this.audioAvailable = true;
            if (this.localVideoref.current) {
                this.localVideoref.current.srcObject = stream;
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleVideo = () => this.setState({ videoPresent: !this.state.videoPresent }, this.getUserFullMedia);
    handleAudio = () => this.setState({ audioPresent: !this.state.audioPresent }, this.getUserFullMedia);

    getUserFullMedia = () => {
        if ((this.state.videoPresent && this.videoAvailable) || (this.state.audioPresent && this.audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: this.state.videoPresent, audio: this.state.audioPresent })
                .then(this.getUserMediaSuccess)
                .catch(e => console.log(e));
        } else {
            try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }
        }
    }

    getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { }

        window.localStream = stream;
        this.localVideoref.current.srcObject = stream;

        for (let id in this.connections) {
            if (id === socket.id) continue;
            this.connections[id].addStream(window.localStream);
            this.connections[id].createOffer().then((description) => {
                this.connections[id].setLocalDescription(description)
                    .then(() => {
                        socket.emit('signal', id, JSON.stringify({ 'sdp': this.connections[id].localDescription }));
                    })
            })
        }
    }

    handleEndCall = () => {
        try {
            let tracks = this.localVideoref.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch (e) { }
        window.location.href = "/home";
    }

    connect = () => this.setState({ askForUsername: false }, () => {
        this.getUserMedia();
        socket.emit('join-call', window.location.href);
    });

    getUserMedia = () => {
        if ((this.state.videoPresent && this.videoAvailable) || (this.state.audioPresent && this.audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: this.state.videoPresent, audio: this.state.audioPresent })
                .then(this.getUserMediaSuccess)
                .catch(e => console.log(e));
        }
    }

    sendMessage = () => {
        socket.emit('chat-message', this.state.message, this.state.username);
        this.setState({ message: "" });
    }

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
                                <div className="viewToggle">
                                    <GridViewIcon /> <span>View</span>
                                </div>
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
                                        <div className="initialAvatar">
                                            {this.state.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="nameTag">
                                        {!this.state.audioPresent && <MicOffIcon className="micOffSmall" />}
                                        {this.state.username} (You)
                                    </div>
                                </div>

                                {this.state.videos.map((video) => (
                                    <div className="participantBox" key={video.socketId}>
                                        <video
                                            ref={(instance) => { if (instance) instance.srcObject = video.stream; }}
                                            autoPlay className="stageVideo"
                                        />
                                        <div className="nameTag">Participant</div>
                                    </div>
                                ))}
                            </div>

                            {/* Side Panel: Chat */}
                            {this.state.showChat && (
                                <div className="sidePanel">
                                    <div className="panelHeader">
                                        <span>Chat</span>
                                        <IconButton onClick={() => this.setState({ showChat: false })}><CloseIcon /></IconButton>
                                    </div>
                                    <div className="panelBody chatBody">
                                        {this.state.messages.length > 0 ? this.state.messages.map((m, i) => (
                                            <div key={i} className="chatBubble">
                                                <span className="chatSender">{m.sender}</span>
                                                <p className="chatMsg">{m.message}</p>
                                            </div>
                                        )) : <p className="emptyState">No messages yet</p>}
                                    </div>
                                    <div className="panelFooter">
                                        <TextField 
                                            fullWidth 
                                            placeholder="Send message..." 
                                            variant="standard" 
                                            value={this.state.message}
                                            onChange={(e) => this.setState({ message: e.target.value })}
                                        />
                                        <IconButton onClick={this.sendMessage} color="primary"><SendIcon /></IconButton>
                                    </div>
                                </div>
                            )}

                            {/* Side Panel: Participants */}
                            {this.state.showParticipants && (
                                <div className="sidePanel">
                                    <div className="panelHeader">
                                        <span>Participants ({this.state.videos.length + 1})</span>
                                        <IconButton onClick={() => this.setState({ showParticipants: false })}><CloseIcon /></IconButton>
                                    </div>
                                    <div className="panelBody">
                                        <div className="participantItem">
                                            <div className="pAvatar">{this.state.username.charAt(0)}</div>
                                            <span className="pName">{this.state.username} (Me, Host)</span>
                                            <div className="pStatus">
                                                {this.state.audioPresent ? <MicIcon /> : <MicOffIcon className="red" />}
                                                {this.state.videoPresent ? <VideocamIcon /> : <VideocamOffIcon className="red" />}
                                            </div>
                                        </div>
                                        {this.state.videos.map((v, i) => (
                                            <div key={i} className="participantItem">
                                                <div className="pAvatar">P</div>
                                                <span className="pName">Participant</span>
                                                <div className="pStatus"><MicIcon /><VideocamIcon /></div>
                                            </div>
                                        ))}
                                    </div>
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
                                    <Badge badgeContent={this.state.newMessages} color="primary">
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
                                <Button className="endBtn" onClick={this.handleEndCall}>
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
