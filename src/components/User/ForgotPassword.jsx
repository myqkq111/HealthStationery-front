import React, { useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import PasswordRecovery from "./PasswordRecovery"; // PasswordRecovery 컴포넌트 임포트

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordRecoveryVisible, setIsPasswordRecoveryVisible] =
    useState(false);
  const [selectedEmail, setSelectedEmail] = useState(""); // 선택된 이메일
  const [selectedId, setSelectedId] = useState(""); // 선택된 ID

  const checkMemberInfo = () => {
    return axiosInstance
      .get("/member/emailAndTell", { params: { email, tell: phoneNumber } })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          console.log(response.data.id);
          // 회원 정보가 존재하는 경우
          setSelectedId(response.data.id); // ID는 응답에서 얻은 값으로 설정
          return true;
        } else {
          // 회원 정보가 존재하지 않는 경우
          throw new Error("회원 정보가 존재하지 않습니다.");
        }
      })
      .catch((error) => {
        throw new Error(
          error.response?.data || "회원 정보 확인에 실패했습니다."
        );
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (step === "request") {
        // 회원 정보 확인
        await checkMemberInfo();

        // 회원 정보가 존재하면 인증 코드 요청
        axiosInstance
          .post("/sms/send", { phoneNumber })
          .then((response) => {
            // 인증 코드 요청 성공
            setStep("verify");
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error requesting verification code:", error);
            setError("인증 코드 요청에 실패했습니다.");
            setLoading(false);
          });
      } else if (step === "verify") {
        axiosInstance
          .post("/sms/verifyCode", { phoneNumber, code: verificationCode })
          .then((response) => {
            // 인증 성공
            setSuccessMessage("인증이 성공적으로 완료되었습니다.");
            setLoading(false);
            // 선택된 이메일과 ID 설정
            setSelectedEmail(email);
            setIsPasswordRecoveryVisible(true);
          })
          .catch((error) => {
            console.error("Error verifying code:", error);
            setError("인증 코드가 올바르지 않습니다.");
            setLoading(false);
          });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (isPasswordRecoveryVisible) {
    return (
      <PasswordRecovery
        selectedEmail={selectedEmail}
        selectedId={selectedId}
        onClose={onClose} // onClose를 PasswordRecovery로 전달합니다.
      />
    );
  }

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
          비밀번호 찾기
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {step === "request" ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="이메일을 입력하세요"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  핸드폰 번호
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  placeholder="핸드폰 번호를 입력하세요"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? "요청 중..." : "인증 코드 요청"}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  인증 코드
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  placeholder="인증 코드를 입력하세요"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? "확인 중..." : "인증 코드 확인"}
              </button>
            </>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
