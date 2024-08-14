import React from "react";
import Modal from "react-modal"; // Modal 라이브러리

// 모달 스타일 설정
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    maxWidth: "90%",
  },
};

const CommentModal = ({
  isOpen,
  onClose,
  onCommentSubmit,
  newComment,
  onNewCommentChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="댓글 작성"
    >
      <h2 className="text-xl font-semibold mb-4">댓글 작성</h2>
      <textarea
        value={newComment}
        onChange={onNewCommentChange}
        placeholder="댓글을 입력하세요"
        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      />
      <div className="flex justify-end">
        <button
          onClick={onCommentSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          댓글 추가
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ml-2"
        >
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default CommentModal;
