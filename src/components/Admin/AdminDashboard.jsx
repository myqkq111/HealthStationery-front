// src/components/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import ProductList from "./ProductList";
import MemberList from "./MemberList";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 탭 */}
      <div className="w-1/5 bg-gray-200 p-4 border-gray-300">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2  ${
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
        </div>
      </div>

      {/* 오른쪽 내용 */}
      <div className="flex-1 p-6 bg-gray-100">
        {activeTab === "products" && <ProductList />}
        {activeTab === "members" && <MemberList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
