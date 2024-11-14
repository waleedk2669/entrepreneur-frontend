import React from 'react';
import { Line } from 'react-chartjs-2';
import './adminDashboard.css';
import { useAuth } from '../AuthContext';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler, // Import the Filler plugin
} from 'chart.js';

// Register the necessary components, including Filler
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const RevenueSection = ({ monthlyRevenueTrends = [], revenueByClientType = {} }) => {
    const { user } = useAuth();

    // Log the user data for debugging purposes
    console.log('Current user in RevenueSection:', user);

    // Safely access monthly revenue trends data
    const labels = (monthlyRevenueTrends ?? []).map(item => item.month);
    const revenueData = (monthlyRevenueTrends ?? []).map(item => item.revenue ?? 0);

    // Chart data configuration
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Monthly Revenue ($)',
                data: revenueData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true, // Enable fill option
            },
        ],
    };

    // Chart options configuration
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
                type: 'linear',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue ($)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
        },
    };

    // Safely access and format revenue values
    const regularClientsRevenue = (revenueByClientType?.regular_clients ?? 0).toLocaleString();
    const engineeringClientsRevenue = (revenueByClientType?.engineering_clients ?? 0).toLocaleString();
    const totalRevenue = (revenueByClientType?.regular_clients ?? 0) + (revenueByClientType?.engineering_clients ?? 0);

    // Conditionally render admin-specific information if the user is an admin
    const adminMessage = user?.is_admin ? <p>Admin Access: Viewing full revenue data.</p> : null;

    return (
        <div className="revenue-section">
            <h2>Revenue Overview</h2>

            {adminMessage}

            {/* Revenue By Client Type */}
            <div className="revenue-summary">
                <h3>Revenue by Client Type</h3>
                <ul>
                    <li><strong>Regular Clients:</strong> ${regularClientsRevenue}</li>
                    <li><strong>Engineering Clients:</strong> ${engineeringClientsRevenue}</li>
                    <li><strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()}</li>
                </ul>
            </div>

            {/* Monthly Revenue Trends Line Chart */}
            <div className="monthly-revenue-chart" aria-label="Monthly Revenue Line Chart">
                <h3>Monthly Revenue Trends (Last 12 Months)</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default RevenueSection;
