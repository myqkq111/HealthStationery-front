import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import CustomModal from "./CustomModal";
import Address from "../../openApi/Address";
// import { useAuth } from "../contexts/AuthContext";
const UpdateProfile = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tell, setTell] = useState("");
  const [address, setAddress] = useState("");
  const [mailaddr, setMailaddr] = useState("");
  const [roadaddr, setRoadaddr] = useState("");
  const [detailaddr, setDetailaddr] = useState("");
  const [birthdate, setBirthdate] = useState("");
  // const user = useAuth();
  const handleAddressSelect = (selectedAddress) => {
    setRoadaddr(selectedAddress.roadAddress || "");
    setMailaddr(selectedAddress.jibunAddress || "");
  };
  // Modal 열릴 때 기존 정보를 가져오는 함수
  useEffect(() => {
    if (isOpen) {
      // localStorage에서 사용자 정보 가져오기
      const user = JSON.parse(localStorage.getItem("member"));
      console.log(user);
      if (user) {
        const { email, name, tell, mailaddr, roadaddr, detailaddr, birth } =
          user;
        setEmail(email || "");
        setName(name || "");
        setTell(tell || "");
        setMailaddr(mailaddr || "");
        setRoadaddr(roadaddr || "");
        setDetailaddr(detailaddr || "");
        setBirthdate(birth || "");
      }
    }
  }, [isOpen]);
  const handleSave = () => {
    // 데이터 유효성 검사
    if (!name || !tell || !roadaddr || !detailaddr) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }
    const updateInfo = {
      email,
      name,
      tell,
      address: `${roadaddr} ${detailaddr}`,
      mailaddr,
    };
    axiosInstance
      .put("/member/update", updateInfo)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        onSave(updateInfo); //수정된 정보를 MyPage에 전달
        onClose(); // 수정 완료 후 모달 닫기
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("프로필 업데이트에 실패했습니다. 다시 시도해 주세요.");
      });
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
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
            value={JSON.parse(localStorage.getItem("member")).email}
            readOnly // 읽기 전용으로 설정
            placeholder="이메일" // placeholder로 표시
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm bg-gray-100 text-gray-500 focus:outline-none sm:text-sm"
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
            htmlFor="roadaddr"
            className="block text-sm font-medium text-gray-700"
          >
            주소
          </label>
          <Address
            value={roadaddr}
            onChange={handleAddressSelect}
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
            type="text"
            value={birthdate}
            readOnly // 읽기 전용으로 설정
            placeholder="생년월일" // placeholder로 표시
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm bg-gray-100 text-gray-500 focus:outline-none sm:text-sm"
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
