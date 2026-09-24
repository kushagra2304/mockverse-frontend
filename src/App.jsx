import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home1";
import InterviewMode from "./components/InterviewMode";
import InterviewSetup from "./components/setup";
import VideoInterview from "./components/videoInterview";
import LeetCodeList from "./components/LeetCodeList";
import LeetCodeSolve from "./components/LeetCodeSolve";
import Login from "./components/login";
import Signup from "./components/signup";
import Score from "./components/score";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interview-mode" element={<InterviewMode />} />
      <Route path="/setup" element={<InterviewSetup />} />
      <Route path="/interview" element={<VideoInterview />} />
      <Route path="/leetcode" element={<LeetCodeList />} />
      <Route path="/leetcode/:id" element={<LeetCodeSolve />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/interview/score/:sessionId" element={<Score />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
