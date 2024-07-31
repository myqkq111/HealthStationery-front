// src/components/ProductList.js
import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 제품 목록 정의
const products = [
  {
    id: 1,
    image: "/images/A/A_1.jpg",
    title: "스트랩",
    price: 29.99,
  },
  {
    id: 2,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 3,
    image: "/images/A/A_3.jpg",
    title: "히어로 논슬립 리프팅 슈즈",
    price: 39.99,
  },
  {
    id: 4,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 5,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 6,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 1,
    image: "/images/A/A_1.jpg",
    title: "스트랩",
    price: 29.99,
  },
  {
    id: 2,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 3,
    image: "/images/A/A_3.jpg",
    title: "히어로 논슬립 리프팅 슈즈",
    price: 39.99,
  },
  {
    id: 4,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 5,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 6,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 1,
    image: "/images/A/A_1.jpg",
    title: "스트랩",
    price: 29.99,
  },
  {
    id: 2,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 3,
    image: "/images/A/A_3.jpg",
    title: "히어로 논슬립 리프팅 슈즈",
    price: 39.99,
  },
  {
    id: 4,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 5,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
  {
    id: 6,
    image: "/images/A/A_2.jpg",
    title: "손목 보호대",
    price: 39.99,
  },
];

// 커스텀 화살표 컴포넌트 정의
const Arrow = ({ className, onClick, icon }) => (
  <div
    className={`${className} bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 flex items-center justify-center`}
    onClick={onClick}
  >
    {icon}
  </div>
);

// 제품 리스트 컴포넌트 정의
const ProductList = () => {
  // 슬라이더 설정
  const settings = {
    dots: false, // 하단의 도트 네비게이션 비활성화
    infinite: true, // 무한 슬라이드 활성화
    speed: 1000, // 슬라이드 전환 속도 (ms)
    slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 3, // 한 번에 넘어갈 슬라이드 개수
    autoplay: true, // 자동 슬라이드 활성화
    autoplaySpeed: 3000, // 자동 슬라이드 전환 간격 (ms)
    nextArrow: <Arrow icon={<FaChevronRight />} />, // 다음 슬라이드 화살표
    prevArrow: <Arrow icon={<FaChevronLeft />} />, // 이전 슬라이드 화살표
    responsive: [
      {
        breakpoint: 1024, // 1024px 이하일 때
        settings: {
          slidesToShow: 3, // 3개 슬라이드 표시
          slidesToScroll: 1, // 1개 슬라이드씩 이동
        },
      },
      {
        breakpoint: 768, // 768px 이하일 때
        settings: {
          slidesToShow: 2, // 2개 슬라이드 표시
          slidesToScroll: 1, // 1개 슬라이드씩 이동
        },
      },
      {
        breakpoint: 480, // 480px 이하일 때
        settings: {
          slidesToShow: 1, // 1개 슬라이드 표시
          slidesToScroll: 1, // 1개 슬라이드씩 이동
        },
      },
    ],
  };

  return (
    <section id="products" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">LIKE UP</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24" />
        </div>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard
                id={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProductList;
