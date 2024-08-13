import React, { useState } from "react";

const InquiryWrite = ({ onAddInquiry, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  // product_id와 member_id를 상위 컴포넌트에서 props로 전달 받도록 설정할 수 있습니다.
  // 현재 예제에서는 하드코딩된 값으로 설정합니다.
  const productId = 1; // 예제 값
  const memberId = 1; // 예제 값

  const handleAddInquiry = (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    const newInquiry = {
      title,
      content,
      secret: isSecret,
      productId: productId,
      memberId: memberId,
    };

    onAddInquiry(newInquiry);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setIsSecret(false);
    onClose();
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
