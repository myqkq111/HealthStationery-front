import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import CommentModal from "./CommentModal"; // 모달 컴포넌트 임포트

const BoardList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // 문의 게시판 목록을 가져오는 함수
    axiosInstance
      .get("/Inquiry/selectAll") // 실제 API 엔드포인트에 맞게 수정
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inquiries:", error);
        setError("데이터를 가져오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  // 댓글 작성 함수 (PUT 요청)
  const handleCommentSubmit = () => {
    axiosInstance
      .put(`/Inquiry/comment`, {
        id: selectedInquiryId,
        comment: newComment,
      })
      .then(() => {
        // 댓글 작성 후 게시물 데이터 업데이트
        // 게시물 데이터 새로 불러오기
        axiosInstance
          .get("/Inquiry/selectAll")
          .then((response) => {
            setPosts(response.data); // 새 데이터로 상태 업데이트
            setNewComment(""); // 입력 필드 초기화
            setShowModal(false); // 모달 닫기
          })
          .catch((error) => {
            console.error("Error fetching inquiries:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
      });
  };

  // 게시물 삭제 함수 (DELETE 요청)
  const handlePostDelete = (postId) => {
    axiosInstance
      .delete(`/Inquiry/delete/${postId}`) // 게시물 ID로 삭제 요청
      .then(() => {
        // 게시물 삭제 후 게시물 목록에서 제거
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  // 로딩 상태 또는 오류 처리
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">문의 게시판 목록</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr className="text-center">
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                문의 ID
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                작성자
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                상품
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                제목
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                내용
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                답글
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                댓글
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">
                삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((inquiry) => (
                <React.Fragment key={inquiry.id}>
                  <tr className="border-b border-gray-200 text-center">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {inquiry.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {inquiry.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {inquiry.productId}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {inquiry.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {inquiry.content}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {inquiry.comment}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <button
                        onClick={() => {
                          setSelectedInquiryId(inquiry.id);
                          setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        댓글 작성
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <button
                        onClick={() => handlePostDelete(inquiry.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CommentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCommentSubmit={handleCommentSubmit}
          newComment={newComment}
          onNewCommentChange={(e) => setNewComment(e.target.value)}
        />
      )}
    </div>
  );
};

export default BoardList;
