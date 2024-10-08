import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaSearch, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import axiosInstance from "../api/AxiosInstance";

const MainHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { cartItemCount, updateCartItemCount, resetCart } = useCart();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

  // 로그인한 사용자 정보 가져오기
  const member = JSON.parse(localStorage.getItem("member"));
  const isAdmin = member?.member_type === "admin";
  const memberId = member?.id;

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

  const checkLoginStatus = () => {
    return !!JSON.parse(localStorage.getItem("member"));
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!checkLoginStatus()) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  const handleLogoutClick = () => {
    logout(); // useAuth 훅을 사용하여 로그아웃
    resetCart(); // 장바구니 초기화
    navigate("/"); // 로그아웃 후 홈으로 이동
  };

  const handleAdminPageClick = () => {
    navigate("/admin"); // 관리자 페이지로 이동
  };

  const handleCartClick = () => {
    if (!checkLoginStatus()) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  // 검색어 입력 이벤트 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 제출 이벤트 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    if (searchTerm.trim()) {
      console.log("검색어:", searchTerm); // 검색어 확인
      axiosInstance
        .get("/product/search", { params: { keyword: searchTerm } })
        .then((response) => {
          console.log("검색 결과:", response.data); // 응답 데이터 확인
          navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        })
        .catch((error) => {
          console.error(
            "검색 요청 실패:",
            error.response?.data || error.message
          );
        });
    } else {
      console.warn("검색어가 비어 있습니다.");
    }
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
            href="#"
            onClick={handleCartClick}
            className="flex items-center text-xs hover:text-yellow-500 relative"
          >
            <FaShoppingCart className="text-sm" />
            <span className="ml-1 text-xs">장바구니</span>
            {cartItemCount > 0 && (
              <span className="absolute -right-4 top-[-10%] bg-red-500 text-white rounded-full text-[10px] font-bold px-1 py-0.5">
                {cartItemCount}
              </span>
            )}
          </a>
          <button
            onClick={handleProfileClick}
            className="flex items-center text-xs hover:text-yellow-500 bg-transparent border-none cursor-pointer"
            style={{ marginLeft: "2rem" }}
          >
            <FaUser className="mr-1 text-sm" /> 마이페이지
          </button>
        </div>
        <div className="relative ml-3">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 pl-4 bg-gray-100 text-black text-right rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs"
            />
            <FaSearch className="absolute left-2 top-1 text-gray-600 text-xs" />
          </form>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
