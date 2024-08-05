// src/components/TermsAndConditions.jsx

// 이용약관
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
  const [isAcceptedPrivacy, setIsAcceptedPrivacy] = useState(false);
  const [isAcceptedAge, setIsAcceptedAge] = useState(false);
  const [isAcceptedAll, setIsAcceptedAll] = useState(false);
  const navigate = useNavigate();

  const handleAcceptTermsChange = (event) => {
    const checked = event.target.checked;
    setIsAcceptedTerms(checked);
    setIsAcceptedAll(checked && isAcceptedPrivacy && isAcceptedAge);
  };

  const handleAcceptPrivacyChange = (event) => {
    const checked = event.target.checked;
    setIsAcceptedPrivacy(checked);
    setIsAcceptedAll(checked && isAcceptedTerms && isAcceptedAge);
  };

  const handleAcceptAgeChange = (event) => {
    const checked = event.target.checked;
    setIsAcceptedAge(checked);
    setIsAcceptedAll(checked && isAcceptedTerms && isAcceptedPrivacy);
  };

  const handleAcceptAllChange = (event) => {
    const checked = event.target.checked;
    setIsAcceptedTerms(checked);
    setIsAcceptedPrivacy(checked);
    setIsAcceptedAge(checked);
    setIsAcceptedAll(checked);
  };

  const handleAccept = () => {
    if (isAcceptedTerms && isAcceptedPrivacy && isAcceptedAge) {
      navigate("/signup"); // 동의 후 회원가입 페이지로 이동
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          약관 및 정책 동의
        </h2>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="acceptAll"
            checked={isAcceptedAll}
            onChange={handleAcceptAllChange}
            className="mr-2"
          />
          <label htmlFor="acceptAll" className="text-gray-700">
            모두 동의합니다.
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={isAcceptedTerms}
            onChange={handleAcceptTermsChange}
            className="mr-2"
          />
          <label htmlFor="acceptTerms" className="text-gray-700">
            서비스 이용약관에 동의합니다.(필수)
          </label>
        </div>
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            서비스 이용약관
          </h3>
          <p className="text-gray-700 mb-4">
            1. 본 약관은 사용자가 본 서비스를 사용함에 있어 필요한 모든 조건을
            정의합니다.
            <br />
            2. 사용자는 본 약관에 동의함으로써 서비스 이용에 관한 권리를
            가집니다.
            <br />
            3. 본 약관은 언제든지 수정될 수 있으며, 사용자는 정기적으로 이를
            확인해야 합니다.
          </p>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="acceptPrivacy"
            checked={isAcceptedPrivacy}
            onChange={handleAcceptPrivacyChange}
            className="mr-2"
          />
          <label htmlFor="acceptPrivacy" className="text-gray-700">
            개인정보 처리방침에 동의합니다.(필수)
          </label>
        </div>
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            개인정보 처리방침
          </h3>
          <p className="text-gray-700 mb-4">
            1. 사용자의 개인정보는 서비스 제공을 위해 사용됩니다.
            <br />
            2. 개인정보는 법적 요구에 따라 저장 및 처리될 수 있습니다.
            <br />
            3. 사용자는 언제든지 개인정보에 접근하고 수정할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="acceptAge"
            checked={isAcceptedAge}
            onChange={handleAcceptAgeChange}
            className="mr-2"
          />
          <label htmlFor="acceptAge" className="text-gray-700">
            만 14세 이상입니다.
          </label>
        </div>

        <button
          onClick={handleAccept}
          disabled={!isAcceptedAll}
          className={`w-full py-3 rounded-lg ${
            isAcceptedAll
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white transition duration-300 ease-in-out`}
        >
          동의하고 가입하기
        </button>
      </div>
    </div>
  );
};

export default Terms;
