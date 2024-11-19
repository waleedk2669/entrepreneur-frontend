import React from "react";
import "./popup.css"; // Make sure to include CSS for styling
import { useNavigate } from "react-router-dom";

const Popup = ({ closePopup }) => {
  const navigate = useNavigate();
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Cross icon to close the popup */}
        <div className="popup-close-btn" onClick={closePopup}>
          ×
        </div>

        <div className="popup-message">
          <h2>Booking Created Successfully!</h2>
          <p>
            Your engineering booking has been successfully created. You can now
            proceed to the dashboard to proceed the payment.
          </p>
        </div>

        {/* Go to Dashboard button, centered */}
        <div className="popup-actions">
          <button
            className="popup-dashboard-btn"
            onClick={() => {
              closePopup();
              navigate("/client-dashboard");
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
