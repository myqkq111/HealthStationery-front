// src/components/Admin/ProductForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ product, onClose, onProductUpdated }) => {
  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? product.price : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = { name, price };

    try {
      if (product) {
        // Update product
        const response = await axios.put(
          `/api/products/${product.id}`,
          productData
        );
        onProductUpdated(response.data);
      } else {
        // Add new product
        const response = await axios.post("/api/products", productData);
        onProductUpdated(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {product ? "상품 수정" : "상품 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">상품명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">가격</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
