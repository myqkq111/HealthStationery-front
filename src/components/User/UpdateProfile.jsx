// src/components/UpdateProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomModal from "./CustomModal";

const UpdateProfile = ({ isOpen, onClose, userEmail }) => {
  const [name, setName] = useState("");
  const [tell, setTell] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");

  // Modal 열릴 때 기존 정보를 가져오는 함수
  useEffect(() => {
    if (isOpen) {
      // 사용자 정보를 가져오는 API 호출
      axios
        .get(`http://localhost:8080/member/profile/${userEmail}`)
        .then((response) => {
          const { name, tell, address, birthdate } = response.data;
          setName(name || "");
          setTell(tell || "");
          setAddress(address || "");
          setBirthdate(birthdate || "");
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
          alert("프로필 정보를 가져오는 데 실패했습니다.");
        });
    }
  }, [isOpen, userEmail]);

  const handleSave = () => {
    // 데이터 유효성 검사
    if (!name || !tell || !address || !birthdate) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    axios
      .put("http://localhost:8080/member/update", {
        email: userEmail,
        name,
        tell,
        address,
        birthdate,
      })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        onClose(); // 수정 완료 후 모달 닫기
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("프로필 업데이트에 실패했습니다. 다시 시도해 주세요.");
      });
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">회원 정보 수정</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="email"
            type="text"
            value={userEmail}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            연락처
          </label>
          <input
            id="phone"
            type="text"
            value={tell}
            onChange={(e) => setTell(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            주소
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="birthdate"
            className="block text-sm font-medium text-gray-700"
          >
            생년월일
          </label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          저장
        </button>
      </div>
    </CustomModal>
  );
};

export default UpdateProfile;
