import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import MemberList from "./MemberList";
import OrderList from "./OrderList";
import BoardList from "./BoardList";
import AdminChatPage from "./AdminChatPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab ? savedTab : "products";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-200 p-4 border-r border-gray-300 fixed h-full">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 ${
              activeTab === "products"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 ${
              activeTab === "members"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            고객 관리
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            주문 관리
          </button>
          <button
            onClick={() => setActiveTab("boards")}
            className={`px-4 py-2 ${
              activeTab === "boards"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            게시판 관리
          </button>
          <button
            onClick={() => setActiveTab("AdminChat")}
            className={`px-4 py-2 ${
              activeTab === "AdminChat"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            톡톡 관리
          </button>
        </div>
      </div>

      <div className="flex-1 ml-64 p-6 bg-gray-100">
        {activeTab === "products" && <ProductList />}
        {activeTab === "members" && <MemberList />}
        {activeTab === "orders" && <OrderList />}
        {activeTab === "boards" && <BoardList />}
        {activeTab === "AdminChat" && <AdminChatPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;
