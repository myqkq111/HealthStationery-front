import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/member/login", { email, password })
      .then((response) => {
        console.log("Login successful:", response.data);

        // 로그인 성공 후 홈 페이지로 이동
        navigate("/"); // 홈 페이지로 이동 ("/" 경로는 필요에 따라 조정하세요)
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError("로그인 실패. 이메일과 비밀번호를 확인해 주세요.");
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-20">
      {/* 페이지 전체에 padding-top 추가 */}
      <div className="w-full max-w-md p-8 rounded-lg bg-transparent">
        {/* 로그인 카드 */}
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
        <div className="flex justify-between mt-6 text-sm text-gray-600">
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
          <Link
            to="/forgot"
            state={{ type: "find" }} // URL 파라미터를 state로 전달
            className="text-blue-500 hover:underline"
          >
            아이디/비밀번호 찾기
          </Link>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
