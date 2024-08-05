// src/components/Admin/MemberForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const MemberForm = ({ member, onClose, onMemberUpdated }) => {
  const [name, setName] = useState(member ? member.name : "");
  const [email, setEmail] = useState(member ? member.email : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const memberData = { name, email };

    try {
      if (member) {
        // Update member
        const response = await axios.put(
          `/api/members/${member.id}`,
          memberData
        );
        onMemberUpdated(response.data);
      } else {
        // Add new member
        const response = await axios.post("/api/members", memberData);
        onMemberUpdated(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save member", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {member ? "회원 수정" : "회원 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            저장
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded ml-2"
          >
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
