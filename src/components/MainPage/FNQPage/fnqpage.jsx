import React, { useState } from "react";
import Modal from "react-modal";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";

// 모달의 루트 엘리먼트를 설정합니다
Modal.setAppElement("#root");

const FNQ = () => {
  // 하드코딩된 데이터
  const allFAQs = [
    {
      id: 1,
      title: "문의 1",
      content: "문의 내용 1",
      createdAt: "2024-08-05",
      author: "홍길동",
    },
    {
      id: 2,
      title: "문의 2",
      content: "문의 내용 2",
      createdAt: "2024-08-04",
      author: "김철수",
    },
    {
      id: 3,
      title: "문의 3",
      content: "문의 내용 3",
      createdAt: "2024-08-03",
      author: "이영희",
    },
    {
      id: 4,
      title: "문의 4",
      content: "문의 내용 4",
      createdAt: "2024-08-02",
      author: "박민수",
    },
    {
      id: 5,
      title: "문의 5",
      content: "문의 내용 5",
      createdAt: "2024-08-01",
      author: "최지훈",
    },
    {
      id: 6,
      title: "문의 6",
      content: "문의 내용 6",
      createdAt: "2024-07-31",
      author: "정하늘",
    },
    {
      id: 7,
      title: "문의 7",
      content: "문의 내용 7",
      createdAt: "2024-07-30",
      author: "임준호",
    },
    {
      id: 8,
      title: "문의 8",
      content: "문의 내용 8",
      createdAt: "2024-07-29",
      author: "송다은",
    },
    {
      id: 9,
      title: "문의 9",
      content: "문의 내용 9",
      createdAt: "2024-07-28",
      author: "오지훈",
    },
    {
      id: 10,
      title: "문의 10",
      content: "문의 내용 10",
      createdAt: "2024-07-27",
      author: "최영수",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 한 페이지에 표시할 항목 수
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFAQ, setNewFAQ] = useState({
    title: "",
    content: "",
    author: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  // 데이터를 작성일 기준으로 내림차순 정렬
  const sortedFAQs = [...allFAQs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // 페이지네이션 처리
  const indexOfLastFAQ = currentPage * itemsPerPage;
  const indexOfFirstFAQ = indexOfLastFAQ - itemsPerPage;
  const currentFAQs = sortedFAQs.slice(indexOfFirstFAQ, indexOfLastFAQ);
  const totalPages = Math.ceil(sortedFAQs.length / itemsPerPage);

  // 게시글 번호 계산 (가장 최근이 1번)
  const calculatePostNumber = (index) => {
    return sortedFAQs.length - (index + 1) + 1;
  };

  // 날짜 차이를 계산하는 함수
  const formatDateDifference = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const minutesDifference = differenceInMinutes(now, postDate);
    const hoursDifference = differenceInHours(now, postDate);
    const daysDifference = differenceInDays(now, postDate);

    if (minutesDifference < 60) {
      return `${minutesDifference}분 전`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference}시간 전`;
    } else if (daysDifference <= 4) {
      return `${daysDifference}일 전`;
    } else {
      return format(postDate, "yyyy-MM-dd"); // 4일을 초과한 경우 정확한 날짜
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFAQ((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 새로운 FAQ를 기존 리스트에 추가하는 로직 (여기서는 예시로 단순히 콘솔에 출력)
    console.log("새 문의글 제출:", newFAQ);
    // 실제 애플리케이션에서는 서버에 전송하거나 상태 관리 라이브러리를 사용할 수 있습니다.
    closeModal();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">문의게시판</h1>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">게시글번호</th>
            <th className="px-4 py-2 text-left">제목</th>
            <th className="px-4 py-2 text-left">글쓴이</th>
            <th className="px-4 py-2 text-left">작성시간</th>
          </tr>
        </thead>
        <tbody>
          {currentFAQs.map((faq, index) => (
            <tr key={faq.id} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">
                {calculatePostNumber(index + indexOfFirstFAQ)}
              </td>
              <td className="px-4 py-2">{faq.title}</td>
              <td className="px-4 py-2">{faq.author}</td>
              <td className="px-4 py-2">
                {formatDateDifference(faq.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 flex justify-center">
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
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          글쓰기
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
        contentLabel="문의글 작성"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">문의글 작성</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                name="title"
                value={newFAQ.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                name="content"
                value={newFAQ.content}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                글쓴이
              </label>
              <input
                type="text"
                name="author"
                value={newFAQ.author}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                작성일
              </label>
              <input
                type="date"
                name="createdAt"
                value={newFAQ.createdAt}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                제출
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default FNQ;
