import React, { useState, useEffect } from "react";
import UpdateProfile from "./UpdateProfile";
import DeleteUser from "./DeleteUser";
import UpdatePassword from "./UpdatePassword";
import OrderList from "./BuyList";
import Favorite from "./Favorite";
import axiosInstance from "../api/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BuyList from "./BuyList";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("myPageActiveTab");
    return savedTab ? savedTab : "orders";
  });

  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
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

  useEffect(() => {
    localStorage.setItem("myPageActiveTab", activeTab);
  }, [activeTab]);

  const handleProfileUpdate = (updatedInfo) => {
    // Update local storage or perform any additional actions after profile update
    localStorage.setItem("member", JSON.stringify(updatedInfo));
    setIsUpdateProfileOpen(false);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "updateProfile") {
      setIsUpdateProfileOpen(true); // 프로필 수정 모달 열기
    } else if (tab === "resetPassword") {
      setIsPasswordModalOpen(true); // 비밀번호 재설정 모달 열기
    } else if (tab === "deleteAccount") {
      setIsDeleteUserOpen(true); // 회원 탈퇴 모달 열기
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString(); // 로케일에 맞는 날짜 형식으로 변환
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 bg-gray-200 p-4 border-r border-gray-300 fixed h-full">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            주문 조회
          </button>
          <button
            onClick={() => handleTabClick("view")}
            className={`px-4 py-2 ${
              activeTab === "view"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            좋아요
          </button>
          <button
            onClick={() => setActiveTab("returns")}
            className={`px-4 py-2 ${
              activeTab === "returns"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            취소/교환/반품
          </button>
          <button
            onClick={() => handleTabClick("updateProfile")}
            className={`px-4 py-2 ${
              activeTab === "updateProfile"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            정보 수정
          </button>
          <button
            onClick={() => handleTabClick("deleteAccount")}
            className={`px-4 py-2 ${
              activeTab === "deleteAccount"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            회원 탈퇴
          </button>
          {/* 비밀번호 재설정 버튼은 cate가 "home"인 경우에만 표시 */}
          {userInfo && userInfo.cate === "home" && (
            <button
              onClick={() => handleTabClick("resetPassword")}
              className={`px-4 py-2 ${
                activeTab === "resetPassword"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-700 transition duration-300`}
            >
              비밀번호 재설정
            </button>
          )}
        </div>
      </div>

      {/* 오른쪽 내용 */}
      <div className="flex-1 ml-64 p-6 bg-gray-100">
        {/* 사용자 정보 표시 */}
        {userInfo && (
          <div className="mb-6 p-4 bg-white flex items-center ">
            {/* 기본 프로필 이미지 */}
            <div
              className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300 mr-4 cursor-pointer"
              onClick={() => {
                setActiveTab("updateProfile");
                setIsUpdateProfileOpen(true);
              }}
            >
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-600"
                style={{ fontSize: "2rem" }}
              />
            </div>
            <p className="text-xl font-semibold mb-2">
              <strong>
                {userInfo.name}님 헬스문방구에 방문해주셔서 감사합니다!
                어서오세요!
              </strong>
            </p>
          </div>
        )}
        {activeTab === "updateProfile" && isUpdateProfileOpen && (
          <UpdateProfile
            isOpen={isUpdateProfileOpen}
            onClose={() => setIsUpdateProfileOpen(false)}
            onSave={handleProfileUpdate}
          />
        )}
        {activeTab === "deleteAccount" && isDeleteUserOpen && (
          <DeleteUser
            isOpen={isDeleteUserOpen}
            onClose={() => setIsDeleteUserOpen(false)}
          />
        )}
        {activeTab === "resetPassword" && isPasswordModalOpen && (
          <UpdatePassword onClose={() => setIsPasswordModalOpen(false)} />
        )}
        {activeTab === "view" && <Favorite />}
        {activeTab === "buylist" && <BuyList />}
      </div>
    </div>
  );
};

export default MyPage;
