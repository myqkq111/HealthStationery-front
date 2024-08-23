import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({
  cate,
  color,
  size,
  content,
  score, // 이 부분은 실제 점수를 나타냅니다
  reviewerName,
  productImage,
  productName,
}) => {
  const firstImage = productImage.split(",")[0];
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 flex flex-col"
      style={{
        width: "300px", // 가로 크기 고정
        height: "500px", // 세로 크기 고정
        fontFamily: "monospace",
      }}
    >
      {/* 상품 이미지 */}
      <div
        className="flex justify-center"
        style={{
          height: "60%", // 이미지 영역을 전체 높이의 60%로 설정
        }}
      >
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center border-b border-gray-300"
          style={{
            backgroundImage: `url(/images/products/${cate}/${firstImage})`,
          }}
        ></div>
      </div>

      {/* 리뷰 내용 */}
      <div className="flex-1 flex flex-col text-left p-2">
        <p className="text-gray-700 mb-2 flex-1 overflow-hidden text-ellipsis">
          {content}
        </p>
        <p className="text-gray-700 mb-2 flex-1 overflow-hidden text-ellipsis">
          {color}ㆍ{size}
        </p>
        {/* 작성자 이름 */}
        <p className="text-gray-500 text-sm text-right mb-2">
          작성자: {reviewerName}
        </p>

        {/* 상품 이름 및 별점 */}
        <div className="text-center mb-2">
          <h3 className="text-lg font-bold">{productName}</h3>
          <div className="flex items-center justify-center mt-1">
            {[...Array(5)].map((_, index) => (
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
