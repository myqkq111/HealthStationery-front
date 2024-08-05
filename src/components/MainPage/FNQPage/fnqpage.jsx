import React, { useState } from "react";

const FNQ = () => {
  // 하드코딩된 데이터
  const allFAQs = [
    { id: 1, title: "문의 1", content: "문의 내용 1", createdAt: "2024-08-05" },
    { id: 2, title: "문의 2", content: "문의 내용 2", createdAt: "2024-08-04" },
    { id: 3, title: "문의 3", content: "문의 내용 3", createdAt: "2024-08-03" },
    { id: 4, title: "문의 4", content: "문의 내용 4", createdAt: "2024-08-02" },
    { id: 5, title: "문의 5", content: "문의 내용 5", createdAt: "2024-08-01" },
    { id: 6, title: "문의 6", content: "문의 내용 6", createdAt: "2024-07-31" },
    { id: 7, title: "문의 7", content: "문의 내용 7", createdAt: "2024-07-30" },
    { id: 8, title: "문의 8", content: "문의 내용 8", createdAt: "2024-07-29" },
    { id: 9, title: "문의 9", content: "문의 내용 9", createdAt: "2024-07-28" },
    {
      id: 10,
      title: "문의 10",
      content: "문의 내용 10",
      createdAt: "2024-07-27",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 한 페이지에 표시할 항목 수

  // 페이지네이션 처리
  const indexOfLastFAQ = currentPage * itemsPerPage;
  const indexOfFirstFAQ = indexOfLastFAQ - itemsPerPage;
  const currentFAQs = allFAQs.slice(indexOfFirstFAQ, indexOfLastFAQ);
  const totalPages = Math.ceil(allFAQs.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">문의게시판</h1>
      <ul className="space-y-4">
        {currentFAQs.map((faq) => (
          <li key={faq.id} className="border p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold">{faq.title}</h2>
            <p>{faq.content}</p>
            <p className="text-gray-500 text-sm">작성일: {faq.createdAt}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FNQ;
