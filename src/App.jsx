import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home1";
import InterviewSetup from "./components/setup";
import VideoInterview from "./components/videoInterview";
import Login from "./components/login";
import Signup from "./components/signup";
import Score from "./components/score";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<InterviewSetup />} />
      <Route path="/interview" element={<VideoInterview />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/interview/score/:sessionId" element={<Score />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
