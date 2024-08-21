import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import ChatWindow from "./ChatWindow";

const ChatIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 로컬 스토리지에서 member 정보 가져오기
  let member = "defaultUser"; // 기본값 설정
  const memberData = localStorage.getItem("member");

  if (memberData) {
    try {
      const parsedData = JSON.parse(memberData);
      if (parsedData) {
        member = parsedData;
      }
    } catch (error) {
      console.error("Error parsing member data from localStorage:", error);
    }
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition"
        aria-label="채팅하기"
      >
        <FaComments size={24} />
      </div>
      {isOpen && (
        <div className="fixed bottom-0 right-0 m-5">
          <ChatWindow user={member} />
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
