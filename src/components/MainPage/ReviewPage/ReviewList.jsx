// src/components/ReviewList.js
import React from "react";
import Slider from "react-slick";
import ReviewCard from "./ReviewCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 샘플 리뷰 데이터
const reviews = [
  {
    id: 1,
    reviewer: "홍길동",
    rating: 5,
    comment: "정말 훌륭한 제품이에요! 강력히 추천합니다.",
    productImage: "/images/A/A_1.jpg", // 제품 사진 추가
    productName: "제품명 A",
  },
  {
    id: 2,
    reviewer: "김철수",
    rating: 4,
    comment: "제품이 괜찮긴 한데, 배송이 조금 늦었어요.",
    productImage: "/images/A/A_2.jpg", // 제품 사진 추가
    productName: "제품명 B",
  },
  {
    id: 3,
    reviewer: "이영희",
    rating: 3,
    comment: "평범한 제품이에요. 가격대비 그냥 그래요.",
    productImage: "/images/A/A_3.jpg", // 제품 사진 추가
    productName: "제품명 C",
  },
  {
    id: 4,
    reviewer: "박지민",
    rating: 5,
    comment: "아주 만족합니다. 다음에도 구매할게요!",
    productImage: "/images/A/A_2.jpg", // 제품 사진 추가
    productName: "제품명 D",
  },
];

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
                    reviewer={review.reviewer}
                    rating={review.rating}
                    comment={review.comment}
                    productImage={review.productImage} // 제품 이미지 추가
                    productName={review.productName} // 제품명 추가
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
