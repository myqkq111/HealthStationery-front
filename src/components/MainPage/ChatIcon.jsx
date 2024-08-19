// ChatIcon.jsx
import React from "react";
import { FaComments } from "react-icons/fa"; // react-icons를 사용하여 채팅 아이콘 추가

const ChatIcon = () => {
  const handleClick = () => {
    // 클릭 시 채팅 창 열기 또는 다른 동작을 여기에 구현
    alert("채팅 창 열기");
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-20 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition"
      aria-label="채팅하기"
    >
      <FaComments size={24} />
    </div>
  );
};

export default ChatIcon;
