import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ReviewCard from "./ReviewCard";

const HonestReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewCount, setReviewCount] = useState(0); // 총 리뷰 수 상태 추가

  useEffect(() => {
    const fetchReviews = () => {
      axiosInstance
        .get("/review") // 모든 리뷰 데이터를 가져오는 API 호출
        .then((response) => {
          setReviews(response.data);
          setReviewCount(response.data.length); // 리뷰 수를 상태에 설정
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

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-semibold mr-4">솔직 구매 후기</h2>
        <span className="text-xl text-gray-500">{reviewCount}</span>
      </div>
      {reviews.length === 0 ? (
        <p>아직 작성된 리뷰가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              content={review.content}
              score={review.score}
              reviewerName={review.reviewerName}
              productImage={review.productImage}
              productName={review.productName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HonestReview;
