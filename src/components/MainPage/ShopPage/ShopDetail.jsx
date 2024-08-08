import React, { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
const ShopDetail = () => {
  const [products, setProducts] = useState([]);
  const { category } = useParams(); // URL 파라미터로 카테고리 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      axiosInstance
        .get(
          category === "shop"
            ? "/product/selectAll"
            : `/product/selectCate?cate=${category}`
        )
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
        });
    };
    fetchProducts();
  }, [category]); // 카테고리가 변경될 때마다 요청

  const getCategoryText = (category) => {
    switch (category) {
      case "shop":
        return "모두보기";
      case "gripps":
        return "그립/스트랩";
      case "wrist":
        return "손목";
      case "elbows":
        return "팔꿈치";
      case "knees":
        return "무릎";
      case "arms":
        return "팔";
      case "back":
        return "등/허리";
      case "powerlifting":
        return "파워리프팅/스트렝스";
      case "workoutgear":
        return "기타운동장비";
      case "clothing":
        return "의류";
      default:
        return category;
    }
  };
  // 사용 예시
  const categoryText = getCategoryText(category);

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      {/* 텍스트 섹션 */}
      <div className="mb-12">
        <h2 className="text-3xl text-center font-bold mb-4">{categoryText}</h2>
        <p className="text-center">한번 써 보면 팬이 됩니다.</p>
        <p className="text-center">피트니스 용품의 기준을 통째로 바꾸다.</p>
      </div>
      <div>
        <p className="max-w-7xl mx-auto text-left text-gray-600 mt-4">
          {categoryText} {products.length}
        </p>
      </div>
      {/* 상품 목록 섹션 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductItem
              key={product.id}
              cate={product.cate}
              name={product.name}
              price={product.price}
              image={product.strImage}
              content={product.content}
              inven={product.inven}
              link={`/product/${product.id}`}
            />
          ))
        ) : (
          <p className="text-center text-gray-600">상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
export default ShopDetail;
