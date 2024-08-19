import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import CustomModal from "./CustomModal";
import Address from "../../openApi/Address";

const UpdateProfile = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tell, setTell] = useState("");
  const [mailaddr, setMailaddr] = useState("");
  const [roadaddr, setRoadaddr] = useState("");
  const [detailaddr, setDetailaddr] = useState("");
  const [birthdate, setBirthdate] = useState(""); // 생년월일을 로컬 포맷으로 저장

  const id = JSON.parse(localStorage.getItem("member")).id;

  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem("member"));
      if (user) {
        const { email, name, tell, roadaddr, detailaddr, birth, mailaddr } =
          user;
        setEmail(email || "");
        setName(name || "");
        setTell(tell || "");
        setRoadaddr(roadaddr || "");
        setDetailaddr(detailaddr || "");
        setMailaddr(mailaddr || "");
        setBirthdate(formatDateForDisplay(birth)); // 생년월일을 표시 형식으로 변환
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name || !tell || !roadaddr || !detailaddr || !mailaddr) {
      alert("모든 필드를 입력해 주세요."); // 모든 필드가 채워졌는지 확인
      return;
    }

    // 생년월일을 ISO 문자열 형식으로 변환하여 서버에 전송
    const formattedBirthdate = formatDateToISO(birthdate);

    const updateInfo = {
      id,
      email,
      name,
      tell,
      mailaddr,
      roadaddr,
      detailaddr,
      birth: formattedBirthdate,
      cate: JSON.parse(localStorage.getItem("member")).cate,
    };
    console.log(updateInfo);
    axiosInstance
      .put("/member/updateUser", updateInfo)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        handleUpdate(updateInfo); // 로컬 스토리지에 새 정보 저장
        onClose();
        onSave(updateInfo);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("프로필 업데이트에 실패했습니다. 다시 시도해 주세요."); // 에러 처리
      });
  };

  // 생년월일 문자열을 YYYY-MM-DD 형식으로 변환하여 표시
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // 날짜를 UTC 기준으로 변환하고, 로컬 타임존에서 하루를 빼서 날짜를 조정
    const offset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - offset);
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 로컬 날짜 문자열을 ISO 문자열 형식으로 변환
  const formatDateToISO = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    // 로컬 시간대에서 UTC로 변환하기 위해 시간을 설정
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString(); // ISO 형식으로 변환
  };

  // 로컬 스토리지에 새 프로필 정보 저장
  const handleUpdate = (updatedInfo) => {
    localStorage.setItem("member", JSON.stringify(updatedInfo));
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
            value={email}
            readOnly
            placeholder="이메일"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm bg-gray-100 text-gray-500 focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 text-lg font-semibold mb-2"
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
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            연락처
          </label>
          <input
            id="phone"
            type="text"
            value={tell}
            onChange={(e) => setTell(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
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
            readOnly
            placeholder="생년월일"
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
