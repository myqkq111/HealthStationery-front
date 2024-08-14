import React, { useState, useCallback } from "react";
import InquiryWrite from "./InquiryWrite";
import axiosInstance from "./../../api/AxiosInstance";
import { useNavigate } from "react-router-dom";

const InquiryList = ({ Inquiry, product }) => {
  const [inquiries, setInquiries] = useState(Inquiry || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excludePrivate, setExcludePrivate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [expandedInquiries, setExpandedInquiries] = useState({});
  const navigate = useNavigate();
  const memberString = localStorage.getItem("member");
  const memberObject = memberString ? JSON.parse(memberString) : null;
  const memberId = memberObject ? memberObject.id : null;
  const memberName = memberObject ? memberObject.name : null;

  const formatName = (name) => {
    if (!name) return "";
    const firstChar = name.charAt(0);
    const rest = name.slice(1);
    const maskedRest = rest.replace(/./g, "*");
    return `${firstChar}${maskedRest}`;
  };

  const handleAddInquiry = useCallback(
    (newInquiry) => {
      setLoading(true);
      axiosInstance
        .post("/Inquiry/insert", newInquiry)
        .then(() => {
          setInquiries((prevInquiries) => {
            const updatedInquiries = [newInquiry, ...prevInquiries];
            const sortedInquiries = updatedInquiries.sort(
              (a, b) => b.id - a.id
            );
            const newTotalPages = Math.ceil(
              sortedInquiries.length / itemsPerPage
            );

            if (currentPage > newTotalPages) {
              setCurrentPage(newTotalPages);
            }

            return sortedInquiries;
          });
          setIsModalOpen(false);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [currentPage, itemsPerPage]
  );

  // 비밀글 제외 필터 적용
  const filteredInquiries = inquiries.filter((inq) => {
    if (excludePrivate) {
      if (inq.secret && inq.memberId === memberId) {
        return true;
      }
      if (inq.secret) {
        return false;
      }
    }
    return true;
  });

  // 페이지네이션에 따라 표시할 문의 목록 계산
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInquiries = filteredInquiries
    .slice(startIndex, startIndex + itemsPerPage)
    .sort((a, b) => b.id - a.id);

  const handleToggleExpand = (id) => {
    setExpandedInquiries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllowedToViewSecret = (inquiry) => {
    return memberId && inquiry.memberId === memberId;
  };

  const handleInquiryClick = () => {
    if (!memberId) {
      const currentUrl = window.location.pathname + window.location.search;
      if (
        window.confirm("로그인이 필요합니다. 로그인 창으로 이동하시겠습니까?")
      )
        navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      setLoading(true);
      axiosInstance
        .delete(`/Inquiry/delete/${id}`)
        .then(() => {
          setInquiries((prevInquiries) =>
            prevInquiries.filter((inquiry) => inquiry.id !== id)
          );
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto bg-white">
        <div className="mb-2">
          <button
            onClick={handleInquiryClick}
            className="bg-black text-white w-full px-4 py-2"
          >
            문의 등록
          </button>
        </div>

        {loading && <p className="text-gray-600">로딩 중...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div>
            <div className="text-center p-2">
              <h2>전체 상품 문의 ({filteredInquiries.length})</h2>
            </div>
            <div className="mb-2">
              <button
                onClick={() => setExcludePrivate(!excludePrivate)}
                className={`px-2 py-2 ${
                  excludePrivate ? "text-black font-semibold" : "text-gray-300"
                }`}
              >
                {excludePrivate ? "비밀글 포함" : "비밀글 제외"}
              </button>
            </div>
            {currentInquiries.length === 0 ? (
              <p className="text-gray-600">등록된 문의가 없습니다.</p>
            ) : (
              <ul className="">
                {currentInquiries.map((inquiry) => (
                  <li
                    key={inquiry.id}
                    className="border-t border-gray-200 rounded p-2 flex justify-between items-center"
                  >
                    <div className="flex flex-col flex-1">
                      <button
                        onClick={() => {
                          if (inquiry.secret) {
                            if (isAllowedToViewSecret(inquiry)) {
                              handleToggleExpand(inquiry.id);
                            } else {
                              setExpandedInquiries((prev) => ({
                                ...prev,
                                [inquiry.id]: false,
                              }));
                            }
                          } else {
                            handleToggleExpand(inquiry.id);
                          }
                        }}
                        className="text-left w-full"
                      >
                        <h3 className="text-gray-800 font-semibold">
                          {inquiry.secret && !isAllowedToViewSecret(inquiry)
                            ? "비밀글입니다."
                            : inquiry.title}
                        </h3>
                      </button>
                      {expandedInquiries[inquiry.id] && (
                        <div className="mt-2">
                          <p className="text-gray-800">
                            {inquiry.secret && !isAllowedToViewSecret(inquiry)
                              ? "비밀글입니다."
                              : inquiry.content}
                          </p>
                        </div>
                      )}
                    </div>
                    {memberId === inquiry.memberId && (
                      <button
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-red-500 ml-4 hover:text-red-700"
                        aria-label="삭제"
                      >
                        삭제
                      </button>
                    )}
                    <div className="ml-4 text-right">
                      <p className="text-gray-500 text-sm mt-1">
                        {formatName(inquiry.name)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 text-gray-700 rounded disabled:opacity-50"
                aria-label="이전 페이지"
              >
                &lt;
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
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <InquiryWrite
              onAddInquiry={handleAddInquiry}
              onClose={() => setIsModalOpen(false)}
              productId={product ? product.id : null}
              memberId={memberId}
              memberName={memberName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryList;
