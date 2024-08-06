import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateProfile from "./UpdateProfile";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/AxiosInstance";
import { update } from "lodash";
const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("member"));
    if (user) {
      // 로컬 스토리지에서 가져온 사용자 정보를 상태로 설정
      console.log(user);
      console.log(user.name);
      setUserInfo(user);
    } else {
      // 서버에서 사용자 정보를 가져와야 할 경우
      axiosInstance
        .get("/member/getUserInfo", {
          withCredentials: true,
        })
        .then((response) => {
          // 서버에서 가져온 사용자 정보를 상태로 설정하고 로컬 스토리지에도 저장
          setUserInfo(response.data);
          localStorage.setItem("member", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("사용자 정보 조회 실패:", error);
        });
    }
  }, []);
  const handleDeleteAccount = async () => {
    setIsPasswordConfirmOpen(true); // 비밀번호 확인 모달을 엽니다.
  };
  const handlePasswordConfirm = async () => {
    try {
      // 비밀번호 확인 요청
      const token = localStorage.getItem("token");
      const cate = JSON.parse(localStorage.getItem("member")).cate;
      const email = JSON.parse(localStorage.getItem("member")).email;
      const response = await axios.post(
        "http://localhost:8080/member/confirmPassword",
        { password, cate, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        // 비밀번호 확인 성공 후 회원 탈퇴 요청
        if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
          await axios.delete("http://localhost:8080/member/deleteAccount", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { cate },
            withCredentials: true,
          });
          logout();
          alert("회원탈퇴가 완료되었습니다.");
          navigate("/login");
        }
      } else {
        alert("비밀번호가 맞지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 실패:", error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsPasswordConfirmOpen(false);
      setPassword(""); // 비밀번호 입력 초기화
    }
  };
  const handleUpdate = (updatedInfo) => {
    setUserInfo((prev) => ({ ...prev, ...updatedInfo }));
    setIsModalOpen(false);
    console.log(updatedInfo);
    alert("회원 정보가 업데이트되었습니다.");
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
                <span>{userInfo.tell}</span>
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
      {/* 비밀번호 확인 모달 */}
      {isPasswordConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
          <div className="bg-white p-6 max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              비밀번호 확인
            </h3>
            <p className="text-gray-600 mb-6">
              회원탈퇴를 진행하려면 현재 비밀번호를 입력해 주세요.
            </p>
            <input
              type="password"
              placeholder="현재 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-300 ease-in-out mb-4"
            />
            <p className="text-red-600 mb-4">
              가입된 회원정보가 모두 삭제됩니다. 탈퇴 후 같은 계정으로 재가입 시
              기존에 적립된 적립금은 적용되지 않습니다. 정말 탈퇴하시겠습니까?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handlePasswordConfirm}
                className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                확인
              </button>
              <button
                onClick={() => setIsPasswordConfirmOpen(false)}
                className="py-2 px-4 bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-300 ease-in-out"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyPage;
