import axios from "axios";

const token = localStorage.getItem("token");
// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://43.203.197.142:8080", // 기본 URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true, // 세션 쿠키를 요청에 포함
});

export default axiosInstance;
