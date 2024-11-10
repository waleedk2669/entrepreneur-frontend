import React, { useEffect, useState } from 'react';
import './Homepage.css';
import Navbar from './Navbar';
import BookingCalendar from './BookingCalendar';

const Homepage = () => {
    const [averageRating, setAverageRating] = useState(null);
    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/average-rating', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setAverageRating(data.average_rating);
                } else {
                    console.error('Error fetching average rating:', data.error);
                }
            } catch (error) {
                console.error('Error fetching average rating:', error.message);
            }
        };

        fetchAverageRating();
    }, []);
    return (
        <div className="homepage">

            <Navbar />

            <header className="homepage-header">
                <h1 id="welcome">Jwhit Productions</h1>
                <h2>Average Client Rating: {averageRating ? `${averageRating} / 5` : 'No ratings yet'}</h2>

            </header>

            <section className="homepage-features">
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Performance Booking</h3>
                        <p>Book live performances for weddings, events, and more! Professional setup, DJ/Karaoke (KJ) options, and more.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Software Engineering Projects</h3>
                        <p>Full-stack development for web applications, mobile apps, and software solutions tailored to your business needs.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Consultation Services</h3>
                        <p>One-on-one or team consultations to help you plan, develop, and deploy tech solutions efficiently.</p>
                    </div>
                </div>
            </section>
            <section className="homepage-calendar">
                <BookingCalendar />
            </section>

            <section className="homepage-contact">
                <h2>Contact Me</h2>
                <p>If you have any questions or want to discuss your project, feel free to reach out!</p>
                <p>Email: <a href="mailto:paredes.jonathen@yahoo.com">paredes.jonathen@yahoo.com</a></p>
                <p>Phone: (959) 204-1689</p>
            </section>
            
        </div>
    );
};

export default Homepage;