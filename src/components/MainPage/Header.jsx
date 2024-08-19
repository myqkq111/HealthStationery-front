import React, { useState } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClothingDropdownOpen, setIsClothingDropdownOpen] = useState(false);

  const toggleDropdown = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const toggleClothingDropdown = (isOpen) => {
    setIsClothingDropdownOpen(isOpen);
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault(); // 기본 링크 동작 방지
    window.location.href = `/${path}`;
  };

  return (
    <nav
      style={{ borderTop: "2px solid #E5E7EB" }}
      className="bg-white p-0 sticky top-0 z-20"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* 브랜드 이름 */}
        <div className="flex items-center justify-center relative">
          <a href="/" className="flex items-center">
            <img
              src="/images/banner/Header.jpg" // 이미지 파일 경로
              alt="헬스문방구 로고" // 이미지 대체 텍스트
              className="w-16 h-12 object-contain" // 이미지 크기 설정
            />
          </a>
        </div>
        <div className="flex-1 flex justify-center gap-4 relative">
          <a
            href="/about"
            className="text-black px-4 whitespace-nowrap tracking-wide font-bold"
          >
            BRAND STORY
          </a>
          <div
            className="relative"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <a
              href="/shop"
              className="text-black px-4 whitespace-nowrap tracking-wide font-bold"
            >
              운동장비
            </a>
            {isDropdownOpen && (
              <div
                className="absolute left-0 w-44 bg-white border border-gray-300 z-20"
                style={{ top: "100%" }}
              >
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "shop")}
                >
                  모두보기
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "gripps")}
                >
                  그립/스트랩
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "wrist")}
                >
                  손목
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "elbows")}
                >
                  팔꿈치
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "knees")}
                >
                  무릎
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "arms")}
                >
                  팔
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "back")}
                >
                  등/허리
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "powerlifting")}
                >
                  파워리프팅/스트렝스
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "workoutgear")}
                >
                  기타운동장비
                </button>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => toggleClothingDropdown(true)}
            onMouseLeave={() => toggleClothingDropdown(false)}
          >
            <a
              href="/clothing"
              className="text-black px-4 whitespace-nowrap tracking-wide font-semibold hover:text-gray-700 transition"
            >
              의류
            </a>
            {isClothingDropdownOpen && (
              <div
                className="absolute left-0 w-44 bg-white border border-gray-300 z-20"
                style={{ top: "100%" }}
              >
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "clothing")}
                >
                  모두보기
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "tops")}
                >
                  상의
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "bottoms")}
                >
                  하의
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide text-left"
                  onClick={(e) => handleLinkClick(e, "other-clothing")}
                >
                  기타 의류
                </button>
              </div>
            )}
          </div>
          <a
            href="#review"
            className="text-black px-4 whitespace-nowrap tracking-wide font-semibold hover:text-gray-700 transition"
          >
            솔직구매후기
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
