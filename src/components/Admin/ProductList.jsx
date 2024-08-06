import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm"; // ProductForm 임포트
import axiosInstance from "../api/AxiosInstance";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState({});

  // 상품 목록을 가져오는 함수
  useEffect(() => {
    console.log(localStorage.getItem("member"));
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

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // 옵션 변경 핸들러
  const handleOptionChange = (productId, index) => {
    setSelectedOptionIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]: index,
    }));
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (productId) => {
    axiosInstance
      .delete(`/product/delete`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((error) => {
        console.error("Failed to delete product", error);
      });
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
                  const optionNames = product.strOptionName
                    ? product.strOptionName.split(",")
                    : [];
                  const optionValues = product.strOptionValue
                    ? product.strOptionValue.split("|")
                    : [];
                  const selectedOptionIndex =
                    selectedOptionIndexes[product.id] || -1;
                  const selectedOptionValue =
                    selectedOptionIndex >= 0
                      ? optionValues[selectedOptionIndex]
                      : "";

                  return (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.cate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.price}원
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.inven}개
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.content}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <select
                          onChange={(e) =>
                            handleOptionChange(product.id, e.target.value)
                          }
                          className="border rounded p-1"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            선택하세요
                          </option>
                          {optionNames.map((option, index) => (
                            <option key={index} value={index}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {selectedOptionValue}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
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
