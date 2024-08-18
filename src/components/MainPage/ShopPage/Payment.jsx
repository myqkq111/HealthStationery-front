import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import axiosInstance from "../../api/AxiosInstance";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPayment, purchaseSource } = location.state || {};
  const [request, setRequest] = useState("");

  // 배송 정보 및 배송 메모 상태 관리
  const [orderInfo, setOrderInfo] = useState(
    JSON.parse(localStorage.getItem("member"))
  );

  const handlePayment = () => {
    const data = {
      pg: "html5_inicis", // PG사
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 100, // 결제금액
      name: "아임포트 결제 데이터 분석", // 주문명
      buyer_name: orderInfo.name, // 구매자 이름
      buyer_tel: orderInfo.tell, // 구매자 전화번호
      buyer_email: orderInfo.email, // 구매자 이메일
      buyer_addr: orderInfo.roadaddr, // 구매자 주소
      buyer_postcode: orderInfo.mailaddr, // 구매자 우편번호
    };
  
    window.IMP.init("imp66777782");
  
    window.IMP.request_pay(data, (response) => {
      const { success, error_msg, imp_uid } = response;
  
      if (success) {
        alert("결제 성공");
  
        // imp_uid를 로컬 스토리지에 저장
        localStorage.setItem('imp_uid', imp_uid);
  
        axiosInstance.post("/buylist/insert", {
          memberId: orderInfo.id,
          name: orderInfo.name,
          tell: orderInfo.tell,
          mailaddr: orderInfo.mailaddr,
          roadaddr: orderInfo.roadaddr,
          detailaddr: orderInfo.detailaddr,
          request: request,
          totalPrice: totalPayment,
          purchaseSource: purchaseSource,
          products: cartItems.map((item) => ({
            productId: item.productId,
            color: item.color,
            size: item.size,
            count: item.count,
          })),
        })
        .then((orderResponse) => {
          const buylistId = orderResponse.data;
          navigate(`/payment-success/${buylistId}`);
        })
        .catch((error) => {
          console.error("주문 정보 전송 실패:", error);
          alert("주문 정보 전송에 실패했습니다.");
        });
      } else {
        alert(`결제 실패: ${error_msg}`);
      }
    });
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-16">
      <h1 className="text-3xl font-bold text-center mb-8">결제하기</h1>
      <div className="flex justify-center">
        <div className="w-full lg:w-3/5 max-w-screen-xl p-6 flex flex-col lg:flex-row lg:space-x-1">
          <div className="w-full lg:w-3/5">
            <LeftSection
              product={cartItems} // 수정된 부분
              user={orderInfo}
              setOrderInfo={setOrderInfo}
              setRequest={setRequest}
              request={request}
            />
          </div>
          <div className="w-full lg:w-1/3 relative">
            <RightSection
              totalPayment={totalPayment}
              handlePayment={handlePayment}
            />{" "}
            {/* 수정된 부분 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
