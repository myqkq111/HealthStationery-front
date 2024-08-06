// src/components/Admin/BoardList.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";

const BoardList = () => {
  const [posts, setPosts] = useState([]);

  // 게시판 목록을 가져오는 함수
  useEffect(() => {
    axiosInstance
      .get("/posts") // 실제 API 엔드포인트에 맞게 수정
      .then((response) => {
        setPosts(response.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">게시판 목록</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                게시글 ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                제목
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                상태
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900">{post.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {post.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 flex space-x-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                      수정
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardList;
