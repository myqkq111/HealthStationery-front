// src/components/MainPage/MainHeader.jsx
import React from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MainHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, member, logout } = useAuth(); // `member`를 가져옵니다.

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    logout(); // useAuth 훅을 사용하여 로그아웃
    navigate("/"); // 로그아웃 후 홈으로 이동
  };

  const handleBasketClick = () => {
    navigate("/basket");
  };

  return (
    <header className="bg-white text-black py-2 px-3 border-b border-gray-200 top-10 inset-x-0 z-20">
      <div className="container mx-auto flex items-center justify-end space-x-3">
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-xs">{member?.name}</span>{" "}
              {/* member?.name으로 안전하게 접근 */}
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
                onClick={() => navigate("/terms")}
                className="text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
              >
                회원가입
              </button>
            </>
          )}
          <button
            onClick={handleBasketClick}
            className="flex items-center text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
          >
            <FaShoppingCart className="mr-1 text-sm" /> 장바구니
          </button>

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
