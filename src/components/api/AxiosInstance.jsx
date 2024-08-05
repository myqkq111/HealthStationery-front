import axios from "axios";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 기본 URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
