import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";

const UpdatePassword = ({ onClose }) => {
  const [step, setStep] = useState(1); // 현재 단계 추적
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("member"));
    const { cate } = user;

    if (cate !== "home") {
      setStep(2);
    }
  }, []);

  const handlePasswordConfirm = () => {
    setIsLoading(true);
    setError(""); // 이전 오류 지우기
    setSuccess(""); // 이전 성공 메시지 지우기

    const user = JSON.parse(localStorage.getItem("member"));
    const { cate, email } = user;

    axiosInstance
      .post("/member/confirmPassword", {
        password: currentPassword,
        cate,
        email,
      })
      .then((response) => {
        if (response.data === 1) {
          // 비밀번호 확인 완료, 다음 단계로 이동
          setStep(2); // 다음 단계로 이동
        } else {
          setError("현재 비밀번호가 맞지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("비밀번호 확인 실패:", error);
        setError("비밀번호 확인 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmNewPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    const user = JSON.parse(localStorage.getItem("member"));
    const { cate, email } = user;

    axiosInstance
      .put("/member/updatePassword", {
        password: newPassword, // 서버에서 현재 비밀번호도 필요할 경우 포함
        cate,
        email,
      })
      .then((response) => {
        if (response.data === 1) {
          setSuccess("비밀번호가 성공적으로 변경되었습니다.");
          setTimeout(() => {
            onClose(); // 성공 메시지를 보여준 후 모달 닫기
          }, 2000); // 성공 메시지를 보여주기 위한 딜레이
        } else {
          setError("비밀번호 변경 실패.");
        }
      })
      .catch((error) => {
        console.error("비밀번호 재설정 실패:", error);
        setError("비밀번호 재설정 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
        // 폼 필드 초기화
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === 1) {
      handlePasswordConfirm();
    } else if (step === 2) {
      handleResetPassword();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          비밀번호 재설정
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {step === 1 && (
            <>
              <div className="w-full mb-4">
                <input
                  type="password"
                  value={currentPassword}
                  placeholder="현재 비밀번호"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "비밀번호 확인"}
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="w-full mb-4">
                <input
                  type="password"
                  value={newPassword}
                  placeholder="새 비밀번호"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <div className="w-full mb-4">
                <input
                  type="password"
                  value={confirmNewPassword}
                  placeholder="새 비밀번호 확인"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "비밀번호 재설정"}
              </button>
            </>
          )}
          {success && (
            <p className="text-green-500 text-center mt-4">{success}</p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
