import React, { useState } from "react";
import axiosInstance from "../api/AxiosInstance";

const MemberForm = ({ member, onClose, onMemberUpdated }) => {
  const [memberType, setMemberType] = useState(
    member ? member.member_type : "user" // Default to "user" if no member type is provided
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let request;

    if (!window.confirm("정말로 이 회원정보를 수정하시겠습니까?")) {
      return;
    }

    if (member) {
      request = axiosInstance.put(
        `/adminMember/update/${member.id}`,
        memberType
      );
    } else {
      console.error("Member does not exist for update");
      return;
    }

    request
      .then((response) => {
        onMemberUpdated(response.data);
        onClose();
      })
      .catch((error) => {
        console.error("Failed to save member", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">회원 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-2">이름</label>
            <input
              type="text"
              value={member ? member.name : ""}
              readOnly
              className="border p-2 w-full bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">권한</label>
            <select
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
