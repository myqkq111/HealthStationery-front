import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import HomePage from "./pages/HomePage";
import MainHeader from "./components/MainPage/MainHeader";
import Header from "./components/MainPage/Header";
import Forgot from "./components/User/Forgot";
import FindID from "./components/User/FindID";
import Terms from "./components/User/Terms";
import Footer from "./components/MainPage/Footer";
import BottomPage from "./components/MainPage/BottomPage";
import Shop from "./pages/Shop";
import ProductPage from "./components/MainPage/ShopPage/ProductPage";
import TopBar from "./components/MainPage/TopBar";
import MyPage from "./components/User/Mypage";
import Payment from "./components/MainPage/ShopPage/Payment";
import AuthCallback from "./components/callback/AuthCallback";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import { CartProvider } from "./components/contexts/CartContext";
import AdminPage from "./pages/AdminPage";
import BasketPage from "./components/MainPage/ShopPage/BasketPage";
import FNQ from "./components/MainPage/FNQPage/fnqpage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PaymentSuccess from "./components/MainPage/ShopPage/PaymentSuccess.jsx";
import ChatIcon from "./components/MainPage/ChatIcon.jsx";
import HonestReview from "./components/MainPage/ReviewPage/HonestReview.jsx";
import SearchPage from "./components/MainPage/SearchPage.jsx";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <TopBar /> {/* TopBar를 페이지 상단에 표시 */}
          <MainHeader /> {/* MainHeader를 TopBar 아래에 표시 */}
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/find-id" element={<FindID />} />
            <Route path="/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<MyPage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/oauth" element={<AuthCallback />} />
            <Route path="/cart" element={<BasketPage />} />
            <Route path="/fnq" element={<FNQ />} />
            <Route path="/review" element={<HonestReview />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/payment-success/:buylistId"
              element={<PaymentSuccess />}
            />
          </Routes>
          <Footer /> {/* Footer를 페이지 하단에 표시 */}
          <BottomPage /> {/* BottomPage를 Footer 아래에 표시 */}
          <ChatIconWrapper /> {/* 채팅 아이콘을 페이지 하단에 고정 */}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

const ChatIconWrapper = () => {
  const { isAdmin } = useAuth();

  // 사용자가 관리자가 아닌 경우에만 ChatIcon을 표시
  return !isAdmin ? <ChatIcon /> : null;
};

export default App;
