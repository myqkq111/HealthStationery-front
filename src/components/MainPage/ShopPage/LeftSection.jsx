import React, { useState, useEffect } from "react";
import Address from "../../../openApi/Address";
import { useNavigate } from "react-router-dom";

const LeftSection = ({ product, user, setOrderInfo, setRequest, request }) => {
  const { id, name, email, tell, roadaddr, detailaddr, mailaddr } = user || {};
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editName, setEditName] = useState(name); // 편집할 이름
  const [editTell, setEditTell] = useState(tell); // 편집할 전화번호
  const [editMailaddr, setEditMailaddr] = useState(mailaddr); // 편집할 이메일 주소
  const [editRoadaddr, setEditRoadaddr] = useState(roadaddr); // 편집할 도로 주소
  const [editDetailaddr, setEditDetailaddr] = useState(detailaddr); // 편집할 상세 주소
  const [activeTab, setActiveTab] = useState("existing"); // 현재 활성 탭
  const [customRequest, setCustomRequest] = useState(""); // 사용자 요청 메시지

  const navigate = useNavigate();

  useEffect(() => {
    if (request === "custom") {
      setCustomRequest(customRequest); // request가 'custom'일 때 customRequest를 설정합니다.
    }
  }, [request]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    const updatedDeliveryInfo = {
      id: id,
      name: editName,
      email: email,
      tell: editTell,
      mailaddr: editMailaddr,
      roadaddr: editRoadaddr,
      detailaddr: editDetailaddr,
      request: request === "custom" ? customRequest : request, // 요청 메시지 설정
    };
    console.log("저장할 주문 정보:", updatedDeliveryInfo); // 콘솔에 출력
    setOrderInfo(updatedDeliveryInfo); // 주문 정보 업데이트
    toggleEdit();
  };

  const handleRequestChange = (event) => {
    const value = event.target.value;
    setRequest(value); // request 상태 업데이트
    if (value !== "custom") {
      setCustomRequest(""); // 'custom'이 아닌 경우 customRequest를 비웁니다.
    }
  };

  const handleCustomRequestChange = (event) => {
    setCustomRequest(event.target.value);
  };

  const handleCustomRequestSubmit = () => {
    if (customRequest.trim()) {
      // 공백이 아닌 요청 메시지가 있을 때만 설정합니다.
      console.log("직접 입력한 요청 메시지:", customRequest); // 콘솔에 출력
      setRequest(customRequest); // 요청 메시지를 직접 입력한 값으로 설정
    }
  };

  return (
    <div className="w-full lg:w-full lg:pr-2">
      <div className="mb-4 bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">주문 상품 정보</h2>
        {product.map((item, index) => (
          <div key={index} className="flex items-center mb-4">
            <img
              src={`https://project-image.s3.ap-northeast-2.amazonaws.com/${
                item.cate
              }/${item.strImage.split(",")[0]}`}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer"
              onClick={() => navigate(`/product/${item.productId}`)} // 제품 상세 페이지로 이동
            />
            <div className="ml-4">
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                {item.name}
              </h3>
              <p className="text-gray-600">가격 : {item.price}원</p>
              <p className="text-gray-600">
                옵션 : {item.color} / {item.size}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4 bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
        <div>
          <p className="text-gray-700 font-bold">
            {JSON.parse(localStorage.getItem("member")).name}
          </p>
          <p className="text-gray-700">
            {JSON.parse(localStorage.getItem("member")).tell}
          </p>
          <p className="text-gray-700">
            {JSON.parse(localStorage.getItem("member")).email}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 mb-2">
        <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
        {isEditing ? (
          <div>
            <div className="flex mb-4">
              <button
                className={`mr-4 py-2 px-4 rounded ${
                  activeTab === "existing"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("existing")}
              >
                배송지 선택
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  activeTab === "new"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("new")}
              >
                신규 입력
              </button>
            </div>

            {activeTab === "existing" ? (
              <div>
                <p className="text-gray-700 font-semibold">{editName}</p>
                <p className="text-gray-700">{editTell}</p>
                <p className="text-gray-700 font-semibold">{editRoadaddr}</p>
                <p className="text-gray-700 font-semibold">{editDetailaddr}</p>
                <p className="text-gray-700 font-semibold">{editMailaddr}</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    이름
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-gray-300"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    전화번호
                  </label>
                  <input
                    type="text"
                    value={editTell}
                    onChange={(e) => setEditTell(e.target.value)}
                    className="w-full p-2 border border-gray-300"
                    placeholder="전화번호를 입력하세요"
                  />
                </div>
                <Address
                  mailaddr={editMailaddr}
                  setMailaddr={setEditMailaddr}
                  roadaddr={editRoadaddr}
                  setRoadaddr={setEditRoadaddr}
                  detailaddr={editDetailaddr}
                  setDetailaddr={setEditDetailaddr}
                />
              </div>
            )}
            <button
              onClick={saveChanges}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              저장
            </button>
            <button
              onClick={toggleEdit}
              className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded"
            >
              취소
            </button>
          </div>
        ) : (
          <div>
            <div>
              <p className="text-gray-700 font-semibold">{name}</p>
              <p className="text-gray-700">{tell}</p>
              <p className="text-gray-700 font-semibold">{roadaddr}</p>
              <p className="text-gray-700 font-semibold">{detailaddr}</p>
              <p className="text-gray-700 font-semibold">{mailaddr}</p>
            </div>
            <button
              onClick={toggleEdit}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              수정
            </button>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">배송 요청</h3>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              요청 메시지 선택
            </label>
            <select
              value={request}
              onChange={handleRequestChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">기본 메시지 선택</option>
              <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
              <option value="배송 전 연락주세요">배송 전 연락주세요</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>

          {request === "custom" && (
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                직접 입력
              </label>
              <textarea
                value={customRequest}
                onChange={handleCustomRequestChange}
                className="w-full p-2 border border-gray-300"
                rows="4"
                placeholder="배송 요청을 직접 입력하세요."
              />
              <button
                onClick={handleCustomRequestSubmit}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
              >
                확인
              </button>
            </div>
          )}

          {request !== "custom" && request && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">요청 메시지</h4>
              <p>{request}</p>
            </div>
          )}

          {request === "custom" && customRequest && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">
                직접 입력한 요청 내용
              </h4>
              <p>{customRequest}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
