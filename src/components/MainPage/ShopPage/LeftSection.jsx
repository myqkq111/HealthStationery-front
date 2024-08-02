import React from "react";

const LeftSection = ({
  product,
  user,
  deliveryMemo,
  setDeliveryMemo,
  customMemo,
  setCustomMemo,
}) => {
  const { image, name, price } = product || {};
  const { username, email, tell, roadaddr, detailaddr, mailaddr } = user || {};

  const handleMemoChange = (event) => {
    setDeliveryMemo(event.target.value);
  };

  return (
    <div className="w-full lg:w-2/3 lg:pr-6">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">주문 상품 정보</h2>
        <div className="flex items-center mb-4">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600">{price}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
        <div>
          <p className="text-gray-700">{username}</p>
          <p className="text-gray-700">{tell}</p>
          <p className="text-gray-700">{email}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
        <div>
          <p className="text-gray-700 font-semibold">{name}</p>
          <p className="text-gray-700">{tell}</p>
          <p className="text-gray-700 font-semibold">{roadaddr}</p>
          <p className="text-gray-700 font-semibold">{detailaddr}</p>
          <p className="text-gray-700 font-semibold">{mailaddr}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">배송 메모</h3>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              배송 메시지 선택
            </label>
            <select
              value={deliveryMemo}
              onChange={handleMemoChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="default">기본 메시지 선택</option>
              <option value="leaveAtDoor">문 앞에 놓아주세요</option>
              <option value="callBeforeDelivery">배송 전 연락주세요</option>
              <option value="noSpecificInstructions">특별 요청 없음</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
          {deliveryMemo === "custom" && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-700 font-semibold">
                직접 입력
              </label>
              <textarea
                value={customMemo}
                onChange={(e) => setCustomMemo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="배송 메모를 직접 입력하세요."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
