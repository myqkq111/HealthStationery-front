import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosInstance from "../api/AxiosInstance";

let stompClient = null;

const ChatWindow = ({ user }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 채팅 기록을 가져옵니다.
    axiosInstance
      .get(`/api/chat/history?memberId=${user.id}`)
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        setChatMessages(data); // 정방향으로 유지
      })
      .catch((error) => {
        console.error("Failed to fetch chat history", error);
      });

    // STOMP 클라이언트 연결
    const connect = () => {
      const socket = new SockJS("http://localhost:8080/ws");
      stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          stompClient.subscribe(
            `/user/${user.member_type}/queue/messages`,
            onMessageReceived
          );
        },
        onStompError: (error) => {
          console.error(error);
        },
      });
      stompClient.activate();
    };

    const onMessageReceived = (payload) => {
      const message = JSON.parse(payload.body);
      if (
        message.memberId === user.id ||
        message.memberType === user.member_type
      ) {
        setChatMessages((prev) => [...prev, message]); // 새 메시지를 리스트의 맨 끝에 추가
      }
    };

    connect();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [user]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected && message.trim()) {
      const chatMessage = {
        memberId: user.id,
        name: user.name,
        content: message,
        sns: 0,
        timestamp: new Date(),
      };

      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(chatMessage),
      });

      setChatMessages((prev) => [...prev, chatMessage]); // 새 메시지를 리스트의 맨 끝에 추가
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 Enter 동작을 방지 (줄바꿈 등)
      sendMessage();
    }
  };

  return (
    <div className="chat-window bg-white shadow-lg rounded-lg overflow-hidden flex flex-col w-80 h-96">
      <div className="chat-messages flex-1 p-4 overflow-y-auto flex flex-col">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-2 p-2 rounded-md max-w-xs ${
              msg.memberId === user.id // 내가 보낸 메시지인지 확인
                ? "bg-blue-500 text-white self-end" // 내가 보낸 메시지
                : "bg-gray-200 text-gray-800 self-start" // 상대방이 보낸 메시지
            }`}
          >
            <strong className="block">
              {msg.memberId === user.id ? "Me" : msg.name}:
            </strong>{" "}
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-100 border-t flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={handleKeyDown} // 엔터키 처리
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
