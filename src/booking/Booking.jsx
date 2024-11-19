import React, { useState, useEffect } from "react";
import "./booking.css";
import Navbar from "../homepage/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import EngineerBooking from "./EngineerBooking";
import PerformanceBooking from "./PerformanceBooking";
import Popup from "./Popup";

const BookingPage = () => {
  const { isSignedIn, user, signOut } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [popup, setPopup] = useState(false);
  const showPopup = () => {
    setPopup(true);
  };
  const handleClosePopup = () => {
    setPopup(false);
  };

  useEffect(() => {
    const bookingTitle = document.querySelector("#bookingtitle");

    const createFallingBooks = () => {
      for (let i = 0; i < 7; i++) {
        const book = document.createElement("span");
        book.classList.add("falling-book");
        book.textContent = ["📚", "📖", "📕", "📙", "📗", "📘", "📓"][i % 7];
        book.style.left = `${Math.random() * 100}%`;
        bookingTitle.appendChild(book);

        // Remove the book after animation ends
        book.addEventListener("animationend", () => {
          book.remove();
        });
      }
    };

    // Drop books continuously every 5 seconds
    const intervalId = setInterval(createFallingBooks, 500);

    // Cleanup function to clear the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Redirect to sign-in page if user is not signed in
  if (!isSignedIn || !token) {
    navigate("/signin");
    return null;
  }

  const user_id = user?.id;
  console.log("User ID in BookingPage:", user_id);

  return (
    <div className="booking-container">
      <Navbar />
      <div id="bookingtitle">Book Your Spot Now!</div>
      <section>
        <div class="apple-music-player2">
          <iframe
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            frameBorder="0"
            height="149"
            style={{
              width: "1150px",
              overflow: "hidden",
              borderRadius: "10px",
            }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/us/album/celebration-single-version/1444107292?i=1444107530"
          ></iframe>
          <div class="apple-music-player2">
            <iframe
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              frameBorder="0"
              height="149"
              style={{
                width: "1150px",
                overflow: "hidden",
                borderRadius: "10px",
              }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src="https://embed.music.apple.com/us/album/takin-care-of-business/1446015797?i=1446015927"
            ></iframe>
          </div>
        </div>
      </section>

      <div className="service-cards-container">
        <div className="service-card">
          <h3>Performance Bookings</h3>
          <ul>
            <li>
              <strong>Karaoke Hosting:</strong> Fun and interactive karaoke
              sessions with a wide range of song choices for guests.
            </li>
            <li>
              <strong>DJ Services:</strong> Professional DJing for parties and
              events, customized to your music preferences and theme.
            </li>
            <li>
              <strong>Live Song Performances:</strong> Personalized live music
              for an unforgettable entertainment experience.
            </li>

            <p>
              <strong>Pricing (4-Hour Standard Booking):</strong>
            </p>
            <li>
              Private Parties (Less than 100 guests):{" "}
              <strong>$120 (4 hours)</strong>
            </li>
            <li>
              Company Events: <strong>$200 minimum (4 hours)</strong>
            </li>
            <li>
              Weddings: <strong>$350 minimum (6 hours)</strong>
            </li>
            <li>
              Deluxe All-Day Event: <strong>$500</strong> (Includes top-tier
              client care, customized playlists, and full-day coverage)
            </li>

            <p>
              <strong>Extras and Add-ons:</strong>
            </p>
            <li>
              Additional Hour (Beyond 4 hours): <strong>$50/hr</strong>
            </li>
            <li>
              Custom Song Requests: <strong>$20 per song</strong>
            </li>
            <li>
              Lighting and Sound Equipment Setup: <strong>$100 flat fee</strong>{" "}
              (Includes professional-grade equipment)
            </li>

            <p>
              <strong>Refund and Cancellation Policy:</strong>
            </p>
            <li>
              Full refund for cancellations made at least 2 weeks before the
              event
            </li>
            <li>50% refund for cancellations made 1 week prior to the event</li>
            <li>
              No refund for cancellations made less than 1 week before the event
            </li>

            <p>
              <strong>Special Offers:</strong>
            </p>
            <li>
              10% discount for early bookings (at least 1 month in advance)
            </li>
            <li>
              15% discount for recurring clients (2+ bookings within 6 months)
            </li>

            <p>
              <strong>Booking Requirements:</strong>
            </p>
            <li>Minimum booking duration: 4 hours</li>
            <li>
              Access to a power supply and venue approval required for equipment
              setup
            </li>
            <li>
              Clear communication of event details and music preferences for a
              tailored experience
            </li>

            <p>
              <strong>Additional Services:</strong>
            </p>
            <li>
              Event MC (Master of Ceremonies): Starting at <strong>$100</strong>{" "}
              (Engages guests and manages event flow)
            </li>
            <li>
              Photography and Video Recording: Starting at <strong>$150</strong>{" "}
              (Captures memorable moments of the event)
            </li>
          </ul>
        </div>

        <div className="service-card">
          <h3>Engineer Bookings</h3>
          <ul>
            <li>
              <strong>New Website Projects:</strong> Professional website
              development tailored to your needs.
            </li>

            <p>
              <strong>Pricing:</strong>
            </p>
            <li>
              <strong>Static Websites:</strong> Starting at{" "}
              <strong>$65 per page</strong>
            </li>
            <ul>
              <li>
                Ideal for simple, informational websites with fixed content
              </li>
              <li>Includes responsive design and basic SEO optimization</li>
              <li>Quick turnaround time (2-5 business days per page)</li>
            </ul>
            <li>
              <strong>Dynamic Applications:</strong> Starting at{" "}
              <strong>$250</strong>
            </li>
            <ul>
              <li>
                Includes interactive features and simple database integration
              </li>
              <li>
                Perfect for blogs, small business sites, and portfolio websites
              </li>
              <li>Custom user interfaces with tailored functionality</li>
            </ul>
            <li>
              <strong>Enterprise Applications:</strong> Starting at{" "}
              <strong>$400</strong>
            </li>
            <ul>
              <li>
                Includes advanced features like user authentication and
                role-based access
              </li>
              <li>
                Scalable architecture for handling high traffic and complex data
                operations
              </li>
              <li>
                Integration with third-party services (e.g., payment gateways,
                APIs)
              </li>
              <li>Ongoing support and maintenance options available</li>
            </ul>

            <li>
              <strong>Software Engineering Consultation Services:</strong>
            </li>
            <p>
              <strong>Details:</strong>
            </p>
            <li>
              Starting at <strong>$30/hr</strong> for expert software
              engineering assistance
            </li>
            <ul>
              <li>Project review and code assessment for best practices</li>
              <li>Debugging and problem-solving sessions</li>
              <li>Guidance on architecture and design patterns</li>
              <li>Assistance with tech stack selection and implementation</li>
              <li>
                Refund policy: Full refund if the issue cannot be resolved or no
                valuable guidance is provided
              </li>
            </ul>

            <p>
              <strong>Additional Services:</strong>
            </p>
            <li>
              Code Review: $50 flat fee (Includes detailed feedback and
              improvement suggestions)
            </li>
            <li>
              API Integration: Starting at $75 per service (Includes setup and
              testing)
            </li>

            <p>
              <strong>Booking Requirements:</strong>
            </p>
            <li>
              Initial consultation required for project scoping and requirements
              gathering
            </li>
            <li>50% deposit required for enterprise projects</li>
            <li>
              Clear communication of project goals and timelines for best
              results
            </li>

            <p>
              <strong>Special Offers:</strong>
            </p>
            <li>10% discount for first-time clients</li>
            <li>20% discount for non-profit organizations and charities</li>
          </ul>
        </div>
      </div>

      <div className="booking-forms-container">
        <PerformanceBooking
          token={token}
          userId={user_id}
          showPopup={showPopup}
        />
        <EngineerBooking
          token={token}
          userId={user_id}
          showPopup={showPopup}
          fetchBookings={() => {}}
        />
      </div>
      {popup && (
        <Popup
          message="Your booking has been successfully created!"
          closePopup={handleClosePopup}
        />
      )}
    </div>
  );
};

export default BookingPage;
