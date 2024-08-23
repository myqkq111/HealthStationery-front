import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import axiosInstance from "../api/AxiosInstance";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [categories, setCategories] = useState([]); // 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리

  const getStock = (productId, color, size) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return "재고 없음";
    const stockItem = product.list.find(
      (item) => item.color === color && item.size === size
    );
    return stockItem ? stockItem.stock : "재고 없음";
  };

  useEffect(() => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        const data = response.data;
        setProducts(data);
        const allCategories = [...new Set(data.map((product) => product.cate))];
        setCategories(allCategories);
      })
      .catch(() => {});
  }, []);

  // 페이지네이션 및 필터링 로직
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  const filteredProducts = products
    .filter((product) =>
      showOutOfStock
        ? product.list.some(
            (item) => getStock(product.id, item.color, item.size) === 0
          )
        : true
    )
    .filter((product) =>
      selectedCategory ? product.cate === selectedCategory : true
    );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleProductUpdated = () => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setProducts(response.data);
        setCurrentPage(1); // 업데이트 후 페이지네이션을 첫 페이지로 리셋
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

  const handleColorChange = (e, productId) => {
    const color = e.target.value;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: { ...prevOptions[productId], color, size: "" }, // 사이즈를 초기화
    }));
  };

  const handleSizeChange = (e, productId) => {
    const size = e.target.value;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: { ...prevOptions[productId], size },
    }));
  };

  useEffect(() => {
    document.body.style.overflow = isFormOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormOpen]);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={handleAddProductClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
        >
          상품 추가
        </button>
        <button
          onClick={() => {
            setShowOutOfStock(!showOutOfStock);
            setCurrentPage(1); // 품절 상태 변경 시 페이지를 첫 페이지로 리셋
          }}
          className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
            showOutOfStock ? "bg-red-700" : "bg-red-500"
          }`}
        >
          {showOutOfStock ? "모든 상품 보기" : "품절 상품 보기"}
        </button>
        <select
          className="ml-4 border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // 카테고리 변경 시 페이지를 첫 페이지로 리셋
          }}
        >
          <option value="">모든 카테고리</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
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
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-48">
                  상품설명
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-32">
                  Color
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-24">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-center text-sm font-medium text-gray-700 whitespace-nowrap w-24">
                  재고
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
                currentProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    {showOutOfStock &&
                    product.list.some(
                      (item) =>
                        getStock(product.id, item.color, item.size) === 0
                    ) ? (
                      product.list
                        .filter(
                          (item) =>
                            getStock(product.id, item.color, item.size) === 0
                        )
                        .map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
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
                              {product.content}
                            </td>
                            <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                              {item.color}
                            </td>
                            <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                              {item.size}
                            </td>
                            <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap min-w-[150px] max-w-[200px] overflow-hidden text-ellipsis">
                              {item.stock} (재고 없음)
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
                        ))
                    ) : (
                      <tr className="border-b border-gray-200">
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
                          {product.content}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                          <select
                            className="w-full border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedOptions[product.id]?.color || ""}
                            onChange={(e) => handleColorChange(e, product.id)}
                          >
                            <option value="">선택</option>
                            {[
                              ...new Set(
                                product.list.map((item) => item.color)
                              ),
                            ].map((color, index) => (
                              <option key={index} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                          <select
                            className="w-full border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedOptions[product.id]?.size || ""}
                            onChange={(e) => handleSizeChange(e, product.id)}
                            disabled={!selectedOptions[product.id]?.color} // 컬러가 선택되지 않았으면 사이즈 선택 비활성화
                          >
                            <option value="">선택</option>
                            {[
                              ...new Set(
                                product.list
                                  .filter(
                                    (item) =>
                                      item.color ===
                                      selectedOptions[product.id]?.color
                                  )
                                  .map((item) => item.size)
                              ),
                            ].map((size, index) => (
                              <option key={index} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap min-w-[150px] max-w-[200px] overflow-hidden text-ellipsis">
                          {getStock(
                            product.id,
                            selectedOptions[product.id]?.color || "",
                            selectedOptions[product.id]?.size || ""
                          )}
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
                    )}
                  </React.Fragment>
                ))
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
