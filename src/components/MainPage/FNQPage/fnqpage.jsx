import React, { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";

const FNQ = () => {
  // 하드코딩된 데이터
  const allFAQs = [
    { id: 1, title: "문의 1", author: "작성자 1", createdAt: "2024-08-05" },
    { id: 2, title: "문의 2", author: "작성자 2", createdAt: "2024-08-04" },
    { id: 3, title: "문의 3", author: "작성자 3", createdAt: "2024-08-03" },
    { id: 4, title: "문의 4", author: "작성자 4", createdAt: "2024-08-02" },
    { id: 5, title: "문의 5", author: "작성자 5", createdAt: "2024-08-01" },
    { id: 6, title: "문의 6", author: "작성자 6", createdAt: "2024-07-31" },
    { id: 7, title: "문의 7", author: "작성자 7", createdAt: "2024-07-30" },
    { id: 8, title: "문의 8", author: "작성자 8", createdAt: "2024-07-29" },
    { id: 9, title: "문의 9", author: "작성자 9", createdAt: "2024-07-28" },
    { id: 10, title: "문의 10", author: "작성자 10", createdAt: "2024-07-27" },
  ];

  // 날짜 기준으로 내림차순 정렬
  const sortedFAQs = allFAQs.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 한 페이지에 표시할 항목 수

  // 페이지네이션 처리
  const indexOfLastFAQ = currentPage * itemsPerPage;
  const indexOfFirstFAQ = indexOfLastFAQ - itemsPerPage;
  const currentFAQs = sortedFAQs.slice(indexOfFirstFAQ, indexOfLastFAQ);
  const totalPages = Math.ceil(sortedFAQs.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 날짜를 상대적으로 표시하는 함수
  const formatRelativeDate = (date) => {
    const now = new Date();
    const pastDate = new Date(date);
    const daysDifference = (now - pastDate) / (1000 * 60 * 60 * 24);

    if (daysDifference <= 1) {
      return formatDistanceToNow(pastDate, { addSuffix: true });
    } else if (daysDifference <= 4) {
      return `${Math.floor(daysDifference)}일 전`;
    } else {
      return format(pastDate, "yyyy-MM-dd");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">문의 게시판</h1>
      <table className="w-full border-collapse bg-white overflow-hidden">
        <thead className="bg-yellow-500 text-white">
          <tr>
            <th className="p-1 border-b text-center">번호</th>
            <th className="p-1 border-b">제목</th>
            <th className="p-1 border-b pr-2">글쓴이</th>
            <th className="p-1 border-b pl-2 text-center">작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentFAQs.map((faq, index) => (
            <tr key={faq.id} className="border-b hover:bg-gray-100">
              <td className="p-2 text-center">
                {sortedFAQs.length - (currentPage - 1) * itemsPerPage - index}
              </td>
              <td className="p-2">{faq.title}</td>
              <td className="p-2 text-center pr-2">{faq.author}</td>
              <td className="p-2 text-center pl-2">
                {formatRelativeDate(faq.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex items-center justify-center space-x-2">
        <button
          onClick={goToPreviousPage}
          className="px-4 py-2"
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          className="px-4 py-2"
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FNQ;
