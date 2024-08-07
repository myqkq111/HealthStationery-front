import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ product, onClose, onProductUpdated }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    cate: "",
    name: "",
    price: "",
    inven: "",
    image: [],
    content: "",
    contentImage: [],
    optionName: [], // 배열로 초기화
    optionValue: [], // 배열로 초기화
  });
  const [sizeOptions, setSizeOptions] = useState([]); // 사이즈 옵션 배열
  const [colorOptions, setColorOptions] = useState([]); // 색상 옵션 배열
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (product) {
      setFormData({
        cate: product.cate || "",
        name: product.name || "",
        price: product.price || "",
        inven: product.inven || "",
        image: product.image || [],
        content: product.content || "",
        contentImage: product.contentImage || [],
        optionName: product.optionName || [],
        optionValue: product.optionValue || [],
      });

      // 옵션 이름과 값이 있을 때만 처리
      if (product.strOptionName && product.strOptionValue) {
        const optionNames = product.strOptionName.split(",");
        const optionValues = product.strOptionValue.split("|");

        const sizeIndex = optionNames.indexOf("size");
        if (sizeIndex !== -1) {
          setSizeOptions(optionValues[sizeIndex].split("|"));
        }

        const colorIndex = optionNames.indexOf("color");
        if (colorIndex !== -1) {
          setColorOptions(optionValues[colorIndex].split("|"));
        }
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" || name === "contentImage") {
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

  const handleAddOption = () => {
    const { optionName, optionValue } = formData;

    // 입력값이 한글, 영어 문자, 숫자, ,만 포함되는지 확인
    if (/^[\uac00-\ud7afa-zA-Z0-9,]+$/.test(optionValue)) {
      if (optionName) {
        if (optionName === "size") {
          // 사이즈 옵션 업데이트
          setSizeOptions([optionValue]);
        } else if (optionName === "color") {
          // 색상 옵션 업데이트
          setColorOptions([optionValue]);
        }
        // 입력값 초기화
        setFormData((prevData) => ({
          ...prevData,
          optionValue: "",
        }));
      }
    } else {
      alert("옵션 값은 한글, 영어 문자, 숫자 및 ,만 포함될 수 있습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("cate", formData.cate);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("inven", formData.inven);
    data.append("content", formData.content);

    if (sizeOptions.length > 0) {
      data.append("optionName", "size");
      data.append("optionValue", sizeOptions.join(","));
    }
    if (colorOptions.length > 0) {
      data.append("optionName", "color");
      data.append("optionValue", colorOptions.join(","));
    }

    Array.from(formData.image).forEach((file) => data.append("image", file));
    Array.from(formData.contentImage).forEach((file) =>
      data.append("contentImage", file)
    );

    const url = product
      ? `http://localhost:8080/product/update/${product.id}` // 상품 아이디를 URL에 포함시킴
      : "http://localhost:8080/product/insert";

    const headers = {
      "Content-Type": "multipart/form-data",
      ...(product && { Authorization: `Bearer ${token}` }), // 상품이 있을 때만 Authorization 헤더 추가
    };

    const request = product
      ? axios.put(url, data, { headers }) // 수정 요청
      : axios.post(url, data, { headers }); // 추가 요청

    request
      .then((response) => {
        onProductUpdated();
      })
      .catch((error) => {
        console.error("Failed to save product", error);
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
              <option value="그립/스트랩">그립/스트랩</option>
              <option value="손목">손목</option>
              <option value="팔꿈치">팔꿈치</option>
              <option value="무릎">무릎</option>
              <option value="팔">팔</option>
              <option value="등/허리">등/허리</option>
              <option value="파워리프팅/스트렝스">파워리프팅/스트렝스</option>
              <option value="기타운동장비">기타운동장비</option>
              <option value="의류">의류</option>
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
          <div className="mb-4">
            <label
              htmlFor="inven"
              className="block text-sm font-medium text-gray-700"
            >
              재고
            </label>
            <input
              id="inven"
              name="inven"
              type="number"
              value={formData.inven}
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
          <div className="mb-4">
            <label
              htmlFor="optionName"
              className="block text-sm font-medium text-gray-700"
            >
              상품 옵션 이름
            </label>
            <select
              id="optionName"
              name="optionName"
              value={formData.optionName}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  optionName: e.target.value,
                  optionValue: "", // 옵션 이름 변경 시 입력값 초기화
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">옵션 선택</option>
              <option value="size">Size</option>
              <option value="color">Color</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="optionValue"
              className="block text-sm font-medium text-gray-700"
            >
              상품 옵션 값
            </label>
            <input
              id="optionValue"
              name="optionValue"
              type="text"
              value={formData.optionValue}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                formData.optionName === "size"
                  ? "사이즈 입력 (예: S,M,L)"
                  : formData.optionName === "color"
                  ? "색상 입력 (예: 블루,검정,흰색)"
                  : "옵션 값을 입력해주세요"
              }
              disabled={!formData.optionName} // 옵션 이름이 선택되지 않으면 비활성화
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!formData.optionValue || !formData.optionName}
            >
              추가
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              사이즈
            </label>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {sizeOptions.length > 0 ? (
                sizeOptions.map((size, index) => <li key={index}>{size}</li>)
              ) : (
                <li className="text-gray-500">등록된 사이즈가 없습니다.</li>
              )}
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              색상
            </label>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {colorOptions.length > 0 ? (
                colorOptions.map((color, index) => <li key={index}>{color}</li>)
              ) : (
                <li className="text-gray-500">등록된 색상이 없습니다.</li>
              )}
            </ul>
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
              disabled={isSubmitting}
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
