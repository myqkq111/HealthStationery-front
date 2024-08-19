import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "/images/products/"; // 이미지 기본 경로

const Favorite = () => {
  const [favorites, setFavorites] = useState([]); // 찜 목록을 저장할 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(""); // 오류 메시지 상태
  const navigate = useNavigate();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("member")).id;

    // 비동기 함수 정의
    const fetchFavorites = () => {
      axiosInstance
        .get(`/wishlist/view?id=${userId}`) // 서버 API 호출
        .then((response) => {
          const fetchedFavorites = response.data;
          console.log(fetchedFavorites);
          setFavorites(fetchedFavorites);
        })
        .catch((err) => {
          console.error("찜 목록 가져오기 실패:", err);
          setError("찜 목록을 가져오는 데 실패했습니다.");
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchFavorites();
  }, []);

  // 찜목록에서 제거
  const handleRemoveFavorite = (productId) => {
    const userId = JSON.parse(localStorage.getItem("member")).id;
    axiosInstance
      .delete("/wishlist/remove", {
        data: {
          productId: productId,
          memberId: userId,
        },
      })
      .then(() => {
        setFavorites(favorites.filter((item) => item.productId !== productId));
      })
      .catch((error) => {
        console.error("찜 목록 제거 실패:", error);
        setError("찜 목록에서 삭제하는 데 실패했습니다.");
      });
  };

  // 상품 상세 페이지로 이동
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // 상품 ID를 URL에 추가하여 상세 페이지로 이동
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">찜 목록</h2>
        <span className="text-2xl font-semibold mb-4">
          ({favorites.length})
        </span>
      </div>
      {favorites.length === 0 ? (
        <p>찜 목록에 아이템이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => {
            const imageUrl = `${IMAGE_BASE_URL}${item.cate}/${
              item.strImage.split(",")[0]
            }`;
            return (
              <div
                key={item.id}
                className="relative border p-4 bg-white flex flex-col"
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover mb-4 cursor-pointer"
                    onError={(e) => {
                      console.error(`Failed to load image at ${imageUrl}`);
                      e.currentTarget.src = "/path/to/default-image.jpg";
                    }}
                    onClick={() => handleProductClick(item.productId)} // 상품 클릭 시 상세 페이지로 이동
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-red-600 font-bold mb-4">{item.price}원</p>
                  <div className="bg-yellow-300 flex items-center justify-center space-x-4 p-2 cursor-pointer">
                    <img
                      src="/assets/icons/kakao-icon1.png"
                      alt="아이콘"
                      className="w-4 h-4"
                    />
                    <span className="text-xs">
                      카카오톡 채널 추가하고 '재입고 알람' 신청하기 ▶
                    </span>
                  </div>
                  {/* 휴지통 버튼 */}
                  <div
                    className="mt-4 flex justify-center items-center cursor-pointer"
                    onClick={() => handleRemoveFavorite(item.productId)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-600 hover:text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 7h16M10 11v6m4-6v6M5 7V4a1 1 0 011-1h12a1 1 0 011 1v3M9 7v12a2 2 0 002 2h4a2 2 0 002-2V7"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 hover:text-red-500">
                      삭제
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorite;
