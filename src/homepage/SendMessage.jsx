import React, { useState } from "react";
import "./SendMessage.css";

const apiUrl = import.meta.env.VITE_API_URL;

const SendMessage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate input fields
    if (!name || !email || !content) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    // Send message to the backend
    try {
      const response = await fetch(`${apiUrl}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, content }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Message sent successfully!");
        setName("");
        setEmail("");
        setContent("");
      } else {
        setError(data.error || "Failed to send message.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="send-message-container">
      <h2 className="sendmessage">Questions?</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="labil" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="labil" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="labil" htmlFor="content">
            Message:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="send-button">
          Send Message
        </button>
      </form>
      <section className="homepage-contact">
        <h2>Contact Me</h2>
        <p>
          If you have any questions or want to discuss your project, feel free
          to reach out!
        </p>
        <p>
          Email:{" "}
          <a className="emailme" href="mailto:paredes.jonathen@yahoo.com">
            paredes.jonathen@yahoo.com
          </a>
        </p>
        <p>Phone: (959) 204-1689</p>
      </section>
    </div>
  );
};

export default SendMessage;
