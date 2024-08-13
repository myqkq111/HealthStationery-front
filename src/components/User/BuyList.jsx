// BuyList.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";

const BuyList = () => {
  const [buylist, setBuylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/buylist")
      .then((response) => {
        setBuylist(response.data);
      })
      .catch((error) => {
        console.error("주문 목록 가져오기 실패:", error);
        setError("주문 목록을 가져오는 데 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">주문 목록</h2>
      {buylist.length === 0 ? (
        <p className="text-gray-600">주문이 없습니다.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">주문 번호</th>
              <th className="p-3 text-left">상품 이미지</th>
              <th className="p-3 text-left">상품 이름</th>
              <th className="p-3 text-left">상품 수량</th>
              <th className="p-3 text-left">상품 가격</th>
              <th className="p-3 text-left">구매 일자</th>
            </tr>
          </thead>
          <tbody>
            {buylist.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.id}</td>
                <td className="p-3">
                  <img
                    src={item.imageUrl || "/default-image.png"}
                    alt={item.productName}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.price.toLocaleString()} 원</td>
                <td className="p-3">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BuyList;
