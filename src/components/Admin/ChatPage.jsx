import React, { useState } from "react";

const ChatPage = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user_id: 1,
      message: "안녕하세요! 어떻게 도와드릴까요?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      user_id: 2,
      message: "안녕하세요! 문의사항이 있습니다.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    const newMsg = {
      id: messages.length + 1,
      user_id: 1, // 현재 관리자 ID
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages([newMsg, ...messages]); // 새 메시지가 가장 위에 오도록 설정
    setNewMessage("");
  };

  return (
    <div className="w-80 h-auto  bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-auto p-2 bg-gray-100 border-b border-gray-300 flex flex-col-reverse">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.user_id === 1 ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`p-2 max-w-xs rounded-lg ${
                msg.user_id === 1
                  ? "bg-yellow-300 text-black"
                  : "bg-white text-black"
              } shadow-md`}
            >
              <p>{msg.message}</p>
              <span className="block text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* 입력 영역 */}
      <div className="p-2 bg-white border-t border-gray-300 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-1 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
