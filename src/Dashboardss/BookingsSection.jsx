import React from 'react';
import { useAuth } from '../AuthContext';
import './adminDashboard.css';

const BookingsSection = ({
    recentBookings = [],
    recentEngineeringBookings = [],
    upcomingBookings = [],
    unpaidBookings = [],
    allRegularBookings = [],
    allEngineeringBookings = [],

}) => {
    const { user } = useAuth();

    // Helper function to format price
    const formatPrice = (price) => `$${(price ?? 0).toLocaleString()}`;

    // Helper function to format date
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A';

    return (
        <div className="bookings-section">
            <h2 className="bookingcard">Bookings Overview</h2>

            {/* Recent Regular Bookings Table */}
            <div className="bookings-table">
                <h3>Recent Regular Bookings</h3>
                {recentBookings?.length > 0 ? (
                    <table aria-label="Recent Regular Bookings Table">
                        <caption>Table showing recent regular bookings details</caption>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Date</th>
                                <th>Location</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((booking, index) => (
                                <tr key={`recent-${booking.id}-${index}`}>
                                    <td>{booking.event_name}</td>
                                    <td>{formatDate(booking.event_date)}</td>
                                    <td>{booking.location}</td>
                                    <td>{formatPrice(booking.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent regular bookings found.</p>
                )}
            </div>

            {/* Recent Engineering Bookings Table */}
            <div className="bookings-table">
                <h3>Recent Engineering Bookings</h3>
                {recentEngineeringBookings?.length > 0 ? (
                    <table aria-label="Recent Engineering Bookings Table">
                        <caption>Table showing recent engineering bookings details</caption>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Start Date</th>
                                <th>Service Type</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEngineeringBookings.map((engBooking, index) => (
                                <tr key={`engineering-${engBooking.id}-${index}`}>
                                    <td>{engBooking.project_name}</td>
                                    <td>{formatDate(engBooking.project_start_date)}</td>
                                    <td>{engBooking.service_type}</td>
                                    <td>{formatPrice(engBooking.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent engineering bookings found.</p>
                )}
            </div>

            <div className="bookings-table">
    <h3>Upcoming Bookings</h3>
    {upcomingBookings?.length > 0 ? (
        <table aria-label="Upcoming Bookings Table">
            <caption>Table showing upcoming bookings details</caption>
            <thead>
                <tr>
                    <th>Event/Project Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Location/Description</th>
                    <th>Client Name</th>
                    <th>Client Phone</th>
                    <th>Project Manager</th>
                    <th>Contact Phone</th>
                    <th>Price</th>
                    <th>Payment Status</th>
                </tr>
            </thead>
            <tbody>
                {upcomingBookings.map((booking, index) => (
                    <tr key={`upcoming-${booking.id}-${index}`}>
                        <td>{booking.event_name || booking.project_name || 'N/A'}</td>
                        <td>{formatDate(booking.event_date || booking.project_start_date)}</td>
                        <td>{booking.project_end_date ? formatDate(booking.project_end_date) : 'N/A'}</td>
                        <td>{booking.location || booking.project_description || 'N/A'}</td>
                        <td>{booking.client_name || 'N/A'}</td>
                        <td>{booking.client_phone || 'N/A'}</td>
                        <td>{booking.project_manager || 'N/A'}</td>
                        <td>{booking.contact_phone || 'N/A'}</td>
                        <td>{formatPrice(booking.price)}</td>
                        <td>{booking.payment_status || 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>No upcoming bookings found.</p>
    )}
</div>

            {/* Unpaid Bookings Table */}
            <div className="bookings-table">
                <h3>Unpaid Bookings</h3>
                {unpaidBookings?.length > 0 ? (
                    <table aria-label="Unpaid Bookings Table">
                        <caption>Table showing unpaid bookings details</caption>
                        <thead>
                            <tr>
                                <th>Event/Project Name</th>
                                <th>Date</th>
                                <th>Payment Status</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaidBookings.map((booking, index) => (
                                <tr key={`unpaid-${booking.id}-${index}`}>
                                    <td>{booking.event_name || booking.project_name}</td>
                                    <td>{formatDate(booking.event_date || booking.project_start_date)}</td>
                                    <td>{booking.payment_status}</td>
                                    <td>{formatPrice(booking.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No unpaid bookings found.</p>
                )}
            </div>

            {/* All Regular Bookings Table */}
            <div className="bookings-table">
                <h3>All Regular Bookings</h3>
                {allRegularBookings?.length > 0 ? (
                    <table aria-label="All Regular Bookings Table">
                        <caption>Table showing all regular bookings details</caption>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Date</th>
                                <th>Event Type</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Payment Status</th>
                                <th>Guests</th>
                                <th>Special Requests</th>
                                <th>Client Name</th>
                                <th>Client Email</th>
                                <th>Client Phone</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allRegularBookings.map((booking, index) => (
                                <tr key={`all-bookings-${booking.id}-${index}`}>
                                    <td>{booking.event_name}</td>
                                    <td>{formatDate(booking.event_date)}</td>
                                    <td>{booking.event_type}</td>
                                    <td>{booking.location}</td>
                                    <td>{booking.status}</td>
                                    <td>{formatPrice(booking.price)}</td>
                                    <td>{booking.payment_status}</td>
                                    <td>{booking.number_of_guests ?? 'N/A'}</td>
                                    <td>{booking.special_requests ?? 'None'}</td>
                                    <td>{booking.client_name}</td>
                                    <td>{booking.client_email}</td>
                                    <td>{booking.client_phone}</td>
                                    <td>{booking.rating ?? 'Unrated'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No regular bookings found.</p>
                )}
            </div>



            {/* All Engineering Bookings Table */}
<div className="bookings-table">
    <h3>All Engineering Bookings</h3>
    {allEngineeringBookings?.length > 0 ? (
        <table aria-label="All Engineering Bookings Table">
            <caption>Table showing all engineering bookings details</caption>
            <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Start Date</th>
                    <th>Service Type</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Payment Status</th>
                    <th>Client Name</th>
                    <th>Client Email</th>
                    <th>Client Phone</th>
                    <th>Special Requests</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                {allEngineeringBookings.map((booking, index) => (
                    <tr key={`engineering-all-${booking.id}-${index}`}>
                        <td>{booking.project_name}</td>
                        <td>{formatDate(booking.project_start_date)}</td>
                        <td>{booking.service_type}</td>
                        <td>{booking.status}</td>
                        <td>{formatPrice(booking.price)}</td>
                        <td>{booking.payment_status}</td>
                        <td>{booking.project_manager}</td>
                        <td>{booking.contact_email}</td>
                        <td>{booking.contact_phone}</td>
                        <td>{booking.special_requests ?? 'None'}</td>
                        <td>{booking.rating ?? 'Unrated'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>No engineering bookings found.</p>
    )}
</div>

        </div>
    );
};

export default BookingsSection;
