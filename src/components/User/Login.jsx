// src/components/User/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance.jsx";
import Forgot from "./Forgot";
import FindID from "./FindID";
import ResetPassword from "./ResetPassword";
import { createPortal } from "react-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isFindIDOpen, setIsFindIDOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
      const response = await axiosInstance
        .post("/member/login", {
          email,
          password,
        })
        .then((response) => {
          const { token, member } = response.data;

          // 로그인 상태 업데이트
          login(token, member);

          navigate("/"); // 홈 페이지로 이동
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setError("로그인 실패. 이메일과 비밀번호를 확인해 주세요.");
        });
  };

  const handleForgotClick = () => setIsForgotOpen(true);
  const handleCloseForgot = () => {
    setIsForgotOpen(false);
    setIsFindIDOpen(false);
    setIsResetPasswordOpen(false);
  };
  const handleOpenFindID = () => {
    setIsFindIDOpen(true);
    setIsForgotOpen(false);
  };
  const handleOpenResetPassword = () => {
    setIsResetPasswordOpen(true);
    setIsForgotOpen(false);
  };

  const socialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-20">
      <div className="w-full max-w-md p-8 rounded-lg bg-transparent">
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-black">
            회원만의 특별한 혜택
          </p>
          <p className="text-md text-gray-700 mt-2">
            가입 즉시 다양한 할인 혜택과 독점 이벤트에 참여할 수 있습니다.
            <br />
            지금 회원가입하고 특별한 할인 쿠폰을 받으세요!
          </p>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          로그인
        </h2>
        <h3 className="text-lg text-gray-600 mb-6 text-center">
          3초면 회원가입 가능!
        </h3>

        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => socialLogin("naver")}
            className="btn btn-primary flex items-center justify-center py-3 px-4 rounded-lg text-white bg-[#03C75A] hover:bg-[#02B34E] transition duration-300 ease-in-out"
          >
            <i className="fab fa-naver mr-2"></i> 네이버로 시작하기
          </button>
          <button
            onClick={() => socialLogin("google")}
            className="btn btn-primary flex items-center justify-center py-3 px-4 rounded-lg text-black bg-white hover:bg-[#f5f5f5] transition duration-300 ease-in-out"
          >
            <i className="fab fa-google mr-2"></i> 구글로 시작하기
          </button>

          <button
            onClick={() => socialLogin("kakao")}
            className="btn btn-primary flex items-center justify-center py-3 px-4 rounded-lg text-white bg-[#F7E300] hover:bg-[#E0D700] transition duration-300 ease-in-out"
          >
            <i className="fab fa-kakao mr-2"></i> 카카오로 시작하기
          </button>
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-t border-gray-300" />
          <span className="mx-4 text-gray-600">또는</span>
          <hr className="flex-1 border-t border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="w-full mb-4">
            <input
              type="email"
              value={email}
              placeholder="이메일"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="w-full mb-4">
            <input
              type="password"
              value={password}
              placeholder="비밀번호"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out"
          >
            로그인
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm text-gray-600">
          <button
            onClick={() => navigate("/terms")}
            className="text-blue-500 hover:underline"
          >
            회원가입
          </button>
          <button
            onClick={handleForgotClick}
            className="text-blue-500 hover:underline"
          >
            아이디/비밀번호 찾기
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {isForgotOpen &&
        createPortal(
          <Forgot
            onClose={handleCloseForgot}
            onOpenFindID={handleOpenFindID}
            onOpenResetPassword={handleOpenResetPassword}
          />,
          document.body
        )}
      {isFindIDOpen &&
        createPortal(<FindID onClose={handleCloseForgot} />, document.body)}
      {isResetPasswordOpen &&
        createPortal(
          <ResetPassword onClose={handleCloseForgot} />,
          document.body
        )}
    </div>
  );
};

export default Login;
