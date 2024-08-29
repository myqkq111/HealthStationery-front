import React, { useState, useEffect } from "react";
import axios from "axios";
import Address from "../../openApi/Address";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";

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
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");

  // OAuth를 통한 회원가입 페이지 일 경우
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const cate = query.get("cate");

  useEffect(() => {
    if (cate) {
      setEmail(query.get("email"));
      setName(query.get("name"));
    }
  }, [cate]);

  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setFm(event.target.value);
  };

  const handleCarrierChange = (event) => {
    setCarrier(event.target.value);
  };

  const handleDateChange = (date) => {
    const utcDate = date.toISOString();
    setBirthDate(utcDate);
  };

  const handleEmailCheck = () => {
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      setIsEmailAvailable(false);
      return;
    }
    if (email.trim() === "") return;

    axios
      .post("http://52.78.11.212:8080/member/checkEmail", email, {
        headers: { "Content-Type": "text/plain" },
      })
      .then((response) => {
        if (response.data) {
          setEmailError("이메일이 이미 등록되어 있습니다.");
          setIsEmailAvailable(false);
        } else {
          setEmailError("사용 가능한 이메일입니다.");
          setIsEmailAvailable(true);
        }
      })
      .catch((error) => {
        console.error("이메일 중복 체크 실패:", error);
        setEmailError("이메일 중복 체크에 실패했습니다.");
      });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
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

  const getColorClass = (index) => {
    if (passwordStrength === "강함") return "bg-green-500";
    if (passwordStrength === "중간" && index < 2) return "bg-yellow-500";
    if (passwordStrength === "취약" && index === 0) return "bg-red-500";
    return "bg-gray-300";
  };

  const getTextColorClass = (strength) => {
    return passwordStrength === strength ? "text-black" : "text-gray-300";
  };

  const handlePasswordChange = (e) => {
    setPasswordError("");
    setPasswordCheckMessage("");
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0) {
      validatePassword(newPassword);
    } else {
      setPasswordStrength("");
    }
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!cate) {
      // 'cate'가 없을 때 필수 유효성 검사
      if (!isEmailAvailable) {
        setError("이메일 중복 확인이 필요합니다.");
        return;
      }

      if (passwordCheckMessage === "") {
        setError("비밀번호를 확인해주세요.");
        return;
      }
    }

    // 공통 유효성 검사
    if (name === "") {
      setError("이름을 입력해주세요.");
      return;
    }

    if (fm === "") {
      setError("성별 체크를 해주세요.");
      return;
    }

    if (tell === "") {
      setError("연락처를 입력해주세요.");
      return;
    }

    if (mailaddr === "") {
      setError("우편번호를 입력해주세요.");
      return;
    }

    if (roadaddr === "") {
      setError("도로명주소를 입력해주세요.");
      return;
    }

    if (detailaddr === "") {
      setError("상세주소를 입력해주세요.");
      return;
    }

    if (birthDate === null) {
      setError("생년월일을 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("cate", cate);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("fm", fm);
    formData.append("tell", tell);
    formData.append("carrier", carrier);
    formData.append("birth", birthDate);
    formData.append("mailaddr", mailaddr);
    formData.append("roadaddr", roadaddr);
    formData.append("detailaddr", detailaddr);

    axios
      .post("http://localhost:8080/member/signup", formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("회원가입 성공");
        navigate("/login");
      })
      .catch((error) => {
        console.error("회원가입 실패:", error);
        setError("회원가입 실패. 다시 시도해 주세요.");
      });
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setIsEmailAvailable(false);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">회원가입</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-grow">
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              이메일
            </label>

            <div className="flex items-center">
              <input
                type="email"
                value={email}
                placeholder="이메일을 입력하세요"
                onChange={emailChange}
                readOnly={cate}
                required
                className={`w-full p-2 border border-gray-300 shadow-sm ${
                  cate
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              />

              {!cate && (
                <button
                  type="button"
                  onClick={handleEmailCheck}
                  className="ml-4 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 w-auto flex-shrink-0"
                >
                  중복 확인
                </button>
              )}
            </div>

            {emailError && (
              <p
                className={`text-sm mt-2 ${
                  isEmailAvailable ? "text-green-500" : "text-red-500"
                }`}
              >
                {emailError}
              </p>
            )}
          </div>
        </div>

        {!cate && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                placeholder="비밀번호를 입력하세요"
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passwordStrength && (
                <div className="mt-2 text-sm">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div
                        className={`w-1/3 h-2 rounded-full ${getColorClass(0)}`}
                      ></div>
                      <div
                        className={`w-1/3 h-2 rounded-full ${getColorClass(1)}`}
                      ></div>
                      <div
                        className={`w-1/3 h-2 rounded-full ${getColorClass(2)}`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={getTextColorClass("취약")}>취약</span>
                      <span className={getTextColorClass("중간")}>중간</span>
                      <span className={getTextColorClass("강함")}>강함</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
                onChange={(e) => {
                  setPasswordError("");
                  setPasswordCheckMessage("");
                  setConfirmPassword(e.target.value);
                }}
                required
                className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handlePasswordCheck}
                className="mt-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600"
              >
                비밀번호 확인
              </button>
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
              {passwordCheckMessage && (
                <p className="text-green-500 text-sm mt-2">
                  {passwordCheckMessage}
                </p>
              )}
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            이름
          </label>
          <input
            type="text"
            value={name}
            placeholder="이름을 입력하세요"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            성별
          </label>
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

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            연락처
          </label>
          <div className="flex items-center space-x-2 mb-4">
            <select
              value={carrier}
              onChange={handleCarrierChange}
              className="p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            주소
          </label>
          <Address
            mailaddr={mailaddr}
            setMailaddr={setMailaddr}
            roadaddr={roadaddr}
            setRoadaddr={setRoadaddr}
            detailaddr={detailaddr}
            setDetailaddr={setDetailaddr}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            생년월일
          </label>
          <DatePicker
            selected={birthDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          가입완료
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
