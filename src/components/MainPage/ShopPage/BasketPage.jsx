import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { FaTrash } from "react-icons/fa";

const BasketPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const deliveryFee = 3000;

  useEffect(() => {
    // 페이지가 로드될 때 장바구니 데이터를 서버에서 가져옵니다.
    const userId = JSON.parse(localStorage.getItem("member")).id;

    axiosInstance
      .get(`/basket/cart?memberId=${userId}`)
      .then((response) => {
        const items = response.data;
        setCartItems(items); // 서버 응답에서 장바구니 아이템 가져오기
        // 품절된 상품을 추적
        setOutOfStockItems(items.filter((item) => item.stock === 0));
        setLoading(false); // 로딩 상태 업데이트
      })
      .catch((error) => {
        console.error("장바구니 데이터 로딩 오류:", error);
        setLoading(false); // 로딩 상태 업데이트
      });
  }, []);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity <= 0) return; // 수량이 0 이하로 떨어지지 않도록 조건 추가

    // 재고가 있는지 확인
    if (newQuantity > item.stock) {
      alert("재고가 부족합니다.");
      return;
    }

    const updatedItem = { ...item, count: newQuantity };
    axiosInstance
      .put(`/basket/optionUpdate`, updatedItem)
      .then(() => {
        // 서버 업데이트 성공 후 로컬 상태도 업데이트
        setCartItems((prevItems) =>
          prevItems.map((i) => (i.id === item.id ? updatedItem : i))
        );
      })
      .catch((error) => {
        console.error("상품 수량 업데이트 오류:", error);
      });
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      axiosInstance
        .delete("/basket/delete", {
          data: { ids: [id] }, // 요청 본문에 선택된 상품 ID를 포함
        })
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

    if (selectedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    // 사용자 확인
    if (window.confirm("선택한 상품을 삭제하시겠습니까?")) {
      // 선택된 상품 ID를 포함한 배열 생성
      const selectedIds = selectedItems;

      // 서버에 삭제 요청
      axiosInstance
        .delete("/basket/delete", {
          data: { ids: selectedIds }, // 요청 본문에 선택된 상품 ID를 포함
        })
        .then(() => {
          // 서버에서 성공적으로 삭제된 후 로컬 상태 업데이트
          setCartItems((prevItems) =>
            prevItems.filter((item) => !selectedIds.includes(item.id))
          );
          setSelectedItems([]); // 선택된 항목 목록 비우기
        })
        .catch((error) => {
          console.error("Failed to delete selected products", error);
          // 에러 처리 로직 추가 (예: 사용자에게 오류 메시지 표시)
        });
    }
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
    axiosInstance
      .get(`/product/oneOption?id=${item.productId}`)
      .then((response) => {
        const options = response.data;

        // 색상별 사이즈와 재고를 담을 객체
        const stockByColorAndSize = options.reduce((acc, option) => {
          if (!acc[option.color]) {
            acc[option.color] = {};
          }
          acc[option.color][option.size] = option.stock;
          return acc;
        }, {});

        // 색상과 사이즈의 리스트를 생성
        const uniqueColors = [
          ...new Set(options.map((option) => option.color)),
        ];
        const uniqueSizes = [...new Set(options.map((option) => option.size))];

        setColors(uniqueColors);
        setSizes(uniqueSizes);
        setStocks(stockByColorAndSize);
        setCurrentItem(item);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("옵션 데이터 로딩 오류:", error);
        setLoading(false);
      });
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

  const handleUpdateItem = () => {
    if (currentItem) {
      // 현재 변경하려는 아이템 제외한 다른 장바구니 아이템들에서 중복 체크
      const isDuplicate = cartItems.some(
        (item) =>
          item.id !== currentItem.id && // 현재 변경하려는 상품 제외
          item.productId === currentItem.productId &&
          item.color === currentItem.color &&
          item.size === currentItem.size
      );

      if (isDuplicate) {
        alert("장바구니에 동일한 색상과 사이즈의 상품이 이미 존재합니다.");
        return; // 중복이 확인되면 업데이트 진행하지 않음
      }

      // 수량을 1로 설정
      const updatedItem = { ...currentItem, count: 1 };

      // 업데이트 요청
      axiosInstance
        .put(`/basket/optionUpdate`, updatedItem)
        .then(() => {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === currentItem.id ? updatedItem : item
            )
          );
          closeModal();
        })
        .catch((error) => {
          console.error("Failed to update product", error);
        });
    }
  };

  const handleRemoveOutOfStock = () => {
    if (window.confirm("품절된 상품을 삭제하시겠습니까?")) {
      const outOfStockIds = outOfStockItems.map((item) => item.id);

      axiosInstance
        .delete("/basket/delete", {
          data: { ids: outOfStockIds },
        })
        .then(() => {
          setCartItems((prevItems) =>
            prevItems.filter((item) => !outOfStockIds.includes(item.id))
          );
          setOutOfStockItems([]); // 품절된 상품 목록 비우기
        })
        .catch((error) => {
          console.error("Failed to delete out of stock products", error);
          // 에러 처리 로직 추가 (예: 사용자에게 오류 메시지 표시)
        });
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentItem((prev) => ({
      ...prev,
      color: newColor,
      size: "", // 색상 변경 시 사이즈를 초기화
    }));
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setCurrentItem((prev) => ({
      ...prev,
      size: newSize,
    }));
  };

  // 모든 사이즈가 품절인 색상 찾기
  const getColorOptions = () => {
    return colors.map((color) => {
      const sizes = stocks[color];
      const allSizesOutOfStock = Object.values(sizes).every(
        (stock) => stock <= 0
      );
      return {
        color,
        isOutOfStock: allSizesOutOfStock,
      };
    });
  };

  // 사이즈 select box에서 색상 변경 시 품절 처리
  const getAvailableSizes = (color) => {
    const sizes = stocks[color] || {};
    return Object.keys(sizes).map((size) => ({
      size,
      isOutOfStock: sizes[size] <= 0,
    }));
  };

  const isUpdateDisabled =
    !currentItem?.size ||
    getColorOptions().find(
      (colorOption) => colorOption.color === currentItem?.color
    )?.isOutOfStock;

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
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <td className="py-2 px-4 border-b border-gray-300 border-t border-gray-300 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === cartItems.length}
                      className="w-5 h-5" // selectbox 크기 조정
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 border-t border-gray-300 text-center font-semibold">
                    상품정보
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 border-t border-gray-300 text-center font-semibold">
                    수량
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 border-t border-gray-300 text-center font-semibold">
                    주문금액
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 border-t border-gray-300 text-center font-semibold"></td>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-300 ${
                      item.stock === 0
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white"
                    }`}
                  >
                    <td
                      className={`py-4 px-4 border-r border-gray-300 text-center ${
                        item.stock === 0 ? "text-gray-400" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        disabled={item.stock === 0}
                        className={`w-5 h-5 ${
                          item.stock === 0 ? "cursor-not-allowed" : ""
                        }`}
                      />
                    </td>
                    <td
                      className={`py-4 px-4 border-r border-gray-300 ${
                        item.stock === 0 ? "text-gray-400" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={`/images/products/${item.cate}/${
                            item.strImage.split(",")[0]
                          }`}
                          alt={item.name}
                          className={`w-24 h-24 object-cover cursor-pointer ${
                            item.stock === 0 ? "opacity-50" : ""
                          }`}
                          onClick={() => navigate(`/product/${item.productId}`)} // 제품 상세 페이지로 이동
                        />
                        <div className="ml-4 flex flex-col justify-center flex-grow">
                          <div className="mb-2">
                            <h2
                              className={`text-lg font-semibold cursor-pointer ${
                                item.stock === 0 ? "text-gray-400" : ""
                              }`}
                              onClick={() =>
                                navigate(`/product/${item.productId}`)
                              } // 제품 상세 페이지로 이동
                            >
                              {item.name}
                            </h2>
                            <p
                              className={`text-gray-600 ${
                                item.stock === 0 ? "text-gray-400" : ""
                              }`}
                            >
                              색상:{" "}
                              <span className="font-medium">{item.color}</span>
                            </p>
                            <p
                              className={`text-gray-600 ${
                                item.stock === 0 ? "text-gray-400" : ""
                              }`}
                            >
                              사이즈:{" "}
                              <span className="font-medium">{item.size}</span>
                            </p>
                            {item.stock > 0 && (
                              <p
                                className={`text-gray-600 ${
                                  item.stock === 0 ? "text-gray-400" : ""
                                }`}
                              >
                                가격:{" "}
                                <span className="font-medium">
                                  {item.price.toLocaleString()}원
                                </span>
                              </p>
                            )}
                            {item.stock === 0 && (
                              <p className="text-red-500 font-semibold">품절</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 border-r border-gray-300 text-center ${
                        item.stock === 0 ? "text-gray-400" : ""
                      }`}
                    >
                      {item.stock > 0 ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.count - 1)
                              }
                              className="bg-gray-100 text-gray-800 px-3 py-1 hover:bg-gray-300"
                              disabled={item.count <= 1}
                            >
                              -
                            </button>
                            <span className="text-lg font-semibold">
                              {item.count}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.count + 1)
                              }
                              className="bg-gray-100 text-gray-800 px-3 py-1 hover:bg-gray-300"
                              disabled={item.count >= item.stock}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => openModal(item)}
                            className="bg-blue-400 text-white px-4 py-2 hover:bg-blue-600"
                          >
                            옵션 변경
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                    <td className="py-4 px-4 border-r border-gray-300 text-center">
                      {item.stock > 0 ? (
                        <span className="font-medium">
                          {(item.price * item.count).toLocaleString()}원
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 border-gray-300 text-center border-l">
                      <button onClick={() => handleRemoveItem(item.id)}>
                        <FaTrash className="text-red-500 w-6 h-6" />
                      </button>
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
                    <td className="py-2 px-4 border-t border-gray-300 text-sm font-bold text-red-600 text-center">
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
                  className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 mr-2"
                >
                  선택상품 삭제
                </button>
                <button
                  onClick={handleRemoveOutOfStock}
                  className="bg-gray-500 text-white px-4 py-2 hover:bg-gray-600"
                >
                  품절상품 삭제
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
                className="bg-yellow-500 text-white px-4 py-2 hover:bg-yellow-600"
                onClick={handleOrder}
              >
                주문하기
              </button>
            </div>

            {isModalOpen && currentItem && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 max-w-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentItem?.name}
                  </h2>
                  <div className="mb-4">
                    <label className="block text-gray-700">색상:</label>
                    <select
                      value={currentItem?.color}
                      onChange={handleColorChange}
                      className="w-full p-2 border border-gray-300"
                    >
                      {getColorOptions().map(({ color, isOutOfStock }) => (
                        <option
                          key={color}
                          value={color}
                          disabled={isOutOfStock}
                          className={isOutOfStock ? "text-gray-400" : ""}
                        >
                          {color} {isOutOfStock ? "(품절)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">사이즈:</label>
                    <select
                      value={currentItem?.size || ""}
                      onChange={handleSizeChange}
                      className="w-full p-2 border border-gray-300"
                      disabled={
                        !currentItem?.color ||
                        getColorOptions().find(
                          (colorOption) =>
                            colorOption.color === currentItem?.color
                        )?.isOutOfStock
                      }
                    >
                      <option value="" disabled>
                        사이즈 선택
                      </option>
                      {getAvailableSizes(currentItem?.color).map(
                        ({ size, isOutOfStock }) => (
                          <option
                            key={size}
                            value={size}
                            disabled={isOutOfStock}
                          >
                            {size} {isOutOfStock ? "(품절)" : ""}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2hover:bg-gray-600 mr-2"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleUpdateItem}
                      className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
                      disabled={isUpdateDisabled} // 사이즈가 선택되지 않거나 색상이 품절이면 비활성화
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
