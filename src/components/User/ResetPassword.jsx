// src/components/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";

const FindPW = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success message

    axios
      .post("http://localhost:8080/member/findPW", email, {
        headers: {
          "Content-Type": "text/plain", // 요청 본문이 문자열이므로 'text/plain' 사용
        },
        responseType: "text", // 서버 응답을 텍스트로 처리
      })
      .then((response) => {
        console.log("Server response:", response); // 응답 전체 로그

        const responseData = response.data;
        if (responseData.includes("임시 비밀번호가 이메일로 전송되었습니다.")) {
          setSuccess("임시 비밀번호가 이메일로 전송되었습니다.");
        } else if (responseData.includes("이메일이 등록되어 있지 않습니다.")) {
          setError("이메일이 등록되어 있지 않습니다.");
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }

        setEmail(""); // Clear the email input field
      })
      .catch((error) => {
        console.error("Temporary password request failed:", error); // 오류 로그
        setError("임시 비밀번호 요청에 실패했습니다. 이메일을 확인해 주세요.");
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
        <p className="text-sm text-gray-600 mb-6 text-center">
          가입 시 사용한 이메일 주소를 입력하세요. 임시 비밀번호를 이메일로
          전송해 드립니다.
        </p>
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
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            임시 비밀번호 요청
          </button>
          {success && (
            <p className="text-green-500 text-center mt-4">{success}</p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default FindPW;
