import React, { useState } from "react";
import axios from "axios";

const FindID = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post("http://localhost:8080/member/find-id", { phoneNumber })
      .then((response) => {
        setEmail(response.data.email);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error finding ID:", error);
        setError("휴대전화 번호와 연결된 이메일을 찾을 수 없습니다.");
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
          아이디 찾기
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          휴대전화 번호를 입력하면 해당 번호에 등록된 이메일을 찾을 수 있습니다.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="w-full mb-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="휴대전화 번호"
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "찾는 중..." : "아이디 찾기"}
          </button>
        </form>
        {email && (
          <p className="text-green-500 text-center mt-4">
            등록된 이메일: {email}
          </p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default FindID;
