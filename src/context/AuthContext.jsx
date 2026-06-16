import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    
    if (userId && email && fullName && role) {
      return { userId, email, fullName, role };
    }
    return null;
  });

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 401 Unauthorized, 400 Bad Request)
        let errMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        try {
          const errorData = await response.json();
          errMsg = errorData.message || errMsg;
        } catch (e) {
          // If response body is not JSON or empty
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      
      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenType', data.tokenType || 'Bearer');
      localStorage.setItem('userId', String(data.userId));
      localStorage.setItem('email', data.email);
      localStorage.setItem('fullName', data.fullName);
      localStorage.setItem('role', data.role);

      // Update React state
      setToken(data.token);
      setUser({
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');

    // Reset React state
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
