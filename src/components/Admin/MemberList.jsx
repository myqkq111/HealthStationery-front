import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import axios from "axios";
import MemberForm from "./MemberForm";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("name");

  // 임시 데이터
  const sampleMembers = [
    {
      id: 1,
      name: "김철수",
      email: "chulsoo.kim@example.com",
      cate: "VIP",
      tell: "010-1234-5678",
      birth: "1985-10-15",
      mailaddr: "서울시 강남구",
      roadaddr: "테헤란로",
      detailaddr: "123-45",
      regdt: "2024-08-01",
    },
    {
      id: 2,
      name: "이영희",
      email: "younghee.lee@example.com",
      cate: "일반",
      tell: "010-8765-4321",
      birth: "1990-05-20",
      mailaddr: "부산시 해운대구",
      roadaddr: "해운대해변로",
      detailaddr: "678-90",
      regdt: "2024-08-02",
    },
    {
      id: 3,
      name: "박민수",
      email: "minsu.park@example.com",
      cate: "정기",
      tell: "010-1357-2468",
      birth: "1988-12-25",
      mailaddr: "인천시 연수구",
      roadaddr: "연수로",
      detailaddr: "234-56",
      regdt: "2024-08-03",
    },
  ];

  useEffect(() => {
    // 임시 데이터 설정
    setMembers(sampleMembers);
    setFilteredMembers(sampleMembers);
  }, []);

  useEffect(() => {
    // 필터링 및 정렬 처리
    const lowercasedQuery = searchQuery.toLowerCase();
    const sortedMembers = [...members].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredMembers(
      sortedMembers.filter((member) =>
        member.name.toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, sortOrder, sortColumn, members]);

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteMember = (memberId) => {
    axios
      .delete(`/api/members/${memberId}`)
      .then(() => {
        // 여기서는 실제 API 호출을 대신하여 직접 상태를 업데이트합니다.
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
      })
      .catch((error) => {
        console.error("Failed to delete member", error);
      });
  };

  const handleMemberUpdated = (updatedMember) => {
    if (editingMember) {
      setMembers(
        members.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
    } else {
      setMembers([...members, updatedMember]);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleSearch = () => {
    setSearchQuery(searchQuery.trim());
  };

  useEffect(() => {
    document.body.style.overflow = isFormOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isFormOpen]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">회원 목록</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <label className="mr-2">정렬 기준:</label>
        <select
          value={sortColumn}
          onChange={(e) => setSortColumn(e.target.value)}
          className="border p-2 rounded mr-4"
        >
          <option value="name">이름</option>
          <option value="email">이메일</option>
          <option value="regdt">등록일</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          {sortOrder === "asc" ? "오름" : "내림"}
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              회원명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이메일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              카테고리
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              전화번호
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              생년월일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              주소
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              등록일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredMembers.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {member.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.cate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.tell}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.birth}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {`${member.mailaddr}, ${member.roadaddr}, ${member.detailaddr}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.regdt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEditMember(member)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isFormOpen && (
        <MemberForm
          member={editingMember}
          onClose={closeForm}
          onMemberUpdated={handleMemberUpdated}
        />
      )}
    </div>
  );
};

export default MemberList;
