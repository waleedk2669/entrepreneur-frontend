import React, { useEffect, useState } from "react";
import "./clientDashboard.css";
import Navbar from "../homepage/Navbar";
import { useAuth } from "../AuthContext";

const ClientDashboard = () => {
    const { user, token, signOut, loading } = useAuth(); // Use loading from AuthContext
    const [overview, setOverview] = useState({});
  const [regularBookings, setRegularBookings] = useState([]);
  const [engineeringBookings, setEngineeringBookings] = useState([]);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState({});
  const [clientBookings, setClientBookings] = useState([]);
  console.log("Token from useAuth:", token);
  const computeStatusSummary = (regularBookings, engineeringBookings) => {
    const allBookings = [...regularBookings, ...engineeringBookings];
    const statusSummary = allBookings.reduce(
      (acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, completed: 0 }
    );
    return statusSummary;
  };
  
  // If no token, sign out immediately
  useEffect(() => {
    if (loading) return;
  
    // Only fetch data if the token is present
    if (token) {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5002/api/client-dashboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
        
                if (response.status === 401) {
                    signOut();
                } else if (response.ok) {
                    const data = await response.json();
                    setRegularBookings(data.regular_bookings || []);
                    setEngineeringBookings(data.engineering_bookings || []);
                    setClientBookings([...data.regular_bookings, ...data.engineering_bookings]);
        
                    // Compute the combined status summary
                    const combinedStatusSummary = computeStatusSummary(
                        data.regular_bookings || [],
                        data.engineering_bookings || []
                    );
        
                    // Compute total bookings
                    const totalBookings = (data.regular_bookings?.length || 0) + (data.engineering_bookings?.length || 0);
        
                    // Compute total spent
                    const totalSpent = [...data.regular_bookings, ...data.engineering_bookings].reduce(
                        (acc, booking) => acc + (booking.price || 0),
                        0
                    );
        
                    // Compute upcoming bookings
                    const upcomingBookings = [...data.regular_bookings, ...data.engineering_bookings].filter((booking) => {
                        const eventDate = new Date(booking.event_date || booking.project_start_date);
                        return eventDate > new Date();
                    }).length;
        
                    // Compute average guests
                    const totalGuests = data.regular_bookings.reduce((acc, booking) => acc + (booking.number_of_guests || 0), 0);
                    const averageGuests = data.regular_bookings.length > 0 ? totalGuests / data.regular_bookings.length : 0;
        
                    // Compute most frequent location
                    const locationCounts = data.regular_bookings.reduce((acc, booking) => {
                        acc[booking.location] = (acc[booking.location] || 0) + 1;
                        return acc;
                    }, {});
                    const mostFrequentLocation = Object.keys(locationCounts).reduce((a, b) => (locationCounts[a] > locationCounts[b] ? a : b), "N/A");
        
                    // Update the overview state
                    setOverview({
                        total_bookings: totalBookings,
                        total_spent: totalSpent,
                        upcoming_bookings: upcomingBookings,
                        average_guests: averageGuests,
                        most_frequent_location: mostFrequentLocation,
                        status_summary: combinedStatusSummary,
                    });
                } else {
                    const data = await response.json();
                    setError(data.error || "Failed to fetch client dashboard data.");
                }
            } catch (err) {
                setError(err.message || "Error fetching dashboard data.");
            }
        };
  
      fetchData();
    }
  }, [token, loading, signOut]);
  
  
  

  const handleRatingChange = (bookingId, value, type) => {
    const key = `${type}-${bookingId}`;
    setRating({ ...rating, [key]: value });
  };
  const submitRating = async (bookingId, type) => {
    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }
  
    const key = `${type}-${bookingId}`;
  
    try {
      const endpoint =
        type === "regular"
          ? `http://localhost:5002/api/bookings/${bookingId}/rate`
          : `http://localhost:5002/api/engineeringbookings/${bookingId}/rate`;
  
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: rating[key] }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(`Rating submitted successfully: ${data.rating}`);
        // Update the rating in the state
        setClientBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, rating: rating[key] }
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
      <h1>Welcome, {user?.username}!</h1>

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
          <th>Event Name</th>
          <th>Event Type</th>
          <th>Client Name</th>
          <th>Client Email</th>
          <th>Client Phone</th>
          <th>Number of Guests</th>
          <th>Special Requests</th>
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
            <td>{booking.event_name}</td>
            <td>{booking.event_type}</td>
            <td>{booking.client_name}</td>
            <td>{booking.client_email}</td>
            <td>{booking.client_phone}</td>
            <td>{booking.number_of_guests}</td>
            <td>{booking.special_requests || "N/A"}</td>
            <td>{booking.event_date}</td>
            <td>{booking.location}</td>
            <td>{booking.status}</td>
            <td>${booking.price.toFixed(2)}</td>
            <td>
              <select
                value={rating[`regular-${booking.id}`] ?? booking.rating ?? ""}
                onChange={(e) =>
                  handleRatingChange(booking.id, parseInt(e.target.value), "regular")
                }
              >
                <option value="" disabled>Select rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </td>
            <td>
              <button
                onClick={() => submitRating(booking.id, "regular")}
                disabled={!rating[`regular-${booking.id}`]}
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
  value={rating[`engineering-${engBooking.id}`] ?? engBooking.rating ?? ""}
  onChange={(e) =>
    handleRatingChange(engBooking.id, parseInt(e.target.value), "engineering")
  }
>
  <option value="" disabled>Select rating</option>
  {[1, 2, 3, 4, 5].map((num) => (
    <option key={num} value={num}>{num} Stars</option>
  ))}
</select>

                  </td>
                  <td>
                    <button
                      onClick={() => submitRating(engBooking.id, "engineering")}
                      disabled={!rating[`engineering-${engBooking.id}`]}
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
