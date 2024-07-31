// src/components/ImageGrid.jsx
import React, { useState } from "react";

const images = Array.from(
  { length: 25 },
  (_, index) => `/images/gallery/${index + 1}.jpg`
); // 25개의 이미지 경로 생성

const ImageGrid = () => {
  const [visibleImages] = useState(15); // 처음에는 16개의 이미지(4줄)만 보임

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-5 gap-4">
        {images.slice(0, visibleImages).map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
