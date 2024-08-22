import React, { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";

const ChatIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
    const isLoggedIn = !!localStorage.getItem("member"); // 로그인 여부 확인

    if (!isLoggedIn) {
      navigate("/login"); // 로그인 페이지로 리다이렉트
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false); // 채팅창 닫기
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
        <div className="fixed bottom-0 right-0 m-5 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center p-2 bg-[#3A1D1D] text-white rounded-t-lg">
            <span className="text-xs "> 문의 톡톡</span>
            <button
              onClick={handleCloseChat}
              className="p-1 hover:bg-[#3A1D1D] rounded-full"
              aria-label="Close chat"
            >
              <FaTimes size={16} />
            </button>
          </div>
          <div className="chat-window h-96">
            <ChatWindow user={member} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
