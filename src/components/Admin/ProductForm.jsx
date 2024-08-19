import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ product, onClose, onProductUpdated }) => {
  const token = localStorage.getItem("token");

  const defaultImageArray = (str) => (str ? str.split(",") : []);

  const [formData, setFormData] = useState({
    cate: "",
    name: "",
    price: "",
    image: [],
    content: "",
    contentImage: [],
    color: "", // 색상
    size: "", // 사이즈
    sizeStock: [], // 사이즈와 색상에 대한 재고
    stock: "", // 재고 수량
  });
  const [editingStockIndex, setEditingStockIndex] = useState(null); // 수정할 재고 인덱스
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        cate: product.cate || "",
        name: product.name || "",
        price: product.price || "",
        image: defaultImageArray(product.strImage),
        content: product.content || "",
        contentImage: defaultImageArray(product.strContentImage), // 문자열을 배열로 변환
        sizeStock: product.list || [],
        color: "",
        size: "",
        stock: "",
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        sizeStock: [], // 추가 시 재고 리스트를 빈 배열로 초기화합니다.
      }));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" || name === "contentImage") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? Array.from(files).map((file) => file.name) : [],
        // [name]: files ? Array.from(files) : [],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const isDuplicateStock = (color, size) => {
    return formData.sizeStock.some(
      (item) => item.color === color && item.size === size
    );
  };

  const handleAddStock = () => {
    const { color, size, stock } = formData;
    if (color && size && stock) {
      if (isDuplicateStock(color, size)) {
        alert("이미 등록된 색상과 사이즈의 재고가 있습니다.");
      } else {
        setFormData((prevData) => ({
          ...prevData,
          sizeStock: [
            ...prevData.sizeStock,
            { color, size, stock: parseInt(stock, 10) }, // 객체로 저장
          ],
          color: "",
          size: "",
          stock: "",
        }));
      }
    } else {
      alert("색상, 사이즈, 재고를 모두 입력해 주세요.");
    }
  };

  const handleRemoveStock = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      sizeStock: prevData.sizeStock.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateStock = () => {
    const { color, size, stock } = formData;
    if (color && size && stock !== "") {
      setFormData((prevData) => {
        const updatedSizeStock = [...prevData.sizeStock];
        updatedSizeStock[editingStockIndex] = {
          color,
          size,
          stock: parseInt(stock, 10),
        }; // 객체로 업데이트
        return {
          ...prevData,
          sizeStock: updatedSizeStock,
          color: "",
          size: "",
          stock: "",
        };
      });
      setEditingStockIndex(null);
    } else {
      alert("색상, 사이즈, 재고를 모두 입력해 주세요.");
    }
  };

  const handleEditStock = (index) => {
    const { color, size, stock } = formData.sizeStock[index];
    setFormData((prevData) => ({
      ...prevData,
      color,
      size,
      stock,
    }));
    setEditingStockIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("cate", formData.cate);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("content", formData.content);
    data.append("sizeStock", JSON.stringify(formData.sizeStock));
    Array.from(formData.image).forEach((file) => data.append("image", file));
    Array.from(formData.contentImage).forEach((file) =>
      data.append("contentImage", file)
    );

    // FormData의 항목 출력
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    const url = product
      ? `http://localhost:8080/product/update/${product.id}` // 수정 요청 시 URL
      : "http://localhost:8080/product/insert"; // 추가 요청 시 URL

    console.log("URL:", url); // URL 확인
    console.log("FormData:", Array.from(data.entries())); // FormData 확인

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }
    const request = product
      ? axios.put(url, data, { headers }) // 수정 요청
      : axios.post(url, data, { headers }); // 추가 요청
    request
      .then((response) => {
        onProductUpdated();
      })
      .catch((error) => {
        console.error(
          "상품 저장에 실패했습니다.",
          error.response ? error.response.data : error.message
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {product ? "상품 수정" : "상품 추가"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 카테고리, 상품명, 가격, 이미지, 설명, 설명 이미지 */}
          <div className="mb-4">
            <label
              htmlFor="cate"
              className="block text-sm font-medium text-gray-700"
            >
              카테고리
            </label>
            <select
              id="cate"
              name="cate"
              value={formData.cate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">카테고리 선택</option>
              <option value="gripps">그립/스트랩</option>
              <option value="wrist">손목</option>
              <option value="elbows">팔꿈치</option>
              <option value="knees">무릎</option>
              <option value="arms">팔</option>
              <option value="back">등/허리</option>
              <option value="powerlifting">파워리프팅/스트렝스</option>
              <option value="workoutgear">기타운동장비</option>
              <option value="tops">상의</option>
              <option value="bottoms">하의</option>
              <option value="other-clothing">기타 의류</option>
            </select>
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
          <div className="space-y-6">
            {/* 이미지 파일 업로드 */}
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
              {formData.image.length > 0 && (
                <div className="mt-2">
                  <strong className="block text-sm font-medium text-gray-700">
                    현재 이미지:
                  </strong>
                  <ul className="list-disc list-inside mt-1">
                    {formData.image.map((fileName, index) => (
                      <li key={index} className="text-gray-800">
                        {fileName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                설명
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
              {formData.contentImage.length > 0 && (
                <div className="mt-2">
                  <strong className="block text-sm font-medium text-gray-700">
                    현재 설명 이미지:
                  </strong>
                  <ul className="list-disc list-inside mt-1">
                    {formData.contentImage.map((fileName, index) => (
                      <li key={index} className="text-gray-800">
                        {fileName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* 색상, 사이즈, 재고 추가 */}
          <div className="mb-4">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              색상
            </label>
            <input
              id="color"
              name="color"
              type="text"
              value={formData.color}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-700"
            >
              사이즈
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">사이즈 선택</option>
              <option value=" ">없음</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              재고
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {editingStockIndex !== null ? (
              <button
                type="button"
                onClick={handleUpdateStock}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                업데이트
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddStock}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
            )}
          </div>
          {/* 등록된 재고 목록 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              등록된 재고
            </label>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {formData.sizeStock.length > 0 ? (
                formData.sizeStock.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {`${item.color}, ${item.size}, ${item.stock}`}{" "}
                    {/* 문자열로 렌더링 */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditStock(index)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStock(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li>등록된 재고가 없습니다.</li>
              )}
            </ul>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
