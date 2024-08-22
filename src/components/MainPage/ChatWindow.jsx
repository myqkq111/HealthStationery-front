import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosInstance from "../api/AxiosInstance";

const ChatWindow = ({ user }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const endOfMessagesRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!user || !user.id) return;

    axiosInstance
      .get(`/api/chat/history?memberId=${user.id}`)
      .then((response) => {
        const data = response.data;

        const filteredMessages = data.filter(
          (msg) => msg.memberId === user.id || msg.transmitMemberId === user.id
        );

        setChatMessages(filteredMessages);
      })
      .catch((error) => {
        console.error("Failed to fetch chat history", error);
      });

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // 올바른 경로로 구독하고 있는지 확인
        client.subscribe(`/topic/admin/${user.id}`, onMessageReceived);
        console.log("STOMP client connected");
      },
      onStompError: (error) => {
        console.error("STOMP Error:", error);
      },
    });
    setStompClient(client);
    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [user.id]);

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log("들어왔냐");
    if (message.memberId === user.id || message.transmitMemberId === user.id) {
      setChatMessages((prev) => [...prev, message]);
    }
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected && message.trim()) {
      const chatMessage = {
        memberId: user.id,
        name: user.name,
        content: message,
        sns: 0,
        timestamp: new Date().toISOString(),
        transmitMemberId: user.transmitMemberId || user.id,
      };

      stompClient.publish({
        destination: `/app/sendMessage`,
        body: JSON.stringify(chatMessage),
      });
      setChatMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    } else {
      console.error("STOMP client is not connected");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className="chat-window bg-[#9bbbd4] overflow-hidden flex flex-col w-80 h-96">
      <div className="chat-messages flex-1 p-4 overflow-y-auto flex flex-col">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-2 p-2 rounded-md max-w-xs ${
              msg.memberId === user.id
                ? "bg-[#fef01b] text-gray-800 self-end"
                : "bg-[#FFFFFF] text-gray-800 self-start"
            }`}
          >
            <strong className="block">
              {msg.memberId === user.id ? "Me" : msg.name}:
            </strong>{" "}
            <span>{msg.content}</span>
            <span className="block text-xs text-black mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-4 bg-gray-100 border-t flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-white"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-[#fef01b] text-black rounded-md transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
