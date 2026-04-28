import React, { Component } from 'react'
import io from 'socket.io-client';
import { Button, IconButton, Badge } from '@mui/material';
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
import LinkIcon from '@mui/icons-material/Link';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import server from '../environment';
import "../App.css"

const socket = io.connect(server);

export default class VideoMeet extends Component {
    constructor(props) {
        super(props);
        this.localVideoref = React.createRef();
        this.editorRef = React.createRef();
        this.state = {
            videoPresent: false,
            audioPresent: false,
            showChat: true,
            showParticipants: false,
            messages: [],
            newMessages: 0,
            username: localStorage.getItem("username") || "Amandeep Verma",
            activeStyles: {
                bold: false,
                italic: false,
                underline: false,
                strikeThrough: false
            }
        }
    }

    componentDidMount() {
        socket.off('chat-message');
        socket.on('chat-message', (data, sender) => {
            this.setState(prevState => ({
                messages: [{ "sender": sender === this.state.username ? "Me" : sender, "html": data }, ...prevState.messages],
                newMessages: prevState.showChat ? 0 : prevState.newMessages + 1
            }));
        });
    }

    updateToolbarStates = () => {
        this.setState({
            activeStyles: {
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikeThrough: document.queryCommandState('strikeThrough')
            }
        });
    }

    applyStyle = (e, command) => {
        e.preventDefault();
        document.execCommand(command, false, null);
        this.updateToolbarStates();
        if (this.editorRef.current) this.editorRef.current.focus();
    }

    sendMessage = () => {
        if (!this.editorRef.current) return;
        const content = this.editorRef.current.innerHTML;
        if (content.trim() === "" || content === "<br>" || content === "<div><br></div>") return;
        
        socket.emit('chat-message', content, this.state.username);
        this.editorRef.current.innerHTML = "";
        this.updateToolbarStates();
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
                            {!this.state.videoPresent && <div className="initialAvatar">{this.state.username.charAt(0).toUpperCase()}</div>}
                            <div className="nameTag">{!this.state.audioPresent && <MicOffIcon className="micOffSmall" />}{this.state.username}</div>
                        </div>
                    </div>

                    {this.state.showChat && (
                        <div className="zoomWhitePanel">
                            <div className="panelHeaderWhite">
                                <span className="panelTitle">{this.state.username}'s Zoom Meeting</span>
                                <div className="panelHeaderIcons"><OpenInNewIcon /><CloseIcon onClick={() => this.setState({ showChat: false })} /></div>
                            </div>
                            
                            <div className="panelBodyWhite">
                                <p className="meetingGroupNotice">Messages addressed to "Meeting Group Chat" will also appear in the meeting group chat in Team Chat</p>
                                <div className="messagesContainer">
                                    {this.state.messages.map((m, i) => (
                                        <div key={i} className="messageItem">
                                            <span className="msgSender">{m.sender}</span>
                                            <div className="msgBody" dangerouslySetInnerHTML={{ __html: m.html }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="panelFooterWhite">
                                <div className="whoCanSee"><GroupIcon /> <span>Who can see your messages?</span></div>
                                <div className="inputBoxWrapper richTextActive">
                                    <div className="richTextToolbar">
                                        <div className={`toolBtn ${this.state.activeStyles.bold ? 'active' : ''}`} onMouseDown={(e) => this.applyStyle(e, 'bold')}>B</div>
                                        <div className={`toolBtn ${this.state.activeStyles.italic ? 'active' : ''}`} onMouseDown={(e) => this.applyStyle(e, 'italic')}><i>I</i></div>
                                        <div className={`toolBtn ${this.state.activeStyles.underline ? 'active' : ''}`} onMouseDown={(e) => this.applyStyle(e, 'underline')}><u>U</u></div>
                                        <div className={`toolBtn ${this.state.activeStyles.strikeThrough ? 'active' : ''}`} onMouseDown={(e) => this.applyStyle(e, 'strikeThrough')}><s>S</s></div>
                                        <span className="vDivider"></span>
                                        <FormatColorTextIcon className="toolIcon" />
                                        <div className="toolBtn">Aa</div>
                                        <LinkIcon className="toolIcon" />
                                        <span className="vDivider"></span>
                                        <div className="toolBtn">Hn</div>
                                        <FormatListBulletedIcon className="toolIcon" onMouseDown={(e) => this.applyStyle(e, 'insertUnorderedList')} />
                                        <FormatListNumberedIcon className="toolIcon" onMouseDown={(e) => this.applyStyle(e, 'insertOrderedList')} />
                                        <MoreHorizIcon className="toolIcon" />
                                    </div>
                                    <div className="toPill"><span>to:</span><div className="bluePill">Meeting Group Chat</div></div>
                                    
                                    <div 
                                        className="chatRichEditor"
                                        contentEditable="true"
                                        ref={this.editorRef}
                                        onKeyUp={this.updateToolbarStates}
                                        onMouseUp={this.updateToolbarStates}
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), this.sendMessage())}
                                        placeholder="Type message here ..."
                                    ></div>

                                    <div className="inputToolbar">
                                        <div className="leftTools">
                                            <div className="pencilBox activeBlue"><CreateIcon /></div>
                                            <InsertDriveFileIcon />
                                            <EmojiEmotionsIcon />
                                            <MoreHorizIcon />
                                        </div>
                                        <div className="sendIconBox" onClick={this.sendMessage}><SendIcon /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="meetToolbar">
                    <div className="toolGroup left">
                        <div className="toolItem" onClick={() => this.setState({ audioPresent: !this.state.audioPresent })}>
                            <IconButton className={!this.state.audioPresent ? "redStatus" : ""}>{this.state.audioPresent ? <MicIcon /> : <MicOffIcon />}</IconButton>
                            <span>{this.state.audioPresent ? "Mute" : "Unmute"}</span>
                        </div>
                        <div className="toolItem" onClick={() => this.setState({ videoPresent: !this.state.videoPresent })}>
                            <IconButton className={!this.state.videoPresent ? "redStatus" : ""}>{this.state.videoPresent ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                            <span>{this.state.videoPresent ? "Stop Video" : "Start Video"}</span>
                        </div>
                    </div>
                    <div className="toolGroup center">
                        <div className="toolItem"><PeopleIcon /><span>Participants</span></div>
                        <div className="toolItem" onClick={() => this.setState({ showChat: !this.state.showChat })}><ChatIcon className={this.state.showChat ? "activeBlue" : ""} /><span>Chat</span></div>
                        <div className="toolItem"><FavoriteIcon /><span>React</span></div>
                        <div className="toolItem"><div className="shareIconBox"><ScreenShareIcon /></div><span>Share</span></div>
                        <div className="toolItem"><SecurityIcon /><span>Host Tools</span></div>
                        <div className="toolItem"><AutoFixHighIcon /><span>AI Companion</span></div>
                        <div className="toolItem"><MoreHorizIcon /><span>More</span></div>
                    </div>
                    <div className="toolGroup right">
                        <Button className="endBtn" onClick={() => window.location.href = "/home"}><CloseIcon className="endIconCircle" /><span>End</span></Button>
                    </div>
                </footer>
            </div>
        )
    }
}
