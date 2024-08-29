// src/components/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://52.78.11.212:8080/member/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.valid) {
            const member = JSON.parse(localStorage.getItem("member"));
            if (member && member.member_type === "admin") {
              setIsAdmin(true);
              localStorage.setItem("admin", true);
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("member");
            localStorage.removeItem("bool");
            localStorage.removeItem("admin");
            setIsAdmin(false);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("member");
          localStorage.removeItem("bool");
          localStorage.removeItem("admin");
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(localStorage.getItem("admin") === "true");
    }
  }, []);

  const login = (token, member) => {
    localStorage.setItem("token", token);
    localStorage.setItem("member", JSON.stringify(member));
    localStorage.setItem("bool", true);
    if (member.member_type === "admin") {
      localStorage.setItem("admin", true);
      setIsAdmin(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    localStorage.removeItem("bool");
    localStorage.removeItem("admin");
    setIsAdmin(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
