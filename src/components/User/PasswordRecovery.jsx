import React, { useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";

const PasswordRecovery = ({ selectedEmail, selectedId, onClose }) => {
  const [email, setEmail] = useState(selectedEmail);
  const [id, setId] = useState(selectedId);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasNumber = /[0-9]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isNotSequential =
      !/(\d)\1\1/.test(password) && !/(.)\1\1/.test(password);
    const isNotKeyboardPattern = !/qwerty|asdfgh|zxcvbn|123456|654321/.test(
      password.toLowerCase()
    );

    if (
      password.length >= 8 &&
      hasNumber &&
      hasUpperCase &&
      hasLowerCase &&
      hasSpecialChar &&
      isNotSequential &&
      isNotKeyboardPattern
    ) {
      setPasswordStrength("강함");
      return true;
    } else if (password.length >= 6) {
      setPasswordStrength("중간");
      return false;
    } else {
      setPasswordStrength("취약");
      return false;
    }
  };

  const getColorClass = (index) => {
    if (passwordStrength === "강함") return "bg-green-500";
    if (passwordStrength === "중간" && index < 2) return "bg-yellow-500";
    if (passwordStrength === "취약" && index === 0) return "bg-red-500";
    return "bg-gray-300";
  };

  const getTextColorClass = (strength) => {
    return passwordStrength === strength ? "text-black" : "text-gray-300";
  };

  const handlePasswordChange = (e) => {
    setPasswordError("");
    setPasswordCheckMessage("");
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    if (newPassword.length > 0) {
      validatePassword(newPassword);
    } else {
      setPasswordStrength("");
    }
  };

  const handlePasswordCheck = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      setPasswordCheckMessage("");
    } else if (!validatePassword(newPassword)) {
      setPasswordError("비밀번호가 보안 정책을 준수하지 않습니다.");
      setPasswordCheckMessage("");
    } else {
      setPasswordError("");
      setPasswordCheckMessage("사용 가능한 비밀번호입니다.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === "") {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (passwordCheckMessage === "") {
      setError("비밀번호를 확인해주세요.");
      return;
    }

    setLoading(true);

    const formData = {
      id: id,
      password: newPassword,
    };

    axiosInstance
      .post("/member/passwordChange", formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        alert("비밀번호 재설정 성공");
        onClose(); // ForgotPassword 창을 닫습니다.
        navigate("/login"); // 로그인 페이지로 이동합니다.
      })
      .catch((error) => {
        console.error("비밀번호 재설정 실패:", error);
        setError("비밀번호 재설정 실패. 다시 시도해 주세요.");
      })
      .finally(() => {
        setLoading(false);
      });
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
          <div className="w-full mb-4">
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              placeholder="이메일을 입력하세요"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              placeholder="새 비밀번호를 입력하세요"
              onChange={handlePasswordChange}
              required
              className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordStrength && (
              <div className="mt-2 text-sm">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div
                      className={`w-1/3 h-2 rounded-full ${getColorClass(0)}`}
                    ></div>
                    <div
                      className={`w-1/3 h-2 rounded-full ${getColorClass(1)}`}
                    ></div>
                    <div
                      className={`w-1/3 h-2 rounded-full ${getColorClass(2)}`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={getTextColorClass("취약")}>취약</span>
                    <span className={getTextColorClass("중간")}>중간</span>
                    <span className={getTextColorClass("강함")}>강함</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="비밀번호를 다시 입력하세요"
              onChange={(e) => {
                setPasswordError("");
                setPasswordCheckMessage("");
                setConfirmPassword(e.target.value);
              }}
              required
              className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handlePasswordCheck}
              className="mt-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600"
            >
              비밀번호 확인
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
            {passwordCheckMessage && (
              <p className="text-green-500 text-sm mt-2">
                {passwordCheckMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "전송 중..." : "비밀번호 재설정"}
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
