import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./bookingCalendar.css";

const localizer = momentLocalizer(moment);
const apiUrl = import.meta.env.VITE_API_URL;

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const token = localStorage.getItem("token"); // Get token from localStorage

  const [showDetails, setShowDetails] = useState(false); // Add showDetails state
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };
  const EventDetailsModal = () => (
    <div className="modal">
      <div className="modal-content">
        <h3>Booking Details</h3>
        <p>
          <strong>Title:</strong> {selectedEvent?.title}
        </p>
        <p>
          <strong>Start:</strong> {selectedEvent?.start.toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {selectedEvent?.end.toLocaleString()}
        </p>
        <p>
          <strong>Type:</strong> {selectedEvent?.type}
        </p>
        <button onClick={() => setShowDetails(false)}>Close</button>
      </div>
    </div>
  );
  // Fetch all bookings data from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/calendar-bookings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // Include token if it exists
          },
          credentials: "include", // Include cookies if needed
        });

        const data = await response.json();

        if (response.ok) {
          // Check if the response is an array directly or an object containing an array
          const bookings = Array.isArray(data) ? data : data.bookings || [];

          if (Array.isArray(bookings)) {
            // Assuming the response contains both regular and engineering bookings, you can
            // map them into the same structure and add them to the events list
            const formattedEvents = bookings.map((event) => ({
              id: event.id,
              title: event.title,
              start: new Date(event.start),
              end: new Date(event.end),
              type: event.type,
            }));

            setEvents(formattedEvents);
          } else {
            console.error("Error: Bookings data is not an array", data);
          }
        } else {
          console.error("Error fetching bookings:", data.error);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [token]); // Run this effect when the token changes

  return (
    <div className="date-picker-container">
      <h2>Upcoming Bookings</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        onSelectEvent={handleSelectEvent}
      />
      {showDetails && <EventDetailsModal />}
    </div>
  );
};

export default BookingCalendar;
