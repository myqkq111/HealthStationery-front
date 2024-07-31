import React from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams(); // URL 파라미터에서 id 가져오기

  // 여기에 상품 상세 정보를 불러오고 표시하는 로직을 추가합니다.

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      <h1 className="text-3xl font-bold">상품 상세 페이지</h1>
      <p>상품 ID: {id}</p>
      {/* 상세 정보, 리뷰 등 추가 내용 표시 */}
    </div>
  );
};

export default ProductPage;
