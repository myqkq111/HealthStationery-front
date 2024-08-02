// src/components/MainPage/MainHeader.jsx
import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MainHeader = () => {
  const navigate = useNavigate();

  // 로그인 상태와 사용자명을 추적하는 상태 추가
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로그인 상태를 확인하는 로직
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setIsAuthenticated(true);
      setUsername(loggedInUser);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/terms");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    // 로그아웃 로직
    setIsAuthenticated(false);
    setUsername("");
    localStorage.removeItem("username");
  };

  return (
    <header className="bg-white text-black py-2 px-3 border-b border-gray-200 top-10 inset-x-0 z-20">
      <div className="container mx-auto flex items-center justify-end space-x-3">
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-xs">{username}</span>
              <button
                onClick={handleLogoutClick}
                className="text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
              >
                로그인
              </button>
              <button
                onClick={handleSignUpClick}
                className="text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
              >
                회원가입
              </button>
            </>
          )}
          <a
            href="/cart"
            className="flex items-center text-xs hover:text-yellow-500"
          >
            <FaShoppingCart className="mr-1 text-sm" /> 장바구니
          </a>
          <button
            onClick={handleProfileClick}
            className="flex items-center text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
          >
            <FaUser className="mr-1 text-sm" /> 마이페이지
          </button>
        </div>

        <div className="relative ml-3">
          <input
            type="text"
            placeholder="검색..."
            className="p-1 pl-6 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs"
          />
          <FaSearch className="absolute left-2 top-1 text-gray-600 text-xs" />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
