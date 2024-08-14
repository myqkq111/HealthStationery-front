// src/components/Admin/OrderList.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";

const BuyList = () => {
  const [buylists, setBuylists] = useState([]);

  // 주문 목록을 가져오는 함수
  useEffect(() => {
    axiosInstance
      .get("/buylist") // 실제 API 엔드포인트에 맞게 수정
      .then((response) => {
        setBuylists(response.data);
      })
      .catch(() => {});
  }, []);

  // 주문 취소 함수
  const handleCancelOrder = (id) => {
    axiosInstance
      .delete(`/buylist/${id}`) // 실제 주문 삭제 API 엔드포인트로 수정
      .then(() => {
        // 삭제 성공 시, 목록에서 해당 주문 제거
        setBuylists(buylists.filter((buylist) => buylist.id !== id));
      })
      .catch((error) => {
        console.error("Failed to cancel order", error);
        // 오류 처리 로직을 여기에 추가할 수 있습니다.
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">주문 목록</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                주문 번호(구매 일자)
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                수량
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                가격
              </th>
            </tr>
          </thead>
          <tbody>
            {buylists.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  주문목록이 없습니다.
                </td>
              </tr>
            ) : (
              buylists.map((buylist) => (
                <tr key={buylist.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buylist.id}
                    <br>{buylist.regdt}</br>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buylist.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buylist.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buylist.totalPrice}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 flex space-x-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleCancelOrder(buylist.id)}
                    >
                      주문취소
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyList;
