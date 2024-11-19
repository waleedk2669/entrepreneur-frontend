import React, { useEffect, useState } from "react";
import "./Messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all messages from the backend
  const fetchMessages = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/admin/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to fetch messages. Please try again later.");
    }
  };

  // Delete a message by its ID
  const handleDelete = async (messageId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Message deleted successfully!");
        // Remove the deleted message from the state
        setMessages(messages.filter((message) => message.id !== messageId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to delete the message. Please try again later.");
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="messages-container">
      <h2>Admin Messages</h2>
      {error && <p className="error-message">{error}</p>}
      {messages.length > 0 ? (
        <ul className="messages-list">
          {messages.map((message) => (
            <li key={message.id} className="message-item">
              <p>
                <strong>Name:</strong> {message.name}
              </p>
              <p>
                <strong>Email:</strong> {message.email}
              </p>
              <p>
                <strong>Message:</strong> {message.content}
              </p>
              <p>
                <strong>Created At:</strong> {message.created_at}
              </p>
              <button
                onClick={() => handleDelete(message.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default Messages;
