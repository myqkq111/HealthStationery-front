import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UpdatePassword = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("member"));
    const { cate } = user;
    if (cate !== "home") {
      onclose();
    }
  }, [onClose]);

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
      return true;
    } else {
      setPasswordStrength("취약");
      return true;
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
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setPasswordError("");

    // Validate new password
    validatePassword(newPassword);

    // Check if new password is not the same as current password
    if (newPassword === currentPassword) {
      setPasswordError("이전 비밀번호를 입력하셨습니다.");
    } else {
      // Update password check message only if confirmNewPassword has value
      if (confirmNewPassword.length > 0) {
        handlePasswordConfirmChange({ target: { value: confirmNewPassword } });
      } else {
        setPasswordCheckMessage("");
      }
    }
  };

  const handlePasswordConfirmChange = (e) => {
    const confirmNewPassword = e.target.value;
    setConfirmNewPassword(confirmNewPassword);
    setPasswordError("");

    // Check if new password and confirm password match
    if (newPassword === currentPassword) {
      setPasswordError("이전 비밀번호를 입력하셨습니다.");
      setPasswordCheckMessage("");
    } else if (newPassword !== confirmNewPassword) {
      setPasswordCheckMessage("비밀번호가 일치하지 않습니다.");
    } else if (!validatePassword(newPassword)) {
      setPasswordCheckMessage("");
    } else {
      setPasswordCheckMessage("사용 가능한 비밀번호입니다.");
    }
  };

  const handlePasswordCheck = () => {
    if (newPassword === currentPassword) {
      setPasswordError("이전 비밀번호를 입력하셨습니다.");
      setPasswordCheckMessage("");
    } else if (newPassword !== confirmNewPassword) {
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

  const handlePasswordConfirm = () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    const id = JSON.parse(localStorage.getItem("member")).id;
    axiosInstance
      .post("/member/confirmPassword", {
        id,
        password: currentPassword,
      })
      .then((response) => {
        if (response.data === 1) {
          setStep(2);
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
    if (newPassword === currentPassword) {
      setPasswordError("이전 비밀번호를 입력하셨습니다. 다시 입력해주세요");
      setPasswordCheckMessage("");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      setPasswordCheckMessage("");
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError("새 비밀번호가 보안 정책을 준수하지 않습니다.");
      setPasswordCheckMessage("");
      return;
    }
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("member"));
    const { id } = user;
    axiosInstance
      .put("/member/updatePassword", {
        id,
        password: newPassword,
      })
      .then((response) => {
        if (response.data === 1) {
          setSuccess("비밀번호가 성공적으로 변경되었습니다.");
          setTimeout(() => {
            logout();
            navigate("/login");
          }, 1000);
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
      <div className="w-full max-w-md p-8 bg-white relative">
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
                  className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out ${
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
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
                <div className="flex mt-2 space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 ${getColorClass(i)}`} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${getTextColorClass("취약")}`}>
                    취약
                  </span>
                  <span className={`text-xs ${getTextColorClass("중간")}`}>
                    중간
                  </span>
                  <span className={`text-xs ${getTextColorClass("강함")}`}>
                    강함
                  </span>
                </div>
              </div>
              <div className="w-full mb-4">
                <input
                  type="password"
                  value={confirmNewPassword}
                  placeholder="새 비밀번호 확인"
                  onChange={handlePasswordConfirmChange}
                  required
                  className="w-full p-4 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out ${
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
          {passwordError && (
            <p className="text-red-500 text-center mt-4">{passwordError}</p>
          )}
          {passwordCheckMessage && (
            <p
              className={`text-center mt-4 ${
                passwordCheckMessage.includes("사용 가능한 비밀번호입니다")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {passwordCheckMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
