import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import ChatPage from "./ChatPage"; // ChatPage 컴포넌트를 가져옵니다.

const AdminChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  useEffect(() => {
    // 채팅방 목록을 가져오는 API 호출
    axiosInstance
      .get("/api/chat/rooms") // API 엔드포인트를 실제 URL로 변경하세요.
      .then((response) => {
        const data = response.data;
        const filteredMessages = filterAndProcessMessages(data);
        setChatRooms(filteredMessages);
      })
      .catch((error) => {
        console.error("Failed to fetch chat rooms", error);
      });
  }, []);

  const filterAndProcessMessages = (messages) => {
    const messageMap = new Map();

    messages
      .filter((msg) => msg.memberId !== 11) // memberId가 11인 메시지는 제외
      .forEach((msg) => {
        const { memberId, content, timestamp, name } = msg;
        if (
          !messageMap.has(memberId) ||
          messageMap.get(memberId).timestamp < timestamp
        ) {
          messageMap.set(memberId, { content, timestamp, name });
        }
      });

    return Array.from(messageMap.entries()).map(
      ([memberId, { content, timestamp, name }]) => ({
        id: memberId,
        name: name, // 이름은 실제 사용자 데이터로 교체해야 합니다.
        lastMessage: content,
        timestamp,
      })
    );
  };

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
