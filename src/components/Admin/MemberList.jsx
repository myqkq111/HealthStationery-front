// src/components/Admin/MemberList.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../api/AxiosInstance";
import MemberForm from "./MemberForm";

const MemberList = () => {
  const [members, setMembers] = useState([]); // 회원 목록을 저장하는 상태
  const [editingMember, setEditingMember] = useState(null); // 현재 수정 중인 회원 상태
  const [isFormOpen, setIsFormOpen] = useState(false); // 회원 추가/수정 폼의 열림 상태

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

  const handleEditMember = (member) => {
    setEditingMember(member); // 수정할 회원 설정
    setIsFormOpen(true); // 폼 열기
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await axiosInstance.delete(`/adminMember/delete/${memberId}`); // 실제 API 엔드포인트로 교체
      setMembers(members.filter((member) => member.id !== memberId)); // 회원 목록에서 삭제
    } catch (error) {
      console.error("Failed to delete member", error); // 삭제 오류 처리
    }
  };

  const handleMemberUpdated = (updatedMember) => {
    if (editingMember) {
      // 기존 회원 업데이트
      setMembers(
        members.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
    }
  };

  const closeForm = () => {
    setIsFormOpen(false); // 폼 닫기
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">회원 목록</h2>
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
              권한
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {member.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.email}
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
