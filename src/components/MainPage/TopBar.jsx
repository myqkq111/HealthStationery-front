// src/components/MainPage/TopBar.jsx
import React, { useEffect, useState } from "react";

const banners = [
  {
    text: "@헬스문방구와 카톡친구해요! 친구하면 1,000원 할인쿠폰 지급, 실시간 상담도 OK",
    link: "https://www.kakaocorp.com/page/service/service/KakaoTalk",
    style: "bg-yellow-300",
    isExternal: true,
    icon: "/assets/icons/kakao-icon.png",
  },
  {
    text: "회원가입하고 1000포인트, 회원전용 특별한 혜탁 받아보세요",
    link: "/login",
    style: "bg-blue-400 text-white",
    isExternal: false,
  },
  {
    text: "평일 오후 2시까지 결제 시 당일배송, 5만원 이상 구매 시 무료배송",
    link: "/shop",
    style: "bg-green-600 text-white",
    isExternal: false,
  },
  {
    text: "한 번 써보면 팬이 됩니다. 비교불가 피트니스 솔루션, 까다라운 프로들의 선택",
    link: "/shop",
    style: "bg-black text-white",
    isExternal: false,
  },
];

const TopBar = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBannerClick = (link, isExternal) => {
    if (isExternal) {
      window.open(link, "_blank");
    } else {
      window.location.pathname = link;
    }
  };

  const currentBanner = banners[currentBannerIndex];

  return (
    <div
      className={`text-black p-2 top-0 inset-x-0 z-30 ${currentBanner.style}`}
      onClick={() =>
        handleBannerClick(currentBanner.link, currentBanner.isExternal)
      }
      style={{ height: "auto", marginBottom: 0 }} // 여백 제거
    >
      <div className="flex items-center justify-center cursor-pointer">
        {currentBanner.icon && (
          <img src={currentBanner.icon} alt="아이콘" className="w-6 h-6 mr-2" />
        )}
        <span>{currentBanner.text}</span>
      </div>
    </div>
  );
};

export default TopBar;
