import React, { useState } from "react";

const ReviewModal = ({ isOpen, onClose, onSubmit, buylist_id, product_id }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(0);

  const handleReviewSubmit = () => {
    if (rating === 0 || reviewContent.trim() === "") {
      alert("평점과 리뷰 내용을 모두 입력해주세요.");
      return;
    }

    onSubmit({ buylist_id, product_id, score: rating, content: reviewContent });
    setReviewContent("");
    setRating(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">리뷰 작성</h2>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="리뷰 내용을 입력하세요."
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          rows={5}
        />
        <label className="block mb-2">
          평점:
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            className="ml-2 border border-gray-300 rounded-md"
          >
            <option value={0}>선택하세요</option>
            <option value={1}>1점</option>
            <option value={2}>2점</option>
            <option value={3}>3점</option>
            <option value={4}>4점</option>
            <option value={5}>5점</option>
          </select>
        </label>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
