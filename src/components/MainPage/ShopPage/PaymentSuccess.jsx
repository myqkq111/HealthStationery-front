// src/components/MainPage/ShopPage/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axiosInstance from "../../api/AxiosInstance";

const PaymentSuccess = () => {
  const { buylistId } = useParams(); // URL 파라미터로부터 주문 ID를 가져옴
  const [buylist, setBuylist] = useState(null);

  useEffect(() => {
    // 주문 정보 가져오기
    const fetchBuylist = () => {
      axiosInstance
        .get(`/buylist/${buylistId}`) // 실제 API 엔드포인트에 맞게 수정
        .then((response) => {
          setBuylist(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch order details", error);
        });
    };

    fetchBuylist();
  }, [buylistId]);

  if (!buylist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white p-6 text-center shadow-lg rounded-lg">
        <FaCheckCircle className="text-green-500 text-4xl mb-4" />
        <h1 className="text-2xl font-semibold mb-2">결제가 완료되었습니다!</h1>
        <p className="text-gray-700 mb-4">
          주문이 성공적으로 처리되었습니다. 감사합니다!
        </p>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">주문 번호:</h2>
          <p className="text-gray-700">{buylist.regdt}</p>{" "}
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">결제 금액:</h2>
          <p className="text-gray-700">{buylist.totalPrice} 원</p>{" "}
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">배송 주소:</h2>
          <p className="text-gray-700">{buylist.mailaddr}</p>{" "}
          <p className="text-gray-700">{buylist.roadaddr}</p>{" "}
          <p className="text-gray-700">{buylist.detailaddr}</p>{" "}
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">요청사항:</h2>
          <p className="text-gray-700">{buylist.request}</p>{" "}
        </div>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
