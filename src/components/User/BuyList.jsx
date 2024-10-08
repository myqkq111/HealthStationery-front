import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AiOutlineDown } from "react-icons/ai";
import ReviewModal from "./ReviewModal"; // 리뷰 모달 컴포넌트 임포트

const BuyList = () => {
  const navigate = useNavigate();
  const [buylists, setBuylists] = useState([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());
  const [confirmedOrders, setConfirmedOrders] = useState(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBuylistId, setSelectedBuylistId] = useState(null);
  const [selecteBuylistProductId, setselecteBuylistProductId] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("member")).id;

    axiosInstance
      .get(`/buylist/mypage?id=${userId}`)
      .then((response) => {
        setBuylists(response.data);
        console.log(response.data);
      })
      .catch(() => {});
  }, []);

  const handleCancelOrder = (id, pid, color, size, count) => {
    const impUid = localStorage.getItem("imp_uid");

    if (!impUid) {
      alert("환불에 필요한 imp_uid가 로컬 스토리지에 없습니다.");
      return;
    }

    axiosInstance
      .post("/api/refund", {
        impUid: impUid,
        amount: 100,
        reason: "주문 취소에 따른 환불",
      })
      .then(() => {
        axiosInstance
          .delete(
            `/buylist/delete?id=${id}&pid=${pid}&color=${color}&size=${size}&count=${count}`
          )
          .then(() => {
            alert("주문이 성공적으로 취소되었습니다.");
            setBuylists((prevBuylists) =>
              prevBuylists.filter((item) => item.id !== id)
            );
          })
          .catch((error) => {
            console.error("주문 취소 실패:", error);
            alert("주문 취소에 실패했습니다.");
          });
        alert("환불이 완료되었습니다.");
      })
      .catch((error) => {
        console.error("환불 요청 실패:", error);
        alert("환불 요청에 실패했습니다.");
      });
  };

  const handleConfirmOrder = (id, buylistProductId) => {
    axiosInstance
      .put(`/buylist/confirmation?id=${buylistProductId}`)
      .then(() => {
        setConfirmedOrders((prev) => new Set(prev).add(id));
        setBuylists((prevBuylists) =>
          prevBuylists.map((item) =>
            item.buylistProductId === buylistProductId
              ? { ...item, confirmation: 1 }
              : item
          )
        );
        alert("구매가 확정되었습니다.");
      })
      .catch((error) => {
        console.error("구매 확정 실패:", error);
        alert("구매 확정에 실패했습니다.");
      });
  };

  const handleReviewSubmit = (reviewData) => {
    const { buylist_id, product_id, score, content, buylistProductId } =
      reviewData;

    console.log(reviewData);
    axiosInstance
      .post("/review/insert", {
        buylistProductId,
        buylistId: buylist_id,
        productId: product_id,
        score,
        content,
      })
      .then(() => {
        alert("리뷰가 성공적으로 등록되었습니다.");
        setBuylists((prevBuylists) =>
          prevBuylists.map((item) =>
            item.id === buylist_id ? { ...item, hasReview: 1 } : item
          )
        );
        setShowReviewModal(false);
      })
      .catch((error) => {
        console.error("리뷰 등록 실패:", error);
        alert("리뷰 등록에 실패했습니다.");
      });
  };

  // 주문 목록을 날짜별로 그룹화
  const groupedByDate = buylists.reduce((acc, buylist) => {
    const date = moment(buylist.regdt).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(buylist);
    return acc;
  }, {});

  // 날짜별로 정렬 (내림차순)
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleToggleDetails = (id) => {
    setExpandedOrderIds((prev) => {
      const newExpandedOrderIds = new Set(prev);
      if (newExpandedOrderIds.has(id)) {
        newExpandedOrderIds.delete(id);
      } else {
        newExpandedOrderIds.add(id);
      }
      return newExpandedOrderIds;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <h2 className="text-2xl font-semibold mb-4">주문 목록</h2>
        {buylists.length === 0 ? (
          <p className="text-center text-gray-500">주문목록이 없습니다.</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="bg-white mb-6">
              <div className="bg-orange-300 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  {moment(date).format("YYYY년 MM월 DD일")}
                </h3>
              </div>
              {groupedByDate[date].map((buylist) => (
                <div key={buylist.id}>
                  <div
                    className="flex items-center justify-between px-6 py-4 border-b border-gray-200 cursor-pointer"
                    onClick={() =>
                      handleToggleDetails(buylist.buylistProductId)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      {/* 추가된 상태 표시 */}
                      <div className="text-sm font-semibold text-gray-700">
                        {buylist.status}
                      </div>
                      <img
                        src={`https://project-image.s3.ap-northeast-2.amazonaws.com/${
                          buylist.cate
                        }/${buylist.strImage.split(",")[0]}`}
                        alt={buylist.productName}
                        className="w-32 h-32 object-cover rounded-md cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${buylist.productId}`);
                        }}
                      />
                      <div>
                        <h4 className="text-md font-semibold">
                          {buylist.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          수량: {buylist.count}
                        </p>
                        <p className="text-sm text-gray-600">
                          가격: {buylist.price} 원
                        </p>
                        <div className="flex space-x-4">
                          <p className="text-sm text-gray-600">
                            상품 색상: {buylist.color}
                          </p>
                          <p className="text-sm text-gray-600">
                            상품 사이즈: {buylist.size}
                          </p>
                        </div>
                      </div>
                    </div>
                    <AiOutlineDown
                      className={`transition-transform duration-300 ${
                        expandedOrderIds.has(buylist.buylistProductId)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                  {expandedOrderIds.has(buylist.buylistProductId) && (
                    <div className="p-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-700">
                            요청사항: {buylist.request}
                          </p>
                          <p className="text-sm text-gray-700">
                            총 결제금액: {buylist.totalPrice} 원
                          </p>
                          <p className="text-sm text-gray-700">
                            구매일시:{" "}
                            {moment(buylist.regdt).format(
                              "YYYY년 MM월 DD일 HH:mm"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            받으실 분: {buylist.name}
                          </p>
                          <p className="text-sm text-gray-700">
                            휴대폰 번호: {buylist.tell}
                          </p>
                          <p className="text-sm text-gray-700">
                            우편번호: {buylist.mailaddr}
                          </p>
                          <p className="text-sm text-gray-700">
                            도로명주소: {buylist.roadaddr}
                          </p>
                          <p className="text-sm text-gray-700">
                            상세주소: {buylist.detailaddr}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-4">
                        {!confirmedOrders.has(buylist.id) &&
                        buylist.confirmation !== 1 ? (
                          <>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(
                                  buylist.id,
                                  buylist.productId,
                                  buylist.color,
                                  buylist.size,
                                  buylist.count
                                );
                              }}
                            >
                              주문취소
                            </button>
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmOrder(
                                  buylist.id,
                                  buylist.buylistProductId
                                );
                              }}
                            >
                              구매확정
                            </button>
                          </>
                        ) : (
                          <button
                            className={`${
                              buylist.hasReview === 1
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                            } text-white px-3 py-1 rounded`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (buylist.hasReview === 0) {
                                setSelectedProductId(buylist.productId);
                                setSelectedBuylistId(buylist.id);
                                setselecteBuylistProductId(
                                  buylist.buylistProductId
                                );
                                setShowReviewModal(true);
                              }
                            }}
                            disabled={buylist.hasReview === 1}
                          >
                            리뷰쓰기
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={(reviewData) => {
          handleReviewSubmit({
            ...reviewData,
            buylist_id: selectedBuylistId,
            product_id: selectedProductId,
            buylistProductId: selecteBuylistProductId,
          });
        }}
      />
    </div>
  );
};

export default BuyList;
