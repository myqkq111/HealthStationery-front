import React from "react";

const RightSection = ({ price }) => {
  return (
    <nav
      style={{ borderTop: "2px solid #e5e7eb" }}
      className="p-0 sticky top-14 z-10"
    >
      <div className="mb-6 bg-white p-4  shadow-sm border border-gray-200">
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

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">결제 수단</h2>
        <div>
          <label className="block mb-2">
            <input type="radio" name="payment" value="card" className="mr-2" />
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
            <input type="radio" name="payment" value="kakao" className="mr-2" />
            카카오페이
          </label>
        </div>
      </div>

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
    </nav>
  );
};

export default RightSection;
