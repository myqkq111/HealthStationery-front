import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import axiosInstance from "../api/AxiosInstance";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {});
  }, []);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleProductUpdated = () => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {});
    setIsFormOpen(false);
  };

  const handleAddProductClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleOptionChange = (productId, index) => {
    setSelectedOptionIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]: index,
    }));
  };

  const handleDeleteClick = (productId) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
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
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    document.body.style.overflow = isFormOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormOpen]);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

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
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
                  상품명
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
                  카테고리
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
                  가격
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
                  재고
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-48">
                  상품설명
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
                  옵션
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap min-w-[150px] max-w-[200px]">
                  옵션 값
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
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
                      <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                        {product.cate}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                        {product.price}원
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                        {product.inven}개
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                        {product.content}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
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
                      <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap min-w-[150px] max-w-[200px] overflow-hidden text-ellipsis">
                        <Tooltip title={selectedOptionValue} placement="top">
                          <span>{selectedOptionValue}</span>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-500 hover:text-red-700"
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
