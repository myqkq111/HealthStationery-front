import React, { useState, useEffect } from "react";

import axiosInstance from "../api/AxiosInstance";

// API URL을 환경 변수로 관리하는 것이 좋습니다.

const Favorite = () => {
  const [favorites, setFavorites] = useState([]); // 찜 목록을 저장할 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(""); // 오류 메시지 상태

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-2">찜 목록</h2>
      {favorites.length === 0 ? (
        <p>찜 목록에 아이템이 없습니다.</p>
      ) : (
        <ul>
          {favorites.map((item) => (
            <li key={item.id} className="border-b py-2">
              <div className="flex justify-between">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600">{item.details}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorite;
