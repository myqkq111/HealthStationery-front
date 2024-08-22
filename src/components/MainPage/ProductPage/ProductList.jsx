// src/components/MainPage/ProductPage/ProductList.js
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosInstance from "../../api/AxiosInstance"; // API 인스턴스 import

// 커스텀 화살표 컴포넌트 정의
const Arrow = ({ className, onClick, icon }) => (
  <div
    className={`${className} bg-gray-700 text-black p-3 border-2 border-gray-600 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-600`}
    onClick={onClick}
  >
    {icon}
  </div>
);

// 제품 리스트 컴포넌트 정의
const ProductList = ({ type }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 데이터 fetch
    const fetchProducts = () => {
      axiosInstance
        .get(`/product/${type}`) // type을 URL에 추가
        .then((response) => {
          setProducts(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          setError("제품을 가져오는 데 실패했습니다.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchProducts();
  }, [type]);

  // 슬라이더 설정
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <Arrow icon={<FaChevronRight />} />,
    prevArrow: <Arrow icon={<FaChevronLeft />} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{type}</h2>
        <div className="flex justify-center mb-4">
          <hr className="border-t-2 border-gray-300 w-24" />
        </div>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard
                id={product.id}
                cate={product.cate}
                name={product.name}
                image={product.strImage}
                price={product.price}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProductList;
