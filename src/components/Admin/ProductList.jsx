import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    cate: "", // 카테고리
    name: "", // 상품명
    price: "", // 가격
    image: [], // 이미지 파일 이름
    content: "", // 상품 설명
    contentImage: [], // 설명 이미지 파일 이름
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태

  useEffect(() => {
    if (product) {
      setFormData({
        cate: product.cate || "",
        name: product.name || "",
        price: product.price || "",
        image: product.image || [], // 이미지 파일 이름들
        content: product.content || "",
        contentImage: product.contentImage || [], // 설명 이미지 파일 이름들
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" || name === "contentImage") {
      // 파일 선택 시, 파일 이름만 추출하여 상태에 저장
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? Array.from(files).map((file) => file.name) : [],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 제출 상태 활성화

    const data = new FormData();
    data.append("cate", formData.cate);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("content", formData.content);

    // 이미지 이름을 JSON 문자열로 변환하여 서버로 전송
    data.append("image", JSON.stringify(formData.image));
    data.append("contentImage", JSON.stringify(formData.contentImage));

    try {
      if (product) {
        const response = await axios.put(`/api/products/${product.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (typeof onProductUpdated === "function") {
          onProductUpdated(response.data);
        } else {
          console.error("onProductUpdated is not a function");
        }
      } else {
        const response = await axios.post(
          "http://localhost:8080/product/insert",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (typeof onProductUpdated === "function") {
          onProductUpdated(response.data);
        } else {
          console.error("onProductUpdated is not a function");
        }
      }
      onClose(); // 폼 닫기
    } catch (error) {
      console.error("Failed to save product", error); // 오류 처리
    } finally {
      setIsSubmitting(false); // 제출 상태 비활성화
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {product ? "상품 수정" : "상품 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="cate"
              className="block text-sm font-medium text-gray-700"
            >
              카테고리
            </label>
            <input
              id="cate"
              name="cate"
              type="text"
              value={formData.cate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              상품명
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              가격
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              이미지 파일 (여러 개 선택 가능)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              multiple
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              상품 설명
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contentImage"
              className="block text-sm font-medium text-gray-700"
            >
              설명 이미지 파일 (여러 개 선택 가능)
            </label>
            <input
              id="contentImage"
              name="contentImage"
              type="file"
              multiple
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isSubmitting} // 제출 중일 때 버튼 비활성화
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductList;
