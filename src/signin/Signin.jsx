import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';
import Navbar from '../homepage/Navbar';
import { useAuth } from '../AuthContext';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth(); // Access signIn from AuthContext

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log('Username input:', username);
        console.log('Password input:', password);
    
        if (!username || !password) {
            setError('Please enter both username and password.');
            console.log('Validation error: Username or password missing.');
            return;
        }
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            console.log('Response status:', response.status);
    
            // Check if the response is OK
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
    
                // Save the JWT token in localStorage or sessionStorage
                localStorage.setItem('token', data.token);  // Storing token in localStorage
    
                // Update the AuthContext with user data
                signIn(data.user, data.token);  // Pass the token along with user data
    
                // Redirect based on user type
                if (data.user.user_type === 'admin') {
                    console.log('Navigating to admin-dashboard.');
                    navigate('/admin-dashboard');
                } else {
                    console.log('Navigating to client-dashboard.');
                    navigate('/client-dashboard');
                }
            } else {
                const errorData = await response.json();
                console.error('Sign-in failed:', errorData.error);
                setError(errorData.error || 'Sign-in failed');
            }
        } catch (err) {
            console.error('Error during sign-in request:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="signin">
            <Navbar /> {/* Navbar outside the form */}

            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <br />

                <label>
                    Username:
                    <br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    Password:
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Sign In</button>
                <p className="signup-link">
                    Don’t have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default SignIn;
