// src/components/DeleteUser.jsx

import React, { useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useAuth } from "../contexts/AuthContext";

const DeleteUser = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const { logout } = useAuth();

  const handlePasswordConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const cate = JSON.parse(localStorage.getItem("member")).cate;
      const email = JSON.parse(localStorage.getItem("member")).email;
      const response = await axiosInstance.post("/member/confirmPassword", {
        password,
        cate,
        email,
      });
      if (response.data) {
        if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
          await axiosInstance.delete("/member/deleteAccount", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { cate },
            withCredentials: true,
          });
          logout();
          alert("회원탈퇴가 완료되었습니다.");
          window.location.href = "/login"; // 또는 navigate 사용
        }
      } else {
        alert("비밀번호가 맞지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 실패:", error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      onClose();
      setPassword("");
    }
  };

  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-300 ease-in-out"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
