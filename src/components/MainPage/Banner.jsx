// src/components/Banner.js
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // 좌우 화살표 아이콘

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true); // Fade 상태
  const slides = [
    "/images/banner/banner1.JPG",
    "/images/banner/banner2.JPG",
    "/images/banner/banner3.JPG",
    "/images/banner/banner4.JPG",
    "/images/banner/banner5.JPG",
    "/images/banner/banner6.JPG",
    "/images/banner/banner7.JPG",
  ];

  const nextSlide = () => {
    setFade(false); // 다음 슬라이드로 넘어갈 때 fade-out
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setFade(true); // 슬라이드 변경 후 fade-in
    }, 300); // Fade-out 애니메이션 시간
  };

  const prevSlideHandler = () => {
    setFade(false); // 이전 슬라이드로 넘어갈 때 fade-out
    setTimeout(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
      );
      setFade(true); // 슬라이드 변경 후 fade-in
    }, 300); // Fade-out 애니메이션 시간
  };

  // 자동 슬라이드 전환 설정
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // 5초마다 슬라이드 전환
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, [currentSlide]);

  return (
    <div className="relative w-full h-144 md:h-160 lg:h-180 xl:h-200 overflow-hidden">
      <div className="relative w-full h-full">
        <img
          src={slides[currentSlide]}
          alt="Current Slide"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* 좌우 화살표 버튼 */}
      <button
        onClick={prevSlideHandler}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600"
      >
        <FaChevronRight />
      </button>

      {/* 페이지 네비게이션 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`block w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-gray-300"
            }`}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentSlide(index);
                setFade(true);
              }, 300);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
