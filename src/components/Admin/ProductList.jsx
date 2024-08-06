import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm"; // ProductForm 임포트
import axiosInstance from "../api/AxiosInstance";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [optionValues, setOptionValues] = useState({});

  const token = localStorage.getItem("token");

  // 상품 목록을 가져오는 함수
  useEffect(() => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {});
  }, []);
  // 상품 추가 또는 수정 후 업데이트
  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsFormOpen(false);
  };
  // 상품 추가 버튼 클릭 핸들러
  const handleAddProductClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };
  // 상품 수정 버튼 클릭 핸들러
  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
    if (product.optionNames && product.optionValues) {
      setOptionValues(product.optionValues);
      setSelectedOption(product.optionNames[0] || ""); // 기본적으로 첫 번째 옵션 선택
    }
  };
  // 상품 삭제 핸들러
  const handleDeleteProductClick = async (productId) => {
    try {
      await axiosInstance.delete(`/api/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("상품 삭제에 실패했습니다.", error);
    }
  };
  // 옵션 변경 핸들러
  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };
  // 옵션 데이터 구하기
  const getOptionValues = (optionName) => {
    return optionValues[optionName] || [];
  };
  return (
    <div className="p-6">
      <button
        onClick={handleAddProductClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        상품 추가
      </button>
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  상품명
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  재고
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  상품설명
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  옵션
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  옵션 값
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  // const optionNames = product.optionNames || [];
                  // const optionValues = product.optionValues || [];
                  return (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.cate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.inven}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.content}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <select
                          // value={selectedOption}
                          onChange={handleOptionChange}
                          className="border rounded p-1"
                        >
                          {product.strOptionName
                            .split(",")
                            .map((option, index) => (
                              <option key={index} value={index}>
                                {option}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {/* 이부분 해야함 */}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex space-x-2">
                        <button
                          onClick={() => handleEditProductClick(product)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteProductClick(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};
export default ProductList;
