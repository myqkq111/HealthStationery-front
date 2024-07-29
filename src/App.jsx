<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
// import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
    </Router>
  );
}
=======
// src/App.js
import React from "react";
import HomePage from "./pages/HomePage";
import "./index.css"; // Tailwind CSS를 적용합니다.

const App = () => {
  return <HomePage />;
};
>>>>>>> 720afc72e23a8f778f17c9550833822835776c97

export default App;
