import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage/Homepage';
import SignIn from './signin/Signin';
import Signup from './signin/Signup';
import BookingPage from './booking/Booking';
import AdminDashboard from './Dashboardss/AdminDashboard';
import ClientDashboard from './Dashboardss/Clientdashboard';


const App = () => {
    return (
        <Router>

            <Routes>
                <Route path="/" element={<Homepage />} />   {/* Homepage as the primary page */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<Signup />} />  {/* Signup route */}
                <Route path="/bookings" element={<BookingPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} /> {/* ClientDashboard route */}

            </Routes>
        </Router>
    );
};

export default App;
