// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import HomePage from "./pages/HomePage";
import "./index.css"; // Tailwind CSS를 적용합니다.
import MainHeader from "./components/MainPage/MainHeader";
import Header from "./components/MainPage/Header";
import Forgot from "./components/User/Forgot";
import FindID from "./components/User/FindID";
import FindPW from "./components/User/ResetPassword";
import Terms from "./components/User/Terms";
import Footer from "./components/MainPage/Footer";
import BottomPage from "./components/MainPage/BottomPage";
import Shop from "./pages/Shop";
import ProductPage from "./components/MainPage/ShopPage/ProductPage";
import TopBar from "./components/MainPage/TopBar";
import MyPage from "./components/User/Mypage";
import Payment from "./components/MainPage/ShopPage/Payment";
import BasketPage from "./components/MainPage/ShopPage/BasketPage";

const App = () => {
  return (
    <Router>
      <TopBar /> {/* TopBar를 페이지 상단에 표시 */}
      <MainHeader /> {/* MainHeader를 TopBar 아래에 표시 */}
      <Header /> {/* Header를 MainHeader 아래에 표시 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/find-id" element={<FindID />} />
        <Route path="/findPW" element={<FindPW />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile" element={<MyPage />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <Footer /> {/* Footer를 페이지 하단에 표시 */}
      <BottomPage /> {/* BottomPage를 Footer 아래에 표시 */}
    </Router>
  );
};

export default App;
