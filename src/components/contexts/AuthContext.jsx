// src/components/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/member/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.valid) {
            const member = JSON.parse(localStorage.getItem("member"));
            if (member && member.member_type === "admin") {
              localStorage.setItem("admin", true);
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("member");
            localStorage.removeItem("bool");
            localStorage.removeItem("admin");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("member");
          localStorage.removeItem("bool");
          localStorage.removeItem("admin");
        });
    }
  }, []);

  const login = (token, member) => {
    localStorage.setItem("token", token);
    localStorage.setItem("member", JSON.stringify(member));
    localStorage.setItem("bool", true);
    if (member.member_type === "admin") {
      localStorage.setItem("admin", true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    localStorage.removeItem("bool");
    localStorage.removeItem("admin");
    alert("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
