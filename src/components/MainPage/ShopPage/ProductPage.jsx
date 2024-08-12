import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import ProductReviewSection from "./ProductReviewSection";
import ProductItem from "./ProductItem";
import ScrollToTopButton from "../ScrollToTopButton";
import axiosInstance from "../../api/AxiosInstance";

const ProductPage = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState();
  const [error, setError] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [options, setOptions] = useState({ sizes: [], colors: [] });
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const uid = JSON.parse(localStorage.getItem("member")).id;
  useEffect(() => {
    const fetchProduct = () => {
      axiosInstance
        .get(`/product/selectOne?id=${id}&uid=${uid}`)
        .then((response) => {
          const productData = response.data;
          setProduct(productData);
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

          // 옵션과 색상 데이터를 상태에 저장합니다.
          const strOptionName = productData.strOptionName || ""; // 예시: "size,color"
          const strOptionValue = productData.strOptionValue || ""; // 예시: "S,M,L,XL|AllBlack,Grey,Red,Black"
          const optionNames = strOptionName.split(",");
          const optionValues = strOptionValue.split("|");

          // 사이즈와 색상 옵션을 추출합니다.
          const sizes = optionValues[0] ? optionValues[0].split(",") : [];
          const colors = optionValues[1] ? optionValues[1].split(",") : [];

          setOptions({
            sizes,
            colors,
          });
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

  // const defaultImage = `/images/products/${[product.cate]}/1.JPG`;

  const scrollToSection = (ref) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
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

  // 상태 관리
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [optionError, setOptionError] = useState(false);
  const [colorError, setColorError] = useState(false);

  // 옵션 선택
  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColor(value);
    setColorError(!value);
    // 색상이 선택되면 사이즈 선택 가능하게 합니다.
    if (value) {
      document.getElementById("size").disabled = false;
    } else {
      document.getElementById("size").disabled = true;
      setSelectedOption(""); // 색상이 선택되지 않으면 사이즈도 선택 해제
    }
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setOptionError(!value);
  };

  // 제출 처리
  const handleSubmit = (event) => {
    event.preventDefault();
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

    if (valid) {
      navigate("/payment", {
        state: {
          productId: product.id,
          selectedOption,
          selectedColor,
        },
      });
    }
  };

  const handleGoToCart = () => {
    navigate("/cart", {
      state: {
        productId: product.id,
        selectedOption,
        selectedColor,
        quantity: 1, // 장바구니에 추가할 수량 (예: 1로 설정)
      },
    });
  };

  // 찜
  const [isLiked, setIsLiked] = useState(false); // 찜 상태 관리

  const handleWishlistToggle = async () => {
    const newLikedStatus = !isLiked;

    if (newLikedStatus) {
      axiosInstance
        .post("/wishlist/add", {
          productId: product.id,
          memberId: uid,
        })
        .then(() => {
          setIsLiked(newLikedStatus);
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
                카카 채널 추가하고 '재입고 알람' 신청하기 ▶
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {options.colors.length > 0 && (
                <div className="mb-4">
                  <label
                    htmlFor="color"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    색상
                  </label>
                  <select
                    id="color"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className={`border rounded p-2 w-full ${
                      colorError ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">선택하세요</option>
                    {options.colors.map((color, index) => (
                      <option key={index} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  {colorError && (
                    <p className="text-red-500 text-xs mt-1">
                      색상을 선택해 주세요.
                    </p>
                  )}
                </div>
              )}

              {options.sizes.length > 0 && (
                <div className="mb-4">
                  <label
                    htmlFor="size"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    사이즈
                  </label>
                  <select
                    id="size"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className={`border rounded p-2 w-full ${
                      optionError ? "border-red-500" : ""
                    }`}
                    disabled={!selectedColor} // 색상이 선택되지 않았으면 비활성화
                  >
                    <option value="">선택하세요</option>
                    {options.sizes.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  {optionError && (
                    <p className="text-red-500 text-xs mt-1">
                      사이즈를 선택해 주세요.
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                {/* 바로 구매 버튼 */}
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300 ease-in-out flex-1 max-w-xs"
                >
                  바로 구매
                </button>

                {/* 장바구니 버튼 */}
                <button
                  type="button"
                  className="bg-white text-black border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out flex-1 max-w-xs"
                  onClick={handleGoToCart} // 클릭 시 장바구니 페이지로 이동
                >
                  장바구니
                </button>

                {/* 찜(하트) 버튼 */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`bg-white text-black border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out flex-1 max-w-xs ${
                    isLiked ? "text-red-500" : ""
                  }`}
                >
                  {isLiked ? "❤" : "🤍"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 중단 영역 */}
        <div className="border border-gray-300 rounded-lg bg-white flex mb-8">
          {/* 좌측 영역 */}
          <div className="flex-1 p-2 border-r border-gray-300 text-center">
            <p
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => scrollToSection(detailsRef)}
            >
              상세정보
            </p>
          </div>

          {/* 우측 영역 */}
          <div className="flex-1 p-2 text-center">
            <p
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => scrollToSection(reviewRef)}
            >
              리뷰
            </p>
          </div>
        </div>

        {/* 이미지 */}
        <div>
          <div className="flex items-center justify-center" ref={detailsRef}>
            <img
              src="/images/products/knees/shop1.jpg"
              alt="상세1"
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <img
              src="/images/products/knees/shop2.jpg"
              alt="상세2"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex mb-6">
            <img
              src="/images/products/knees/shop3.jpg"
              alt="상세3"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex mb-6">
            <img
              src="/images/products/knees/shop4.jpg"
              alt="상세3"
              className="w-full h-auto object-cover"
            />
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
        <div ref={reviewRef}>
          <ProductReviewSection productId={product.id} />
        </div>
        <div className="flex mb-6">
          <img
            src="/images/products/productPage4.jpg"
            alt="상세4"
            className="w-full h-full object-cover"
          />
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
