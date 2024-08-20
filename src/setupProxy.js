import { createProxyMiddleware } from "http-proxy-middleware";

// 미들웨어를 설정하는 이름이 있는 함수
function setupProxy(app) {
  app.use(
    "/ws",
    createProxyMiddleware({
      target: "http://localhost:8080",
      ws: true, // 웹소켓을 사용하겠다!
    })
  );
}

export default setupProxy;
