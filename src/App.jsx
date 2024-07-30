import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./pages/HomePage";
import "./index.css"; // Tailwind CSS를 적용합니다.
import MainHeader from "./components/MainHeader";
import Header from "./components/Header";
import Forgot from "./components/Forgot";
import FindID from "./components/FindID";
import ResetPassword from "./components/ResetPassword";

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
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/find-id" element={<FindID />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
