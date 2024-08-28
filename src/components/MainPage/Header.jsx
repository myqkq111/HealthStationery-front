import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClothingDropdownOpen, setIsClothingDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 상태

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
      className="bg-white p-0 sticky top-0 z-10"
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* 브랜드 이름 */}
        <div className="flex items-center justify-center relative">
          <a href="/" className="flex items-center">
            <img
              src="/images/banner/Header.jpg"
              alt="헬스문방구 로고"
              className="w-full h-full object-cover" // 이미지 크기 설정
            />
          </a>
        </div>
        {/* 모바일 메뉴 */}
        <div
          className={`fixed inset-y-20 left-0 bg-gray-100 z-30 md:hidden transform transition-transform ${
            isMobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
          style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
        >
          <div className="flex flex-col p-4">
            <a
              href="/shop"
              className="text-black py-2 text-lg font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              운동장비
            </a>
            <a
              href="/clothing"
              className="text-black py-2 text-lg font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              의류
            </a>
            <a
              href="/review"
              className="text-black py-2 text-lg font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              솔직구매후기
            </a>
          </div>
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex flex-1 justify-center gap-4 relative">
          <a
            href="https://github.com/myqkq111/HealthStationery-front"
            className="text-black text-xl font-sans px-4 whitespace-nowrap tracking-wide font-bold"
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
              className="text-black text-xl font-sans px-4 whitespace-nowrap tracking-wide font-bold"
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
              className="text-black text-xl font-sans px-4 whitespace-nowrap tracking-wide font-semibold hover:text-gray-700 transition"
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
              </div>
            )}
          </div>
          <a
            href="/review"
            className="text-black text-xl font-sans px-4 whitespace-nowrap tracking-wide font-semibold hover:text-gray-700 transition"
          >
            솔직구매후기
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
