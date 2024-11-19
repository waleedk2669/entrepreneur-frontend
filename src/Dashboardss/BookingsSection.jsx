import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import "./adminDashboard.css";

const BookingsSection = ({
  recentBookings = [],
  recentEngineeringBookings = [],
  upcomingBookings = [],
  unpaidBookings = [],
  allRegularBookings = [],
  allEngineeringBookings = [],
}) => {
  const { user, token } = useAuth();
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingEngineeringBookingId, setEditingEngineeringBookingId] =
    useState(null);

  const [formData, setFormData] = useState({});
  // Helper function to format price
  const formatPrice = (price) => `$${(price ?? 0).toLocaleString()}`;
  console.log("User from useAuth:", user);

  const formatDateForBackend = (date) => {
    if (!date) return null;
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options).replace(" at ", " ");
  };

  const handleRegularDeleteClick = async (bookingId) => {
    if (!token) {
      console.error("No token found. Please sign in.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this regular booking?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Regular booking deleted successfully.");
        // Optionally, refresh the list or remove the deleted booking from state
        window.location.reload(); // Quick solution for refreshing the data
      } else {
        alert(data.error || "Failed to delete regular booking.");
      }
    } catch (error) {
      console.error("Error deleting regular booking:", error);
      alert("An error occurred while trying to delete the booking.");
    }
  };

  const formatDateForEngineeringBookings = (date) => {
    if (!date) return null;
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Handle Delete Button Click for Engineering Bookings
  const handleEngineeringDeleteClick = async (bookingId) => {
    if (!token) {
      console.error("No token found. Please sign in.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/engineeringbookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Engineering booking deleted successfully.");
        // Optionally, refresh the list or remove the deleted booking from state
        window.location.reload(); // Quick solution for refreshing the data
      } else {
        alert(data.error || "Failed to delete engineering booking.");
      }
    } catch (error) {
      console.error("Error deleting engineering booking:", error);
      alert("An error occurred while trying to delete the booking.");
    }
  };

  // Helper function to format date for display in the UI
  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  };
  // Handle Input Change for Engineering Bookings
  const handleEngineeringInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "project_start_date" && value) {
      const date = new Date(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formatDateForEngineeringBookings(date),
      }));
    } else if (name === "project_end_date" && value) {
      const date = new Date(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formatDateForBackend(date),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleSaveEngineeringClick = async () => {
    if (!token) {
      console.error("No token found. Please sign in.");
      return;
    }

    const updateData = {
      project_start_date: formData.project_start_date
        ? formatDateForEngineeringBookings(formData.project_start_date)
        : null,
      project_end_date: formData.project_end_date
        ? formatDateForEngineeringBookings(formData.project_end_date)
        : null,
      project_description: formData.project_description,
      project_name: formData.project_name,
      service_type: formData.service_type,
      project_manager: formData.project_manager,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      price: parseFloat(formData.price) > 0 ? parseFloat(formData.price) : 0,
      special_requests: formData.special_requests,
      rating: parseInt(formData.rating) || null,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/engineeringbookings/${editingEngineeringBookingId}`,
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
        setEditingEngineeringBookingId(null);
      } else {
        alert(data.error || "Failed to update engineering booking.");
      }
    } catch (error) {
      console.error("Error updating engineering booking:", error);
    }
  };
  // Handle Edit Button Click for Engineering Bookings
  const handleEngineeringEditClick = (booking) => {
    setEditingEngineeringBookingId(booking.id);
    setFormData(booking);
  };

  // Handle Edit Button Click
  const handleEditClick = (booking) => {
    setEditingBookingId(booking.id);
    setFormData(booking);
  };

  // Handle Input Change
  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is a date field and format accordingly
    if (name === "event_date" && value) {
      const date = new Date(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formatDateForBackend(date),
      }));
    } else if (name === "booking_date" && value) {
      const date = new Date(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formatDateForBackend(date),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle Save Click
  const handleSaveClick = async () => {
    if (!token) {
      console.error("No token found. Please sign in.");
      return;
    }

    const bookingToUpdate = { ...formData };

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
      status: bookingToUpdate.status,
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
      const response = await fetch(
        `http://localhost:5000/api/bookings/${editingBookingId}`,
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
        alert("Booking updated successfully.");
        setEditingBookingId(null);
      } else {
        alert(data.error || "Failed to update booking.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // Handle Cancel Click
  const handleCancelClick = () => {
    setEditingBookingId(null);
    setFormData({});
  };

  return (
    <div className="bookings-section">
      <h2 className="bookingcard">Bookings Overview</h2>

      {/* Recent Regular Bookings Table */}
      <div className="bookingss-table">
        <h3 className="bookingheader">Recent Regular Bookings</h3>
        {recentBookings?.length > 0 ? (
          <table aria-label="Recent Regular Bookings Table">
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
      <div className="bookingss-table">
        <h3 className="bookingheader">Recent Engineering Bookings</h3>
        {recentEngineeringBookings?.length > 0 ? (
          <table aria-label="Recent Engineering Bookings Table">
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

      <div className="bookingss-table">
        <h3 className="bookingheader">Upcoming Bookings</h3>
        {upcomingBookings?.length > 0 ? (
          <table aria-label="Upcoming Bookings Table">
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
                  <td>{booking.event_name || booking.project_name || "N/A"}</td>
                  <td>
                    {formatDate(
                      booking.event_date || booking.project_start_date
                    )}
                  </td>
                  <td>
                    {booking.project_end_date
                      ? formatDate(booking.project_end_date)
                      : "N/A"}
                  </td>
                  <td>
                    {booking.location || booking.project_description || "N/A"}
                  </td>
                  <td>{booking.client_name || "N/A"}</td>
                  <td>{booking.client_phone || "N/A"}</td>
                  <td>{booking.project_manager || "N/A"}</td>
                  <td>{booking.contact_phone || "N/A"}</td>
                  <td>{formatPrice(booking.price)}</td>
                  <td>{booking.payment_status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No upcoming bookings found.</p>
        )}
      </div>

      {/* Unpaid Bookings Table */}
      <div className="bookingss-table">
        <h3 className="bookingheader">Unpaid Bookings</h3>
        {unpaidBookings?.length > 0 ? (
          <table aria-label="Unpaid Bookings Table">
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
                  <td>
                    {formatDate(
                      booking.event_date || booking.project_start_date
                    )}
                  </td>
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
      <div className="bookingss-table">
        <h3 className="bookingheader">All Regular Bookings</h3>
        {allRegularBookings?.length > 0 ? (
          <table aria-label="All Regular Bookings Table">
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
                <th>Ratings</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRegularBookings.map((booking, index) => (
                <tr key={`all-bookings-${booking.id}-${index}`}>
                  {editingBookingId === booking.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="event_name"
                          value={formData.event_name}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          name="event_date"
                          value={
                            formData.event_date
                              ? new Date(formData.event_date)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={handleInputChange}
                        />
                      </td>{" "}
                      <td>
                        <input
                          type="text"
                          name="event_type"
                          value={formData.event_type}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="payment_status"
                          value={formData.payment_status}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="number_of_guests"
                          value={formData.number_of_guests}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="special_requests"
                          value={formData.special_requests}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="client_name"
                          value={formData.client_name}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="client_email"
                          value={formData.client_email}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="client_phone"
                          value={formData.client_phone}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <select
                          value={formData.rating ?? ""}
                          onChange={(e) =>
                            handleInputChange({
                              target: {
                                name: "rating",
                                value: parseInt(e.target.value),
                              },
                            })
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
                        <button className="SaveMe" onClick={handleSaveClick}>
                          Save
                        </button>
                        <button
                          className="CancelMe"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{booking.event_name}</td>
                      <td>{formatDate(booking.event_date)}</td>
                      <td>{booking.event_type}</td>
                      <td>{booking.location}</td>
                      <td>{booking.status}</td>
                      <td>{formatPrice(booking.price)}</td>
                      <td>{booking.payment_status}</td>
                      <td>{booking.number_of_guests ?? "N/A"}</td>
                      <td>{booking.special_requests ?? "None"}</td>
                      <td>{booking.client_name}</td>
                      <td>{booking.client_email}</td>
                      <td>{booking.client_phone}</td>
                      <td>{booking.rating}</td>

                      <td>
                        <button
                          className="EditMe"
                          onClick={() => handleEditClick(booking)}
                        >
                          Edit
                        </button>
                        <button
                          className="DeleteMe"
                          onClick={() => handleRegularDeleteClick(booking.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No regular bookings found.</p>
        )}
      </div>

      {/* All Engineering Bookings Table */}
      <div className="bookingss-table">
        <h3 className="bookingheader">All Engineering Bookings</h3>
        {allEngineeringBookings?.length > 0 ? (
          <table aria-label="All Engineering Bookings Table">
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
                <th>Actions:</th>
              </tr>
            </thead>
            <tbody>
              {allEngineeringBookings.map((booking, index) => (
                <tr key={`engineering-all-${booking.id}-${index}`}>
                  {editingEngineeringBookingId === booking.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="project_name"
                          value={formData.project_name}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          name="project_start_date"
                          value={
                            formData.project_start_date
                              ? new Date(formData.project_start_date)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          name="project_end_date"
                          value={
                            formData.project_end_date
                              ? new Date(formData.project_end_date)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="service_type"
                          value={formData.service_type}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="payment_status"
                          value={formData.payment_status}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="project_manager"
                          value={formData.project_manager}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="contact_email"
                          value={formData.contact_email}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="tel"
                          name="contact_phone"
                          value={formData.contact_phone}
                          onChange={handleEngineeringInputChange}
                        />
                      </td>
                      <td>
                        <textarea
                          name="special_requests"
                          value={formData.special_requests}
                          onChange={handleEngineeringInputChange}
                        ></textarea>
                      </td>
                      <td>
                        <select
                          value={formData.rating ?? ""}
                          onChange={(e) =>
                            handleEngineeringInputChange({
                              target: {
                                name: "rating",
                                value: parseInt(e.target.value),
                              },
                            })
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
                          className="SaveMe"
                          onClick={handleSaveEngineeringClick}
                        >
                          Save
                        </button>
                        <button
                          className="CancelMe"
                          onClick={() => setEditingEngineeringBookingId(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{booking.project_name}</td>
                      <td>{formatDate(booking.project_start_date)}</td>
                      <td>{formatDate(booking.project_end_date)}</td>
                      <td>{booking.service_type}</td>
                      <td>{formatPrice(booking.price)}</td>
                      <td>{booking.payment_status}</td>
                      <td>{booking.project_manager}</td>
                      <td>{booking.contact_email}</td>
                      <td>{booking.contact_phone}</td>
                      <td>{booking.special_requests ?? "None"}</td>
                      <td>{`${booking.rating ?? "Unrated"} Stars`}</td>
                      <td>
                        <button
                          className="EditMe"
                          onClick={() => handleEngineeringEditClick(booking)}
                        >
                          Edit
                        </button>
                        <button
                          className="DeleteMe"
                          onClick={() =>
                            handleEngineeringDeleteClick(booking.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
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
