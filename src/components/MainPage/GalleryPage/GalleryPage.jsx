// src/pages/GalleryPage.jsx
import React, { useState } from "react";

const GalleryPage = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const commonLink = "https://www.instagram.com/p/C-RDju9xFoR/?img_index=1"; // 모든 이미지가 연결될 링크

  // 이미지 배열 생성: 1.jpg부터 25.jpg까지
  const images = Array.from({ length: 25 }, (_, index) => ({
    src: `https://project-image.s3.ap-northeast-2.amazonaws.com/Gallery/${
      index + 1
    }.jpg`, // 1부터 25까지의 숫자로 이미지 경로 생성
  }));

  // 보이는 이미지 수 결정
  const visibleImages = images.slice(0, visibleCount);

  // 더보기 버튼의 가시성 결정
  const showLoadMoreButton = visibleCount < images.length;

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => {
      // 다음에 보여줄 이미지 수 결정 (최대 10개씩 추가)
      const nextCount = Math.min(prevCount + 10, images.length);
      return nextCount;
    });
  };

  return (
    <div className="relative py-8 px-8 bg-white min-h-screen max-w-screen-xl mx-auto">
      {/* 상단 텍스트 및 수평선 */}
      <div className="text-center p-4 bg-white text-black z-10">
        <h2 className="text-3xl font-bold mb-8">헬스문방구 IS EVERYWHERE</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24 mx-auto" />
        </div>
      </div>

      {/* 그리드 컨테이너 */}
      <div className="grid grid-cols-5 gap-0 mt-8">
        {visibleImages.map((image, index) => (
          <a
            key={index}
            href={commonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-50 h-60 group"
          >
            <img
              src={image.src}
              alt={`Gallery item ${index + 1}`}
              className="object-cover w-full h-60 group-hover:opacity-75 transition duration-300 ease-in-out"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition duration-300 ease-in-out"></div>
          </a>
        ))}
      </div>

      {/* 버튼들 */}
      {showLoadMoreButton && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-white border-2 border-black text-black rounded-full hover:bg-gray-200 transition-shadow shadow-md hover:shadow-lg"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
