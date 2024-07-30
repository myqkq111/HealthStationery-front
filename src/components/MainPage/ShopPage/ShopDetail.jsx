import React from "react";
import ProductItem from "./ProductItem";

const ShopDetail = () => {
  // 상품 데이터
  const products = [
    {
      id: 1,
      image: "/images/products/product1.jpg",
      name: "상품 이름 1",
      price: "$29.99",
      details: "상품 상세정보 1",
      reviews: "120",
      link: "/product/1", // 링크 추가
    },
    {
      id: 2,
      image: "/images/products/product2.jpg",
      name: "상품 이름 2",
      price: "$39.99",
      details: "상품 상세정보 2",
      reviews: "80",
      link: "/product/2", // 링크 추가
    },
    {
      id: 3,
      image: "/images/products/product3.jpg",
      name: "상품 이름 3",
      price: "$49.99",
      details: "상품 상세정보 3",
      reviews: "150",
      link: "/product/3", // 링크 추가
    },
    {
      id: 4,
      image: "/images/products/product4.jpg",
      name: "상품 이름 4",
      price: "$59.99",
      details: "상품 상세정보 4",
      reviews: "200",
      link: "/product/4", // 링크 추가
    },
  ];

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      {/* 텍스트 섹션 */}
      <div className="mb-8">
        <h2 className="text-3xl text-center font-bold mb-4">모두 보기</h2>
        <p className="text-center">한번 써 보면 팬이 됩니다.</p>
        <p className="text-center">피트니스 용품의 기준을 통째로 바꾸다.</p>
      </div>

      {/* 상품 목록 섹션 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            details={product.details}
            reviews={product.reviews}
            link={product.link} // 링크 전달
          />
        ))}
      </div>
    </div>
  );
};

export default ShopDetail;
