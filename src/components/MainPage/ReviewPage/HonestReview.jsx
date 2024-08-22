import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ReviewCard from "./ReviewCard";

const HonestReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [reviewsPerPage] = useState(8); // 페이지당 리뷰 수

  useEffect(() => {
    const fetchReviews = () => {
      axiosInstance
        .get("/review/product")
        .then((response) => {
          setReviews(response.data);
          setReviewCount(response.data.length);
        })
        .catch((err) => {
          console.error("리뷰 데이터를 가져오는 데 실패했습니다:", err);
          setError("리뷰 데이터를 가져오는 데 실패했습니다.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchReviews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // 페이지네이션 로직
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviewCount / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="p-4">
        <img
          src="/images/reviews/review.JPG"
          alt="ㅎㅇ"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-semibold mr-4">솔직 구매 후기</h2>
        <span className="text-xl text-gray-500">{reviewCount}</span>
      </div>

      {currentReviews.length === 0 ? (
        <p>아직 작성된 리뷰가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentReviews.map((review) => (
            <ReviewCard
              key={review.id} // 유니크한 키를 추가
              color={review.color}
              cate={review.cate}
              size={review.size}
              content={review.content}
              score={review.score}
              reviewerName={review.name}
              productImage={review.strImage}
              productName={review.productName}
            />
          ))}
        </div>
      )}

      {/* 페이지 네비게이션 */}
      <div className="mt-8 flex justify-center">
        <ul className="flex space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === index + 1
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HonestReview;
