import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindId = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/member/find-id", { email })
      .then((response) => {
        console.log("ID Find successful:", response.data);
        setSuccess("아이디가 이메일로 전송되었습니다.");
      })
      .catch((error) => {
        console.error("ID Find failed:", error);
        setError("아이디 찾기에 실패했습니다. 이메일을 확인해 주세요.");
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-20">
      <div className="w-full max-w-md p-8 rounded-lg bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          아이디 찾기
        </h2>
        <p className="text-lg text-gray-600 mb-6 text-center">
          가입 시 사용한 이메일 주소를 입력하세요. 아이디를 이메일로 전송해
          드립니다.
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
            아이디 찾기
          </button>
        </form>
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default FindId;
