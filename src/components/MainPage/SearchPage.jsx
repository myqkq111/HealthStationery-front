import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductItem from "./ShopPage/ProductItem";
import axiosInstance from "../api/AxiosInstance";

const SearchPage = () => {
  const [products, setProducts] = useState([]); // 전체 상품 목록
  const [visibleProducts, setVisibleProducts] = useState([]); // 화면에 표시되는 상품 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 쿼리 파라미터 가져오기
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query");

  useEffect(() => {
    if (query) {
      setLoading(true);
      axiosInstance
        .get("/product/search", { params: { keyword: query } })
        .then((response) => {
          const fetchedProducts = response.data;
          setProducts(fetchedProducts);
          setVisibleProducts(fetchedProducts);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message || "검색 요청 실패");
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-8">
          "{query}" 관련 상품
        </h1>
        {/* 상품 목록 섹션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <ProductItem
                  cate={product.cate}
                  name={product.name}
                  price={product.price}
                  image={product.strImage}
                  content={product.content}
                  link={`/product/${product.id}`}
                  like={product.like}
                  view={product.view}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-xl">
              상품이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
