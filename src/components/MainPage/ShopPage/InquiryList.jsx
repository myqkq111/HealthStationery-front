import React, { useState, useCallback } from "react";
import InquiryWrite from "./InquiryWrite";
import axiosInstance from "./../../api/AxiosInstance";

const InquiryList = ({ Inquiry }) => {
  // 문의 데이터 상태를 Inquiry prop으로 초기화
  const [inquiries, setInquiries] = useState(Inquiry || []);
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  // 에러 상태
  const [error, setError] = useState(null);
  // 모달의 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 비밀글 제외 여부 상태
  const [excludePrivate, setExcludePrivate] = useState(false);
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);
  // 페이지당 항목 수
  const itemsPerPage = 5;
  // 펼쳐진 문의 상태
  const [expandedInquiries, setExpandedInquiries] = useState({});
  // 비밀번호 입력 상태
  const [password, setPassword] = useState("");
  // 현재 선택된 비밀글 ID
  const [selectedSecretId, setSelectedSecretId] = useState(null);
  // 비밀번호 오류 상태
  const [passwordError, setPasswordError] = useState(null);

  // 문의 추가 핸들러
  const handleAddInquiry = useCallback(
    (newInquiry) => {
      axiosInstance
        .post("/product/inq", newInquiry) // 서버 API 엔드포인트
        .then((response) => {
          setInquiries((prevInquiries) => {
            const updatedInquiries = [...prevInquiries, response.data];
            const newTotalPages = Math.ceil(
              updatedInquiries.length / itemsPerPage
            );

            // 현재 페이지가 새 총 페이지 수보다 크면 현재 페이지를 총 페이지 수로 조정
            if (currentPage > newTotalPages) {
              setCurrentPage(newTotalPages);
            }

            return updatedInquiries;
          });
          setIsModalOpen(false); // 문의 추가 후 모달 닫기
        })
        .catch((err) => {
          setError(err.message);
        });
    },
    [currentPage, itemsPerPage]
  );

  // 비밀글 제외 필터 적용
  const filteredInquiries = excludePrivate
    ? inquiries.filter((inq) => !inq.is_secret)
    : inquiries;

  // 페이지네이션에 따라 표시할 문의 목록 계산
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInquiries = filteredInquiries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 제목 클릭 시 펼쳐진 상태 토글
  const handleToggleExpand = (id) => {
    setExpandedInquiries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 비밀번호 확인 핸들러
  const handlePasswordSubmit = (id) => {
    axiosInstance
      .post(`/product/inq/${id}/verify`, { password }) // 비밀번호 검증 엔드포인트
      .then((response) => {
        if (response.data.valid) {
          setExpandedInquiries((prev) => ({
            ...prev,
            [id]: true,
          }));
          setSelectedSecretId(null);
        } else {
          setPasswordError("비밀번호가 틀렸습니다.");
        }
      })
      .catch((err) => {
        setPasswordError("비밀번호 검증에 실패했습니다.");
      });
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto bg-white">
        {/* 문의 등록 버튼 */}
        <div className="mb-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-full px-4 py-2"
          >
            문의 등록
          </button>
        </div>

        {/* 로딩 중일 때 */}
        {loading && <p className="text-gray-600">로딩 중...</p>}

        {/* 에러가 있을 때 */}
        {error && <p className="text-red-600">{error}</p>}

        {/* 문의 목록 */}
        {!loading && !error && (
          <div>
            <div className="text-center p-2">
              <h2>전체 상품 문의 ({filteredInquiries.length})</h2>
            </div>
            {/* 비밀글 제외 버튼 */}
            <div className="mb-2">
              <button
                onClick={() => setExcludePrivate(!excludePrivate)}
                className={`px-2 py-2 ${
                  excludePrivate ? "text-black font-semibold" : "text-gray-300"
                }`}
              >
                {excludePrivate ? "비밀글 제외" : "비밀글 제외"}
              </button>
            </div>
            {/* 문의 목록이 없는 경우 */}
            {currentInquiries.length === 0 ? (
              <p className="text-gray-600">등록된 문의가 없습니다.</p>
            ) : (
              <ul className="">
                {currentInquiries.map((inquiry) => (
                  <li
                    key={inquiry.id}
                    className="border-t border-gray-200 rounded p-2"
                  >
                    <div className="flex flex-col">
                      {/* 제목 클릭 시 펼쳐진 상태 토글 */}
                      <button
                        onClick={() => {
                          if (inquiry.is_secret) {
                            setSelectedSecretId(inquiry.id);
                          } else {
                            handleToggleExpand(inquiry.id);
                          }
                        }}
                        className="text-left w-full"
                      >
                        <h3 className="text-gray-800 font-semibold">
                          {inquiry.title}
                        </h3>
                      </button>
                      {/* 비밀번호 입력 */}
                      {selectedSecretId === inquiry.id && (
                        <div className="mt-2">
                          <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 w-full mb-2"
                          />
                          <button
                            onClick={() => handlePasswordSubmit(inquiry.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            확인
                          </button>
                          {passwordError && (
                            <p className="text-red-600 mt-2">{passwordError}</p>
                          )}
                        </div>
                      )}
                      {/* 문의 내용 조건부 렌더링 */}
                      {expandedInquiries[inquiry.id] && (
                        <div className="mt-2">
                          <p className="text-gray-800">{inquiry.content}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-gray-500 text-sm mt-1">
                        {inquiry.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* 페이지 네이션 버튼 */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 text-gray-700 rounded disabled:opacity-50"
                aria-label="이전 페이지"
              >
                &lt; {/* 왼쪽 화살표 */}
              </button>
              <span className="px-4 py-2 text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 text-gray-700 rounded disabled:opacity-50"
                aria-label="다음 페이지"
              >
                &gt; {/* 오른쪽 화살표 */}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 모달 팝업 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <InquiryWrite
              onAddInquiry={handleAddInquiry}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryList;
