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
import ResetPassword from "./components/User/ResetPassword";
import Terms from "./components/User/Terms";
import Footer from "./components/MainPage/Footer";
import BottomPage from "./components/MainPage/BottomPage";
import Shop from "./pages/Shop";
import ProductPage from "./components/MainPage/ShopPage/ProductPage";

function App() {
  return (
    <Router>
      {/* MainHeader는 페이지 내에서 사용 */}
      <MainHeader />
      {/* Header는 페이지 상단에 고정 */}
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/find-id" element={<FindID />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" component={ProductPage} />
      </Routes>
      <Footer />
      <BottomPage />
    </Router>
  );
}

export default App;
