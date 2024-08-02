// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [member, setMember] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setMember(response.data.member); // Assume the API returns the full member object
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("member");
        });
    }
  }, []);

  const login = (token, member) => {
    localStorage.setItem("token", token);
    localStorage.setItem("member", JSON.stringify(member)); // Store the full member object
    setIsAuthenticated(true);
    setMember(member);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    setIsAuthenticated(false);
    setMember(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, member, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
