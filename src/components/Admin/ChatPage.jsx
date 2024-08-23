import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosInstance from "../api/AxiosInstance";

const ChatPage = ({ chatRoomId }) => {
  // 상태 관리: 채팅 메시지, 새 메시지, 현재 사용자, STOMP 클라이언트
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef(null); // 메시지 컨테이너에 대한 참조
  const [currentUser, setCurrentUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  // 컴포넌트가 마운트될 때 현재 사용자 정보를 로컬 스토리지에서 가져오기
  useEffect(() => {
    const member = JSON.parse(localStorage.getItem("member"));
    setCurrentUser(member);
  }, []);

  // 채팅방 ID와 현재 사용자가 변경될 때 채팅 기록을 가져와 필터링
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
          setMessages(filteredMessages);
        })
        .catch((error) => {
          console.error("Failed to fetch chat history", error);
        });
    }
  }, [chatRoomId, currentUser]);

  // STOMP 클라이언트 설정 및 구독
  useEffect(() => {
    if (currentUser) {
      const socket = new SockJS("http://localhost:8080/ws"); // WebSocket 연결
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("STOMP client connected");
          // 사용자의 메시지 큐에 구독
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
          client.deactivate(); // 클라이언트 비활성화
        }
      };
    }
  }, [currentUser]);

  // 메시지 수신 처리
  const onMessageReceived = (payload) => {
    console.log("Received payload:", payload); // 수신된 원시 payload 확인
    const message = JSON.parse(payload.body);
    console.log("Parsed message:", message);

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
      timestamp: new Date().toISOString(),
      transmitMemberId: chatRoomId,
    };

    if (stompClient) {
      if (stompClient.connected) {
        stompClient.publish({
          destination: "/app/sendAdminMessage",
          body: JSON.stringify(newMsg),
        });

        setMessages((prevMessages) => [...prevMessages, newMsg]);
        setNewMessage("");
      } else {
        console.error("STOMP client is not connected. Cannot send message.");
      }
    } else {
      console.error("STOMP client instance is not available.");
    }
  };

  // Enter 키를 누를 때 메시지 전송 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 리스트를 스크롤하여 최신 메시지가 보이도록 설정
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window max-w-md mx-auto bg-white flex flex-col h-[60vh]">
      <div className="flex justify-between items-center p-3 bg-[#3A1D1D] text-white rounded-t-lg">
        <span className="text-s "> 문의 톡톡</span>
      </div>

      <div
        className="chat-messages flex-1 p-3 overflow-y-auto bg-[#9bbbd4]"
        ref={messagesContainerRef}
      >
        {/* 채팅 메시지 목록 렌더링 */}
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
              {new Date(msg.timestamp).toLocaleTimeString()}
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
          className="ml-2 px-3 py-2 bg-[#fef01b] text-black rounded-md  transition"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
