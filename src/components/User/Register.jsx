import React, { useState } from "react";
import axios from "axios";
import Address from "../../openApi/Address";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

// 한국어 로케일을 등록합니다.
registerLocale("ko", ko);

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [fm, setFm] = useState("");
  const [tell, setTell] = useState("");
  const [carrier, setCarrier] = useState(""); // 통신사 상태 추가
  const [mailaddr, setMailaddr] = useState("");
  const [roadaddr, setRoadaddr] = useState("");
  const [detailaddr, setDetailaddr] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setFm(event.target.value);
  };

  const handleCarrierChange = (event) => {
    setCarrier(event.target.value);
  };

  const handleDateChange = (date) => {
    setBirthDate(date);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    axios
      .post("http://localhost:8080/member/signup", {
        email,
        password,
        name,
        fm,
        tell,
        carrier, // 통신사 정보 추가
        birth: birthDate ? birthDate.toISOString().split("T")[0] : "",
        mailaddr,
        roadaddr,
        detailaddr,
      })
      .then((response) => {
        console.log("회원가입 성공:", response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.error("회원가입 실패:", error);
        setError("회원가입 실패. 다시 시도해 주세요.");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          회원가입
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              placeholder="이메일을 입력하세요"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="비밀번호를 다시 입력하세요"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">이름</label>
            <input
              type="text"
              value={name}
              placeholder="이름을 입력하세요"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">성별</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="man"
                  checked={fm === "man"}
                  onChange={handleGenderChange}
                  className="form-radio text-blue-500"
                />
                <span className="text-gray-800">남성</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="woman"
                  checked={fm === "woman"}
                  onChange={handleGenderChange}
                  className="form-radio text-blue-500"
                />
                <span className="text-gray-800">여성</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              연락처
            </label>
            <div className="flex items-center space-x-2 mb-4">
              <select
                value={carrier}
                onChange={handleCarrierChange}
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">통신사 선택</option>
                <option value="skt">SKT</option>
                <option value="kt">KT</option>
                <option value="lg">LG U+</option>
              </select>
              <input
                type="text"
                value={tell}
                placeholder="연락처를 입력하세요"
                onChange={(e) => setTell(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">주소</label>
            <Address
              mailaddr={mailaddr}
              setMailaddr={setMailaddr}
              roadaddr={roadaddr}
              setRoadaddr={setRoadaddr}
              detailaddr={detailaddr}
              setDetailaddr={setDetailaddr}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              생년월일
            </label>
            <DatePicker
              selected={birthDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="날짜를 선택하세요"
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              locale="ko"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            가입완료
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
