import React, { useState, useEffect } from "react";
import axios from "axios";

const MemberForm = ({ member, onClose, onMemberUpdated }) => {
  const [name, setName] = useState(member ? member.name : "");
  const [email, setEmail] = useState(member ? member.email : "");
  const [cate, setCate] = useState(member ? member.cate : "");
  const [tell, setTell] = useState(member ? member.tell : "");
  const [birth, setBirth] = useState(member ? member.birth : "");
  const [mailaddr, setMailaddr] = useState(member ? member.mailaddr : "");
  const [roadaddr, setRoadaddr] = useState(member ? member.roadaddr : "");
  const [detailaddr, setDetailaddr] = useState(member ? member.detailaddr : "");
  const [regdt, setRegdt] = useState(member ? member.regdt : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const address = `${mailaddr}, ${roadaddr}, ${detailaddr}`;

    const memberData = { name, email, cate, tell, birth, address, regdt };

    let request;

    if (member) {
      // Update member
      request = axios.put(`/api/members/${member.id}`, memberData);
    } else {
      // Add new member
      request = axios.post("/api/members", memberData);
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
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {member ? "회원 수정" : "회원 추가"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="mb-4">
            <label className="block mb-2">카테고리</label>
            <input
              type="text"
              value={cate}
              onChange={(e) => setCate(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">전화번호</label>
            <input
              type="text"
              value={tell}
              onChange={(e) => setTell(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">생년월일</label>
            <input
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">우편주소</label>
            <input
              type="text"
              value={mailaddr}
              onChange={(e) => setMailaddr(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">도로명주소</label>
            <input
              type="text"
              value={roadaddr}
              onChange={(e) => setRoadaddr(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">상세주소</label>
            <input
              type="text"
              value={detailaddr}
              onChange={(e) => setDetailaddr(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">등록일</label>
            <input
              type="date"
              value={regdt}
              onChange={(e) => setRegdt(e.target.value)}
              className="border p-2 w-full"
            />
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
