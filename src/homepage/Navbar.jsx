import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth to access the signOut function

import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth(); // Get the signOut function from AuthContext

    const handleSignOut = () => {
        signOut(); // Call signOut from AuthContext, which will handle the sign-out process
        navigate('/signin'); // Redirect to the sign-in page after sign-out
    };


    return (
        <nav className="navbar">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'active' : '')}>Booking</NavLink>
                </li>
                <li>
                    <NavLink to="/signin" className={({ isActive }) => (isActive ? 'active' : '')}>Sign In</NavLink>
                </li>
                <li>
                    <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
                </li>

                <li>
                    <NavLink to="/client-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Client Dashboard
                    </NavLink>
                </li>

                <li>
                    <button onClick={handleSignOut}>Sign Out</button>
                </li>

            </ul>
        </nav>
    );
};

export default Navbar;
