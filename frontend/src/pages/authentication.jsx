import React, { useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, CircularProgress, Backdrop } from '@mui/material';
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
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState(0); // 0: Sign In, 1: Sign Up
    const [open, setOpen] = useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);
    const navigate = useNavigate();

    let handleAuth = async () => {
        try {
            setLoading(true);
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                await handleRegister(name, username, password);
                setFormState(0);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const handleSocialLogin = (provider) => {
        setLoading(true);
        // Simulate OAuth delay
        setTimeout(() => {
            // Set a dummy token for demo purposes
            localStorage.setItem("token", "social_demo_token");
            navigate("/home");
            setLoading(false);
        }, 1500);
    }

    return (
        <div className="authPageContainer">
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
                <span style={{ marginLeft: '1rem', fontWeight: 600 }}>Connecting...</span>
            </Backdrop>

            <div className="authIllustration">
                <img src="/logo3.png" alt="Meeting Illustration" />
            </div>

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
                            />
                        )}
                        <TextField
                            label="Email or Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <div className="socialIconItem" onClick={() => handleSocialLogin('SSO')}>
                            <VpnKeyIcon /> <span>SSO</span>
                        </div>
                        <div className="socialIconItem" onClick={() => handleSocialLogin('Apple')}>
                            <AppleIcon /> <span>Apple</span>
                        </div>
                        <div className="socialIconItem" onClick={() => handleSocialLogin('Google')}>
                            <GoogleIcon /> <span>Google</span>
                        </div>
                        <div className="socialIconItem" onClick={() => handleSocialLogin('Facebook')}>
                            <FacebookIcon /> <span>Facebook</span>
                        </div>
                        <div className="socialIconItem" onClick={() => handleSocialLogin('Microsoft')}>
                            <MicrosoftIcon /> <span>Microsoft</span>
                        </div>
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