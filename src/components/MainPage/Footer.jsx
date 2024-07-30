// src/components/Footer.js
import React from "react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaGoogle,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-black py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* 상단 가로 한 줄 */}
        <div className="grid grid-cols-1 text-center mb-8">
          <p className="font-bold">&copy; 이용약관 | 개인정보처리방침</p>
        </div>

        {/* 중간 세로 4개 */}
        <div className="grid grid-cols-4 gap-4 mb-8 text-center">
          <div>
            <h3 className="text-lg font-semibold">한 번 써보면 팬이 됩니다.</h3>
            <h3 className="text-lg font-semibold">
              운동장비에 바라던 당신의 생각, 헬스문방구가 되다.
            </h3>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">고객만족센터</h3>
            <p>MON-FRI</p>
            <p>10:00 - 17:00 (lunch 13:00 - 14:00)</p>
            <p>hello@zerotohero.co.kr</p>
          </div>
          <div className="text-left">
            <p>할말이 없어</p>
          </div>
          <div className="flex flex-col justify-between">
            <br></br>
            <br></br>
            <div className="flex justify-center space-x-4 mt-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition"
              >
                <FaInstagram size={30} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition"
              >
                <FaYoutube size={30} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition"
              >
                <FaFacebook size={30} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition"
              >
                <FaTwitter size={30} />
              </a>
              <a
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition"
              >
                <FaGoogle size={30} />
              </a>
            </div>
          </div>
        </div>

        {/* 하단 가로 한 줄 */}
        <div className="grid grid-cols-1 text-center">
          <p className="text-sm">홈페이지 도용하면 혼나</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
