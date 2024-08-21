import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/AxiosInstance";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

const ChatPage = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const member = JSON.parse(localStorage.getItem("member"));
    setCurrentUser(member);
  }, []);

  useEffect(() => {
    if (chatRoomId) {
      axiosInstance
        .get(`/api/chat/historyAdmin?memberId=${chatRoomId}`)
        .then((response) => {
          const data = response.data;
          setMessages(
            data.map((msg) => ({
              id: msg.id,
              user_id: msg.memberId,
              content: msg.content,
              timestamp: msg.timestamp,
            }))
          );
        })
        .catch((error) => {
          console.error("Failed to fetch chat history", error);
        });
    }
  }, [chatRoomId]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(
          `/user/${chatRoomId}/queue/messages`,
          onMessageReceived
        );
      },
      onStompError: (error) => {
        console.error("STOMP Error:", error);
      },
    });
    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [chatRoomId]);

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = () => {
    if (!currentUser) return; // 사용자가 로드되기 전에 메시지를 보내지 않음

    if (newMessage.trim() === "") return;

    const newMsg = {
      memberId: currentUser.id,
      name: currentUser.name,
      content: newMessage,
      sns: 1,
      timestamp: new Date().toISOString(),
      transmitMemberId: chatRoomId,
    };

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/sendAdminMessage",
        body: JSON.stringify(newMsg),
      });
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    } else {
      console.error("STOMP client is not connected");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 Enter 동작을 방지 (줄바꿈 등)
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window bg-white shadow-lg rounded-lg overflow-hidden flex flex-col w-80 h-96">
      {/* 메시지 영역 */}
      <div className="chat-messages flex-1 p-4 overflow-y-auto flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index} // id를 key로 사용
            className={`message mb-2 p-2 rounded-md max-w-xs ${
              msg.user_id === currentUser?.id
                ? "bg-blue-500 text-white self-end align-self-end" // 오른쪽 정렬
                : "bg-gray-200 text-gray-800 self-start align-self-start" // 왼쪽 정렬
            }`}
          >
            <strong className="block">
              {msg.user_id === currentUser?.id ? "Me" : msg.name}:
            </strong>
            <span>{msg.content}</span>
            <span className="block text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* 입력 영역 */}
      <div className="p-4 bg-gray-100 border-t flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
