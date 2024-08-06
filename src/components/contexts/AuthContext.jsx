// src/components/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    //토큰 유효성 검사
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/member/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (!response.data.valid) {
            //토큰이 유효하지 않을 경우
            localStorage.removeItem("token");
            localStorage.removeItem("member");
            localStorage.removeItem("bool");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("member");
          localStorage.removeItem("bool");
        });
    }
  }, []);

  const login = (token, member) => {
    localStorage.setItem("token", token);
    localStorage.setItem("member", JSON.stringify(member));
    localStorage.setItem("bool", true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    localStorage.removeItem("bool");
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
