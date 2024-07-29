import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Forgot = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFind = () => {
    navigate("/find-id");
  };

  const handleReset = () => {
    navigate("/reset-password");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-20">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          아이디/비밀번호 찾기
        </h2>
        <p className="text-lg text-gray-600 mb-6 text-center">
          아래 버튼을 클릭하여 아이디를 찾거나 비밀번호를 재설정하세요.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleFind}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            아이디 찾기
          </button>
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
