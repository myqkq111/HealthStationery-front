import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const Payment = () => {
  const location = useLocation();
  const { product, user } = location.state || {};

  // 배송 정보 및 배송 메모 상태 관리
  const [deliveryMemo, setDeliveryMemo] = useState("default");
  const [customMemo, setCustomMemo] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">결제하기</h1>
      <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row lg:space-x-6">
        <LeftSection
          product={product}
          user={user}
          deliveryMemo={deliveryMemo}
          setDeliveryMemo={setDeliveryMemo}
          customMemo={customMemo}
          setCustomMemo={setCustomMemo}
        />
        <div className="w-full lg:w-1/3">
          <RightSection price={product?.price || 0} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
