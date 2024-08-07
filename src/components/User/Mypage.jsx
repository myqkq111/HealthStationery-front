// src/components/MyPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import UpdateProfile from "./UpdateProfile";
import DeleteUser from "./DeleteUser";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("member"));
    if (user) {
      setUserInfo(user);
    } else {
      axiosInstance
        .get("/member/getUserInfo", { withCredentials: true })
        .then((response) => {
          setUserInfo(response.data);
          localStorage.setItem("member", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("사용자 정보 조회 실패:", error);
        });
    }
  }, []);

  const handleDeleteAccount = () => {
    setIsDeleteUserOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 max-w-xs bg-white shadow-md p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/profile/orders")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              주문조회
            </button>
          </li>
          <hr className="flex-1 border-t border-gray-300" />
          <li>
            <button
              onClick={() => navigate("/profile/favorites")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              좋아요
            </button>
          </li>
          <hr className="flex-1 border-t border-gray-300" />
          <li>
            <button
              onClick={() => navigate("/profile/returns")}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              취소/교환/반품
            </button>
          </li>
          <hr className="flex-1 border-t border-gray-300" />
          <li>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              정보수정
            </button>
          </li>
          <hr className="flex-1 border-t border-gray-300" />
          <li>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              회원탈퇴
            </button>
          </li>
          <hr className="flex-1 border-t border-gray-300" />
        </ul>
      </div>
      <div className="w-3/4 max-w-4xl p-8 bg-white shadow-md ml-4">
        <h2 className="text-2xl font-bold mb-6 text-center">회원 정보</h2>
        <p className="text-gray-600 mb-4 text-center">
          여기서 회원 정보를 관리할 수 있습니다.
        </p>
        {userInfo ? (
          <div className="mb-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-4">회원 정보</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">이름:</span>
                <span>{userInfo.name}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">이메일:</span>
                <span>{userInfo.email}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">연락처:</span>
                <span>{userInfo.tell}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">주소:</span>
                <span>
                  {userInfo.roadaddr && userInfo.detailaddr
                    ? `${userInfo.roadaddr} ${userInfo.detailaddr}`
                    : "정보 없음"}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">생년월일:</span>
                <span>{formatDate(userInfo.birth)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            정보를 불러오는 중입니다...
          </p>
        )}
      </div>
      <UpdateProfile
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedInfo) => {
          setUserInfo((prev) => ({ ...prev, ...updatedInfo }));
          alert("회원 정보가 업데이트되었습니다.");
        }}
      />
      <DeleteUser
        isOpen={isDeleteUserOpen}
        onClose={() => setIsDeleteUserOpen(false)}
      />
    </div>
  );
};

export default MyPage;
