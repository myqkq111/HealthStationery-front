import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/member/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      // 로그인 성공 후 처리 로직 추가
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-8 text-center">
        <p className="text-xl font-semibold text-black">회원만의 특별한 혜택</p>
      </div>
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">로그인</h2>
        <h3 className="text-lg text-gray-600 mb-6">3초면 회원가입 가능!</h3>

        {/* 소셜 로그인 버튼들 */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="flex items-center justify-center py-3 px-4 rounded-lg text-white bg-[#03C75A] hover:bg-[#02B34E] transition duration-300 ease-in-out">
            <i className="fab fa-naver mr-2"></i> 네이버로 시작하기
          </button>
          <button className="flex items-center justify-center py-3 px-4 rounded-lg text-white bg-[#4285F4] hover:bg-[#357AE8] transition duration-300 ease-in-out">
            <i className="fab fa-google mr-2"></i> 구글로 시작하기
          </button>
          <button className="flex items-center justify-center py-3 px-4 rounded-lg text-white bg-[#3b5998] hover:bg-[#2d4373] transition duration-300 ease-in-out">
            <i className="fab fa-facebook mr-2"></i> 페이스북으로 시작하기
          </button>
          <button className="flex items-center justify-center py-3 px-4 rounded-lg text-white bg-[#F7E300] hover:bg-[#E0D700] transition duration-300 ease-in-out">
            <i className="fab fa-kakao mr-2"></i> 카카오로 시작하기
          </button>
        </div>

        {/* 또는 부분 */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-t border-gray-300" />
          <span className="mx-4 text-gray-600">또는</span>
          <hr className="flex-1 border-t border-gray-300" />
        </div>

        {/* 로그인 폼 */}
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
          <div className="w-full mb-6">
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
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            로그인
          </button>
        </form>

        {/* 로그인/회원가입 링크 */}
        <div className="flex flex-col items-center mt-6 space-y-2">
          <Link to="/signup" className="text-blue-500 hover:underline text-lg">
            회원가입
          </Link>
          <Link
            to="/forgot-id"
            className="text-blue-500 hover:underline text-lg"
          >
            아이디 찾기
          </Link>
          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline text-lg"
          >
            비밀번호 찾기
          </Link>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
