// src/pages/BottomPage.jsx
import React from "react";

const BottomPage = () => {
  return (
    <div className="bg-white px-12 py-12 max-w-screen-xl mx-auto">
      <div className="flex">
        {/* 왼쪽 섹션 */}
        <div className="w-1/2 px-8">
          <div
            className="border-b-4 border-black mb-2 "
            style={{ width: "calc(70% - 120px)" }}
          ></div>
          <h2 className="text-2xl font-bold text-left">안심하세요.</h2>
          <h2 className="text-2xl font-bold text-left mb-2">헬스문방구</h2>
          <div
            className="border-b-4 border-black"
            style={{ width: "calc(70% - 120px)" }}
          ></div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="w-1/2 px-8">
          <h2 className="text-2xl font-bold mb-4 text-left">
            오른쪽 섹션 제목
          </h2>
          <p className="text-lg text-left">
            여기에 오른쪽 섹션의 내용을 작성하세요. 이 영역은 오른쪽 절반을
            차지하며, 왼쪽 섹션과 유사한 디자인을 갖고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BottomPage;
