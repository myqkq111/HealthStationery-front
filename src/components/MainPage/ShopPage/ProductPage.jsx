import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import ProductReviewSection from "./ProductReviewSection";
import ProductItem from "./ProductItem";
import ScrollToTopButton from "../ScrollToTopButton";
import axiosInstance from "../../api/AxiosInstance";
import Swal from "sweetalert2";
import InquiryList from "./InquiryList";

const ProductPage = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState();
  const [error, setError] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [inquiries, setInquiries] = useState("");
  const [options, setOptions] = useState({ sizes: [], colors: [] });
  const [contentImages, setContentImages] = useState([]); // 추가된 상태
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [optionError, setOptionError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [quantity, setQuantity] = useState(1); // 수량 상태 추가
  const [price, setPrice] = useState(0); // 가격 상태 추가
  const [stock, setStock] = useState({}); // 재고 상태 추가
  const [likeCount, setLikeCount] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const currentUrl = window.location.pathname + window.location.search;

  // 로그인된 유저의 uid 가져오기 (localStorage에서 가져오고, null 처리)
  const uid = localStorage.getItem("member")
    ? JSON.parse(localStorage.getItem("member")).id
    : null;

  useEffect(() => {
    const fetchProduct = () => {
      // 로그인 상태에 따라 URL 결정
      const url = uid
        ? `/product/selectOne?id=${id}&uid=${uid}`
        : `/product/selectOne?id=${id}`;
      axiosInstance
        .get(url)
        .then((response) => {
          const productDetailsMap = response.data;
          const productData = productDetailsMap.product;
          setInquiries(productDetailsMap.inquiries);
          console.log(productDetailsMap.inquiries);
          setProduct(productData);
          setLikeCount(productData.like);
          if (productData.likeToggle) setIsLiked(true);
          // 이미지 파일 경로를 ,로 구분된 문자열로 받아오고, 배열로 변환합니다.
          const strImage = productData.strImage.split(",");
          const defaultImage = strImage[0]
            ? `/images/products/${productData.cate}/${strImage[0]}`
            : "";
          setMainImage(defaultImage);

          const thumbnails = strImage.map(
            (path) => `/images/products/${productData.cate}/${path}`
          );
          setThumbnails(thumbnails);

          const strContentImage = productData.strContentImage.split(",");
          const contentImages = strContentImage.map(
            (path) => `/images/products/${productData.cate}/${path}`
          );
          console.log(contentImages);
          setContentImages(contentImages);

          // list에서 옵션 데이터 추출
          const sizes = [...new Set(productData.list.map((item) => item.size))];
          const colors = [
            ...new Set(productData.list.map((item) => item.color)),
          ];

          // 재고 정보 설정
          const stock = {};
          productData.list.forEach((item) => {
            if (!stock[item.color]) {
              stock[item.color] = {};
            }
            stock[item.color][item.size] = item.stock;
          });

          setOptions({
            sizes,
            colors,
          });
          setPrice(productData.price); // 상품가격
          setStock(stock);
        })
        .catch((error) => {
          console.error("상품 정보를 가져오는 데 실패했습니다:", error);
          setError(error);
        });
    };
    fetchProduct();
  }, [id, uid]);

  // 상품이 없는 경우에는 빈 상태로 초기화
  const [mainImage, setMainImage] = useState(); // 초기 이미지 설정
  const [fade, setFade] = useState(false);

  const detailsRef = useRef(null);
  const reviewRef = useRef(null);
  const Inquiry = useRef(null);

  // const defaultImage = `/images/products/${[product.cate]}/1.JPG`;

  const scrollToSection = (ref) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    return !!localStorage.getItem("member"); // 사용자 정보가 있으면 true, 없으면 false
  };

  // 로그인 알림 표시 및 페이지 리디렉션
  const handleLoginPrompt = () => {
    Swal.fire({
      title: "로그인 필요",
      text: "로그인 후 이용할 수 있습니다. 로그인 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "로그인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      }
    });
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = (action) => {
    if (!checkLoginStatus()) {
      handleLoginPrompt();
    } else {
      action();
    }
  };

  // 현재 썸네일 인덱스
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(
    thumbnails.findIndex((thumbnail) => thumbnail === mainImage)
  );

  // 클릭 시 메인 이미지 변경
  const handleThumbnailClick = (index) => {
    setMainImage(thumbnails[index]); // 클릭한 썸네일 이미지로 메인 이미지 변경
    setCurrentThumbnailIndex(index); // 현재 썸네일 인덱스 업데이트
  };

  // 디바운스된 핸들러
  const debouncedHandleMouseEnter = useCallback(
    debounce((index) => {
      setFade(true);
      setMainImage(thumbnails[index]); // 마우스 오버 시 메인 이미지 변경
    }, 200), // 200ms 디바운스
    [thumbnails]
  );

  const handleMouseEnter = (index) => {
    debouncedHandleMouseEnter(index);
  };

  // 옵션 선택
  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColor(value);
    setColorError(!value);
    // 색상이 선택되면 사이즈 선택 가능하게 합니다.
    if (value) {
      document.getElementById("size").disabled = false;
      setQuantity(0); // 수량을 1로 초기화
    } else {
      document.getElementById("size").disabled = true;
      setSelectedOption(""); // 색상이 선택되지 않으면 사이즈도 선택 해제
      setQuantity(0); // 색상이 선택되지 않으면 수량도 1로 초기화
    }
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setOptionError(!value);

    if (value) {
      setQuantity(0); // 수량을 1로 초기화
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      const maxStock = stock[selectedColor]?.[selectedOption] || 0;

      if (newQuantity < 1) return 1; // 수량이 1보다 작아지지 않도록

      if (newQuantity > maxStock) {
        alert(`재고가 부족합니다. 최대 수량은 ${maxStock}개입니다.`);
        return maxStock; // 최대 재고로 수량 조정
      }

      return newQuantity;
    });
  };

  // 제출 처리
  const handleSubmit = (event) => {
    // event.preventDefault();
    let valid = true;
    if (!selectedOption) {
      setOptionError(true);
      valid = false;
    } else {
      setOptionError(false);
    }
    if (!selectedColor) {
      setColorError(true);
      valid = false;
    } else {
      setColorError(false);
    }

    let data = [
      {
        cate: product.cate,
        color: selectedColor,
        count: quantity,
        memberId: JSON.parse(localStorage.getItem("member")).id,
        name: product.name,
        price: product.price,
        productId: product.id,
        size: selectedOption,
        strImage: product.strImage,
      },
    ];

    let totalPayment = 0;
    if (product.price * quantity < 50000) {
      totalPayment += product.price * quantity + 3000; // 50,000원 미만인 경우 3,000원을 더함
    } else {
      totalPayment += product.price * quantity; // 50,000원 이상인 경우 원래 가격 사용
    }

    if (valid) {
      navigate("/payment", {
        state: {
          cartItems: data,
          totalPayment: totalPayment,
          purchaseSource: 0,
        },
      });
    }
  };

  const handleGoToCart = () => {
    const userId = JSON.parse(localStorage.getItem("member")).id;
    const data = new FormData();
    data.append("productId", product.id);
    data.append("memberId", userId);
    data.append("color", selectedColor);
    data.append("size", selectedOption); // 사이즈는 옵션일 수 있음
    data.append("count", quantity);

    // 색상, 수량 선택 여부 확인
    if (!selectedColor || quantity <= 0) {
      Swal.fire({
        title: "선택 사항이 누락되었습니다.",
        text: "색상, 수량을 모두 선택해 주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return; // 선택이 완료되지 않으면 함수 종료
    }

    // 상품이 사이즈를 필요로 하는 경우
    const requiresSize = product.sizes && product.sizes.length > 0;

    if (requiresSize && !selectedOption) {
      Swal.fire({
        title: "사이즈 선택 누락",
        text: "사이즈를 선택해 주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return; // 사이즈가 필요한 상품인데 사이즈가 선택되지 않은 경우
    }

    const maxStock = stock[selectedColor]?.[selectedOption] || 0;

    if (quantity > maxStock) {
      Swal.fire({
        title: "재고 부족",
        text: `재고가 부족합니다. 최대 수량은 ${maxStock}개입니다.`,
        icon: "warning",
        confirmButtonText: "확인",
      });
      return; // 수량이 재고를 초과하면 함수 종료
    }

    axiosInstance
      .post("/basket/check", data)
      .then((response) => {
        if (response.data === 0) {
          // 장바구니에 없는 상품일 경우
          axiosInstance
            .post("/basket/insert", data)
            .then(() => {
              setLoading(false);
              Swal.fire({
                title: "상품이 장바구니에 추가되었습니다.",
                text: "장바구니 페이지로 이동하시겠습니까?",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "네",
                cancelButtonText: "아니요",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/cart", {
                    state: {
                      productId: product.id,
                      selectedOption,
                      selectedColor,
                      quantity,
                    },
                  });
                }
              });
            })
            .catch((error) => {
              console.error("Error adding to cart:", error);
              setError("장바구니에 추가하는 도중 오류가 발생했습니다.");
              setLoading(false);
            });
        } else {
          Swal.fire({
            title: "이미 장바구니에 등록된 상품입니다.",
            text: "상품 개수를 증가시키겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",
          }).then((result) => {
            if (result.isConfirmed) {
              axiosInstance
                .put(`/basket/countup?id=${response.data}`)
                .then(() => {
                  Swal.fire({
                    title: "수량이 증가되었습니다.",
                    text: "장바구니 페이지로 이동하시겠습니까?",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonText: "네",
                    cancelButtonText: "아니요",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate("/cart", {
                        state: {
                          productId: product.id,
                          selectedOption,
                          selectedColor,
                          quantity: quantity + 1,
                        },
                      });
                    }
                  });
                })
                .catch((error) => {
                  console.error("Failed to increase quantity:", error);
                  Swal.fire(
                    "오류",
                    "장바구니 수량 증가 도중 오류가 발생했습니다.",
                    "error"
                  );
                });
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error verifying cart:", error);
        setError("장바구니 확인 도중 오류가 발생했습니다.");
        setLoading(false);
      });
  };
  // 찜
  const [isLiked, setIsLiked] = useState(false); // 찜 상태 관리

  const handleWishlistToggle = () => {
    const newLikedStatus = !isLiked;

    if (newLikedStatus) {
      axiosInstance
        .post("/wishlist/add", {
          productId: product.id,
          memberId: uid,
        })
        .then(() => {
          setIsLiked(newLikedStatus);
          setLikeCount(likeCount + 1);
        })
        .catch((error) => {
          console.error("찜 목록 추가 실패:", error);
        });
    } else {
      axiosInstance
        .delete("/wishlist/remove", {
          data: {
            productId: product.id,
            memberId: uid,
          },
        })
        .then(() => {
          setIsLiked(newLikedStatus);
          setLikeCount(likeCount - 1);
        })
        .catch((error) => {
          console.error("찜 목록 제거 실패:", error);
        });
    }
  };
  // 서버에서 관련 상품 데이터 가져오기
  useEffect(() => {
    axiosInstance
      .get("/product/selectAll")
      .then((response) => {
        setRelatedProducts(response.data); // 응답 데이터를 상태에 저장
        setLoading(false); // 로딩 상태 업데이트
      })
      .catch((err) => {
        setError(err); // 오류 상태 업데이트
        setLoading(false); // 로딩 상태 업데이트
      });
  }, []); // 컴포넌트 마운트 시 데이터 요청

  const totalPrice = price * quantity; // 총 가격 계산

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 메시지
  if (error) return <p>Error: {error.message}</p>; // 오류 발생 시 메시지

  if (!product) {
    return <p>상품 정보가 없습니다.</p>; // 데이터가 없을 때 메시지
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-24">
        {/* Breadcrumbs (탐색 경로) */}
        <nav className="mb-4">
          <ol className="list-reset flex text-black text-sm">
            <li>
              <Link to="/" className="hover:text-gray-600">
                Home
              </Link>
              <span className="mx-2">▶</span>
            </li>
            <li>
              <Link to="/shop" className="hover:text-gray-600">
                Shop
              </Link>
              <span className="mx-2">▶</span>
            </li>
            <li>상세 정보</li>
          </ol>
        </nav>

        {/* Product Detail Section (상품 상세 정보 섹션) */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Image Section (이미지 섹션) */}
          <div className="flex-1">
            {/* Main Image (메인 이미지) */}
            <img
              src={mainImage} // 메인 이미지 URL
              alt={product.name} // 이미지 대체 텍스트
              className={`w-full h-auto object-contain transition-opacity duration-700 ease-in-out ${
                fade ? "opacity-100" : "opacity-100"
              }`} // 수정: object-contain으로 이미지 크기 조절
              style={{ maxHeight: "600px" }} // 수정: 최대 높이 설정 (필요에 따라 조정)
            />

            {/* Thumbnail Images (썸네일 이미지들) */}
            <div className="mt-4 flex gap-2 overflow-x-auto flex-wrap">
              {thumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail} // 썸네일 이미지 URL
                  alt={`썸네일 ${index + 1}`} // 이미지 대체 텍스트
                  className="w-16 h-16 object-cover cursor-pointer" // 선택된 썸네일에 테두리 추가
                  onClick={() => handleThumbnailClick(index)} // 클릭 시 메인 이미지 변경
                  onMouseEnter={() => handleMouseEnter(index)} // 마우스 오버 시 메인 이미지 변경
                />
              ))}
            </div>
          </div>

          {/* Details Section (상품 상세 정보 섹션) */}
          <div className="flex-1 px-4 sm:px-6 lg:px-0">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg mb-2">리뷰: {product.reviews}개</p>
            <p className="text-lg mb-8">가격: {product.price}원</p>
            <hr className="mb-6" />
            <p className="text-lg text-sm font-semibold font-serif mb-2">
              {product.content}
            </p>
            <div
              className="bg-yellow-300 flex items-center justify-center space-x-4 p-2 cursor-pointer mb-14"
              onClick={() =>
                window.open(
                  "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code",
                  "_blank"
                )
              }
            >
              <img
                src="/assets/icons/kakao-icon1.png"
                alt="아이콘"
                className="w-10 h-10"
              />
              <span className="text-xl">
                카카오톡 채널 추가하고 '재입고 알람' 신청하기 ▶
              </span>
            </div>
            <div className="text-xs font-mono text-gray-500 mb-2">
              <p>배송 방법 택배</p>
              <p>배송비 3000원 (50,000원 이상 무료배송)</p>
              <p>배송 안내 ※1개 주문 시 좌,우 1쌍 발송됩니다.</p>
            </div>
            <div className="bg-gray-100 flex items-center justify-between space-x-4 p-2 mb-8">
              <div className="flex items-center space-x-4 p-1">
                <img
                  src="/assets/icons/truck-icon.png" // 택배 트럭 아이콘 경로
                  alt="택배 트럭 아이콘"
                  className="w-10 h-10"
                />
                <div className="flex flex-col">
                  <p className="font-bold">오늘 출발 상품</p>
                  <p>
                    <span className="text-red-500 font-bold">
                      오늘 14:00까지 결제
                    </span>
                    시 오늘 바로 발송됩니다.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-6">
                <label className="font-semibold mb-2" htmlFor="color">
                  색상(필수선택)
                </label>
                <select
                  id="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="border border-gray-300 p-2"
                >
                  <option value="">선택하세요</option>
                  {options.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {colorError && (
                  <p className="text-red-500 text-sm">
                    색상을 선택하세요.(필수)
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-6">
                <label className="font-semibold mb-2" htmlFor="size">
                  사이즈(필수선택)
                </label>
                <select
                  id="size"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="border border-gray-300 p-2"
                  disabled={!selectedColor} // 색상이 선택되지 않은 경우 선택 불가
                >
                  <option value="">선택하세요</option>
                  {options.sizes.map((size) => {
                    const sizeStock = stock[selectedColor]?.[size] || 0;
                    return (
                      <option
                        key={size}
                        value={size}
                        disabled={sizeStock === 0} // 재고가 0인 경우 선택 불가
                      >
                        {sizeStock === 0 ? `${size} (품절)` : size}
                      </option>
                    );
                  })}
                </select>
                {optionError && (
                  <p className="text-red-500 text-sm">
                    사이즈를 선택하세요.(필수)
                  </p>
                )}
              </div>
              {/* Quantity Selection (수량 선택) */}
              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  수량
                </label>
                <div className="flex items-center mt-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-gray-200 border border-gray-300 px-3 py-1 text-gray-700"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-t border-b border-gray-300 px-3 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="bg-gray-200 border border-gray-300 px-3 py-1 text-gray-700 "
                  >
                    +
                  </button>
                  <p className="ml-4 font-semibold">
                    총 가격: {totalPrice.toLocaleString()} 원
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                {/* 바로 구매 버튼 */}
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300 ease-in-out flex-1 max-w-xs"
                  onClick={() => handleButtonClick(handleSubmit)}
                >
                  바로 구매
                </button>

                {/* 장바구니 버튼 */}
                <button
                  type="button"
                  className="bg-white text-black border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out flex-1 max-w-xs"
                  onClick={() => handleButtonClick(handleGoToCart)}
                >
                  장바구니
                </button>

                {/* 찜(하트) 버튼 */}
                <button
                  type="button"
                  onClick={() => handleButtonClick(handleWishlistToggle)}
                  className={`bg-white text-black border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out flex-1 max-w-xs ${
                    isLiked ? "text-red-500" : ""
                  }`}
                >
                  {isLiked ? "❤" : "🤍"}
                  <span className="text-base text-black font-semibold">
                    {likeCount}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 중단 영역 */}
        <div className="border border-gray-300  bg-white flex mb-8">
          <div className="flex-1 p-2 border-r border-gray-300 text-center">
            <p
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => scrollToSection(detailsRef)}
            >
              상세정보
            </p>
          </div>

          <div className="flex-1 p-2 border-r border-gray-300 text-center">
            <p
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => scrollToSection(reviewRef)}
            >
              리뷰
            </p>
          </div>
          <div className="flex-1 p-2 text-center">
            <p
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => scrollToSection(Inquiry)}
            >
              문의 게시판
            </p>
          </div>
        </div>

        {/* 이미지 */}
        <div>
          <div className="prose">
            {contentImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Content ${index}`}
                className="w-full h-auto object-cover"
              />
            ))}
          </div>
        </div>

        {/* 표 */}
        <div className="bg-white p-2 mb-16">
          <div className="text-sm font-semibold mb-2">상품정보 제공고시</div>
          <hr />

          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">풀명 및 모델명</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {product.name}
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">크기, 중량</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              약 130g
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">색상</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              상세페이지 참조
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">재질</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              Rubber,Nylone,Neoprene
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">제품구성</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              제로투히어로 그립테크 논슬립 헬스 스트랩 본풀
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">
              동일모델의 출시년월
            </div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              2018년 5월 출시
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">제조자</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              ZEROTOHERO
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">제조국</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              중국
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">
              상품별 세부 사양
            </div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              상세페이지 참조
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">품질보증기준</div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              소비자 분쟁해결기준(공정거래위원회 고시)및 관계법령에 따릅니다.
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="bg-gray-100 text-sm p-2 w-1/3">
              A/S 책임자와 전화번호
            </div>
            <div className="p-2 w-2/3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              카카오톡플러스 @헬스문방구
            </div>
          </div>
          <hr />
        </div>

        {/* 상품 리뷰 섹션 */}
        <div ref={reviewRef} className="">
          <ProductReviewSection productId={product.id} product={product} />
        </div>

        <div ref={Inquiry} className="mb-4">
          <InquiryList Inquiry={inquiries} product={product} />
        </div>

        <div className="text-xl font-bold mb-4">함께 많이 구매한 아이템</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedProducts.map((product) => (
            <ProductItem
              key={product.id}
              image={product.image}
              hoverImage={product.hoverImage}
              name={product.name}
              price={product.price}
              details={product.details}
              reviews={product.reviews}
              link={product.link}
            />
          ))}
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default ProductPage;
