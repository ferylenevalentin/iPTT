import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [openSignUp, setOpenSignUp] = useState(false);
    const [signUpError, setSignUpError] = useState("");
    const navigate = useNavigate();

    // Refs for Sign Up fields
    const signUpIdRef = useRef();
    const signUpFirstNameRef = useRef();
    const signUpLastNameRef = useRef();
    const signUpMiddleNameRef = useRef();
    const signUpEmailRef = useRef();
    const signUpPasswordRef = useRef();
    

    // Place the handleLogin function here
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:1337/login", { email, password });
            const { token, role } = response.data;

            // Save token and role to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // Navigate to the dashboard
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const handleSignUp = async () => {
        const newUser = {
            userId: signUpIdRef.current.value.trim(),
            firstName: signUpFirstNameRef.current.value.trim(),
            lastName: signUpLastNameRef.current.value.trim(),
            middleName: signUpMiddleNameRef.current.value.trim(),
            email: signUpEmailRef.current.value.trim(),
            password: signUpPasswordRef.current.value.trim(),
            
        };
    
        // Validate required fields
        if (!newUser.userId || !newUser.email || !newUser.password ) {
            setSignUpError("All fields are required.");
            return;
        }
    
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            setSignUpError("Please enter a valid email address.");
            return;
        }
    
        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newUser.password)) {
            setSignUpError(
                "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return;
        }
    
        try {
            await axios.post("http://localhost:1337/signup", newUser);
            alert("Sign up successful! You can now log in.");
            setOpenSignUp(false);
        } catch (err) {
            setSignUpError("Error signing up. Email or ID might already exist.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    fullWidth
                    onClick={() => setOpenSignUp(true)}
                >
                    Sign Up
                </Button>
            </form>

            {/* Sign Up Dialog */}
            <Dialog open={openSignUp} onClose={() => setOpenSignUp(false)}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    {signUpError && <p className="error">{signUpError}</p>}
                    <TextField inputRef={signUpIdRef} label="ID Number" variant="outlined" fullWidth margin="normal" required />
                    <TextField inputRef={signUpFirstNameRef} label="First Name" variant="outlined" fullWidth margin="normal" required />
                    <TextField inputRef={signUpLastNameRef} label="Last Name" variant="outlined" fullWidth margin="normal" required />
                    <TextField inputRef={signUpMiddleNameRef} label="Middle Name" variant="outlined" fullWidth margin="normal" />
                    <TextField inputRef={signUpEmailRef} label="Email" variant="outlined" fullWidth margin="normal" required />
                    <TextField inputRef={signUpPasswordRef} label="Password" type="password" variant="outlined" fullWidth margin="normal" required />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSignUp(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSignUp} color="primary">
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Login;