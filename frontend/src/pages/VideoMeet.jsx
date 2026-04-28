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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CreateIcon from '@mui/icons-material/Create';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import GroupIcon from '@mui/icons-material/Group';
import server from '../environment';
import "../App.css"

const socket = io.connect(server);

export default class VideoMeet extends Component {
    constructor(props) {
        super(props);
        this.localVideoref = React.createRef();
        this.state = {
            videoPresent: false,
            audioPresent: false,
            showChat: true,
            showParticipants: false,
            messages: [],
            message: "",
            newMessages: 0,
            askForUsername: false,
            username: localStorage.getItem("username") || "Amandeep Verma",
            videos: []
        }
    }

    componentDidMount() {
        socket.off('chat-message');
        socket.on('chat-message', (data, sender) => {
            this.setState(prevState => ({
                messages: [{ "sender": sender === this.state.username ? "Me" : sender, "message": data }, ...prevState.messages],
                newMessages: prevState.showChat ? 0 : prevState.newMessages + 1
            }));
        });
    }

    sendMessage = () => {
        if (this.state.message.trim() === "") return;
        socket.emit('chat-message', this.state.message, this.state.username);
        this.setState({ message: "" });
    }

    render() {
        return (
            <div className="meetViewPage">
                <header className="meetTopBar">
                    <div className="meetBrand"><span className="zoomText">zoom</span><span className="workplaceText">Workplace</span></div>
                    <div className="topRightActions">
                        <SecurityIcon className="securityIcon" />
                        <div className="viewToggle"><GridViewIcon /> <span>View</span></div>
                    </div>
                </header>

                <main className="meetStage">
                    <div className={`stageCenter ${this.state.showChat || this.state.showParticipants ? 'shrunkGrid' : ''}`}>
                        <div className="participantBox">
                            {!this.state.videoPresent && (
                                <div className="initialAvatar">{this.state.username.charAt(0).toUpperCase()}</div>
                            )}
                            <div className="nameTag">
                                {!this.state.audioPresent && <MicOffIcon className="micOffSmall" />}
                                {this.state.username}
                            </div>
                        </div>
                    </div>

                    {this.state.showChat && (
                        <div className="zoomWhitePanel">
                            <div className="panelHeaderWhite">
                                <span className="panelTitle">{this.state.username}'s Zoom Meeting</span>
                                <div className="panelHeaderIcons">
                                    <OpenInNewIcon />
                                    <CloseIcon onClick={() => this.setState({ showChat: false })} />
                                </div>
                            </div>
                            
                            <div className="panelBodyWhite">
                                <p className="meetingGroupNotice">
                                    Messages addressed to "Meeting Group Chat" will also appear in the meeting group chat in Team Chat
                                </p>
                                
                                <div className="messagesContainer">
                                    {this.state.messages.map((m, i) => (
                                        <div key={i} className="messageItem">
                                            <span className="msgSender">{m.sender}</span>
                                            <p className="msgBody">{m.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="panelFooterWhite">
                                <div className="whoCanSee">
                                    <GroupIcon /> <span>Who can see your messages?</span>
                                </div>
                                <div className="inputBoxWrapper">
                                    <div className="toPill">
                                        <span>to:</span>
                                        <div className="bluePill">Meeting Group Chat</div>
                                    </div>
                                    <textarea 
                                        placeholder="Type message here ..." 
                                        className="chatTextArea"
                                        value={this.state.message}
                                        onChange={(e) => this.setState({ message: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), this.sendMessage())}
                                    />
                                    <div className="inputToolbar">
                                        <div className="leftTools">
                                            <CreateIcon />
                                            <InsertDriveFileIcon />
                                            <EmojiEmotionsIcon />
                                            <MoreHorizIcon />
                                        </div>
                                        <div className="sendIconBox" onClick={this.sendMessage}>
                                            <SendIcon />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="meetToolbar">
                    <div className="toolGroup left">
                        <div className="toolItem" onClick={() => this.setState({ audioPresent: !this.state.audioPresent })}>
                            <IconButton className={!this.state.audioPresent ? "redStatus" : ""}>
                                {this.state.audioPresent ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                            <span>{this.state.audioPresent ? "Mute" : "Unmute"}</span>
                        </div>
                        <div className="toolItem" onClick={() => this.setState({ videoPresent: !this.state.videoPresent })}>
                            <IconButton className={!this.state.videoPresent ? "redStatus" : ""}>
                                {this.state.videoPresent ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                            <span>{this.state.videoPresent ? "Stop Video" : "Start Video"}</span>
                        </div>
                    </div>

                    <div className="toolGroup center">
                        <div className="toolItem"><PeopleIcon /><span>Participants</span></div>
                        <div className="toolItem" onClick={() => this.setState({ showChat: !this.state.showChat })}>
                            <ChatIcon className={this.state.showChat ? "activeBlue" : ""} />
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
            </div>
        )
    }
}
