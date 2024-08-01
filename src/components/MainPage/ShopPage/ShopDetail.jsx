import React from "react";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const ShopDetail = () => {
  // 상품 데이터
  const products = [
    {
      id: 1,
      image: "/images/products/product1.jpg",
      hoverImage: "/images/products/product1-hover.jpg", // 마우스 오버 시 보여줄 이미지 경로
      name: "스트랩",
      price: "100원",
      details: "국민스트랩! Double 논슬립 그립테크의 기술력",
      reviews: "120",
      link: "/product/1",
    },
    {
      id: 2,
      image: "/images/products/product2.jpg",
      hoverImage: "/images/products/product2-hover.jpg", // 마우스 오버 시 보여줄 이미지 경로
      name: "상품 이름 2",
      price: "100원",
      details: "상품 상세정보 2",
      reviews: "80",
      link: "/product/2",
    },
    {
      id: 3,
      image: "/images/products/product3.jpg",
      name: "상품 이름 3",
      price: "100원",
      details: "상품 상세정보 3",
      reviews: "150",
      link: "/product/3",
    },
    {
      id: 4,
      image: "/images/products/product4.jpg",
      name: "상품 이름 4",
      price: "100원",
      details: "상품 상세정보 4",
      reviews: "200",
      link: "/product/4",
    },
    {
      id: 5,
      image: "/images/products/product1.jpg",
      name: "상품 이름 1",
      price: "100원",
      details: "상품 상세정보 1",
      reviews: "120",
      link: "/product/1",
    },
    {
      id: 6,
      image: "/images/products/product2.jpg",
      name: "상품 이름 2",
      price: "100원",
      details: "상품 상세정보 2",
      reviews: "80",
      link: "/product/2",
    },
    {
      id: 7,
      image: "/images/products/product3.jpg",
      name: "상품 이름 3",
      price: "100원",
      details: "상품 상세정보 3",
      reviews: "150",
      link: "/product/3",
    },
    {
      id: 8,
      image: "/images/products/product4.jpg",
      name: "상품 이름 4",
      price: "100원",
      details: "상품 상세정보 4",
      reviews: "200",
      link: "/product/4",
    },
    {
      id: 1,
      image: "/images/products/product1.jpg",
      name: "상품 이름 1",
      price: "100원",
      details: "상품 상세정보 1",
      reviews: "120",
      link: "/product/1",
    },
    {
      id: 2,
      image: "/images/products/product2.jpg",
      name: "상품 이름 2",
      price: "100원",
      details: "상품 상세정보 2",
      reviews: "80",
      link: "/product/2",
    },
    {
      id: 3,
      image: "/images/products/product3.jpg",
      name: "상품 이름 3",
      price: "100원",
      details: "상품 상세정보 3",
      reviews: "150",
      link: "/product/3",
    },
    {
      id: 4,
      image: "/images/products/product4.jpg",
      name: "상품 이름 4",
      price: "100원",
      details: "상품 상세정보 4",
      reviews: "200",
      link: "/product/4",
    },
    {
      id: 5,
      image: "/images/products/product1.jpg",
      name: "상품 이름 1",
      price: "100원",
      details: "상품 상세정보 1",
      reviews: "120",
      link: "/product/1",
    },
    {
      id: 6,
      image: "/images/products/product2.jpg",
      name: "상품 이름 2",
      price: "100원",
      details: "상품 상세정보 2",
      reviews: "80",
      link: "/product/2",
    },
    {
      id: 7,
      image: "/images/products/product3.jpg",
      name: "상품 이름 3",
      price: "100원",
      details: "상품 상세정보 3",
      reviews: "150",
      link: "/product/3",
    },
    {
      id: 8,
      image: "/images/products/product4.jpg",
      name: "상품 이름 4",
      price: "100원",
      details: "상품 상세정보 4",
      reviews: "200",
      link: "/product/4",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      {/* 텍스트 섹션 */}
      <div className="mb-12">
        <h2 className="text-3xl text-center font-bold mb-4">모두 보기</h2>
        <p className="text-center">한번 써 보면 팬이 됩니다.</p>
        <p className="text-center">피트니스 용품의 기준을 통째로 바꾸다.</p>
      </div>
      <div>
        <p className="max-w-7xl mx-auto text-left text-gray-600 mt-4">
          모두보기 {products.length}
        </p>
      </div>

      {/* 상품 목록 섹션 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            state={{ product, initialImage: product.image }} // 상품 데이터를 state로 전달
          >
            <ProductItem
              image={product.image}
              hoverImage={product.hoverImage} // 마우스 오버 이미지 전달
              name={product.name}
              price={product.price}
              details={product.details}
              reviews={product.reviews}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopDetail;
