import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactPaginate from "react-paginate";
import axiosInstance from "../../api/AxiosInstance"; // axiosInstance를 사용하여 API 요청

const ProductReviewSection = ({ totalreview, productId }) => {
  const [view, setView] = useState("text"); // 'text' 또는 'photo'
  const [filterRating, setFilterRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState("date");
  const [reviews, setReviews] = useState([]); // 초기값 빈 배열
  const [photoReviews, setPhotoReviews] = useState([]); // 초기값 빈 배열
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const reviewsPerPage = 5;
  const offset = currentPage * reviewsPerPage;

  // 필터링된 리뷰 리스트
  const filteredReviews = filterRating
    ? reviews.filter((review) => review.score === filterRating)
    : reviews;

  // 정렬
  const sortedReviews = filteredReviews.slice().sort((a, b) => {
    if (sortOption === "rating") {
      return b.score - a.score;
    }
    if (sortOption === "date") {
      return b.id - a.id;
    }
    return 0;
  });

  const currentPageReviews = sortedReviews.slice(
    offset,
    offset + reviewsPerPage
  );

  useEffect(() => {
    if (filterRating === null) {
      setSortOption("date"); // 전체보기 시 날짜순 정렬
    }
  }, [filterRating]);

  useEffect(() => {
    // 백엔드에서 리뷰 데이터와 포토 리뷰 데이터 가져오기
    axiosInstance
      .get("/review/selectReviewByProductId", {
        params: { productId }, // productId를 쿼리 파라미터로 전달
      })
      .then((response) => {
        console.log("API Response:", response.data); // API 응답 확인
        setReviews(response.data.reviews || []); // 빈 배열로 초기화
        setPhotoReviews(response.data.photoReviews || []); // 빈 배열로 초기화
        setLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setLoading(false); // 데이터 로딩 완료 (실패하더라도)
      });
  }, [productId]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleRatingFilter = (rating) => {
    setFilterRating(rating);
    setCurrentPage(0); // 페이지네이션 초기화
  };

  // 슬라이드 설정
  const slideSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };

  // 별점별 리뷰 수 계산
  const ratingCounts = [5, 4, 3, 2, 1].reduce((acc, rating) => {
    acc[rating] = reviews.filter((review) => review.score === rating).length;
    return acc;
  }, {});

  // 총 리뷰 수
  const totalReviews = reviews.length;

  // 평균 별점 계산
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.score, 0) / totalReviews
        ).toFixed(1)
      : 0;

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 메시지
  }

  return (
    <div>
      <div className="bg-gray-100 p-8 flex flex-col md:flex-row mb-12">
        {/* 별점 영역 */}
        <div className="flex-none w-full md:w-1/6 pr-4 flex flex-col items-center mb-4 md:mb-0">
          <div className="mt-2">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`text-2xl ${
                  index < Math.round(averageRating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-4xl font-bold text-yellow-500 mt-2">
            {averageRating}
          </div>
          <div>총 {totalreview}개의 구매평</div>
        </div>

        {/* 통계 그래프 영역 */}
        <div className="flex-1 flex flex-col w-full md:w-2/6 items-center mb-4 md:mb-0">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-4 w-80">
              <div className="text-gray-600 text-sm mr-2">{rating}점</div>
              <div className="bg-gray-300 h-2 flex-1 rounded-full relative">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{
                    width: `${
                      (ratingCounts[rating] / totalReviews) * 100 || 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 포토 리뷰 영역 */}
        <div className="flex-none w-full md:w-1/2 pl-0 md:pl-10">
          <div>
            <div className="text-center font-bold mb-1">
              포토 구매평 모아보기
            </div>
            <Slider {...slideSettings}>
              {photoReviews.map((photo, index) => (
                <div key={index} className="p-1 flex justify-center">
                  <img
                    src={photo}
                    alt={`Photo Review ${index + 1}`}
                    className="w-32 h-32 object-cover"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <div className="flex mb-4">
        구매평 <p className="text-red-300">({totalreview})</p>
      </div>
      {/* 정렬 및 필터 선택 박스 */}
      <div className="flex justify-end items-center mb-6">
        <select
          value={filterRating || ""}
          onChange={(e) => handleRatingFilter(Number(e.target.value))}
          className="border border-gray-300 px-4 py-2 rounded-md mb-2"
        >
          <option value="">전체 보기</option>
          <option value="5">최고 ★★★★★</option>
          <option value="4">좋음 ★★★★</option>
          <option value="3">보통 ★★★</option>
          <option value="2">별로 ★★</option>
          <option value="1">나쁨 ★</option>
        </select>
      </div>

      {/* 리뷰 리스트 */}
      <div>
        <hr className="border-t-1 border-black" />
        {currentPageReviews.map((review) => (
          <div key={review.id} className="bg-white">
            <div className="flex mb-2">
              {/* 왼쪽 - 리뷰 세부 사항 */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`text-2xl ${
                          index < review.score
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">[옵션] Option:</div>{" "}
                <div className="mb-2 text-sm text-gray-600">
                  {review.content}
                </div>
                {/* 예시 제품 이름 */}
                <div className="text-sm text-gray-600">댓글</div>{" "}
                {/* 예시 댓글 */}
              </div>
              {/* 오른쪽 - 작성자 ID */}
              <div className="ml-4 flex-none p-10">
                <div className="text-sm text-gray-500">{review.name}</div>
              </div>
            </div>
            <hr className="border-t-1 border-gray-300" />
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6 mb-16">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredReviews.length / reviewsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="flex space-x-2"
          pageClassName="relative"
          pageLinkClassName="px-3 py-1 rounded-md"
          previousClassName="relative"
          nextClassName="relative"
          previousLinkClassName="px-3  rounded-md"
          nextLinkClassName="px-3 py-1  rounded-md"
          breakClassName="relative"
          breakLinkClassName="px-3 py-1  rounded-md"
          activeClassName="text-red-300"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default ProductReviewSection;
