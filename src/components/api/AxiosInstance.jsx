import axios from "axios";

const token = localStorage.getItem("token");
// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 기본 URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
