import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { product, user } = location.state || {};

  // 상품 정보
  const { image, name, price } = product || {};

  // 사용자 정보
  const { username, email, tell, roadaddr, detailaddr, mailaddr } = user || {};

  // 배송 정보 및 배송 메모 상태 관리
  const [deliveryMemo, setDeliveryMemo] = useState("default");
  const [customMemo, setCustomMemo] = useState("");

  const handleMemoChange = (event) => {
    setDeliveryMemo(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">결제하기</h1>
      <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row lg:justify-between">
        {/* 왼쪽 섹션 */}
        <div className="w-full lg:w-2/3 lg:pr-6">
          {/* 주문 상품 정보 */}
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

          {/* 주문자 정보 */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
            <div>
              <p className="text-gray-700">{username}</p>
              <p className="text-gray-700">{tell}</p>
              <p className="text-gray-700">{email}</p>
            </div>
          </div>

          {/* 배송 정보 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
            <div>
              <p className="text-gray-700 font-semibold">{name}</p>
              <p className="text-gray-700">{tell}</p>
              <p className="text-gray-700 font-semibold">{roadaddr}</p>
              <p className="text-gray-700 font-semibold">{detailaddr}</p>
              <p className="text-gray-700 font-semibold">{mailaddr}</p>
            </div>

            {/* 배송 메모 */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">배송 메모</h3>
              {/* 배송 메모 선택 */}
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

              {/* 직접 입력 */}
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

        {/* 오른쪽 섹션 */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-16">
          {/* 주문 요약 */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">주문 요약</h2>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">상품 가격:</span>
              <span className="text-gray-700">{price}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">배송비:</span>
              <span className="text-gray-700">3000원</span>
            </div>
            <div className="mt-4 flex justify-between font-bold text-lg">
              <span>총 주문 금액:</span>
              <span>{price + 3000}</span>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">결제 수단</h2>
            <div>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  className="mr-2"
                />
                카드 결제
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  className="mr-2"
                />
                계좌 이체
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="payment"
                  value="kakao"
                  className="mr-2"
                />
                카카오페이
              </label>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">약관 동의</h2>
            <div>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                전체 동의
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                개인정보 처리 방침 동의
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                결제 이용 약관 동의
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
