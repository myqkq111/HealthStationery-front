import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaSearch, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/AxiosInstance";

const MainHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);
  const memberId = JSON.parse(localStorage.getItem("member"))?.id;

  //장바구니 아이템수 가져오기
  const fetchCartItemCount = () => {
    axiosInstance
      .get(`/basket/item-count?id=${memberId}`)
      .then((response) => {
        setCartItemCount(response.data); // 서버에서 반환된 장바구니 아이템 수를 상태에 저장
      })
      .catch((error) => {
        console.error("장바구니 아이템 수를 가져오는 데 실패했습니다.", error);
      });
  };

  // 컴포넌트가 마운트될 때 장바구니 아이템 수를 가져오고, 일정 간격으로 새로고침
  useEffect(() => {
    // 초기 데이터 로드
    fetchCartItemCount();

    // 1초마다 장바구니 아이템 수를 새로 고침
    const intervalId = setInterval(fetchCartItemCount, 100);

    // 클린업: 컴포넌트 언마운트 시 interval 종료
    return () => clearInterval(intervalId);
  }, [memberId]);

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

  const handleAdminPageClick = () => {
    navigate("/admin"); // 관리자 페이지로 이동
  };

  // 로그인한 사용자 정보 가져오기
  const member = JSON.parse(localStorage.getItem("member"));
  const isAdmin = member?.member_type === "admin";

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
