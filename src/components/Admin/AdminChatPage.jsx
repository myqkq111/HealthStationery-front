import React, { useState } from "react";
import ChatPage from "./ChatPage"; // ChatPage 컴포넌트를 가져옵니다.

const AdminChatPage = () => {
  const [chatRooms] = useState([
    { id: 1, name: "User 1", lastMessage: "Hello, I need help!" },
    { id: 2, name: "User 2", lastMessage: "Can you assist me?" },
    { id: 3, name: "User 3", lastMessage: "I have a question about my order." },
  ]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  const handleChatRoomClick = (chatRoomId) => {
    setSelectedChatRoom(chatRoomId);
  };

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <div className="w-64 bg-gray-200 p-4 border-r border-gray-300">
        <h1 className="text-2xl font-bold mb-4">톡톡 관리</h1>
        <ul>
          {chatRooms.map((room) => (
            <li
              key={room.id}
              onClick={() => handleChatRoomClick(room.id)}
              className="p-2 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <div className="font-semibold">{room.name}</div>
              <div className="text-sm text-gray-600">{room.lastMessage}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* 채팅방 대화 내용 */}
      <div className="flex-1 p-4 bg-gray-100">
        {selectedChatRoom ? (
          <ChatPage chatRoomId={selectedChatRoom} />
        ) : (
          <p>채팅방을 선택해주세요.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
