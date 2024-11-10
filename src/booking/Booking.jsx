import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './booking.css';
import Navbar from '../homepage/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { format } from 'date-fns';

const BookingPage = () => {
    const [eventDate, setEventDate] = useState(null);
    const [projectStartDate, setProjectStartDate] = useState(null);
    const [projectEndDate, setProjectEndDate] = useState(null);
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('Karaoke');
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [projectName, setProjectName] = useState('');
    const [serviceType, setServiceType] = useState('New Website');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [bookingType, setBookingType] = useState('performance');
    const { isSignedIn, user, signOut } = useAuth();
    const navigate = useNavigate();

    
    const formattedEventDate = eventDate ? format(eventDate, 'EEEE, MMMM d, yyyy h:mm a') : '';
    const formattedProjectStartDate = projectStartDate ? format(projectStartDate, 'EEEE, MMMM d, yyyy') : '';
    const formattedProjectEndDate = projectEndDate ? format(projectEndDate, 'EEEE, MMMM d, yyyy') : '';    
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Redirect to sign-in page if user is not signed in
    if (!isSignedIn || !token) {
        navigate('/signin');
        return null; // Prevent rendering if not signed in
    }

    const user_id = user?.id;
    console.log("User ID in BookingPage:", user_id);

    // Fetch bookings when the component mounts or when booking type changes
    useEffect(() => {
        if (isSignedIn) {
            console.log("useEffect - Fetching bookings. isSignedIn:", isSignedIn);
            fetchBookings();
        }
    }, [bookingType, isSignedIn]);

    const fetchBookings = async () => {
        const url = bookingType === 'performance'
            ? `/api/bookings?user_id=${user?.id}`
            : `/api/engineeringbookings?user_id=${user?.id}`;

        console.log("Fetching bookings from URL:", url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send token in Authorization header
                },
                credentials: 'include',
            });
            console.log("Fetch response status:", response.status);

            const data = await response.json();
            console.log("Fetch response data:", data);

            if (response.ok) {
                setBookings(data.bookings || []);
                console.log("Bookings set successfully:", data.bookings);
            } else {
                setError(data.error || 'Could not fetch bookings');
                console.error("Fetch request failed:", error);
            }
        } catch (error) {
            setError('An error occurred while fetching bookings.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formattedEventDate = eventDate ? eventDate.toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }) : '';

        const formattedProjectStartDate = projectStartDate ? projectStartDate.toLocaleDateString('en-US') : '';
        const formattedProjectEndDate = projectEndDate ? projectEndDate.toLocaleDateString('en-US') : '';
        const parsedNumberOfGuests = numberOfGuests ? parseInt(numberOfGuests, 10) : null;

        const url = bookingType === 'performance'
            ? '/api/bookings'
            : '/api/engineeringbookings';

        const body = bookingType === 'performance'
            ? {
                event_date: formattedEventDate,
                event_name: eventName,
                event_type: eventType,
                location,
                price,
                number_of_guests: parsedNumberOfGuests,
                special_requests: specialRequests,
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone,
            }
            : {
                project_name: projectName,
                service_type: serviceType,
                project_start_date: formattedProjectStartDate,
                project_end_date: formattedProjectEndDate,
                project_description: projectDescription,
                price,
                special_requests: specialRequests,
            };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send token in Authorization header
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess('Booking created successfully!');
                fetchBookings();
                setEventDate(null);
                setLocation('');
                setPrice('');
                setNumberOfGuests('');
                setProjectDescription('');
                setSpecialRequests('');
                setEventName('');
                setClientName('');
                setClientEmail('');
                setClientPhone('');
                setProjectName('');
                setServiceType('New Website');
            } else {
                console.error("Backend Error:", data);
                setError(data.error || 'Failed to create booking');
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setError('An error occurred while creating the booking.');
        }
    };

    

    return (
        <div className="booking-container">
            <Navbar />

            <h2>Create a Booking</h2>

            <button onClick={signOut}>Sign Out</button>

            <div className='bookingformss'>
                <div className="toggle-buttons">
                    <button onClick={() => setBookingType('performance')} disabled={bookingType === 'performance'}>
                        Performance Booking
                    </button>
                    <button onClick={() => setBookingType('engineering')} disabled={bookingType === 'engineering'}>
                        Engineering Booking
                    </button>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <form onSubmit={handleSubmit}>
                    {bookingType === 'performance' && (
                        <>
                            <label>
                                Event Name:
                                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                            </label>
                            <label>
                                Event Type:
                                <input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)} required />
                            </label>
                            <label>
                                Event Date:
                                <DatePicker
                                    selected={eventDate}
                                    onChange={(date) => setEventDate(date)}
                                    showTimeSelect
                                    dateFormat="EEEE, MMMM d, yyyy h:mm aa"
                                    placeholderText="Select event date and time"
                                />
                            </label>
                            <label>
                                Location:
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                            </label>
                            <label>
                                Client Name:
                                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                            </label>
                            <label>
                                Client Email:
                                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
                            </label>
                            <label>
                                Client Phone:
                                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
                            </label>
                        </>
                    )}

                    {bookingType === 'engineering' && (
                        <>
                            <label>
                                Project Name:
                                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                            </label>
                            <label>
                                Service Type:
                                <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required />
                            </label>
                            <label>
                                Project Start Date:
                                <DatePicker
                                    selected={projectStartDate}
                                    onChange={(date) => setProjectStartDate(date)}
                                    dateFormat="EEEE, MMMM d, yyyy"
                                    placeholderText="Select project start date"
                                />
                            </label>
                            <label>
                                Project End Date:
                                <DatePicker
                                    selected={projectEndDate}
                                    onChange={(date) => setProjectEndDate(date)}
                                    dateFormat="EEEE, MMMM d, yyyy"
                                    placeholderText="Select project end date"
                                />
                            </label>
                            <label>
                                Project Description:
                                <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required />
                            </label>
                        </>
                    )}

                    <label>
                        Price:
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || '')} required />
                    </label>

                    <label>
                        Special Requests:
                        <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
                    </label>

                    <button type="submit">Create Booking</button>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
