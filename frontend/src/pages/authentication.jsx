import React, { useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { Button, TextField, Snackbar } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import MicrosoftIcon from '@mui/icons-material/Window';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import "../App.css"

export default function Authentication() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [formState, setFormState] = useState(0); // 0: Sign In, 1: Sign Up
    const [open, setOpen] = useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                await handleRegister(name, username, password);
                setFormState(0);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed");
            setOpen(true);
        }
    }

    return (
        <div className="authPageContainer">
            {/* Left Side: Illustration */}
            <div className="authIllustration">
                <img src="/logo3.png" alt="Meeting Illustration" />
            </div>

            {/* Right Side: Form */}
            <div className="authFormSection">
                <div className="authFormContainer">
                    <h1 className="authTitle">{formState === 0 ? "Sign in" : "Sign up"}</h1>
                    
                    <div className="inputGroup">
                        {formState === 1 && (
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="authInput"
                            />
                        )}
                        <TextField
                            label="Email or Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="authInput"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="authInput"
                        />
                    </div>

                    <Button 
                        variant="contained" 
                        fullWidth 
                        className="authMainBtn"
                        onClick={handleAuth}
                    >
                        {formState === 0 ? "Next" : "Create Account"}
                    </Button>

                    <div className="authSwitchText">
                        {formState === 0 ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setFormState(formState === 0 ? 1 : 0)}>
                            {formState === 0 ? "Sign Up" : "Sign In"}
                        </span>
                    </div>

                    <div className="socialLoginDivider">
                        <span>Or sign in with</span>
                    </div>

                    <div className="socialIconsGrid">
                        <div className="socialIconItem"><VpnKeyIcon /> <span>SSO</span></div>
                        <div className="socialIconItem"><AppleIcon /> <span>Apple</span></div>
                        <div className="socialIconItem"><GoogleIcon /> <span>Google</span></div>
                        <div className="socialIconItem"><FacebookIcon /> <span>Facebook</span></div>
                        <div className="socialIconItem"><MicrosoftIcon /> <span>Microsoft</span></div>
                    </div>

                    <div className="authFooterLinks">
                        <p>Forgot password?</p>
                        <div className="footerLegal">
                            <span>Help</span>
                            <span>Terms</span>
                            <span>Privacy</span>
                        </div>
                        <p className="recaptchaText">
                            Apna is protected by reCAPTCHA and the Google <br/>
                            Privacy Policy and Terms of Service apply.
                        </p>
                    </div>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={error}
            />
        </div>
    )
}