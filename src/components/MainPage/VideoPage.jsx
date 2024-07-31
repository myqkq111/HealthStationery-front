// src/pages/VideoPage.jsx
import React from "react";

const VideoPage = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 상단 텍스트 및 수평선 */}
      <div className="top-0 left-0 w-full text-center p-4 bg-white text-black z-20">
        <h2 className="text-3xl font-bold mb-8">MOTIVATION - RUFF DIESEL</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24 mx-auto" />
        </div>
      </div>

      {/* 비디오 */}
      <video
        className="top-0 left-0 w-full h-full object-cover"
        src="/videos/Video.mp4"
        autoPlay
        muted
        loop
      />
    </div>
  );
};

export default VideoPage;
