// src/pages/AboutUs.jsx
import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 상단 텍스트 및 수평선 */}
      <div className="absolute top-0 left-0 w-full text-center p-4 bg-white text-black z-20">
        <h2 className="text-3xl font-bold mb-8">헬스문방구 이야기</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24 mx-auto" />
        </div>
      </div>

      {/* 클릭 가능한 이미지 */}
      <Link to="/about" className="relative block w-full h-full">
        <img
          src="/images/AboutUs/AboutUs.JPG" // 여기에 원하는 이미지 경로를 넣으세요
          alt="쇼핑몰 소개"
          className="w-full h-full object-contain max-w-screen-lg mx-auto"
        />

        {/* 중앙 검은색 반투명 사각형 및 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-6 bg-black bg-opacity-70 text-white rounded-lg text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              한 번 써보면 팬이 됩니다
            </h2>
            <p className="mb-6">재구매가 유독 많은 이유가 무엇일까요?</p>

            {/* 버튼 */}
            <Link
              to="/about"
              className="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              브랜드 스토리 보기
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AboutUs;
