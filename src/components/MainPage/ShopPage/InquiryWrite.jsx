import React, { useState } from "react";

const InquiryWrite = ({
  onAddInquiry,
  onClose,
  productId,
  memberId,
  memberName,
}) => {
  // 입력 상태 초기화
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  // 문의 추가 핸들러
  const handleAddInquiry = (event) => {
    event.preventDefault();

    // 제목과 내용이 모두 입력되었는지 확인
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    // 새로운 문의 데이터 객체 생성
    const newInquiry = {
      title,
      content,
      secret: isSecret, // 비밀글 여부
      productId: productId,
      memberId: memberId,
      name: memberName,
    };

    // 문의 추가 함수 호출
    onAddInquiry(newInquiry);
    resetForm(); // 폼 초기화
  };

  // 폼 초기화 함수
  const resetForm = () => {
    setTitle("");
    setContent("");
    setIsSecret(false);
    onClose(); // 모달 닫기
  };

  return (
    <form onSubmit={handleAddInquiry} className="space-y-4">
      {/* 제목 입력 필드 */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          placeholder="제목을 입력하세요..."
        />
      </div>

      {/* 내용 입력 필드 */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          문의내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          className="w-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          placeholder="내용을 입력하세요..."
        />
      </div>

      {/* 비밀글 체크박스 */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isSecret}
          onChange={(e) => setIsSecret(e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isSecret" className="ml-2 text-gray-700">
          비밀글로 설정
        </label>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-6 py-2 hover:bg-gray-600 transition duration-150 ease-in-out"
        >
          취소
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 transition duration-150 ease-in-out"
        >
          등록
        </button>
      </div>
    </form>
  );
};

export default InquiryWrite;
