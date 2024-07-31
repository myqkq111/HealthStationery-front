import React from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams(); // URL 파라미터에서 id 가져오기

  // 예제 데이터 (실제로는 API 호출을 통해 데이터 가져옴)
  const product = {
    image: "/images/products/product1.jpg",
    name: "상품 이름",
    price: "100원",
    details:
      "상품 상세정보는 여기에 표시됩니다. 이 부분에는 상품의 자세한 설명이 들어갑니다. 예를 들어, 상품의 기능, 소재, 사용 방법 등을 기술할 수 있습니다.",
    reviews: "150",
    additionalInfo: "여기에 추가 정보나 특장점 등을 넣을 수 있습니다.",
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* 상품 이미지 및 정보 */}
        <div className="flex flex-col md:flex-row">
          {/* 상품 이미지 */}
          <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-sm rounded-lg shadow-md"
            />
          </div>

          {/* 상품 정보 */}
          <div className="md:w-1/2 md:pl-6">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              {product.price}
            </p>
            <p className="text-gray-700 mb-4">{product.details}</p>
            <p className="text-sm text-gray-600 mb-4">
              리뷰: {product.reviews}개
            </p>
            <div className="flex items-center mb-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                onClick={() => alert("장바구니에 추가되었습니다!")}
              >
                장바구니에 추가
              </button>
            </div>
            <p className="text-gray-600">{product.additionalInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
