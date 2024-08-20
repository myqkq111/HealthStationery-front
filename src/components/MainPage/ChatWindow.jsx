import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosInstance from "../api/AxiosInstance";

let stompClient = null;

const ChatWindow = ({ user }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const member = JSON.parse(localStorage.getItem("member"));

  useEffect(() => {
    // 채팅 기록을 가져옵니다.
    axiosInstance
      .get(`/api/chat/history?memberType=${user}&memberId=${member.id}`)
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
            `/user/${user}/queue/messages`,
            onMessageReceived
          );
        },
        onStompError: (error) => {
          console.error(error);
        },
      });
      stompClient.activate();
    };

    connect();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [user]);

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    if (message.memberId === member.id || message.memberType === user) {
      setChatMessages((prev) => [...prev, message]); // 새 메시지를 리스트의 맨 끝에 추가
    }
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      // member.member_type이 admin인 경우 sns를 1로 설정
      const snsValue = member.member_type === "admin" ? 1 : 0;

      const chatMessage = {
        memberId: member.id,
        name: member.name,
        content: message,
        sns: snsValue, // 조건에 따라 sns 값을 설정
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

  return (
    <div className="chat-window bg-white shadow-lg rounded-lg overflow-hidden flex flex-col w-80 h-96">
      <div className="chat-messages flex-1 p-4 overflow-y-auto flex flex-col">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-2 p-2 rounded-md max-w-xs ${
              msg.memberId === member.id // 내가 보낸 메시지인지 확인
                ? "bg-blue-500 text-white self-end" // 내가 보낸 메시지
                : "bg-gray-200 text-gray-800 self-start" // 상대방이 보낸 메시지
            }`}
          >
            <strong className="block">
              {msg.memberId === member.id ? "Me" : msg.name}:
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
