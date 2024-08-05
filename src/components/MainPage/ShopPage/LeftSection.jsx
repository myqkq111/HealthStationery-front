import React, { useState } from "react";

const LeftSection = ({
  product,
  user,
  deliveryMemo,
  setDeliveryMemo,
  customMemo,
  setCustomMemo,
}) => {
  const { image, name, price } = product || {};
  const { username, email, tell, roadaddr, detailaddr, mailaddr } = user || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(username);
  const [editTell, setEditTell] = useState(tell);
  const [editRoadaddr, setEditRoadaddr] = useState(roadaddr);
  const [editDetailaddr, setEditDetailaddr] = useState(detailaddr);
  const [editMailaddr, setEditMailaddr] = useState(mailaddr);
  const [activeTab, setActiveTab] = useState("existing");

  const handleMemoChange = (event) => {
    setDeliveryMemo(event.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    // 여기서 필요한 로직 추가 (예: 서버로 변경사항 전송)
    toggleEdit();
  };

  return (
    <div className="w-full lg:w-full lg:pr-2">
      <div className="mb-4 bg-white p-4 ">
        <h2 className="text-xl font-semibold mb-4">주문 상품 정보</h2>
        <div className="flex items-center mb-4">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600">{price}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 bg-white p-4 ">
        <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
        <div>
          <p className="text-gray-700">{username}</p>
          <p className="text-gray-700">{tell}</p>
          <p className="text-gray-700">{email}</p>
        </div>
      </div>

      <div className="bg-white p-4  mb-2">
        <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
        {isEditing ? (
          <div>
            <div className="flex mb-4">
              <button
                className={`mr-4 py-2 px-4 rounded ${
                  activeTab === "existing"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("existing")}
              >
                배송지 선택
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  activeTab === "new"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("new")}
              >
                신규 입력
              </button>
            </div>

            {activeTab === "existing" ? (
              <div>
                <p className="text-gray-700 font-semibold">{editName}</p>
                <p className="text-gray-700">{editTell}</p>
                <p className="text-gray-700 font-semibold">{editRoadaddr}</p>
                <p className="text-gray-700 font-semibold">{editDetailaddr}</p>
                <p className="text-gray-700 font-semibold">{editMailaddr}</p>
              </div>
            ) : (
              <div>
                <div>
                  <label className="block mb-2 text-gray-700 font-semibold">
                    이름
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                  <label className="block mb-2 text-gray-700 font-semibold">
                    전화번호
                  </label>
                  <input
                    type="text"
                    value={editTell}
                    onChange={(e) => setEditTell(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                  <label className="block mb-2 text-gray-700 font-semibold">
                    도로명 주소
                  </label>
                  <input
                    type="text"
                    value={editRoadaddr}
                    onChange={(e) => setEditRoadaddr(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                  <label className="block mb-2 text-gray-700 font-semibold">
                    상세 주소
                  </label>
                  <input
                    type="text"
                    value={editDetailaddr}
                    onChange={(e) => setEditDetailaddr(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                  <label className="block mb-2 text-gray-700 font-semibold">
                    이메일
                  </label>
                  <input
                    type="text"
                    value={editMailaddr}
                    onChange={(e) => setEditMailaddr(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                </div>
              </div>
            )}
            <button
              onClick={saveChanges}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              저장
            </button>
            <button
              onClick={toggleEdit}
              className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded"
            >
              취소
            </button>
          </div>
        ) : (
          <div>
            <div>
              <p className="text-gray-700 font-semibold">{name}</p>
              <p className="text-gray-700">{tell}</p>
              <p className="text-gray-700 font-semibold">{roadaddr}</p>
              <p className="text-gray-700 font-semibold">{detailaddr}</p>
              <p className="text-gray-700 font-semibold">{mailaddr}</p>
            </div>
            <button
              onClick={toggleEdit}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              수정
            </button>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">배송 메모</h3>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              배송 메시지 선택
            </label>
            <select
              value={deliveryMemo}
              onChange={handleMemoChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="default">기본 메시지 선택</option>
              <option value="leaveAtDoor">문 앞에 놓아주세요</option>
              <option value="callBeforeDelivery">배송 전 연락주세요</option>
              <option value="noSpecificInstructions">특별 요청 없음</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
          {deliveryMemo === "custom" && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-700 font-semibold">
                직접 입력
              </label>
              <textarea
                value={customMemo}
                onChange={(e) => setCustomMemo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="배송 메모를 직접 입력하세요."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
