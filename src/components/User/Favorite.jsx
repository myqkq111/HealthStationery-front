import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import ProductItem from "../MainPage/ShopPage/ProductItem";

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
    console.log("테스트1 " + userId);
    axiosInstance
      .delete("/wishlist/remove", {
        data: {
          productId: productId,
          memberId: userId,
        },
      })
      .then(() => {
        console.log("테스트2 " + productId + "," + userId);
        setFavorites(favorites.filter((item) => item.productId !== productId));
      })
      .catch((error) => {
        console.log("테스트3 " + userId);
        console.error("찜 목록 제거 실패:", error);
        setError("찜 목록에서 삭제하는 데 실패했습니다.");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h2 className="text-xm font-semibold mr-2">찜 목록</h2>
        <span className="text-lg font-medium text-gray-600">
          ({favorites.length})
        </span>
      </div>
      {favorites.length === 0 ? (
        <p>찜 목록에 아이템이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => {
            const imageUrl = `${IMAGE_BASE_URL}${item.cate}/${item.id}.JPG`;

            return (
              <div
                key={item.id}
                className="relative border p-4 bg-white flex flex-col"
              >
                <div className="relative">
                  {/* X 버튼 */}
                  <div
                    className="absolute top-2 right-2 cursor-pointer bg-white p-1 rounded-full hover:bg-gray-200"
                    onClick={() => handleRemoveFavorite(item.productId)}
                    style={{ display: "none" }} // 기본적으로 숨김
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-red-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover mb-4 cursor-pointer"
                    onMouseEnter={(e) =>
                      (e.currentTarget.previousSibling.style.display = "block")
                    } // 마우스 오버 시 X 버튼 보이기
                    onMouseLeave={(e) =>
                      (e.currentTarget.previousSibling.style.display = "none")
                    } // 마우스 리브 시 X 버튼 숨기기
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

                  <p className="text-red-600 font-bold mb-4">{item.price}원</p>
                  <div
                    className="bg-yellow-300 flex items-center justify-center space-x-4 p-2 cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code",
                        "_blank"
                      )
                    }
                  >
                    <img
                      src="/assets/icons/kakao-icon1.png"
                      alt="아이콘"
                      className="w-4 h-4"
                    />
                    <span className="text-xs">
                      카카오톡 채널 추가하고 '재입고 알람' 신청하기 ▶
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
