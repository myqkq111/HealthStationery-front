import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";

const BasketPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const deliveryFee = 3000;

  useEffect(() => {
    // 페이지가 로드될 때 장바구니 데이터를 서버에서 가져옵니다.
    const userId = JSON.parse(localStorage.getItem("member")).id;

    axiosInstance
      .get(`/basket/cart?memberId=${userId}`) // 서버의 장바구니 데이터 API 경로
      .then((response) => {
        console.log(response.data);
        setCartItems(response.data); // 서버 응답에서 장바구니 아이템 가져오기
        setLoading(false); // 로딩 상태 업데이트
      })
      .catch((error) => {
        console.error("장바구니 데이터 로딩 오류:", error);
        setLoading(false); // 로딩 상태 업데이트
        // 에러 처리 로직 추가 (예: 사용자에게 오류 메시지 표시)
      });
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      axiosInstance
        .delete(`/basket/delete?id=${id}`)
        .then(() => {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          );
        })
        .catch((error) => {
          console.error("Failed to delete product", error);
        });
    }
  };

  const handleBuyNow = (item) => {
    navigate("/payment", { state: { item } });
  };

  const handleOrder = () => {
    // 선택된 상품들만 필터링
    const selectedItemsDetails = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedItemsDetails.length === 0) {
      alert("선택한 상품이 없습니다.");
      return;
    }

    // 결제 페이지로 네비게이션
    navigate("/payment", {
      state: {
        cartItems: selectedItemsDetails,
        totalPayment: totalPayment,
        purchaseSource: 1,
      },
    });
  };

  const handleRemoveSelected = () => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  };

  const calculateTotal = () => {
    // 선택된 상품 ID를 기준으로 필터링
    const selectedItemsDetails = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    // 필터링된 상품들의 총합 계산
    return selectedItemsDetails.reduce(
      (total, item) => total + item.price * item.count,
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
  const totalPayment = totalAmount === 0 ? 0 : totalAmount + finalDeliveryFee;

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
      closeModal(); // 수량 업데이트 후 모달 닫기
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-4">장바구니</h1>

      <div className="max-w-6xl mx-auto bg-white p-6">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">
            장바구니에 상품이 없습니다.
          </p>
        ) : (
          <>
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
                        src={`/images/products/${item.cate}/${
                          item.strImage.split(",")[0]
                        }`}
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
                        <p className="text-gray-600">색상: {item.color}</p>
                        <p className="text-gray-600">사이즈: {item.size}</p>
                        <p className="text-gray-600">
                          가격: {item.price.toLocaleString()}원
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-r border-gray-300 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-lg font-semibold">
                          {item.count}
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
                        {(item.price * item.count).toLocaleString()}원
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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

            <div className="flex justify-between items-center mb-4 border-t border-gray-300 pt-4">
              <div>
                <button
                  onClick={handleRemoveSelected}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-2"
                >
                  선택상품 삭제
                </button>
              </div>
              <p className="text-gray-600">
                결제 시 추가 할인 적용에 따라 배송비가 변경될 수 있습니다.
              </p>
            </div>

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
                      {totalPayment.toLocaleString()} 원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                onClick={handleOrder}
              >
                주문하기
              </button>
            </div>

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
