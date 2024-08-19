// ShopDetail.js

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
        .get(`/product/selectCate?cate=${category}`)
        .then((response) => {
          console.log(response.data);
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
        return "모두보기";
      case "tops":
        return "상의";
      case "bottoms":
        return "하의";
      case "other-clothing":
        return "기타 의류";
      default:
        return category;
    }
  };

  const getCategoryMent = (category) => {
    switch (category) {
      case "gripps":
        return ["궁극을 넘어선 완벽한 그립력"];
      case "wrist":
        return ["퍼포먼스 향상을 위한 비교 불가 압박력"];
      case "elbows":
        return ["퍼포먼스 향상을 위한 비교 불가 압박력"];
      case "knees":
        return ["퍼포먼스 향상을 위한 비교 불가 압박력"];
      case "arms":
        return [
          "당신의 볼륨감 있는 팔을 위하여,",
          "팔운동과 팔 노동, 그 한 끝 차이",
        ];
      case "back":
        return ["허리 내부 구조에 특화된 패턴, 코어 보호란 이런 것"];
      case "powerlifting":
        return ["All about 파워리프팅 & 스트렝스 훈련 에센셜"];
      case "workoutgear":
        return ["당신의 워크아웃을", "한단계 업그레이드 시켜줄 피트니스 용품"];
      case "clothing":
        return ["편안함과 기능성을 동시에 만족시켜주는 GYM WEAR"];
      case "tops":
        return ["운동과 일상에서 모두 활용 가능한 편안한 상의."];
      case "bottoms":
        return ["최고의 활동성을 보장하는 기능성 하의."];
      case "other-clothing":
        return ["운동을 더욱 즐겁게 만드는 다양한 의류 아이템."];
      default:
        return [
          "피트니스 용품의 기준을 통째로 바꾸다.",
          "한번 써 보면 팬이 됩니다.",
        ];
    }
  };

  const categoryText = getCategoryText(category);
  const [ment1, ment2] = getCategoryMent(category);

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      {/* 텍스트 섹션 */}
      <div className="mb-12">
        <h2 className="text-3xl text-center font-bold mb-4">{categoryText}</h2>
        <p className="text-center font-bold">{ment1}</p>
        <p className="text-center font-bold">{ment2}</p>
      </div>
      <div>
        <p className="max-w-7xl mx-auto text-left text-gray-600 mt-4">
          {categoryText} {products.length}
        </p>
      </div>
      {/* 상품 목록 섹션 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => {
            const isSoldOut = product.list.every((item) => item.stock === 0); // 모든 옵션의 재고가 0인지 확인
            return (
              <ProductItem
                key={product.id}
                cate={product.cate}
                name={product.name}
                price={product.price}
                image={product.strImage}
                content={product.content}
                isSoldOut={isSoldOut} // 품절 여부 전달
                link={`/product/${product.id}`}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-600">상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
