import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateProfile from "./UpdateProfile";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/member/getUserInfo",
          {
            withCredentials: true,
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      try {
        // 토큰가져오기
        const cate = JSON.parse(localStorage.getItem("member")).cate;
        const token = localStorage.getItem("token");

        // 토큰이 없을시
        if (!token) {
          alert("로그인을 먼저 해주세요!");
          navigate("/login");
          return;
        }

        await axios.delete("http://localhost:8080/member/deleteAccount", {
          headers: {
            Authorization: `Bearer ${token}`, //HT
          },
          data: { cate },
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

  const handleUpdate = async (updatedInfo) => {
    try {
      await axios.put("http://localhost:8080/member/updateInfo", updatedInfo, {
        withCredentials: true,
      });
      alert("회원 정보가 업데이트되었습니다.");
      setIsModalOpen(false);
      setUserInfo((prev) => ({ ...prev, ...updatedInfo }));
    } catch (error) {
      console.error("회원 정보 업데이트 실패:", error);
      alert("회원 정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
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

      {/* 콘텐츠 영역 */}
      <div className="w-3/4 max-w-4xl p-8 bg-white shadow-md ml-4">
        <h2 className="text-2xl font-bold mb-6 text-center">회원 정보</h2>
        <p className="text-gray-600 mb-4 text-center">
          여기서 회원 정보를 관리할 수 있습니다.
        </p>

        {/* 회원 정보 표시 */}
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
                <span>{userInfo.phone}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">주소:</span>
                <span>{userInfo.address}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">생년월일:</span>
                <span>{userInfo.birthDate}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            정보를 불러오는 중입니다...
          </p>
        )}
      </div>

      {/* 수정 모달 */}
      <UpdateProfile
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userInfo={userInfo || {}}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default MyPage;
