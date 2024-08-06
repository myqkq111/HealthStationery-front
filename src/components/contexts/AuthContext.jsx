// src/components/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";

// 인증 상태를 관리하는 컨텍스트 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    // 컴포넌트가 마운트될 때, 저장된 토큰을 검사하여 인증 상태를 확인
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
            // 토큰이 유효하지 않을 경우, 인증 상태 및 관리자 상태를 false로 설정
            localStorage.removeItem("token");
            localStorage.removeItem("member");
            localStorage.removeItem("bool");
            localStorage.removeItem("admin");
          }
        })
        .catch(() => {
          // 요청 실패 시, 인증 상태 및 관리자 상태를 false로 설정
          localStorage.removeItem("token");
          localStorage.removeItem("member");
          localStorage.removeItem("bool");
          localStorage.removeItem("admin");
        });
    }
  }, []);

  // 로그인 시 호출되는 함수
  const login = (token, member) => {
    localStorage.setItem("token", token);
    localStorage.setItem("member", JSON.stringify(member));
    localStorage.setItem("bool", true);
    if (member.member_type === "admin") {
      localStorage.setItem("admin", true);
    }
  };

  // 로그아웃 시 호출되는 함수
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    localStorage.removeItem("bool");
    localStorage.removeItem("admin");
  };

  // 컨텍스트 값을 제공하여 하위 컴포넌트에서 사용할 수 있게 함
  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 컨텍스트를 사용하는 커스텀 훅
export const useAuth = () => useContext(AuthContext);
