// src/components/ReviewCard.js
import React from "react";

const ReviewCard = ({ reviewer, rating, comment, productImage }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <div className="w-24 h-24 mb-4">
        <img
          src={productImage}
          alt="Product"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{reviewer}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.21-6.042 5.978 1.426 8.307L12 17.666l-7.384 3.963 1.426-8.307-6.042-5.978 8.332-1.21z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 text-center">{comment}</p>
    </div>
  );
};

export default ReviewCard;
