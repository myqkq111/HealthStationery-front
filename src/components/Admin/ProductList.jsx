import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm"; // ProductForm 임포트
import axiosInstance from "../api/AxiosInstance";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 상품 목록을 가져오는 함수
  useEffect(() => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {});
  }, []);

  // 페이지네이션에 필요한 데이터 추출
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // 상품 추가 또는 수정 후 업데이트
  const handleProductUpdated = () => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {});
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
      .delete(`/product/delete/${productId}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((error) => {
        console.error("Failed to delete product", error);
      });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 스크롤 제어 함수
  useEffect(() => {
    document.body.style.overflow = isFormOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isFormOpen]);

  // 페이지네이션 버튼 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6 ">
      <button
        onClick={handleAddProductClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        상품 추가
      </button>
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border  border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b  border-gray-200 ">
              <tr>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  상품명
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  카테고리
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  가격
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  재고
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  상품설명
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  옵션
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  옵션 값
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => {
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
                      <td className="px-4 py-4 text-sm text-center text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900">
                        {product.cate}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">
                        {product.price}원
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900">
                        {product.inven}개
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900">
                        {product.content}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900">
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
                      <td className="px-4 py-4 w-48 text-sm text-center text-gray-900">
                        {selectedOptionValue}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-500  hover:text-blue-700 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-500  hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex flex-wrap gap-2">
              {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 border rounded ${
                      number === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    }`}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
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
