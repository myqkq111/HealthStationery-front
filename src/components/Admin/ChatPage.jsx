import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosInstance from "../api/AxiosInstance";

const ChatPage = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const member = JSON.parse(localStorage.getItem("member"));
    setCurrentUser(member);
  }, []);

  useEffect(() => {
    if (chatRoomId && currentUser) {
      axiosInstance
        .get(`/api/chat/historyAdmin?memberId=${chatRoomId}`)
        .then((response) => {
          const data = response.data;
          const filteredMessages = data.filter(
            (msg) =>
              (msg.memberId === currentUser.id &&
                msg.transmitMemberId === chatRoomId) ||
              (msg.memberId === chatRoomId &&
                msg.transmitMemberId === currentUser.id)
          );

          setMessages(
            filteredMessages.map((msg) => ({
              ...msg,
              timestamp: formatTimestamp(msg.timestamp), // Format timestamp for messages
            }))
          );
        })
        .catch((error) => {
          console.error("Failed to fetch chat history", error);
        });
    }
  }, [chatRoomId, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const socket = new SockJS("http://43.203.197.142:8080/ws");
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("STOMP client connected");
          client.subscribe(`/topic/admin/${currentUser.id}`, onMessageReceived);
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
    }
  }, [currentUser]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleTimeString("ko-KR", {
          timeZone: "Asia/Seoul",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    message.timestamp = formatTimestamp(message.timestamp); // Format timestamp
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = () => {
    if (!currentUser) {
      console.error("No current user available");
      return;
    }
    if (newMessage.trim() === "") {
      console.error("Cannot send an empty message");
      return;
    }

    const newMsg = {
      memberId: currentUser.id,
      name: currentUser.name,
      content: newMessage,
      sns: 1,
      timestamp: new Date().toISOString(), // Send UTC timestamp
      transmitMemberId: chatRoomId,
    };

    if (stompClient) {
      if (stompClient.connected) {
        stompClient.publish({
          destination: "/app/sendAdminMessage",
          body: JSON.stringify(newMsg),
        });
        newMsg.timestamp = formatTimestamp(newMsg.timestamp); // Format timestamp for immediate display
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        setNewMessage("");
      } else {
        console.error("STOMP client is not connected. Cannot send message.");
      }
    } else {
      console.error("STOMP client instance is not available.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window max-w-md mx-auto bg-white flex flex-col h-[60vh]">
      <div className="flex justify-between items-center p-3 bg-[#3A1D1D] text-white rounded-t-lg">
        <span className="text-s">문의 톡톡</span>
      </div>

      <div
        className="chat-messages flex-1 p-3 overflow-y-auto bg-[#9bbbd4]"
        ref={messagesContainerRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message w-60 mb-2 p-2 rounded-md ${
              msg.memberId === currentUser?.id
                ? "bg-[#fef01b] text-black ml-auto self-end"
                : "bg-[#FFFFFF] text-gray-800 mr-auto self-start"
            }`}
          >
            <span className="block text-sm mt-1">{msg.content}</span>
            <span className="block text-xs text-black mt-1">
              {msg.timestamp} {/* Formatted timestamp */}
            </span>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-200 border-t flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-[#F9F9F9] border rounded-md focus:outline-none focus:ring-1 focus:ring-white"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-3 py-2 bg-[#fef01b] text-black rounded-md transition"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
