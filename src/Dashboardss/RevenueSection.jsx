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
    Filler,
} from 'chart.js';

// Register the necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const RevenueSection = ({ monthlyRevenueTrends = [], revenueByClientType = {} }) => {
    const { user } = useAuth();

    // Log props for debugging
    console.log("Props - monthlyRevenueTrends:", monthlyRevenueTrends);
    console.log("Props - revenueByClientType:", revenueByClientType);

    // Prepare data for the chart
    const labels = (monthlyRevenueTrends ?? []).map(item => item.month);
    const revenueData = (monthlyRevenueTrends ?? []).map(item => item.revenue ?? 0);

    // Chart data configuration
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Monthly Revenue ($)',
                data: revenueData,
                borderColor: 'rgba(0, 0, 0, 0.8)',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Chart options configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true, // Disable aspect ratio to control the size
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                    color: '#333',
                },
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => `Revenue: $${context.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'black', // Black grid lines
                    lineWidth: 1,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
                title: {
                    display: true,
                    text: 'Revenue ($)',
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                    color: '#333',
                },
            },
            x: {
                grid: {
                    color: 'black', // Black grid lines
                    lineWidth: 1,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
                title: {
                    display: true,
                    text: 'Month',
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                    color: '#333',
                },
            },
        },
    };

    // Revenue summary values
    const regularClientsRevenue = (revenueByClientType?.regular_clients ?? 0).toLocaleString();
    const engineeringClientsRevenue = (revenueByClientType?.engineering_clients ?? 0).toLocaleString();
    const totalRevenue = (revenueByClientType?.regular_clients ?? 0) + (revenueByClientType?.engineering_clients ?? 0);

    // Admin message
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
            <div className="monthly-revenue-chart-container">
                <h3>Monthly Revenue Trends (Last 12 Months)</h3>
                <div className="chart-wrapper">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default RevenueSection;
