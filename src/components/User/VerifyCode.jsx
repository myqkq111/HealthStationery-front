import React, { useState } from "react";
import axiosInstance from "../api/AxiosInstance";

const VerifyCode = ({ phoneNumber, onClose }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    axiosInstance
      .post("/sms/verifyCode", { phoneNumber, code })
      .then((response) => {
        console.log(response.data);
        setSuccess(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        setError("인증 코드가 올바르지 않습니다.");
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
          인증 코드 입력
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          발송된 인증 코드를 입력해 주세요.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="w-full mb-4">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="인증 코드"
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "검증 중..." : "인증 확인"}
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

export default VerifyCode;
