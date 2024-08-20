import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import moment from "moment"; // moment 라이브러리 임포트

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 항목 수
  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("memberName"); // 기본 검색 기준은 고객명
  const [sortOrder, setSortOrder] = useState("desc"); // 정렬 방향 상태 (기본값: 내림차순)

  useEffect(() => {
    axiosInstance
      .get("/buylist/selectAll") // 실제 API 엔드포인트에 맞게 수정
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // 필터링 및 정렬 처리
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = orders.filter((order) => {
      const orderDate = moment(order.regdt).format("YYYY-MM-DD");
      const matchesDateRange = orderDate >= startDate && orderDate <= endDate;
      const matchesSearchTerm = order[searchType]
        ?.toLowerCase()
        .includes(lowercasedQuery);
      return matchesDateRange && matchesSearchTerm;
    });

    const sortedOrders = filtered.sort((a, b) => {
      const dateA = moment(a.regdt).unix();
      const dateB = moment(b.regdt).unix();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredOrders(sortedOrders);
  }, [searchQuery, searchType, startDate, endDate, orders, sortOrder]);

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handleToggleDetails = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.has(orderId)
        ? new Set([...prev].filter((id) => id !== orderId))
        : new Set(prev.add(orderId))
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // 총 결제 금액 계산
  const totalAmount = filteredOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">주문 목록</h2>

      {/* 상단 조정 영역 */}
      <div className="flex justify-between items-center mb-4">
        {/* 왼쪽 영역: 날짜 선택 및 총 결제 금액 */}
        <div className="flex items-end space-x-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              시작일
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-4 w-52"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              종료일
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-4 w-52"
            />
          </div>
          <div className="text-xl font-bold mt-1 mb-1">
            총 결제 금액: {totalAmount.toLocaleString()} 원
          </div>
        </div>

        {/* 오른쪽 영역: 검색 및 정렬 기능 */}
        <div className="flex items-center space-x-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-4"
          >
            <option value="memberName">고객명</option>
            <option value="productName">상품명</option>
          </select>
          <input
            type="text"
            placeholder={`검색 (${
              searchType === "memberName" ? "고객명" : "상품명"
            })`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-4 w-72"
          />
          <button
            onClick={() => setSearchQuery(searchQuery.trim())}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300 flex items-center"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center space-x-1 bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            <span>구매일시</span>
            {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                주문 ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                고객명
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                수량
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                상태
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.memberName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.count}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 flex space-x-2">
                      <button
                        onClick={() => handleToggleDetails(order.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {expandedOrderIds.has(order.id) ? "접기" : "상세보기"}
                      </button>
                      {/* <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        취소
                      </button> */}
                    </td>
                  </tr>
                  {expandedOrderIds.has(order.id) && (
                    <>
                      <tr>
                        <td colSpan="6" className="px-6 py-4">
                          <div className="border-t border-gray-300 mt-4 mb-4"></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-700">
                                요청사항: {order.request}
                              </p>
                              <p className="text-sm text-gray-700">
                                총 결제금액: {order.totalPrice} 원
                              </p>
                              <p className="text-sm text-gray-700">
                                구매일시:{" "}
                                {moment(order.regdt).format(
                                  "YYYY년 MM월 DD일 HH:mm"
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700">
                                받으실 분: {order.name}
                              </p>
                              <p className="text-sm text-gray-700">
                                휴대폰 번호: {order.tell}
                              </p>
                              <p className="text-sm text-gray-700">
                                우편번호: {order.mailaddr}
                              </p>
                              <p className="text-sm text-gray-700">
                                도로명주소: {order.roadaddr}
                              </p>
                              <p className="text-sm text-gray-700">
                                상세주소: {order.detailaddr}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="6">
                          <div className="border-t border-gray-300 mt-4"></div>
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          이전
        </button>
        <div>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`mx-1 px-3 py-1 rounded ${
                number === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default OrderList;
