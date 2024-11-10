import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useAuth } from '../AuthContext'; // Import useAuth for session management
import './AdminDashboard.css';
import Navbar from '../homepage/Navbar';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const { user, isSignedIn } = useAuth(); // Get user data and sign-in status from context
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    // Ensure only admins can access this component
    if (!isSignedIn || user?.user_type !== 'admin') {
      setError('Unauthorized access. Admins only.');
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data for user:', user);

      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage

        // Make sure the token exists
        if (!token) {
          throw new Error('Authorization token is missing.');
        }

        const response = await fetch('http://localhost:5002/api/admin-dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        console.log('Dashboard response status:', response.status);

        if (!response.ok) {
          const data = await response.json();
          console.error('Failed to fetch dashboard data:', data);
          throw new Error(data.error || 'Failed to fetch dashboard data');
        }

        const data = await response.json();
        console.log('Dashboard data:', data);
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isSignedIn, user]);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Destructure data for easier access
  const { overview, recent_bookings, recent_engineering_bookings } = dashboardData;

  // Chart Data for Booking Status Summary
  const bookingStatusData = {
    labels: ['Pending', 'Confirmed', 'Completed', 'Canceled'],
    datasets: [
      {
        label: 'Booking Status',
        data: [
          overview.status_summary.pending,
          overview.status_summary.confirmed,
          overview.status_summary.completed,
          overview.status_summary.canceled,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        titleColor: 'white',
        bodyColor: 'white',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        grid: {
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };

  // Chart Data for Payment Status Summary
  const paymentStatusData = {
    labels: ['Unpaid', 'Paid'],
    datasets: [
      {
        label: 'Payment Status',
        data: [
          overview?.payment_summary?.unpaid || 0,
          overview?.payment_summary?.paid || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB'],
        borderColor: ['#FF6384', '#36A2EB'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <Navbar />

      <div className="join">
        {/* Overview Section */}
        <div className="overview">
          <h2>Overview</h2>
          <ul>
            <li>Total Bookings: {overview.total_bookings}</li>
            <li>Total Revenue: ${overview.total_revenue.toFixed(2)}</li>
            <li>Total Users: {overview.total_users}</li>
            <li>Active Clients: {overview.active_clients}</li>
          </ul>
        </div>

        {/* Status Summary Section */}
        <div className="status-summary">
          <h2>Booking Status Summary</h2>
          <Bar data={bookingStatusData} options={options} />
        </div>

        {/* Payment Summary Section */}
        <div className="payment-summary">
          <h2>Payment Status Summary</h2>
          <ul>
            <li>Unpaid: {overview.payment_summary.unpaid}</li>
            <li>Paid: {overview.payment_summary.paid}</li>
          </ul>
          <Pie data={paymentStatusData} options={options} />
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Username</th>
              <th>Booking Date</th>
              <th>Event Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Price</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {recent_bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user_id}</td>
                <td>{booking.username}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.event_date}</td>
                <td>{booking.location}</td>
                <td>{booking.status}</td>
                <td>${booking.price.toFixed(2)}</td>
                <td>{booking.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Engineering Bookings Section */}
      <div className="recent-engineering-bookings">
        <h2>Recent Engineering Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Booking Date</th>
              <th>Project Start Date</th>
              <th>Project End Date</th>
              <th>Description</th>
              <th>Status</th>
              <th>Price</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {recent_engineering_bookings.map((engBooking) => (
              <tr key={engBooking.id}>
                <td>{engBooking.id}</td>
                <td>{engBooking.user_id}</td>
                <td>{engBooking.booking_date}</td>
                <td>{engBooking.project_start_date}</td>
                <td>{engBooking.project_end_date}</td>
                <td>{engBooking.project_description}</td>
                <td>{engBooking.status}</td>
                <td>${engBooking.price.toFixed(2)}</td>
                <td>{engBooking.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
