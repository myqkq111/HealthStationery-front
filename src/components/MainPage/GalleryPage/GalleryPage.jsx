// src/pages/GalleryPage.jsx
import React, { useState } from "react";

// 이미지 및 URL 경로 (여기에 이미지를 추가해 주세요)
const images = [
  {
    src: "/images/gallery/1.jpg",
    url: "https://www.instagram.com/katarinabluu/",
  },
  {
    src: "/images/gallery/2.jpg",
    url: "https://www.instagram.com/dangerousmanleebyeonggeon/",
  },
  { src: "/images/gallery/3.jpg", url: "https://example.com/3" },
  // 나머지 이미지와 URL을 추가하세요
  { src: "/images/gallery/4.jpg", url: "https://example.com/4" },
  { src: "/images/gallery/5.jpg", url: "https://example.com/5" },
  { src: "/images/gallery/6.jpg", url: "https://example.com/6" },
  { src: "/images/gallery/7.jpg", url: "https://example.com/7" },
  { src: "/images/gallery/8.jpg", url: "https://example.com/8" },
  { src: "/images/gallery/9.jpg", url: "https://example.com/9" },
  { src: "/images/gallery/10.jpg", url: "https://example.com/10" },
  { src: "/images/gallery/11.jpg", url: "https://example.com/11" },
  { src: "/images/gallery/12.jpg", url: "https://example.com/12" },
  { src: "/images/gallery/13.jpg", url: "https://example.com/13" },
  { src: "/images/gallery/14.jpg", url: "https://example.com/14" },
  { src: "/images/gallery/15.jpg", url: "https://example.com/15" },
  { src: "/images/gallery/16.jpg", url: "https://example.com/16" },
  { src: "/images/gallery/17.jpg", url: "https://example.com/17" },
  { src: "/images/gallery/18.jpg", url: "https://example.com/18" },
  { src: "/images/gallery/19.jpg", url: "https://example.com/19" },
  { src: "/images/gallery/20.jpg", url: "https://example.com/20" },
  { src: "/images/gallery/21.jpg", url: "https://example.com/21" },
  { src: "/images/gallery/22.jpg", url: "https://example.com/22" },
  { src: "/images/gallery/23.jpg", url: "https://example.com/23" },
  { src: "/images/gallery/24.jpg", url: "https://example.com/24" },
  { src: "/images/gallery/25.jpg", url: "https://example.com/25" },
];

const GalleryPage = () => {
  const [visibleCount, setVisibleCount] = useState(10);

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
        <h2 className="text-3xl font-bold mb-8">이쁘다</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24 mx-auto" />
        </div>
      </div>

      {/* 그리드 컨테이너 */}
      <div className="grid grid-cols-5 gap-0 mt-8">
        {visibleImages.map((image, index) => (
          <a
            key={index}
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full h-full group"
          >
            <img
              src={image.src}
              alt={`Gallery item ${index + 1}`}
              className="object-cover w-full h-full group-hover:opacity-75 transition duration-300 ease-in-out"
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
