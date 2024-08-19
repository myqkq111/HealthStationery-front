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
            <h3 className="text-sm font-semibold">한 번 써보면 팬이 됩니다.</h3>
            <h3 className="text-sm font-semibold">
              운동장비에 바라던 당신의 생각, 헬스문방구가 되다.
            </h3>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">고객만족센터</h3>
            <p>MON-FRI</p>
            <p>10:00 - 17:00 (lunch 13:00 - 14:00)</p>
            <p>hello@zerotohero.co.kr</p>
          </div>
          <div className="text-left text-xs">
            <p>COMPANY NAME: (주)헬스문방구</p>
            <p>BUSINESS LICENSE: 123-45-67890 [사업자정보확인]</p>
            <p>MAIL ORDER LICENSE 2024-Seoul-Guro Digit-2024</p>
            <p>Hosting by (주)Final Project</p>
            <p>TEL 02-1234-5678 Owner Junseo Choi</p>
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
          <p className="text-sm font-bold">
            COPYRIGHT &copy; 2024 Healthmoonbangu ALL RIGHTS RESERVED.{" "}
            <span className="text-xs">
              헬스문방구의 허가 없이 사이트 내의 디자인 및 이미지 등을 무단
              복제, 사용할 수 없습니다. 고객님은 안전거래를 위해 현금 등으로
              결제시 저희 쇼핑몰에서 가입한 KG사의 구매안전서비스를 이용하실 수
              있습니다. [이노시스 가입확인]
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
