import React, { useEffect, useState } from "react";
import "./clientDashboard.css";
import Navbar from "../homepage/Navbar";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripePaymentLink = "https://buy.stripe.com/test_payment_link"; // Replace with your actual Stripe payment link

  const { user, token, signOut, loading } = useAuth(); // Use loading from AuthContext
  const [overview, setOverview] = useState({});
  const [regularBookings, setRegularBookings] = useState([]);
  const [engineeringBookings, setEngineeringBookings] = useState([]);
  const [editingEngineeringBookingId, setEditingEngineeringBookingId] =
    useState(null);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const localDate = new Date(dateString);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // code added by me for stripe integration
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isSuccess = queryParams.get("success");
    const isCancelled = queryParams.get("cancelled");
    const bookingId = queryParams.get("booking_id");
    const type = queryParams.get("type"); // Regular or engineering booking

    if (isSuccess && bookingId && type) {
      // Update the payment status on the server
      updatePaymentStatus(bookingId, type);

      // Remove query parameters after updating payment status
      removeSearchParams();
      navigate(location.pathname, { replace: true });
    } else if (isCancelled) {
      alert("Payment was cancelled. You can retry payment.");

      // Remove query parameters immediately
      removeSearchParams();
      navigate(location.pathname, { replace: true });
    }
  }, [location.search]);

  const removeSearchParams = () => {
    const newUrl = window.location.pathname; // Get current path without search params
    window.history.replaceState({}, "", newUrl); // Update the browser's address bar
    console.log(newUrl);
  };
  // Function to update payment status on the server
  const updatePaymentStatus = async (bookingId, type) => {
    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    try {
      const endpoint =
        type === "regular"
          ? `${apiUrl}/api/bookings/${bookingId}`
          : `${apiUrl}/api/engineeringbookings/${bookingId}`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_status: "paid" }), // Only updating payment_status
      });

      const data = await response.json();

      if (response.ok) {
        alert("Payment status updated successfully.");

        // Update the corresponding booking in the state
        if (type === "regular") {
          setRegularBookings((prev) =>
            prev.map((booking) =>
              booking.id === bookingId
                ? { ...booking, payment_status: "paid" }
                : booking
            )
          );
        } else {
          setEngineeringBookings((prev) =>
            prev.map((booking) =>
              booking.id === bookingId
                ? { ...booking, payment_status: "paid" }
                : booking
            )
          );
        }
      } else {
        alert(data.error || "Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Error updating payment status.");
    }
  };
  const handlePayment = async (bookingId, price, type) => {
    try {
      const response = await fetch(`${apiUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ booking_id: bookingId, price, type }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe's hosted payment page
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create a payment session.");
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // end of my added code

  const formatDateForEngineeringBooking = (dateString) => {
    if (!dateString) return null;
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // Format as 'Thursday, January 6, 2025'
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

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
  const handleBookingChange = (bookingId, field, value, type = "regular") => {
    if (type === "regular") {
      setRegularBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, [field]: value } : booking
        )
      );
    } else {
      setEngineeringBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, [field]: value } : booking
        )
      );
    }
  };
  const handleSaveEngineeringBooking = async (bookingId) => {
    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    const bookingToUpdate = engineeringBookings.find((b) => b.id === bookingId);

    // Format dates as expected by the backend
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return new Date(dateString)
        .toLocaleString("en-US", options)
        .replace(" at ", " ");
    };

    // Prepare the data object for the PATCH request
    const updateData = {
      project_start_date: formatDateForEngineeringBooking(
        bookingToUpdate.project_start_date
      ),
      project_end_date: formatDateForEngineeringBooking(
        bookingToUpdate.project_end_date
      ),
      project_description: bookingToUpdate.project_description,
      price:
        parseFloat(bookingToUpdate.price) > 0
          ? parseFloat(bookingToUpdate.price)
          : 0,
      special_requests: bookingToUpdate.special_requests,
      project_name: bookingToUpdate.project_name,
      service_type: bookingToUpdate.service_type,
      project_manager: bookingToUpdate.project_manager,
      contact_email: bookingToUpdate.contact_email,
      contact_phone: bookingToUpdate.contact_phone,
      rating: parseInt(bookingToUpdate.rating) || null,
    };

    // Frontend validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (
      updateData.contact_email &&
      !emailRegex.test(updateData.contact_email)
    ) {
      alert("Invalid email format.");
      return;
    }

    if (updateData.price <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/api/engineeringbookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Engineering booking updated successfully.");
        setEngineeringBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? data : booking
          )
        );
        setEditingEngineeringBookingId(null);
      } else {
        alert(data.error || "Failed to update engineering booking.");
      }
    } catch (error) {
      console.error("Error updating engineering booking:", error);
      setError("Error updating engineering booking.");
    }
  };

  const handleSaveBooking = async (bookingId) => {
    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    const bookingToUpdate = regularBookings.find((b) => b.id === bookingId);

    // Format event_date as expected by the backend
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      // Remove the "at" from the formatted date string
      return new Date(dateString)
        .toLocaleString("en-US", options)
        .replace(" at ", " ");
    };

    // Prepare the data object to be sent in the PATCH request
    const updateData = {
      booking_date: formatDate(bookingToUpdate.booking_date),
      client_name: bookingToUpdate.client_name,
      client_email: bookingToUpdate.client_email,
      client_phone: bookingToUpdate.client_phone,
      event_date: formatDate(bookingToUpdate.event_date),
      event_name: bookingToUpdate.event_name,
      event_type: bookingToUpdate.event_type,
      location: bookingToUpdate.location,
      number_of_guests: parseInt(bookingToUpdate.number_of_guests) || 0,
      price:
        parseFloat(bookingToUpdate.price) > 0
          ? parseFloat(bookingToUpdate.price)
          : 0,
      special_requests: bookingToUpdate.special_requests,
      payment_status: bookingToUpdate.payment_status,
      rating: parseInt(bookingToUpdate.rating) || null,
    };

    // Frontend email validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (updateData.client_email && !emailRegex.test(updateData.client_email)) {
      alert("Invalid email format.");
      return;
    }

    // Frontend price validation
    if (updateData.price <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Booking updated successfully.");
        setRegularBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? data : booking
          )
        );
        setEditingBookingId(null);
      } else {
        alert(data.error || "Failed to update booking.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Error updating booking.");
    }
  };

  // If no token, sign out immediately
  useEffect(() => {
    if (loading) return;

    // Only fetch data if the token is present
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/client-dashboard`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 401) {
            signOut();
          } else if (response.ok) {
            const data = await response.json();
            setRegularBookings(data.regular_bookings || []);
            setEngineeringBookings(data.engineering_bookings || []);
            setClientBookings([
              ...data.regular_bookings,
              ...data.engineering_bookings,
            ]);

            // Compute the combined status summary
            const combinedStatusSummary = computeStatusSummary(
              data.regular_bookings || [],
              data.engineering_bookings || []
            );

            // Compute total bookings
            const totalBookings =
              (data.regular_bookings?.length || 0) +
              (data.engineering_bookings?.length || 0);

            // Compute total spent
            const totalSpent = [
              ...data.regular_bookings,
              ...data.engineering_bookings,
            ].reduce((acc, booking) => acc + (booking.price || 0), 0);

            // Compute upcoming bookings
            const upcomingBookings = [
              ...data.regular_bookings,
              ...data.engineering_bookings,
            ].filter((booking) => {
              const eventDate = new Date(
                booking.event_date || booking.project_start_date
              );
              return eventDate > new Date();
            }).length;

            // Compute average guests
            const totalGuests = data.regular_bookings.reduce(
              (acc, booking) => acc + (booking.number_of_guests || 0),
              0
            );
            const averageGuests =
              data.regular_bookings.length > 0
                ? totalGuests / data.regular_bookings.length
                : 0;

            // Compute most frequent location
            const locationCounts = data.regular_bookings.reduce(
              (acc, booking) => {
                acc[booking.location] = (acc[booking.location] || 0) + 1;
                return acc;
              },
              {}
            );
            const mostFrequentLocation = Object.keys(locationCounts).reduce(
              (a, b) => (locationCounts[a] > locationCounts[b] ? a : b),
              "N/A"
            );

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
    if (type === "regular") {
      setRegularBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, rating: value } : booking
        )
      );
    } else {
      setEngineeringBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, rating: value } : booking
        )
      );
    }
  };

  const submitRating = async (bookingId, type) => {
    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    const bookingToUpdate =
      type === "regular"
        ? regularBookings.find((b) => b.id === bookingId)
        : engineeringBookings.find((b) => b.id === bookingId);

    const newRating = bookingToUpdate?.rating;

    try {
      const endpoint =
        type === "regular"
          ? `${apiUrl}/api/bookings/${bookingId}/rate`
          : `${apiUrl}/api/engineeringbookings/${bookingId}/rate`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Rating submitted successfully: ${data.rating}`);

        // Update the rating directly in the state
        if (type === "regular") {
          setRegularBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === bookingId
                ? { ...booking, rating: data.rating }
                : booking
            )
          );
        } else {
          setEngineeringBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === bookingId
                ? { ...booking, rating: data.rating }
                : booking
            )
          );
        }
      } else {
        alert(data.error || "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Error submitting rating.");
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

      <div class="apple-music-player">
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          frameborder="0"
          height="175"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src="https://embed.music.apple.com/us/album/youre-my-best-friend/1440650428?i=1440650731"
        ></iframe>
      </div>

      {/* Overview Section */}
      <div className="dashboard-summary">
        <h2>Summary</h2>
        <div className="summaryy-cards">
          <div className="metricc-card">
            <h3>Total Bookings</h3>
            <p>{overview?.total_bookings || 0}</p>
          </div>
          <div className="metricc-card">
            <h3>Total Spent</h3>
            <p>${overview?.total_spent?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="metricc-card">
            <h3>Upcoming </h3>
            <p>{overview?.upcoming_bookings || 0}</p>
          </div>
          <div className="metricc-card">
            <h3>Average Guests</h3>
            <p>{overview?.average_guests || 0}</p>
          </div>
          <div className="metricc-card">
            <h3>Frequent Location</h3>
            <p>{overview?.most_frequent_location || "N/A"}</p>
          </div>
        </div>

        <h2 className="statuss">Status Summary</h2>
        <div className="statuss-summary">
          <div className="statuss-card">
            <h4 className="statuslabel">Pending</h4>
            <p className="statusdata">
              {overview?.status_summary?.pending || 0}
            </p>
          </div>
          <div className="statuss-card">
            <h4 className="statuslabel">Confirmed</h4>
            <p className="statusdata">
              {overview?.status_summary?.confirmed || 0}
            </p>
          </div>
          <div className="statuss-card">
            <h4 className="statuslabel">Completed</h4>
            <p className="statusdata">
              {overview?.status_summary?.completed || 0}
            </p>
          </div>
          <div className="statuss-card">
            <h4 className="statuslabel">Canceled</h4>
            <p className="statusdata">
              {overview?.status_summary?.canceled || 0}
            </p>
          </div>
          <div className="payment-button-container">
            <h2>Ready to Confirm Your Booking?</h2>
            <button
              className="payment-button"
              onClick={() => window.open(stripePaymentLink, "_blank")}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      <div className="clienttables">
        {/* Regular Bookings Table */}
        <div className="bookings-table">
          <h2>All Regular Bookings</h2>
          {regularBookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Payment</th>
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
                    <td>
                      {booking.payment_status === "unpaid" ? (
                        <button
                          onClick={() =>
                            handlePayment(booking.id, booking.price, "regular")
                          }
                        >
                          Pay Now
                        </button>
                      ) : (
                        <p
                          style={{
                            padding: "8px 12px",
                            margin: "5px",
                            fontSize: "0.9rem",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "green",
                          }}
                        >
                          Paid
                        </p>
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="text"
                          value={booking.event_name}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "event_name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.event_name
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="text"
                          value={booking.event_type}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "event_type",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.event_type
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="text"
                          value={booking.client_name}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "client_name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.client_name
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="email"
                          value={booking.client_email}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "client_email",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.client_email
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="tel"
                          value={booking.client_phone}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "client_phone",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.client_phone
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="number"
                          value={booking.number_of_guests}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "number_of_guests",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      ) : (
                        booking.number_of_guests
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <textarea
                          value={booking.special_requests}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "special_requests",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.special_requests || "N/A"
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="datetime-local"
                          value={formatDateForInput(booking.event_date)}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "event_date",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.event_date
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="text"
                          value={booking.location}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "location",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        booking.location
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "status",
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        booking.status
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={booking.price}
                          onChange={(e) =>
                            handleBookingChange(
                              booking.id,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      ) : (
                        `$${booking.price.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <select
                          value={booking.rating ?? ""}
                          onChange={(e) =>
                            handleRatingChange(
                              booking.id,
                              parseInt(e.target.value),
                              "regular"
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
                      ) : (
                        `${booking.rating ?? "No rating"} Stars`
                      )}
                    </td>

                    <td>
                      {editingBookingId === booking.id ? (
                        <>
                          <button onClick={() => handleSaveBooking(booking.id)}>
                            Save
                          </button>
                          <button onClick={() => setEditingBookingId(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditingBookingId(booking.id)}>
                          Edit
                        </button>
                      )}
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
                  <th>Payment</th>
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
                    <td>
                      {engBooking.payment_status === "unpaid" ? (
                        <button
                          onClick={() =>
                            handlePayment(
                              engBooking.id,
                              engBooking.price,
                              "engineering"
                            )
                          }
                        >
                          Pay Now
                        </button>
                      ) : (
                        <p
                          style={{
                            padding: "8px 12px",
                            margin: "5px",
                            fontSize: "0.9rem",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "green",
                          }}
                        >
                          Paid
                        </p>
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <input
                          type="datetime-local"
                          value={formatDateForInput(
                            engBooking.project_start_date
                          )}
                          onChange={(e) =>
                            handleBookingChange(
                              engBooking.id,
                              "project_start_date",
                              e.target.value,
                              "engineering"
                            )
                          }
                        />
                      ) : (
                        engBooking.project_start_date
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <input
                          type="datetime-local"
                          value={formatDateForInput(
                            engBooking.project_end_date
                          )}
                          onChange={(e) =>
                            handleBookingChange(
                              engBooking.id,
                              "project_end_date",
                              e.target.value,
                              "engineering"
                            )
                          }
                        />
                      ) : (
                        engBooking.project_end_date
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <textarea
                          value={engBooking.project_description}
                          onChange={(e) =>
                            handleBookingChange(
                              engBooking.id,
                              "project_description",
                              e.target.value,
                              "engineering"
                            )
                          }
                        />
                      ) : (
                        engBooking.project_description
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <select
                          value={engBooking.status}
                          onChange={(e) =>
                            handleBookingChange(
                              engBooking.id,
                              "status",
                              e.target.value,
                              "engineering"
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        engBooking.status
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={engBooking.price}
                          onChange={(e) =>
                            handleBookingChange(
                              engBooking.id,
                              "price",
                              parseFloat(e.target.value),
                              "engineering"
                            )
                          }
                        />
                      ) : (
                        `$${engBooking.price.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <select
                          value={engBooking.rating ?? ""}
                          onChange={(e) =>
                            handleBookingChange(
                              engBooking.id,
                              "rating",
                              parseInt(e.target.value),
                              "engineering"
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
                      ) : (
                        `${engBooking.rating ?? "No rating"} Stars`
                      )}
                    </td>
                    <td>
                      {editingEngineeringBookingId === engBooking.id ? (
                        <>
                          <button
                            onClick={() =>
                              handleSaveEngineeringBooking(engBooking.id)
                            }
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingEngineeringBookingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingEngineeringBookingId(engBooking.id)
                          }
                        >
                          Edit
                        </button>
                      )}
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
    </div>
  );
};

export default ClientDashboard;
