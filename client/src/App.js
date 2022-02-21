// import logo from './logo.svg';
// import './App.css';

import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
// import RegisterPage from './components/views/RegisterPage/RegisterPage';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register"> */}

    </Routes>
  );
};

export default App;










// _actions , _reducer -> Redux 를 위한 폴더들
// components/views -> Page들을 넣음
// components/views/Sections -> 해당 페이지에 관련된 css 파일이나 component 들을 넣음
// App.js -> Routing 관련 일을 처리
// Config.js -> 환경 변수같은 것들을 정하는 곳
// hoc -> Higher Order Component 의 약자
// utils -> 여러군데에서 쓰일 수 있는 것들을 이곳에 미리 넣어둬서 어디서든 쓸 수 있게 함