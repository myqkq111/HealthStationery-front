import React, { useState } from "react";
import axios from "axios";
import Address from "../../openApi/Address";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// 한국어 로케일을 등록합니다.
registerLocale("ko", ko);

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [fm, setFm] = useState("");
  const [tell, setTell] = useState("");
  const [carrier, setCarrier] = useState("");
  const [mailaddr, setMailaddr] = useState("");
  const [roadaddr, setRoadaddr] = useState("");
  const [detailaddr, setDetailaddr] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

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

  const handleEmailCheck = async () => {
    if (email.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:8080/member/checkEmail",
        email,
        { headers: { "Content-Type": "text/plain" } }
      );

      if (response.data) {
        setEmailError("이메일이 이미 등록되어 있습니다.");
        setIsEmailAvailable(false);
      } else {
        setEmailError("");
        setIsEmailAvailable(true);
      }
    } catch (error) {
      console.error("이메일 중복 체크 실패:", error);
      setEmailError("이메일 중복 체크에 실패했습니다.");
    }
  };

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
      return false;
    } else {
      setPasswordStrength("취약");
      return false;
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const handlePasswordCheck = () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      setPasswordCheckMessage("");
    } else if (!validatePassword(password)) {
      setPasswordError("비밀번호가 보안 정책을 준수하지 않습니다.");
      setPasswordCheckMessage("");
    } else {
      setPasswordError("");
      setPasswordCheckMessage("사용 가능한 비밀번호입니다.");
    }
  };

  const handleSendVerificationCode = async () => {
    if (!carrier || !tell) {
      setVerificationError("통신사와 전화번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/sendVerificationCode",
        {
          carrier,
          tell,
        }
      );
      if (response.data.success) {
        setIsCodeSent(true);
        setVerificationError("");
      } else {
        setVerificationError("인증 코드 발송 실패.");
      }
    } catch (error) {
      console.error("인증 코드 발송 실패:", error);
      setVerificationError("인증 코드 발송 실패.");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError("인증 코드를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/verifyCode", {
        carrier,
        tell,
        verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true);
        setVerificationError("");
      } else {
        setVerificationError("인증 코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("인증 실패:", error);
      setVerificationError("인증 실패.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isEmailAvailable) {
      setError("이메일 중복 확인이 필요합니다.");
      return;
    }

    if (!validatePassword(password)) {
      setError("비밀번호가 보안 정책을 준수하지 않습니다.");
      return;
    }

    if (!isVerified) {
      setError("전화번호 인증이 필요합니다.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/member/signup", {
        email,
        password,
        name,
        fm,
        tell,
        carrier,
        birth: birthDate ? birthDate.toISOString().split("T")[0] : "",
        mailaddr,
        roadaddr,
        detailaddr,
      });
      console.log("회원가입 성공");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setError("회원가입 실패. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-lg p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          회원가입
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
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
              {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
            </div>
            <button
              type="button"
              onClick={handleEmailCheck}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              중복 확인
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              비밀번호
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="ml-2 text-gray-500"
              />
              <span className="text-sm text-gray-600 block mt-1">
                (최소 8자리 이상, 대문자, 소문자, 특수문자가 혼합되어야 합니다)
              </span>
            </label>
            <input
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={handlePasswordChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordStrength && (
              <div
                className={`mt-2 ${
                  passwordStrength === "취약"
                    ? "text-red-500"
                    : passwordStrength === "중간"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                비밀번호 강도: {passwordStrength}
              </div>
            )}
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
            <button
              type="button"
              onClick={handlePasswordCheck}
              className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              비밀번호 확인
            </button>
            {passwordError && (
              <p className="text-red-500 mt-2">{passwordError}</p>
            )}
            {passwordCheckMessage && (
              <p className="text-green-500 mt-2">{passwordCheckMessage}</p>
            )}
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
            {/* 
            {!isCodeSent && (
              <button
                type="button"
                onClick={handleSendVerificationCode}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                인증 코드 전송
              </button>
            )}

            {isCodeSent && (
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  인증 코드
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  placeholder="인증 코드를 입력하세요"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  인증 확인
                </button>
              </div>
            )}

            {verificationError && (
              <p className="text-red-500 mt-2">{verificationError}</p>
            )}
            {isVerified && (
              <p className="text-green-500 mt-2">전화번호 인증 완료</p>
            )} */}
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
