import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import MemberForm from "./MemberForm";
import { format, parseISO } from "date-fns"; // 날짜 포맷팅을 위한 import

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10; // 페이지당 회원 수

  useEffect(() => {
    // 컴포넌트가 마운트될 때 회원 목록을 서버에서 가져오는 함수
    const fetchMembers = () => {
      axiosInstance
        .get("/adminMember/selectAll") // 실제 API 엔드포인트로 교체
        .then((response) => {
          setMembers(response.data); // 회원 목록 상태 업데이트
        })
        .catch((error) => {
          console.error("Failed to fetch members", error); // 데이터 fetching 오류 처리
        });
    };

    fetchMembers();
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

  // 페이지네이션을 위해 현재 페이지의 회원 목록을 계산
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm("정말로 이 회원을 삭제하시겠습니까?")) {
      axiosInstance
        .delete(`/adminMember/delete/${memberId}`)
        .then(() => {
          setMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== memberId)
          );
        })
        .catch((error) => {
          console.error("Failed to delete member", error);
        });
    }
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

  // 페이지네이션 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

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
              가입유형
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
              권한
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentMembers.map((member) => {
            // 날짜 포맷팅
            const birthDate = member.birth
              ? format(parseISO(member.birth), "yyyy-MM-dd")
              : "";
            const regDate = member.regdt
              ? format(parseISO(member.regdt), "yyyy-MM-dd")
              : "";

            return (
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
                  {birthDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {`${member.mailaddr}, ${member.roadaddr}, ${member.detailaddr}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {regDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.member_type}
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
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          이전
        </button>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
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
