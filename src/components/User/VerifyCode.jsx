import React, { useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import PasswordRecovery from "./PasswordRecovery";

const VerifyCode = ({ phoneNumber, onClose }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);

  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleEmailChange = (e) => {
    const selectedEmailData = emails.find(
      (emailData) => emailData.email === e.target.value
    );
    setSelectedEmail(selectedEmailData.email);
    setSelectedId(selectedEmailData.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    axiosInstance
      .post("/sms/verifyCode", { phoneNumber: phoneNumber, code: code })
      .then((response) => {
        setSuccess(response.data);
        setLoading(false);

        axiosInstance
          .get(`/member/findByTell?tell=${phoneNumber}`)
          .then((response) => {
            const data = response.data;
            const emailData = data.map((item) => ({
              email: item.email,
              cate: item.cate,
              id: item.id,
            }));

            if (emailData.length === 0) {
              setError("가입된 정보가 없습니다.");
              setIsVerified(true);
              setEmails([]); // 이메일 데이터 초기화
            } else {
              setEmails(emailData);
              setSelectedEmail(emailData[0].email);
              setSelectedId(emailData[0].id);
              setIsVerified(true);
            }
          })
          .catch((error) => {
            console.error("Error fetching emails:", error);
            setError("이메일 정보를 가져오는 중 오류가 발생했습니다.");
            setIsVerified(false);
          });
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        setError("인증 코드가 올바르지 않습니다.");
        setLoading(false);
      });
  };

  const handlePasswordRecovery = () => {
    const selectedEmailData = emails.find(
      (emailData) => emailData.email === selectedEmail
    );

    if (selectedEmailData && selectedEmailData.cate === "home") {
      setShowPasswordRecovery(true);
    } else {
      setError(
        "비밀번호 재설정은 'home' 카테고리의 이메일에 대해서만 가능합니다."
      );
    }
  };

  const handleLogin = () => {
    const selectedEmailData = emails.find(
      (emailData) => emailData.email === selectedEmail
    );

    if (selectedEmailData && selectedEmailData.cate === "home") {
      navigate(`/login?email=${encodeURIComponent(selectedEmail)}`);
    } else {
      navigate("/login");
    }

    onClose();
  };

  return (
    <>
      {showPasswordRecovery ? (
        <PasswordRecovery
          selectedEmail={selectedEmail}
          selectedId={selectedId}
          onClose={() => {
            setShowPasswordRecovery(false);
            onClose();
          }}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              &times;
            </button>

            {!isVerified ? (
              <div>
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
                {error && (
                  <p className="text-red-500 text-center mt-4">{error}</p>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  이메일 선택
                </h2>
                <div className="mt-6 flex flex-col items-center">
                  {emails.length === 0 ? (
                    <>
                      <p className="text-red-500 text-center mt-4">
                        가입된 정보가 없습니다.
                      </p>
                      <button
                        onClick={handleLogin}
                        className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out mt-6"
                      >
                        로그인 하러 가기
                      </button>
                    </>
                  ) : (
                    <>
                      {emails.map(({ email, cate, id }, index) => (
                        <label
                          key={index}
                          className="w-full mb-2 flex items-center"
                        >
                          <input
                            type="radio"
                            value={email}
                            checked={selectedEmail === email}
                            onChange={handleEmailChange}
                            className="mr-2"
                          />
                          <span className="mr-2">{email}</span>
                          <span className="text-gray-600">({cate})</span>
                        </label>
                      ))}
                      <div className="w-full mt-6 flex justify-between">
                        <button
                          onClick={handlePasswordRecovery}
                          className="w-1/2 py-3 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out mr-2"
                        >
                          비밀번호 찾기
                        </button>
                        <button
                          onClick={handleLogin}
                          className="w-1/2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out ml-2"
                        >
                          로그인 하러 가기
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyCode;
