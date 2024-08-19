// src/pages/BottomPage.jsx
import React from "react";

const BottomPage = () => {
  return (
    <div className="bg-white px-12 py-12 max-w-screen-xl mx-auto">
      <div className="flex">
        {/* 왼쪽 섹션 */}
        <div className="w-1/2 px-8">
          <div className="flex items-left relative">
            <a href="/" className="flex items-center">
              <img
                src="/images/banner/Header.jpg" // 이미지 파일 경로
                alt="헬스문방구 로고" // 이미지 대체 텍스트
                className="w-16 h-12 object-contain" // 이미지 크기 설정
              />
            </a>
          </div>
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
          <div className="mb-3">
            {" "}
            {/* 각 묶음의 아래쪽 마진 설정 */}
            <h2 className="text-sl font-bold mb-2 text-left">
              {" "}
              {/* 묶음의 첫 번째 요소 */}
              헬스문방구는 쉬지 않습니다.
            </h2>
            <p className="text-xs text-left">
              하루정도는 빠질수 있지만 고객분들과 소통하며, 피드백에 귀 기울여,
              이를 제품 개선에 반영합니다.
            </p>
            <p className="text-xs text-left">
              품질과 기능, 그리고 가격 모두 놓치지 않는 철학을 담은 제품을
              제공합니다.
            </p>
          </div>

          <div className="mb-3">
            {" "}
            {/* 두 번째 묶음 */}
            <h2 className="text-sl font-bold mb-2 text-left">
              헬스문방구는 신뢰의 상징이 되고 싶습니다.
            </h2>
            <p className="text-xs text-left">
              고객분들에게 단순히 피트니스 제품을 만드는데서 끝나지 않고, 신뢰의
              상징이 되고자 매일 연구하고, 노력합니다.
            </p>
          </div>

          <div>
            {" "}
            {/* 세 번째 묶음 */}
            <h2 className="text-sl font-bold mb-2 text-left">
              헬스문방구는 운동인들만을 위한 전문 피트니스브랜드입니다.
            </h2>
            <p className="text-xs text-left">
              최고의 품질을 유지하기 위해 노력하고 있습니다. 앞으로도
              헬스문방구는 운동인들이 안심하고 사용할 수 있는 피트니스 브랜드의
              기준이 되고자 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPage;
