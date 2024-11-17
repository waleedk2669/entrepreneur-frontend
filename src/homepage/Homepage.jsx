import React, { useEffect, useState } from "react";
import "./Homepage.css";
import Navbar from "./Navbar";
import BookingCalendar from "./BookingCalendar";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import SendMessage from "./SendMessage";

const Homepage = () => {
  const [averageRating, setAverageRating] = useState(null);
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(
          "http://localhost:5002/api/average-rating",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setAverageRating(data.average_rating);
        } else {
          console.error("Error fetching average rating:", data.error);
        }
      } catch (error) {
        console.error("Error fetching average rating:", error.message);
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

    const header = document.querySelector(".homepage-header");

    useEffect(() => {
      const header = document.querySelector(".homepage-header");

      const createFallingStars = () => {
        for (let i = 0; i < 10; i++) {
          const star = document.createElement("div");
          star.classList.add("star");
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `-${Math.random() * 20}px`;
          header.appendChild(star);

          // Remove the star after animation ends
          star.addEventListener("animationend", () => {
            star.remove();
          });
        }
      };

      // Automatically create falling stars every 3 seconds
      const intervalId = setInterval(createFallingStars, 500);

      // Cleanup function to clear the interval on component unmount
      return () => {
        clearInterval(intervalId);
      };
    }, []);

    return <div>{stars}</div>;
  }

  // Array of beautiful gradients
  const gradients = [
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  ];

  // Get the feature card element
  // Get all feature card elements
  const featureCards = document.querySelectorAll(".feature-card");

  // Add hover event listeners to each feature card
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const randomGradient =
        gradients[Math.floor(Math.random() * gradients.length)];
      card.style.backgroundImage = randomGradient;
    });

    card.addEventListener("mouseleave", () => {
      card.style.backgroundImage = "none";
      card.style.backgroundColor = "#fff";
    });
  });

  useEffect(() => {
    const ratingElement = document.querySelector(".homepagerating");

    const createFallingStars2 = () => {
      for (let i = 0; i < 5; i++) {
        const star = document.createElement("div");
        star.classList.add("star2");
        star.style.left = `${Math.random() * 100}%`;
        star.style.setProperty("--i", i);
        ratingElement.appendChild(star);

        // Remove the star after animation ends
        star.addEventListener("animationend", () => {
          star.remove();
        });
      }
    };

    // Automatically create falling stars every 3 seconds
    const intervalId = setInterval(createFallingStars2, 500);

    // Cleanup function to clear the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="homepage">
      <Navbar />

      <header className="homepage-header">
        <h1 id="welcome">JWhit Production</h1>
      </header>

      <div className="homepagerating">
        <h2 className="ratingsheader">
          Ratings:{" "}
          {averageRating ? (
            <StarRating rating={averageRating} />
          ) : (
            "No ratings yet"
          )}
        </h2>
      </div>

      <div className="apple-music-player">
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          frameBorder="0"
          height="149"
          style={{
            width: "100%",
            maxWidth: "1100px",
            overflow: "hidden",
            borderRadius: "10px",
          }}
          src="https://embed.music.apple.com/us/album/mr-blue-sky/196426681?i=196426738"
        ></iframe>
      </div>

      <section className="homepage-calendar">
        <section className="homepage-features">
          <div className="feature-cards">
            <div className="feature-card performance">
              <h3>Performance Booking</h3>
              <p>
                Elevate your event with live performances, high-energy DJ sets,
                interactive karaoke, charismatic emcee services, and more!
              </p>
            </div>
            <div className="feature-card performance">
              <h3> Bartending Experience</h3>
              <p>
                Elevate your events with a customized bartending service,
                tailored drink menus, and a touch of flair. Tips Certified.
              </p>
            </div>

            <div className="feature-card">
              <h3>Software Engineering</h3>
              <p>
                Full-stack development for web applications, mobile apps, and
                software solutions tailored to your needs.
              </p>
            </div>
            <div className="feature-card">
              <h3>Consultation Services</h3>
              <p>
                One-on-one or team consultations to help you plan, develop, and
                deploy tech solutions efficiently.
              </p>
            </div>
          </div>
        </section>
        <BookingCalendar />
        <SendMessage />
      </section>
    </div>
  );
};

export default Homepage;
