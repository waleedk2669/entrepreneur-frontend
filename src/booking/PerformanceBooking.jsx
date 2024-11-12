import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "./PerformanceBooking.css"; // Import the CSS file for styling

const PerformanceBooking = ({ token, userId, fetchBookings }) => {
  const [eventDate, setEventDate] = useState(null);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Karaoke");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formattedEventDate = eventDate
      ? format(eventDate, "EEEE, MMMM d, yyyy h:mm a")
      : "";
    const parsedNumberOfGuests = parseInt(numberOfGuests, 10);

    if (isNaN(parsedNumberOfGuests) || parsedNumberOfGuests <= 0) {
      setError("Number of guests must be a positive integer.");
      return;
    }

    const body = {
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
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create performance booking");
        return; // Exit the function if there is an error
      }

      // Only set success message if there is no error
      setSuccess("Performance booking created successfully!");
      fetchBookings(); // Re-fetch bookings after successful submission
      resetForm(); // Reset the form fields
    } catch (error) {
      setError("An error occurred while creating the booking.");
    }
  };

  const resetForm = () => {
    setEventDate(null);
    setLocation("");
    setPrice("");
    setEventName("");
    setEventType("Karaoke");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setNumberOfGuests("");
    setSpecialRequests("");
  };

  return (
    <div className="performancecard">
      <h3>Performance Booking</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>

      <div className="performanceform-group">
    <label htmlFor="clientName">Client Name:</label>
    <input
        id="clientName"
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="e.g., John Doe"
        required
    />
</div>

    <div className="performanceform-group">
    <label htmlFor="clientEmail">Client Email:</label>
    <input
        id="clientEmail"
        type="email"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
        placeholder="e.g., example@email.com"
        required
    />
</div>


    <div className="performanceform-group">
    <label htmlFor="clientPhone">Client Phone:</label>
    <input
        id="clientPhone"
        type="tel"
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
        placeholder="e.g., 123-456-7890"
        pattern="^\(\d{3}\) \d{3}-\d{4}$"
        required
    />
</div>
    

<div className="performanceform-group">
    <label htmlFor="eventName">Event Name:</label>
    <input
        id="eventName"
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="e.g., Annual Gala"
        required
    />
</div>




    <div className="performanceform-group">
        <label>Event Type:</label>
        <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
        >
            <option value="" disabled>Select an event type</option>
            <option value="Karaoke">Karaoke</option>
            <option value="Wedding">Wedding</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Corporate">Corporate</option>
            <option value="Birthday">Birthday</option>
        </select>
    </div>

    <div className="performanceform-group">
    <label htmlFor="eventDate">Event Date:</label>
    <DatePicker
        id="eventDate"
        selected={eventDate}
        onChange={(date) => setEventDate(date)}
        showTimeSelect
        dateFormat="EEEE, MMMM d, yyyy h:mm aa"
        placeholderText="Select event date and time"
    />
</div>

<div className="performanceform-group">
    <label htmlFor="location">Location:</label>
    <input
        id="location"
        type="text"
        placeholder="Prism Bar 1221 Pennsylvania Avenue, Bristol, CT 06010"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
    />
</div>




<div className="performanceform-group">
    <label htmlFor="numberOfGuests">Number of Guests:</label>
    <input
        id="numberOfGuests"
        type="number"
        placeholder="If Guest amount unsure - Insert closest guess."

        value={numberOfGuests}
        onChange={(e) => setNumberOfGuests(e.target.value)}
        required
    />
</div>

<div className="performanceform-group">
    <label htmlFor="specialRequests">Special Requests:</label>
    <textarea
        id="specialRequests"
        placeholder="e.g., Preferred song list, extra setup requirements, or age related restrictions."
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
    />
</div>



    <div className="performanceform-group">
    <label htmlFor="price">Price:</label>
    <input
        id="price"
        type="number"
        step="5" // Increment by $5
        min="50" // Start at $50
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value) || "")}
        required
    />
</div>


    <button type="submit" className="submit-button">Submit Performance Booking</button>
</form>

    </div>
  );
};

export default PerformanceBooking;
