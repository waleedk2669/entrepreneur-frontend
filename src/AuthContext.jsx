import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const loadUserFromStorage = () => {
    const storedUser = sessionStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log('Stored User in sessionStorage:', storedUser);
    console.log('Stored Token in localStorage:', token);

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(token);
      setIsSignedIn(true);
    }
    setLoading(false);
  };

  const signIn = (userData, accessToken, refreshToken) => {
    try {
      const normalizedUserData = {
        id: userData.id,
        username: userData.username,
        user_type: userData.user_type,
        is_admin: userData.user_type === 'admin',
        last_login: userData.last_login || null,
      };

      setUser(normalizedUserData);
      setToken(accessToken);
      setIsSignedIn(true);
      sessionStorage.setItem('user', JSON.stringify(normalizedUserData));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      console.log("Stored token:", localStorage.getItem("token"));
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsSignedIn(false);
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      } else {
        console.error('Failed to sign out on the server.');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
