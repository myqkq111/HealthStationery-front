import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

  const toggleDropdown = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const toggleContactDropdown = (isOpen) => {
    setIsContactDropdownOpen(isOpen);
  };

  return (
    <nav
      style={{ borderTop: "2px solid #e5e7eb" }}
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

        <div className="flex-1 flex justify-center gap-4 relative ">
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
              SHOP
            </a>
            {isDropdownOpen && (
              <div
                className="absolute left-0 w-44 bg-white border border-gray-300 shadow-lg rounded-md z-20"
                style={{ top: "100%" }}
              >
                <a
                  href="/shop"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  모두보기
                </a>
                <a
                  href="/gripps"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  그립/스트랩
                </a>
                <a
                  href="/wrist"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  손목
                </a>
                <a
                  href="/elbows"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  팔꿈치
                </a>
                <a
                  href="/knees"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  무릎
                </a>
                <a
                  href="/arms"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  팔
                </a>
                <a
                  href="/back"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  등/허리
                </a>
                <a
                  href="/powerlifting"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  파워리프팅/스트렝스
                </a>
                <a
                  href="/workoutgear"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  기타운동장비
                </a>
                <a
                  href="/clothing"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition tracking-wide"
                >
                  의류
                </a>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => toggleContactDropdown(true)}
            onMouseLeave={() => toggleContactDropdown(false)}
          >
            <a
              href="#contact"
              className="text-black px-4 whitespace-nowrap tracking-wide font-semibold hover:text-gray-700 transition"
            >
              문의게시판
            </a>
            {isContactDropdownOpen && (
              <div
                className="absolute left-0 w-56 bg-white border border-gray-300 shadow-lg rounded-md z-20"
                style={{ top: "100%" }}
              >
                <a
                  href="/fnq"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition"
                >
                  고객센터
                </a>
                <a
                  href="/wearing-guide"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition"
                >
                  착용법
                </a>
                <a
                  href="/faq"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition"
                >
                  FAQ
                </a>
                <a
                  href="/partnership"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 transition"
                >
                  제휴문의
                </a>
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
