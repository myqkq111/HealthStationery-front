// src/components/contexts/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

// 장바구니 상태를 관리하는 컨텍스트 생성
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  // 장바구니 아이템 수 업데이트
  const updateCartItemCount = (count) => {
    setCartItemCount(count);
  };

  // 장바구니 초기화
  const resetCart = () => {
    setCartItems([]);
    setCartItemCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        updateCartItemCount,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 컨텍스트를 사용하는 커스텀 훅
export const useCart = () => useContext(CartContext);
