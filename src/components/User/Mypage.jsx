// src/pages/MyPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyPage = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      try {
        await axios.delete("http://localhost:8080/member/deleteAccount", {
          withCredentials: true,
        });
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/login");
      } catch (error) {
        console.error("회원탈퇴 실패:", error);
        alert("회원탈퇴에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-1/4 max-w-xs bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">마이페이지</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/profile/orders")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              주문조회
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/profile/favorites")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              좋아요
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/profile/returns")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              취소/교환/반품
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/profile/edit")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              정보수정
            </button>
          </li>
          <li>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2 px-4 text-left rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300 ease-in-out"
            >
              회원탈퇴
            </button>
          </li>
        </ul>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="w-3/4 max-w-4xl p-8 bg-white rounded-lg shadow-md ml-4">
        <h2 className="text-2xl font-bold mb-6 text-center">회원 정보</h2>
        <p className="text-gray-600 mb-4 text-center">
          여기서 회원 정보를 관리할 수 있습니다.
        </p>

        {/* 회원 정보 표시 */}
        <div className="mb-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-4">회원 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">이름:</span>
              <span>사용자 이름</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">이메일:</span>
              <span>user@example.com</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">연락처:</span>
              <span>010-1234-5678</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">주소:</span>
              <span>서울시 강남구 테헤란로 123</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">생년월일:</span>
              <span>1990-01-01</span>
            </div>
          </div>
        </div>

        {/* 회원 정보 수정 버튼 */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out mb-4"
        >
          회원 정보 수정
        </button>
      </div>
    </div>
  );
};

export default MyPage;
