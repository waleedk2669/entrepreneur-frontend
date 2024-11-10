import React, { useEffect, useState } from "react";
import "./clientDashboard.css";
import Navbar from "../homepage/Navbar";

const ClientDashboard = () => {
  const [overview, setOverview] = useState({});
  const [regularBookings, setRegularBookings] = useState([]);
  const [engineeringBookings, setEngineeringBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({});
  const [clientBookings, setClientBookings] = useState([]);
  const token = localStorage.getItem("token");

  // Get token from localStorage

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No token found. Please sign in.");
        setLoading(false);
        return;
      }
  
      try {

        const response = await fetch(
            `http://localhost:5002/api/client-dashboard`,
            {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });
  
        const data = await response.json();
  
        if (response.ok) {
          setOverview(data.overview);
          setRegularBookings(data.regular_bookings || []);
          setEngineeringBookings(data.engineering_bookings || []);
          setClientBookings([
            ...data.regular_bookings,
            ...data.engineering_bookings,
          ]);
  
          setLoading(false);
        } else {
          console.error("Error:", data.error);
          setError(data.error || "Failed to fetch client dashboard data.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [token]); // `token` is a dependency for this useEffect
  

  const handleRatingChange = (bookingId, value) => {
    setRating({ ...rating, [bookingId]: value });
  };

  const submitRating = async (bookingId, type) => {
    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    try {
      const endpoint =
        type === "regular"
          ? `http://localhost:5002/api/bookings/${bookingId}/rate`
          : `http://localhost:5002/api/engineeringbookings/${bookingId}/rate`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
        },
        body: JSON.stringify({ rating: rating[bookingId] }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Rating submitted successfully: ${data.rating}`);
        // Update the rating in the state
        setClientBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, rating: rating[bookingId] }
              : booking
          )
        );
      } else {
        alert(data.error || "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="client-dashboard">
      <h1>Client Dashboard</h1>
      <Navbar />

      {/* Overview Section */}
      <div className="dashboard-summary">
        <h2>Summary</h2>
        <p>Total Bookings: {overview?.total_bookings || 0}</p>
        <p>Total Spent: ${overview?.total_spent?.toFixed(2) || "0.00"}</p>
        <p>Upcoming Bookings: {overview?.upcoming_bookings || 0}</p>
        <p>Average Guests: {overview?.average_guests || 0}</p>
        <p>
          Most Frequent Location: {overview?.most_frequent_location || "N/A"}
        </p>
        <div className="status-summary">
          <p>Pending: {overview?.status_summary?.pending || 0}</p>
          <p>Confirmed: {overview?.status_summary?.confirmed || 0}</p>
          <p>Completed: {overview?.status_summary?.completed || 0}</p>
        </div>
      </div>

      {/* Regular Bookings Table */}
      <div className="bookings-table">
        <h2>All Regular Bookings</h2>
        {regularBookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Submit</th>
              </tr>
            </thead>
            <tbody>
              {regularBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.event_date}</td>
                  <td>{booking.location}</td>
                  <td>{booking.status}</td>
                  <td>${booking.price.toFixed(2)}</td>
                  <td>
                    <select
                        value={rating[booking.id] || booking.rating || ""}
                        onChange={(e) =>
                        handleRatingChange(booking.id, parseInt(e.target.value))
                      }
                    >
                      <option value="" disabled>
                        Select rating
                      </option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Stars
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => submitRating(booking.id, "regular")}
                      disabled={!rating[booking.id]}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No regular bookings available.</p>
        )}
      </div>

      {/* Engineering Bookings Table */}
      <div className="engineering-bookings-table">
        <h2>All Engineering Bookings</h2>
        {engineeringBookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Start Date</th>
                <th>Project End Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Submit</th>
              </tr>
            </thead>
            <tbody>
              {engineeringBookings.map((engBooking) => (
                <tr key={engBooking.id}>
                  <td>{engBooking.id}</td>
                  <td>{engBooking.project_start_date}</td>
                  <td>{engBooking.project_end_date}</td>
                  <td>{engBooking.project_description}</td>
                  <td>{engBooking.status}</td>
                  <td>${engBooking.price.toFixed(2)}</td>
                  <td>
                    <select
                      value={rating[engBooking.id] || engBooking.rating || ""}
                      onChange={(e) =>
                        handleRatingChange(
                          engBooking.id,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="" disabled>
                        Select rating
                      </option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Stars
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => submitRating(engBooking.id, "engineering")}
                      disabled={!rating[engBooking.id]}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No engineering bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
