import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({
  content,
  score,
  reviewerName,
  productImage,
  productName,
}) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 flex flex-col"
      style={{
        minHeight: "400px",
        maxWidth: "300px",
        padding: "1rem",
        fontFamily: "monospace",
      }}
    >
      {/* 상품 이미지 */}
      <div className="mb-4 flex justify-center">
        <div
          className="w-full h-40 bg-cover bg-center border border-gray-300"
          style={{ backgroundImage: `url(${productImage})` }}
        ></div>
      </div>

      {/* 리뷰 내용 */}
      <div className="flex-1 flex flex-col text-left">
        <p className="text-gray-700 mb-4 flex-1">{content}</p>

        {/* 작성자 이름 */}
        <p className="text-gray-500 text-sm text-right mb-4">
          작성자: {reviewerName}
        </p>

        {/* 상품 이름 및 별점 */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">{productName}</h3>
          <div className="flex items-center justify-center">
            {[...Array(5)].map((star, index) => (
              <FaStar
                key={index}
                className={index < score ? "text-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
