import React, { useEffect, useState } from 'react';
import './Homepage.css';
import Navbar from './Navbar';
import BookingCalendar from './BookingCalendar';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const Homepage = () => {
    const [averageRating, setAverageRating] = useState(null);
    useEffect(() => {
        const fetchAverageRating = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage

            try {
                const response = await fetch('http://localhost:5002/api/average-rating', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }), // Include the token if it exists
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


    function StarRating({ rating }) {
        const maxStars = 5;
        const stars = [];
        const starSize = 54; // Increase this value for bigger stars (e.g., 30, 36)
      
        for (let i = 0; i < maxStars; i++) {
          if (i < Math.floor(rating)) {
            stars.push(<FaStar key={i} color="#FFD700" size={starSize} />);
          } else if (i < rating) {
            stars.push(<FaStarHalfAlt key={i} color="#FFD700" size={starSize} />);
          } else {
            stars.push(<FaRegStar key={i} color="#FFD700" size={starSize} />);
          }
        }



        const header = document.querySelector('.homepage-header');

        useEffect(() => {
            const header = document.querySelector('.homepage-header');
    
            const createFallingStars = () => {
                for (let i = 0; i < 10; i++) {
                    const star = document.createElement('div');
                    star.classList.add('star');
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `-${Math.random() * 20}px`;
                    header.appendChild(star);
    
                    // Remove the star after animation ends
                    star.addEventListener('animationend', () => {
                        star.remove();
                    });
                }
            };
    
            // Add event listener for hover
            header.addEventListener('mouseenter', createFallingStars);
    
            // Clean up event listener
            return () => {
                header.removeEventListener('mouseenter', createFallingStars);
            };
        }, []);
      
        return <div>{stars}</div>;
      }
      
    
    return (
        <div className="homepage">

            <Navbar />

            <header className="homepage-header">
                <h1 id="welcome">Jwhit Productions</h1>
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

            <div className='homepagerating'>
                <h2 className='ratingsheader'>Ratings:</h2>
{averageRating ? <StarRating rating={averageRating} /> : 'No ratings yet'}
</div>
            <div className="apple-music-player">
  <iframe
    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
    frameBorder="0"
    height="145"
    style={{
      width: '100%',
      maxWidth: '660px',
      overflow: 'hidden',
      borderRadius: '10px'
    }}
    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
    src="https://embed.music.apple.com/us/album/mr-blue-sky/196426681?i=196426738"
  ></iframe>
</div>


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