// src/components/ReviewCard.js
import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({
  reviewer,
  rating,
  comment,
  productImage,
  productName,
}) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full max-w-sm mx-auto border-dashed border-2 border-gray-300"
      style={{ padding: "1rem", fontFamily: "monospace" }}
    >
      <div className="text-center mb-4">
        <p className="text-gray-700 font-bold">Review</p>
      </div>
      <div className="mb-4 flex justify-center">
        <div
          className="w-32 h-32 bg-cover bg-center border border-gray-300"
          style={{ backgroundImage: `url(${productImage})` }}
        ></div>
      </div>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold">{productName}</h3>
      </div>
      <div className="p-4 flex-1 flex flex-col text-left">
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((star, index) => (
            <FaStar
              key={index}
              className={index < rating ? "text-yellow-500" : "text-gray-300"}
            />
          ))}
        </div>
        <p className="text-gray-700 mb-4">{comment}</p>
        <p className="text-gray-500 text-sm text-right">작성자: {reviewer}</p>
      </div>
      <div className="mt-4 text-center">
        <div
          className="w-32 h-8 mx-auto"
          style={{
            backgroundImage: "url(/images/Card/barcode.jpg)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ReviewCard;
