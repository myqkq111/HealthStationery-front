import React from "react";

const RightSection = ({ totalPayment, handlePayment }) => {
  const deliveryFee = totalPayment >= 50000 ? 0 : 3000;

  // 상품 가격 (배송비가 포함되지 않은 경우)
  const itemPrice =
    totalPayment >= 50000 ? totalPayment : totalPayment - deliveryFee;

  return (
    <aside className="sticky top-16 z-10">
      <div className="mb-6 bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">주문 요약</h2>
        <div className="mb-2 flex justify-between">
          <span className="text-gray-700">상품 가격:</span>
          <span className="text-gray-700">{itemPrice.toLocaleString()}원</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="text-gray-700">배송비:</span>
          <span className="text-gray-700">
            {deliveryFee.toLocaleString()}원
          </span>
        </div>
        <hr />
        <div className="mt-4 flex justify-between font-bold text-lg">
          <span>총 주문 금액:</span>
          <span>{totalPayment.toLocaleString()}원</span>
        </div>
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-red-500 text-white py-4 px-4 hover:bg-red-600 transition"
      >
        결제하기
      </button>
    </aside>
  );
};

export default RightSection;
