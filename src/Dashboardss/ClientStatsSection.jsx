import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "./adminDashboard.css";

const ClientStatsSection = ({
  mostActiveClients = [],
  topServicesRequested = [],
  lastLoginTimes = [],
  activeClients = 0,
  newRegistrations = 0,
  statusSummary = {},
}) => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  console.log(statusSummary); // Log the statusSummary prop to see if it's being passed correctly
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      // Send DELETE request to delete the user
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the deleted user from the allUsers state
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again later.");
    }
  };

  // Fetch all users data
  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users data");
        }

        const usersData = await response.json();
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching user data. Please try again later.");
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user?.is_admin) {
      fetchAllUsers();
    }
  }, [user]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  if (loadingUsers) {
    return <div>Loading all users data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (
    !mostActiveClients.length &&
    !topServicesRequested.length &&
    !lastLoginTimes.length &&
    !allUsers.length
  ) {
    return <div>No client statistics data available.</div>;
  }

  return (
    <div className="client-stats-section">
      <h2>Client Statistics</h2>

      {/* Active Clients */}
      <div className="stats-card">
        <h3>Active Clients (Last 30 Days)</h3>
        <p>{activeClients}</p>
      </div>

      {/* New Registrations */}
      <div className="stats-card">
        <h3>New Registrations (Last 30 Days)</h3>
        <p>{newRegistrations}</p>
      </div>

      {/* Most Active Clients */}
      <div className="stats-list">
        <h3>Most Active Clients</h3>
        {mostActiveClients.length > 0 ? (
          <ul>
            {mostActiveClients.map((client, index) => (
              <li key={`active-client-${client.id || index}`}>
                <strong>{client.username}</strong>: {client.total_bookings}{" "}
                bookings
              </li>
            ))}
          </ul>
        ) : (
          <p>No active clients found.</p>
        )}
      </div>

      {/* Top Services Requested */}
      <div className="stats-list">
        <h3>Top Services Requested</h3>
        {topServicesRequested.length > 0 ? (
          <ul>
            {topServicesRequested.map((service, index) => (
              <li key={`service-request-${service.service_type || index}`}>
                <strong>{service.service_type}</strong>: {service.request_count}{" "}
                requests
              </li>
            ))}
          </ul>
        ) : (
          <p>No service requests data available.</p>
        )}
      </div>

      {/* All Users Section */}
      <div className="all-users-table">
        <h3>All Users</h3>
        {allUsers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>User Type</th>
                <th>Last Login</th>
                <th>Created At</th>
                <th>Delete Users</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, index) => (
                <tr key={`user-${user.id || index}`}>
                  <td>{user.username}</td>
                  <td>{user.user_type}</td>
                  <td>{user.last_login || "N/A"}</td>
                  <td>{user.created_at}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default ClientStatsSection;
