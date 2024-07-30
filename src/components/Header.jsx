import React from "react";

const Header = () => {
  return (
    <nav
      style={{ borderTop: "2px solid #e5e7eb" }}
      className="bg-white p-4 sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-black text-xl font-bold">
          헬스문방구
        </a>
        <div className="flex-1 flex justify-center">
          <a href="#home" className="text-black px-4">
            BRAND STORY
          </a>
          <a href="#products" className="text-black px-4">
            SHOP
          </a>
          <a href="#contact" className="text-black px-4">
            커뮤니티
          </a>
          <a href="#contact" className="text-black px-4">
            문의게시판
          </a>
          <a href="#contact" className="text-black px-4">
            솔직구매후기
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
