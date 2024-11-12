import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './EngineerBooking.css'; // Import the CSS file for styling


const EngineerBooking = ({ token, userId, fetchBookings }) => {
    const [projectStartDate, setProjectStartDate] = useState(null);
    const [projectEndDate, setProjectEndDate] = useState(null);
    const [price, setPrice] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [projectName, setProjectName] = useState('');
    const [serviceType, setServiceType] = useState('New Website');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [projectManager, setProjectManager] = useState(''); // New field
    const [contactEmail, setContactEmail] = useState(''); // New field
    const [contactPhone, setContactPhone] = useState(''); // New field

    const formattedProjectStartDate = projectStartDate ? format(projectStartDate, 'EEEE, MMMM d, yyyy') : '';
    const formattedProjectEndDate = projectEndDate ? format(projectEndDate, 'EEEE, MMMM d, yyyy') : '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const body = {
            project_name: projectName,
            service_type: serviceType,
            project_start_date: formattedProjectStartDate,
            project_end_date: formattedProjectEndDate,
            project_description: projectDescription,
            price,
            special_requests: specialRequests,
            project_manager: projectManager, // New field
            contact_email: contactEmail, // New field
            contact_phone: contactPhone, // New field
        };

        try {
            const response = await fetch('/api/engineeringbookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Engineering booking created successfully!');
                fetchBookings();  // Re-fetch bookings after successful submission
                resetForm();  // Reset the form fields
            } else {
                setError(data.error || 'Failed to create engineering booking');
            }
        } catch (error) {
            setError('An error occurred while creating the booking.');
        }
    };

    const resetForm = () => {
        setProjectName('');
        setServiceType('New Website');
        setProjectStartDate(null);
        setProjectEndDate(null);
        setProjectDescription('');
        setPrice('');
        setSpecialRequests('');
        setProjectManager(''); // Reset new field
        setContactEmail(''); // Reset new field
        setContactPhone(''); // Reset new field
    };

    return (
        <div className="engineeringcard">
            <h3>Engineering Booking</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form className="engineeringform-content" onSubmit={handleSubmit}>
            <div className="engineeringform-group">
    <label htmlFor="projectName">Project Name:</label>
    <input
        id="projectName"
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="New Website Name"
        required
    />
</div>
<div className="engineeringform-group">
    <label htmlFor="projectManager">Project Manager:</label>
    <input
        id="projectManager"
        type="text"
        value={projectManager}
        onChange={(e) => setProjectManager(e.target.value)}
        placeholder="Enter the name of the project manager"
        required
    />
</div>

<div className="engineeringform-group">
    <label htmlFor="contactEmail">Contact Email:</label>
    <input
        id="contactEmail"
        type="email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        placeholder="Enter the contact email (e.g., example@domain.com)"
        required
    />
</div>

<div className="engineeringform-group">
    <label htmlFor="contactPhone">Contact Phone:</label>
    <input
        id="contactPhone"
        type="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        placeholder="Enter phone number (e.g., 123-456-7890)"
        required
    />
</div>

<div className="engineeringform-group">
    <label htmlFor="serviceType">Service Type:</label>
    <select
        id="serviceType"
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        required
    >
        <option value="" disabled>Select a service type</option>
        <option value="NEW PROJECT">NEW WEBSITE</option>
        <option value="CONSULTATION">CONSULTATION</option>
    </select>
</div>
<div className="engineeringform-group">
    <label htmlFor="projectStartDate">Project Start Date:</label>
    <DatePicker
        id="projectStartDate"
        selected={projectStartDate}
        onChange={(date) => setProjectStartDate(date)}
        dateFormat="EEEE, MMMM d, yyyy"
        placeholderText="Select project start date"
    />
</div>

<div className="engineeringform-group">
    <label htmlFor="projectEndDate">Project End Date:</label>
    <DatePicker
        id="projectEndDate"
        selected={projectEndDate}
        onChange={(date) => setProjectEndDate(date)}
        dateFormat="EEEE, MMMM d, yyyy"
        placeholderText="Select project end date"
    />
</div>
<div className="engineeringform-group">
    <label htmlFor="projectDescription">Project Description:</label>
    <textarea
        id="projectDescription"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        placeholder="Provide a detailed description of the project"
        required
    />
</div>
<div className="engineeringform-group">
    <label htmlFor="price">Price:</label>
    <input
        id="price"
        type="number"
        step="5"           // Increment by $5
        min="50"           // Start at $50
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
        placeholder="Enter a price starting at $50, increments of $5"
        required
    />
</div>
<div className="engineeringform-group">
    <label htmlFor="specialRequests">Special Requests:</label>
    <textarea
        id="specialRequests"
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
        placeholder="Enter any special requests or additional information (e.g., preferred features, special accommodations)"
    />
</div>



                <button className="engineeringsubmit-button"type="submit">Submit Engineering Booking</button>
            </form>
        </div>
    );
};

export default EngineerBooking;
