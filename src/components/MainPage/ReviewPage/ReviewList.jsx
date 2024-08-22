// src/components/ReviewList.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/AxiosInstance";
import Slider from "react-slick";
import ReviewCard from "./ReviewCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 커스텀 화살표 컴포넌트 정의
const Arrow = ({ className, onClick, icon }) => (
  <div
    className={`${className} bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 flex items-center justify-center`}
    onClick={onClick}
  >
    {icon}
  </div>
);

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2.65,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000, // 3초마다 자동으로 넘어감
  nextArrow: <Arrow icon={<FaChevronRight />} />,
  prevArrow: <Arrow icon={<FaChevronLeft />} />,
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 리뷰 데이터 fetch
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get("/review/product");
        setReviews(response.data);
      } catch (err) {
        setError("리뷰 데이터를 가져오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="container mx-auto px-4 flex">
        {/* 제목 */}
        <div className="flex-none mr-8">
          <h2 className="text-3xl font-bold mb-4 text-left">고객 REAL 후기</h2>
          <p className="text-left mb-2">내돈내산 리얼 리뷰,</p>
          <p className="text-left">직접보고 쇼핑하세요</p>
        </div>

        {/* 리뷰 카드 슬라이더 */}
        <div className="flex-1">
          <div className="w-full max-w-4xl mx-auto">
            <Slider {...settings}>
              {reviews.map((review) => (
                <div key={review.id} className="px-4">
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
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewList;
