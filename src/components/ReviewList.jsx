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
  },
  {
    id: 2,
    reviewer: "김철수",
    rating: 4,
    comment: "제품이 괜찮긴 한데, 배송이 조금 늦었어요.",
    productImage: "/images/A/A_2.jpg", // 제품 사진 추가
  },
  {
    id: 3,
    reviewer: "이영희",
    rating: 3,
    comment: "평범한 제품이에요. 가격대비 그냥 그래요.",
    productImage: "/images/A/A_3.jpg", // 제품 사진 추가
  },
  {
    id: 4,
    reviewer: "박지민",
    rating: 5,
    comment: "아주 만족합니다. 다음에도 구매할게요!",
    productImage: "/images/A/A_2.jpg", // 제품 사진 추가
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
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000, // 3초마다 자동으로 넘어감
  nextArrow: <Arrow icon={<FaChevronRight />} />,
  prevArrow: <Arrow icon={<FaChevronLeft />} />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const ReviewList = () => {
  return (
    <section id="reviews" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">고객 REAL 후기</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24" />
        </div>

        {/* 리뷰 카드 슬라이더 */}
        <div className="relative">
          <Slider {...settings}>
            {reviews.map((review) => (
              <div key={review.id} className="px-2">
                <ReviewCard
                  reviewer={review.reviewer}
                  rating={review.rating}
                  comment={review.comment}
                  productImage={review.productImage} // 제품 이미지 추가
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default ReviewList;
