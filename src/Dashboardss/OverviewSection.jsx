import React from 'react';
import './adminDashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../AuthContext';
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


const OverviewSection = ({ data, dailyAverageGuests, dailyRegistrations, dailyActiveClients }) => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading user data...</div>;
    }

    if (!data) {
        return <div>No overview data available.</div>;
    }

    // Destructure overview metrics from the data object
    const {
        total_bookings,
        total_revenue,
        total_users,
        active_clients,
        new_registrations,
        average_rating,
        top_location,
        average_guests,
        status_summary,
        payment_summary,
        daily_registrations = [],
        daily_active_clients = [],
        daily_average_guests = [],
    } = data;
    const averageGuestLabels = dailyAverageGuests?.map(item => item.date) || [];
    const averageGuestsData = dailyAverageGuests?.map(item => item.average_guests) || [];
    // Prepare data for New Registrations line graph
    const registrationLabels = dailyRegistrations?.map(item => item.date) || [];
    const registrationsData = dailyRegistrations?.map(item => item.count) || [];
    

    // Prepare data for Active Clients line graph
    const activeClientLabels = dailyActiveClients?.map(item => item.date) || [];
    const activeClientsData = dailyActiveClients?.map(item => item.count) || [];
    const activeClientsBarChartData = {
        labels: activeClientLabels,
        datasets: [
            {
                label: 'Active Clients',
                data: activeClientsData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14, // Increase font size for the legend
                    },
                    color: '#ffffff', // White font color
                },
            },
            tooltip: {
                enabled: true,
                bodyFont: {
                    size: 14, // Increase font size for the tooltips
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#ffffff', // Set grid lines to white
                },
                ticks: {
                    color: '#ffffff', // Set y-axis labels to white
                    font: {
                        size: 14, // Increase font size for y-axis labels
                    },
                },
                title: {
                    display: true,
                    text: 'Number of Active Clients',
                    color: '#ffffff', // White font color
                    font: {
                        size: 16, // Increase font size for the y-axis title
                    },
                },
            },
            x: {
                grid: {
                    color: '#ffffff', // Set grid lines to white
                },
                ticks: {
                    color: '#ffffff', // Set x-axis labels to white
                    font: {
                        size: 14, // Increase font size for x-axis labels
                    },
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: '#ffffff', // White font color
                    font: {
                        size: 16, // Increase font size for the x-axis title
                    },
                },
            },
        },
    };
    

    const registrationsChartData = {
        labels: registrationLabels,
        datasets: [
            {
                label: 'New Registrations',
                data: registrationsData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const activeClientsChartData = {
        labels: activeClientLabels,
        datasets: [
            {
                label: 'Active Clients',
                data: activeClientsData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const averageGuestsChartData = {
        labels: averageGuestLabels,
        datasets: [
            {
                label: 'Average Guests per Booking',
                data: averageGuestsData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Guests',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };
    const adminMetrics = user?.is_admin ? (
        <>
            <div className="metric-card">
                <h3>Total Users</h3>
                <p>{total_users}</p>
            </div>
            <div className="metric-card">
                <h3>New Users</h3>
                <p>{new_registrations}</p>
            </div>
        </>
    ) : null;

    return (
        <div className="overview-section">
            <h2>Overview Metrics</h2>
            <div className="overview-metrics">
                <div className="metric-card">
                    <h3>Bookings</h3>
                    <p>{total_bookings}</p>
                </div>
                <div className="metric-card">
                    <h3 className='cardname'>Total Revenue</h3>
                    <p>${total_revenue.toFixed(2)}</p>
                </div>
                {adminMetrics}
                <div className="metric-card">
                    <h3 className='cardname'>Core Users</h3>
                    <p>{active_clients}</p>
                </div>
                <div className="metric-card">
                    <h3 className='cardname'>Avg Ratings</h3>
                    <p>{average_rating}/5</p>
                </div>
                <div className="metric-card">
                    <h3 className='cardname'>Location</h3>
                    <p>{top_location}</p>
                </div>
                <div className="metric-card">
                    <h3 className='cardname'>Avg Guests</h3>
                    <p>{average_guests}</p>
                </div>
                
            </div>

            {/* Line Graph for Average Guests per Booking */}
            <div className="line-graph">
                <h3>Average Guests per Booking (Last 30 Days)</h3>
                <Line data={averageGuestsChartData} options={chartOptions} />
            </div>

            {/* Line Graph for New Registrations */}
            <div className="line-graph">
                <h3>New Registrations (Last 30 Days)</h3>
                <Line data={registrationsChartData} options={chartOptions} />
            </div>

{/* Bar Graph for Active Clients */}
<div className="bar-graph">
    <h3>Active Clients (Last 30 Days)</h3>
    <Bar key={activeClientLabels.join('-')} data={activeClientsBarChartData} options={barChartOptions} />
    </div>
            <h2 className='status'>Status Summary</h2>
            <div className="status-summary">
                <div className="status-card">
                    <h4 className='statuslabel'>Pending Bookings</h4>
                    <p className='statusdata'>{status_summary?.pending ?? 0}</p>
                </div>
                <div className="status-card">
                    <h4 className='statuslabel'>Confirmed Bookings</h4>
                    <p className='statusdata'>{status_summary?.confirmed ?? 0}</p>
                </div>
                <div className="status-card">
                    <h4 className='statuslabel'>Completed Bookings</h4>
                    <p className='statusdata'>{status_summary?.completed ?? 0}</p>
                </div>
                <div className="status-card">
                    <h4 className='statuslabel'>Canceled Bookings</h4>
                    <p className='statusdata'>{status_summary?.canceled ?? 0}</p>
                </div>
                <div className="status-card">
                    <h4 className='statuslabel'>Unpaid Bookings</h4>
                    <p className='statusdata'>{payment_summary?.unpaid ?? 0}</p>
                </div>
                <div className="status-card">
                    <h4 className='statuslabel'>Paid Bookings</h4>
                    <p className='statusdata'>{payment_summary?.paid ?? 0}</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
