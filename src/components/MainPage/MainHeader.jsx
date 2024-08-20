import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaSearch, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import axiosInstance from "../api/AxiosInstance";

const MainHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // 로그인한 사용자 정보 가져오기
  const member = JSON.parse(localStorage.getItem("member"));
  const isAdmin = member?.member_type === "admin";
  const memberId = JSON.parse(localStorage.getItem("member"))?.id;
  const { cartItemCount, updateCartItemCount, resetCart } = useCart();

  useEffect(() => {
    if (memberId) {
      axiosInstance
        .get(`/basket/item-count?id=${memberId}`)
        .then((response) => {
          updateCartItemCount(response.data);
        })
        .catch((error) => {
          console.error(
            "장바구니 아이템 수를 가져오는 데 실패했습니다.",
            error
          );
        });
    }
  }, [memberId, updateCartItemCount]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    logout(); // useAuth 훅을 사용하여 로그아웃
    resetCart(); // 장바구니 초기화
    navigate("/"); // 로그아웃 후 홈으로 이동
  };

  const handleAdminPageClick = () => {
    navigate("/admin"); // 관리자 페이지로 이동
  };

  return (
    <header className="bg-white text-black py-2 px-3 border-b border-gray-200 top-10 inset-x-0 z-20">
      <div className="container mx-auto flex items-center justify-end space-x-3">
        <div className="flex items-center space-x-3">
          {localStorage.getItem("bool") ? (
            <>
              <span className="text-xs">{member.name}</span>
              <button
                onClick={handleLogoutClick}
                className="text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
              >
                로그아웃
              </button>
              {isAdmin && (
                <button
                  onClick={handleAdminPageClick}
                  className="text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer flex items-center"
                >
                  <FaUserShield className="mr-1 text-sm" /> 관리자 페이지
                </button>
              )}
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
          <a
            href="/cart"
            className="flex items-center text-xs hover:text-yellow-500 relative"
          >
            <FaShoppingCart className="text-sm" />
            <span className="ml-1 text-xs">장바구니</span>{" "}
            {/* 텍스트와 숫자 사이의 간격 조정 */}
            {cartItemCount > 0 && (
              <span className="absolute -right-4 top-[-10%] bg-red-500 text-white rounded-full text-[10px] font-bold px-1 py-0.5">
                {cartItemCount}
              </span>
            )}
          </a>
          <button
            onClick={handleProfileClick}
            className="flex items-center text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
            style={{ marginLeft: "2rem" }} // 또는 원하는 값으로 조정
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
