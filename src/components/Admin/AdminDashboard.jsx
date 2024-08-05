// src/components/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import ProductList from "./ProductList";
import MemberList from "./MemberList";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
        <div>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-l-lg ${
              activeTab === "products"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            상품 목록
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-r-lg ${
              activeTab === "members"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            회원 목록
          </button>
        </div>
      </div>

      {activeTab === "products" && <ProductList />}
      {activeTab === "members" && <MemberList />}
    </div>
  );
};

export default AdminDashboard;
