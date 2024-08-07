import React, { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
const ShopDetail = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // 데이터 가져오기
    axiosInstance
      .get("/product/selectAll") // API 엔드포인트는 실제 사용하시는 것으로 수정하세요
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
    console.log(products);
  }, []);
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
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              state={{ product, initialImage: product.image }} // 상품 데이터를 state로 전달
            >
              <ProductItem
                cate={product.cate}
                name={product.name}
                price={product.price}
                image={product.strImage}
                content={product.content}
                inven={product.inven}
                link={`/product/${product.id}`}
              />
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600">상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
export default ShopDetail;
