import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Helper function to load user and token from storage
  const loadUserFromStorage = () => {
    const storedUser = sessionStorage.getItem('user');
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage

    console.log('Stored User in sessionStorage:', storedUser);
    console.log('Stored Token in localStorage:', token);  // Debugging: Log token

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsSignedIn(true);
    }
  };

  // Sign-in function - Save JWT token in localStorage and user info in sessionStorage
  const signIn = (userData, token) => {
    try {
      const normalizedUserData = {
        id: userData.id,
        username: userData.username,
        user_type: userData.user_type,
        is_admin: userData.user_type === 'admin',
        last_login: userData.last_login || null,
      };

      setUser(normalizedUserData);
      setIsSignedIn(true);
      sessionStorage.setItem('user', JSON.stringify(normalizedUserData));
      localStorage.setItem('token', token); // Save token in localStorage
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  // Sign-out function - Remove token and user data from storage
  const signOut = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send token for signout
        },
      });
      if (response.ok) {
        setIsSignedIn(false);
        setUser(null);
        sessionStorage.removeItem('user');
        localStorage.removeItem('token'); // Remove token
      } else {
        console.error('Failed to sign out on the server.');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        setError("No refresh token found. Please log in again.");
        navigate('/signin');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the new token
        return data.token;
      } else {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        navigate("/signin");
      }
    } catch (error) {
      setError("An error occurred while refreshing the token.");
      navigate("/signin");
    }
  };


  // Check if the user session is still valid using the JWT token
  const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      signOut();
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/check-session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send token for verification
        },
      });

      if (response.ok) {
        const data = await response.json();
        signIn(data.user, token);
      } else {
        signOut();
      }
    } catch (error) {
      console.error('Error checking session:', error);
      signOut();
    }
  };

  // Effect to load user and token from storage and check session on initial load
  useEffect(() => {
    loadUserFromStorage();
    checkSession();
  }, []);

  return (
<AuthContext.Provider value={{ isSignedIn, user, signIn, signOut, refreshToken }}>
{children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
