import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const BasketPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "상품 1",
      price: 20000,
      quantity: 2,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "상품 2",
      price: 30000,
      quantity: 1,
      image: "https://via.placeholder.com/150",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const deliveryFee = 3000;

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleBuyNow = (item) => {
    navigate("/payment", { state: { item } });
  };

  const handleOrder = () => {
    navigate("/payment", { state: { cartItems, totalPayment } });
  };

  const handleRemoveSelected = () => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  };

  const handleRemoveOutOfStock = () => {
    // 품절 상품 삭제 로직 구현
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const totalAmount = calculateTotal();
  const finalDeliveryFee = totalAmount >= 50000 ? 0 : deliveryFee;
  const totalPayment = totalAmount + finalDeliveryFee;

  const openModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleQuantityUpdate = (newQuantity) => {
    if (currentItem) {
      handleQuantityChange(currentItem.id, newQuantity);
      // Don't close the modal here
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* 장바구니 제목 부분 */}
      <h1 className="text-3xl font-bold text-center mb-4">장바구니</h1>

      <div className="max-w-6xl mx-auto bg-white p-6">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">
            장바구니에 상품이 없습니다.
          </p>
        ) : (
          <>
            {/* 헤더 부분 */}
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr>
                  <td className="py-2 px-4 text-left border-b border-gray-300 border-t border-gray-300">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === cartItems.length}
                    />
                  </td>
                  <td className="py-2 px-4 text-left border-b border-gray-300 border-t border-gray-300">
                    상품정보
                  </td>
                  <td className="py-2 px-4 text-left border-b border-gray-300 border-t border-gray-300">
                    수량
                  </td>
                  <td className="py-2 px-4 text-left border-b border-gray-300 border-t border-gray-300">
                    주문금액
                  </td>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="py-4 px-4 border-r border-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="py-4 px-4 flex items-center border-r border-gray-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="ml-4 flex flex-col flex-grow">
                        <h2 className="text-lg font-semibold flex justify-between items-center">
                          {item.name}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 ml-4"
                          >
                            삭제
                          </button>
                        </h2>
                        <p className="text-gray-600">
                          가격: {item.price.toLocaleString()} 원
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-r border-gray-300 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-lg font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => openModal(item)}
                          className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                        >
                          수량/옵션변경
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-gray-300">
                      <span>
                        {(item.price * item.quantity).toLocaleString()} 원
                      </span>
                      <div className="mt-2 flex items-center">
                        <button
                          onClick={() => handleBuyNow(item)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          바로 구매
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 배송비 표시 */}
            <div className="mb-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-t border-gray-300 text-lg font-bold text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <span>배송비:</span>
                        <span className="text-lg font-bold">
                          {finalDeliveryFee.toLocaleString()} 원
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-t border-gray-300 text-sm font-bold text-gray-600 text-center">
                      ※조건부 무료배송: 50,000원 이상시 무료배송※
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 선택 상품 삭제 및 품절 상품 삭제 버튼 */}
            <div className="flex justify-between items-center mb-4 border-t border-gray-300 pt-4">
              <div>
                <button
                  onClick={handleRemoveSelected}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-2"
                >
                  선택상품 삭제
                </button>
                <button
                  onClick={handleRemoveOutOfStock}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  품절상품 삭제
                </button>
              </div>
              <p className="text-gray-600">
                결제 시 추가 할인 적용에 따라 배송비가 변경될 수 있습니다.
              </p>
            </div>

            {/* 총 결제 금액 */}
            <div className="mt-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 text-left border-t border-gray-300">
                      총 상품 금액:
                    </td>
                    <td className="py-2 px-4 text-right border-t border-gray-300">
                      {totalAmount.toLocaleString()} 원
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-left border-t border-gray-300">
                      배송비:
                    </td>
                    <td className="py-2 px-4 text-right border-t border-gray-300">
                      {finalDeliveryFee.toLocaleString()} 원
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-left font-bold border-t border-gray-300">
                      총 주문 금액:
                    </td>
                    <td className="py-2 px-4 text-right font-bold border-t border-gray-300">
                      {(totalAmount + finalDeliveryFee).toLocaleString()} 원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 주문하기 버튼 */}
            <div className="mt-6 text-center">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                onClick={handleOrder} // 주문하기 버튼 클릭 시 payment 페이지로 이동
              >
                주문하기
              </button>
            </div>

            {/* 수량 및 옵션 변경 모달 */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentItem?.name}
                  </h2>
                  <div className="mb-4">
                    <label className="block text-gray-700">새로운 수량:</label>
                    <input
                      type="number"
                      min="1"
                      defaultValue={currentItem?.quantity}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({
                          ...prev,
                          quantity: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-2"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        handleQuantityUpdate(currentItem?.quantity);
                        closeModal();
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
