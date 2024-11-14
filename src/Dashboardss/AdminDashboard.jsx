import React, { useEffect, useState } from 'react';
import OverviewSection from './OverviewSection';
import BookingsSection from './BookingsSection';
import RevenueSection from './RevenueSection';
import ClientStatsSection from './ClientStatsSection';
import { useAuth } from '../AuthContext';
import './adminDashboard.css';
import Navbar from "../homepage/Navbar";


const AdminDashboard = () => {
    const { user, isSignedIn } = useAuth();

    // Define state hooks before any conditional returns
    const [dashboardData, setDashboardData] = useState({
        overview: {},
        recent_bookings: [],
        recent_engineering_bookings: [],
        upcoming_bookings: [],
        unpaid_bookings: [],
        monthly_revenue_trends: [],
        revenue_by_client_type: [],
        most_active_clients: [],
        top_services_requested: [],
        last_login_times: [],
        daily_average_guests: [], // Include new data for line graph

        stats: {}, // Add this line to initialize stats
        status_summary: {},  // Add this to store the status summary data
        

    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');  // Default active tab
    const [allRegularBookings, setAllRegularBookings] = useState([]);
    const [allEngineeringBookings, setAllEngineeringBookings] = useState([]);

    // Fetch admin dashboard data
    useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          setError(null);
  
          try {
              const response = await fetch('/api/admin-dashboard', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  credentials: 'include',
              });
  
              if (!response.ok) {
                  throw new Error('Failed to fetch dashboard data');
              }
  
              const data = await response.json();
              console.log("Fetched Dashboard Data:", data);
  
              // Fetch all regular bookings
              const allBookingsResponse = await fetch('/api/all-regular-bookings', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  credentials: 'include',
              });
  
              if (!allBookingsResponse.ok) {
                  throw new Error('Failed to fetch all regular bookings');
              }
  
              const allBookingsData = await allBookingsResponse.json();
              console.log("Fetched All Regular Bookings Data:", allBookingsData);
  
// Fetch all engineering bookings
const engineeringBookingsResponse = await fetch('/api/all-engineering-bookings', {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  credentials: 'include',
});

if (!engineeringBookingsResponse.ok) {
  throw new Error('Failed to fetch all engineering bookings');
}

const engineeringBookingsData = await engineeringBookingsResponse.json();
console.log("Fetched All Engineering Bookings Data:", engineeringBookingsData);

// Set all engineering bookings data
setAllEngineeringBookings(engineeringBookingsData.all_engineering_bookings || []);


              // Update state
              setDashboardData({
                  overview: data.overview || {},
                  recent_bookings: data.recent_bookings || [],
                  recent_engineering_bookings: data.recent_engineering_bookings || [],
                  upcoming_bookings: data.upcoming_bookings || [],
                  unpaid_bookings: data.unpaid_bookings || [],
                  monthly_revenue_trends: data.monthly_revenue_trends || [],
                  revenue_by_client_type: data.revenue_by_client_type || [],
                  most_active_clients: data.most_active_clients || [],
                  top_services_requested: data.top_services_requested || [],
                  last_login_times: data.last_login_times || [],
                  daily_average_guests: data.daily_average_guests || [],
                  daily_registrations: data.daily_registrations || [],
                  daily_active_clients: data.daily_active_clients || [],
                  status_summary: data.status_summary || {},
              });
  
              // Set all regular bookings data
              setAllRegularBookings(allBookingsData.all_regular_bookings || []);
            } catch (error) {
              console.error('Error fetching dashboard data:', error);
              setError('Error fetching dashboard data. Please try again later.');
          } finally {
              setLoading(false);
          }
      };
  
      fetchData();
  }, [user]);
      console.log("OverviewSection data:", dashboardData.overview);

    // Early return for non-admin users after all hooks are defined
    if (!isSignedIn || !user?.is_admin) {
        return <p>Access Denied. You must be an admin to view this page.</p>;
    }

    // Render loading, error, or dashboard content
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="admin-dashboard">
                <Navbar />

            <h1 className='intro'>Admin Dashboard</h1>
            <h2 className='welcome'>Welcome, Admin {user.username}</h2>
            <p>User Type: {user.user_type}</p>
            <p>Last Login: {user.last_login}</p>

            {/* Tabs for different sections */}
            <div className="tabs">
                <div 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </div>
                <div 
                    className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('bookings')}
                >
                    Bookings
                </div>
                <div 
                    className={`tab ${activeTab === 'revenue' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('revenue')}
                >
                    Revenue
                </div>
                <div 
                    className={`tab ${activeTab === 'stats' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('stats')}
                >
                    Client Stats
                </div>
            </div>

            {/* Section Cards (Only one section visible based on active tab) */}
            <div className={`card-section ${activeTab === 'overview' ? 'active' : ''}`}>

            <OverviewSection
    data={dashboardData.overview}
    dailyAverageGuests={dashboardData.daily_average_guests}
    dailyRegistrations={dashboardData.daily_registrations}
/>            </div>
            <div className={`card-section ${activeTab === 'bookings' ? 'active' : ''}`}>
            <BookingsSection
    recentBookings={dashboardData.recent_bookings}
    recentEngineeringBookings={dashboardData.recent_engineering_bookings}
    upcomingBookings={dashboardData.upcoming_bookings}
    unpaidBookings={dashboardData.unpaid_bookings}
    allRegularBookings={allRegularBookings}
    allEngineeringBookings={allEngineeringBookings}

/>
            </div>
            <div className={`card-section ${activeTab === 'revenue' ? 'active' : ''}`}>
                <RevenueSection
                    monthlyTrends={dashboardData.monthly_revenue_trends}
                    revenueByClientType={dashboardData.revenue_by_client_type}
                />
            </div>
            <div className={`card-section ${activeTab === 'stats' ? 'active' : ''}`}>
                <ClientStatsSection
                    mostActiveClients={dashboardData.most_active_clients}
                    topServicesRequested={dashboardData.top_services_requested}
                    lastLoginTimes={dashboardData.last_login_times}
                    statusSummary={dashboardData.status_summary} 

                />
            </div>
        </div>
    );
};

export default AdminDashboard;
