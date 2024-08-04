import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const cate = query.get('cate');
    const email = query.get('email');
    const name = query.get('name');
        axiosInstance.get(`/oauth/login?email=${email}&cate=${cate}`)
          .then((response) => {
            const { token, member } = response.data;
            if(token === "no"){
                navigate(`/terms?cate=${cate}&email=${email}&name=${name}`);
            } else{
                 // 로그인 상태 업데이트
                login(token, member);
    
                navigate("/"); // 홈 페이지로 이동
            }
          })
          .catch((error) => {
            console.error("Login failed:", error);
            // setError("로그인 실패. 이메일을 확인해 주세요.");
          });

  }, [location, login]);

  return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin mb-4"></div>
  <div className="text-blue-500 text-xl font-semibold">Loading...</div>
</div>;
};

export default AuthCallback;

