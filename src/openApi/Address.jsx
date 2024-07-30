import React, { useEffect } from "react";

const Address = ({
  mailaddr,
  setMailaddr,
  roadaddr,
  setRoadaddr,
  detailaddr,
  setDetailaddr,
}) => {
  useEffect(() => {
    // Daum Postcode API 스크립트를 동적으로 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    // 스크립트가 로드되면 Daum Postcode 객체를 사용할 수 있게 됩니다.
    script.onload = () => {
      window.daum.Postcode = window.daum.Postcode || {};
    };

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        let addr = "";
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
        }

        setMailaddr(data.zonecode);
        setRoadaddr(addr);
        document.getElementById("sample6_detailAddress").focus();
      },
    }).open();
  };

  return (
    <>
      <div>
        <input
          type="text"
          id="sample6_postcode"
          value={mailaddr}
          onChange={(e) => setMailaddr(e.target.value)}
          placeholder="우편번호"
          readOnly
          className="flex-1 p-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="button"
          onClick={openPostcode}
          value="우편번호 찾기"
          className="p-2 bg-blue-500 text-white border border-blue-600 rounded-r-lg cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <br />
        <input
          type="text"
          id="sample6_address"
          value={roadaddr}
          onChange={(e) => setRoadaddr(e.target.value)}
          placeholder="주소"
          readOnly
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        />
        <br />
        <input
          type="text"
          id="sample6_detailAddress"
          value={detailaddr}
          onChange={(e) => setDetailaddr(e.target.value)}
          placeholder="상세주소"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        />
      </div>
    </>
  );
};

export default Address;
