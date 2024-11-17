import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Signup.css';
import Navbar from '../homepage/Navbar';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [userType, setUserType] = useState('client'); // Default user type
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { signIn } = useAuth(); // Use the signIn function from AuthContext
    const navigate = useNavigate();

    // Password Requirements List
    const passwordRequirements = [
        { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
        { label: "No more than 128 characters", test: (pw) => pw.length <= 128 },
        { label: "At least one uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
        { label: "At least one lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
        { label: "At least one digit (0-9)", test: (pw) => /\d/.test(pw) },
        { label: "At least one special character (!@#$%^&*)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
    ];

    // Password Strength Function
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
        return strength;
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        const strength = getPasswordStrength(password);
        if (strength < 3) {
            setError('Password is too weak. Please meet the requirements.');
            return;
        }


        if (password !== confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }

    
        try {
            const response = await fetch('http://localhost:5002/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, user_type: userType }),
            });
    
            const data = await response.json();
            console.log("Response from server:", data);
    
            if (response.ok) {
                localStorage.setItem('token', data.token);  // Store the token in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));  // Optionally store user info
                signIn(data.user, data.token);  // Sign the user in
    
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => navigate('/signin'), 200);  // Navigate after success
            } else {
                setError(data.error || 'Sign-up failed');
            }
        } catch (err) {
            console.error("Error during sign-up:", err);
            setError('An error occurred. Please try again.');
        }
    };
    
    
    
    
    return (
        <div className="signup">
            <Navbar />
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <br />
                    <input
                        className='signupinput'
                        style={{ width: '30%', margin: 'auto', fontSize: '1.5rem' }}

                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password:
                    <br />
                    <input
                        className='signupinput'
                        style={{ width: '30%', margin: 'auto', fontSize: '1.5rem', marginLeft: 'auto' }}
                        placeholder="Password"

                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </label>


                <label>
                    Confirm Password:
                    <br />
                    <input
                        className='signupinput'
                        placeholder="Password"

                        style={{ width: '30%', margin: 'auto', fontSize: '1.5rem' }}
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    
                </label>
                <button className="toggle-password" type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"} Password
                    </button>

                {/* Password Strength Meter */}
                <div className="password-strength">
                    <div className={`strength-bar strength-${getPasswordStrength(password)}`}></div>
                </div>

                {/* Password Requirements */}
                <div className="password-requirements">
                    <p>Password must contain:</p>
                    <ul>
                        {passwordRequirements.map((req, index) => (
                            <li key={index} className={req.test(password) ? "valid" : "invalid"}>
                                {req.test(password) ? "✔" : "✖"} {req.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <label>
                    User Type:
                    <br />
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
                <button className="signupbutton" type="submit">Sign Up</button>
                <p className="signin-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
