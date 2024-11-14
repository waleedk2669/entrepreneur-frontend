import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth to access user data and signOut function

import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth(); // Access user data and signOut function from AuthContext

    const handleSignOut = () => {
        signOut(); // Call signOut from AuthContext
        navigate('/signin'); // Redirect to the sign-in page after sign-out
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
                </li>
                {/* Show 'Booking' link only when user is signed in */}
                {user && (
                    <li>
                        <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'active' : '')}>Booking</NavLink>
                    </li>
                )}

                {/* Show 'Sign In' link only when the user is not signed in */}
                {!user && (
                    <li>
                        <NavLink to="/signin" className={({ isActive }) => (isActive ? 'active' : '')}>Sign In</NavLink>
                    </li>
                )}

                {/* Show 'Admin Dashboard' link only if the user is an admin */}
                {user && user.user_type === 'admin' && (
                    <li>
                        <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Admin Dashboard</NavLink>
                    </li>
                )}

                {/* Show 'Client Dashboard' link only if the user is a client */}
                {user && user.user_type === 'client' && (
                    <li>
                        <NavLink to="/client-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Client Dashboard
                        </NavLink>
                    </li>
                )}

                {/* Show 'Sign Out' button only if the user is signed in */}
                {user && (
                    <li>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
