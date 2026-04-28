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
        this.messagesEndRef = React.createRef();
        this.state = {
            videoPresent: false,
            audioPresent: false,
            showChat: true,
            isPoppedOut: false,
            chatPos: { x: 50, y: 50 },
            dragging: false,
            rel: null, 
            localStream: null,
            showFontSizeMenu: false,
            showColorMenu: false,
            showLinkMenu: false,
            linkUrl: '',
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
            if (sender !== this.state.username) {
                this.setState(prevState => ({
                    messages: [...prevState.messages, { 
                        "sender": sender, 
                        "html": data,
                        "time": new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }],
                    newMessages: prevState.showChat ? 0 : prevState.newMessages + 1
                }), this.scrollToBottom);
            }
        });

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    handleOutsideClick = (e) => {
        if (this.state.showFontSizeMenu || this.state.showColorMenu || this.state.showLinkMenu) {
            this.setState({ showFontSizeMenu: false, showColorMenu: false, showLinkMenu: false });
        }
    }

    getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.setState({ localStream: stream, videoPresent: true, audioPresent: true }, () => {
                if (this.localVideoref.current) this.localVideoref.current.srcObject = stream;
            });
        } catch (err) { console.error(err); }
    }

    handleVideo = () => {
        if (!this.state.localStream) { this.getPermissions(); return; }
        const videoTrack = this.state.localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        this.setState({ videoPresent: videoTrack.enabled });
    }

    handleAudio = () => {
        if (!this.state.localStream) { this.getPermissions(); return; }
        const audioTrack = this.state.localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        this.setState({ audioPresent: audioTrack.enabled });
    }

    onMouseDown = (e) => {
        if (!this.state.isPoppedOut) return;
        if (e.button !== 0) return;
        this.setState({ dragging: true, rel: { x: e.pageX - this.state.chatPos.x, y: e.pageY - this.state.chatPos.y } });
        e.stopPropagation(); e.preventDefault();
    }

    onMouseUp = () => this.setState({ dragging: false });

    onMouseMove = (e) => {
        if (!this.state.dragging) return;
        this.setState({ chatPos: { x: e.pageX - this.state.rel.x, y: e.pageY - this.state.rel.y } });
        e.stopPropagation(); e.preventDefault();
    }

    scrollToBottom = () => { if (this.messagesEndRef.current) this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); }

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

    applyStyle = (e, command, value = null) => {
        e.preventDefault();
        e.stopPropagation();
        document.execCommand(command, false, value);
        this.updateToolbarStates();
        if (this.editorRef.current) this.editorRef.current.focus();
        this.setState({ showFontSizeMenu: false, showColorMenu: false, showLinkMenu: false });
    }

    addLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.linkUrl.trim() === "") return;
        let url = this.state.linkUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) { url = 'https://' + url; }
        document.execCommand('createLink', false, url);
        this.setState({ showLinkMenu: false, linkUrl: '' });
        if (this.editorRef.current) this.editorRef.current.focus();
    }

    sendMessage = () => {
        if (!this.editorRef.current) return;
        const content = this.editorRef.current.innerHTML;
        if (content.trim() === "" || content === "<br>" || content === "<div><br></div>") return;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.setState(prevState => ({ messages: [...prevState.messages, { "sender": "You", "html": content, "time": time }] }), this.scrollToBottom);
        socket.emit('chat-message', content, this.state.username);
        this.editorRef.current.innerHTML = "";
        this.editorRef.current.focus();
        this.updateToolbarStates();
    }

    render() {
        const colors = ['#FF1744', '#FF9100', '#FFD600', '#00E676', '#2979FF', '#D500F9', '#FF4081', '#000000'];
        const bgColors = ['#FF5252', '#FFAB40', '#FFFF00', '#69F0AE', '#448AFF', '#E040FB', '#FF80AB', '#FFFFFF'];

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
                    <div className={`stageCenter ${(this.state.showChat && !this.state.isPoppedOut) || this.state.showParticipants ? 'shrunkGrid' : ''}`}>
                        <div className="participantBox">
                            {this.state.videoPresent ? <video ref={this.localVideoref} autoPlay muted className="localVideoFeed"></video> : <div className="initialAvatar">{this.state.username.charAt(0).toUpperCase()}</div>}
                            <div className="nameTag">{!this.state.audioPresent && <MicOffIcon className="micOffSmall" />}{this.state.username}</div>
                        </div>
                    </div>

                    {this.state.showChat && (
                        <div className={`zoomWhitePanel ${this.state.isPoppedOut ? 'floatingChat' : ''}`} style={this.state.isPoppedOut ? { left: this.state.chatPos.x, top: this.state.chatPos.y } : {}}>
                            <div className="panelHeaderWhite" onMouseDown={this.onMouseDown} style={{ cursor: this.state.isPoppedOut ? 'move' : 'default' }}>
                                <span className="panelTitle">{this.state.username}'s Zoom Meeting</span>
                                <div className="panelHeaderIcons">
                                    <OpenInNewIcon className={this.state.isPoppedOut ? "activeBlueIcon" : ""} onClick={() => this.setState({ isPoppedOut: !this.state.isPoppedOut, chatPos: { x: 100, y: 100 } })} />
                                    <CloseIcon onClick={() => this.setState({ showChat: false, isPoppedOut: false })} />
                                </div>
                            </div>
                            
                            <div className="panelBodyWhite">
                                <p className="meetingGroupNotice">Messages addressed to "Meeting Group Chat" will also appear in the meeting group chat in Team Chat</p>
                                <div className="messagesContainer">
                                    {this.state.messages.map((m, i) => {
                                        const showHeader = (i === 0 || this.state.messages[i-1].sender !== m.sender);
                                        return (
                                            <div key={i} className={`messageItemBubble ${!showHeader ? 'grouped' : ''}`}>
                                                {showHeader && (
                                                    <>
                                                        <div className="msgMetaRow">{m.sender} {m.time}</div>
                                                        <div className="msgContentRow">
                                                            <div className="msgUserAvatar">{m.sender.charAt(0).toUpperCase()}</div>
                                                            <div className="msgBubbleContent" dangerouslySetInnerHTML={{ __html: m.html }} />
                                                        </div>
                                                    </>
                                                )}
                                                {!showHeader && (
                                                    <div className="msgContentRow">
                                                        <div className="msgUserAvatar ghostSpacer"></div>
                                                        <div className="msgBubbleContent" dangerouslySetInnerHTML={{ __html: m.html }} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div ref={this.messagesEndRef} />
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
                                        
                                        <div className="toolBtn relativePos" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); this.setState({ showColorMenu: !this.state.showColorMenu }); }}>
                                            <FormatColorTextIcon className="bigToolIcon" />
                                            {this.state.showColorMenu && (
                                                <div className="colorPickerSubMenu" onMouseDown={(e) => e.stopPropagation()}>
                                                    <div className="menuSection">
                                                        <span className="sectionTitle">Text Color</span>
                                                        <div className="colorGrid">
                                                            {colors.map(c => (
                                                                <div key={c} className="colorUnit" style={{ color: c }} onMouseDown={(e) => this.applyStyle(e, 'foreColor', c)}>A</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="menuSection">
                                                        <span className="sectionTitle">Background Color</span>
                                                        <div className="colorGrid">
                                                            {bgColors.map(c => (
                                                                <div key={c} className="colorBlock" style={{ backgroundColor: c, border: c==='#ffffff' ? '1px solid #ccc' : 'none' }} onMouseDown={(e) => this.applyStyle(e, 'hiliteColor', c)}></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Button className="clearFormatBtn" onMouseDown={(e) => this.applyStyle(e, 'removeFormat')}>Clear</Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="toolBtn relativePos" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); this.setState({ showFontSizeMenu: !this.state.showFontSizeMenu }); }}>
                                            Aa
                                            {this.state.showFontSizeMenu && (
                                                <div className="fontSizeSubMenu">
                                                    <div className="sizeItem smallSize" onMouseDown={(e) => this.applyStyle(e, 'fontSize', '2')}>Small</div>
                                                    <div className="sizeItem mediumSize" onMouseDown={(e) => this.applyStyle(e, 'fontSize', '3')}>Medium</div>
                                                    <div className="sizeItem largeSize" onMouseDown={(e) => this.applyStyle(e, 'fontSize', '5')}>Large</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="toolBtn relativePos" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); this.setState({ showLinkMenu: !this.state.showLinkMenu }); }}>
                                            <LinkIcon className="bigToolIcon" />
                                            {this.state.showLinkMenu && (
                                                <div className="linkPickerSubMenu" onMouseDown={(e) => e.stopPropagation()}>
                                                    <LinkIcon className="innerLinkIcon" />
                                                    <input 
                                                        type="text" 
                                                        className="linkInput" 
                                                        placeholder="Type or paste link" 
                                                        value={this.state.linkUrl}
                                                        onChange={(e) => this.setState({ linkUrl: e.target.value })}
                                                        autoFocus
                                                    />
                                                    <Button className="confirmLinkBtn" onMouseDown={this.addLink}>Confirm</Button>
                                                </div>
                                            )}
                                        </div>

                                        <span className="vDivider"></span>
                                        <div className="toolBtn">Hn</div>
                                        <FormatListBulletedIcon className="toolIcon" onMouseDown={(e) => this.applyStyle(e, 'insertUnorderedList')} />
                                        <FormatListNumberedIcon className="toolIcon" onMouseDown={(e) => this.applyStyle(e, 'insertOrderedList')} />
                                        <MoreHorizIcon className="toolIcon" />
                                    </div>
                                    <div className="toPill"><span>to:</span><div className="bluePill">Meeting Group Chat</div></div>
                                    <div className="chatRichEditor" contentEditable="true" ref={this.editorRef} onKeyUp={this.updateToolbarStates} onMouseUp={this.updateToolbarStates} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), this.sendMessage())} placeholder="Type message here ..."></div>
                                    <div className="inputToolbar">
                                        <div className="leftTools"><div className="pencilBox activeBlue"><CreateIcon /></div><InsertDriveFileIcon /><EmojiEmotionsIcon /><MoreHorizIcon /></div>
                                        <div className="sendIconBox" onClick={this.sendMessage}><SendIcon /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="meetToolbar">
                    <div className="toolGroup left">
                        <div className="toolItem" onClick={this.handleAudio}><IconButton className={!this.state.audioPresent ? "redStatus" : ""}>{this.state.audioPresent ? <MicIcon /> : <MicOffIcon />}</IconButton><span>{this.state.audioPresent ? "Mute" : "Unmute"}</span></div>
                        <div className="toolItem" onClick={this.handleVideo}><IconButton className={!this.state.videoPresent ? "redStatus" : ""}>{this.state.videoPresent ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton><span>{this.state.videoPresent ? "Stop Video" : "Start Video"}</span></div>
                    </div>
                    <div className="toolGroup center">
                        <div className="toolItem"><PeopleIcon /><span>Participants</span></div>
                        <div className="toolItem" onClick={() => this.setState({ showChat: !this.state.showChat, isPoppedOut: false })}><ChatIcon className={this.state.showChat ? "activeBlue" : ""} /><span>Chat</span></div>
                        <div className="toolItem"><FavoriteIcon /><span>React</span></div>
                        <div className="toolItem"><div className="shareIconBox"><ScreenShareIcon /></div><span>Share</span></div>
                        <div className="toolItem"><SecurityIcon /><span>Host Tools</span></div>
                        <div className="toolItem"><AutoFixHighIcon /><span>AI Companion</span></div>
                        <div className="toolItem"><MoreHorizIcon /><span>More</span></div>
                    </div>
                    <div className="toolGroup right"><Button className="endBtn" onClick={() => window.location.href = "/home"}><CloseIcon className="endIconCircle" /><span>End</span></Button></div>
                </footer>
            </div>
        )
    }
}
