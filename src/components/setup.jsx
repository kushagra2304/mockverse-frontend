import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Target, Sparkles, Zap, TrendingUp } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/ContextAuth";

const InterviewSetup = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const sessionResponse = await axios.post("https://mockverse-backend-leqo.onrender.com/interview/start", {
      const sessionResponse = await axios.post("http://localhost:5000/interview/start", {
        user_id: user.id,
      });
      const { sessionId } = sessionResponse.data;
      // const response = await axios.post("https://mockverse-backend-leqo.onrender.com/start-interview", {
      const response = await axios.post("http://localhost:5000/start-interview", {
        user_id: user.id,
        topic,
        difficulty,
        session_id: sessionId,
      });

      const { interview_id, questions } = response.data;
      navigate("/interview", {
        state: {
          topic,
          difficulty,
          questions,
          interview_id,
          sessionId,
        },
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  const difficultyInfo = {
    easy: {
      color: "from-green-400 to-emerald-500",
      bg: "bg-green-50",
      border: "border-green-300",
      text: "Perfect for beginners and warm-ups"
    },
    medium: {
      color: "from-yellow-400 to-orange-500",
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      text: "Balanced challenge for most candidates"
    },
    hard: {
      color: "from-red-400 to-pink-500",
      bg: "bg-red-50",
      border: "border-red-300",
      text: "Advanced questions for experts"
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Funky background pattern with parallax */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer animate-slide-in-left"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <Target className="w-7 h-7 text-yellow-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-black text-black tracking-tight">
                Mock<span className="text-purple-600">verse</span>
              </h2>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all animate-slide-in-right"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-88px)] px-4 py-12 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-6 py-2 bg-purple-100 text-purple-800 rounded-full font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                <Sparkles className="w-4 h-4 mr-2" />
                Step 1: Configure Your Interview
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-black mb-4 leading-tight">
              Setup Your
              <span className="inline-block transform rotate-2 bg-gradient-to-r from-yellow-300 to-orange-400 px-4 py-2 ml-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                Interview
              </span>
            </h1>
            <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
              Choose your topic and difficulty level to get personalized interview questions
            </p>
          </div>

          {/* Main Card */}
          <Card 
            className={`bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Topic Input */}
                <div 
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <Label className="text-black font-black text-lg mb-3 block flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Interview Topic
                  </Label>
                  <Input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., React, Data Structures, Machine Learning..."
                    required
                    className="bg-white border-4 border-black text-black placeholder-gray-400 text-lg px-6 py-4 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:-translate-y-0.5 transition-all"
                  />
                  <p className="text-gray-600 text-sm mt-2 font-medium ml-1">
                    💡 Be specific! "React Hooks" is better than just "React"
                  </p>
                </div>

                {/* Difficulty Select */}
                <div 
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  <Label className="text-black font-black text-lg mb-3 block flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                    Difficulty Level
                  </Label>
                  <Select onValueChange={setDifficulty} defaultValue="medium">
                    <SelectTrigger className="bg-white border-4 border-black text-black text-lg px-6 py-6 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                      <SelectItem 
                        value="easy" 
                        className="text-black font-bold text-lg px-6 py-4 cursor-pointer hover:bg-green-50 focus:bg-green-100"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3"></div>
                          Easy
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="medium" 
                        className="text-black font-bold text-lg px-6 py-4 cursor-pointer hover:bg-yellow-50 focus:bg-yellow-100"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mr-3"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="hard" 
                        className="text-black font-bold text-lg px-6 py-4 cursor-pointer hover:bg-red-50 focus:bg-red-100"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mr-3"></div>
                          Hard
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Difficulty Info Box */}
                  <div className={`mt-4 p-4 ${difficultyInfo[difficulty].bg} border-4 ${difficultyInfo[difficulty].border} rounded-2xl transition-all duration-300`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${difficultyInfo[difficulty].color} flex items-center justify-center mr-3 border-2 border-black`}>
                        <span className="text-white font-black text-sm">
                          {difficulty === 'easy' ? '📚' : difficulty === 'medium' ? '🎯' : '🔥'}
                        </span>
                      </div>
                      <p className="text-black font-bold">
                        {difficultyInfo[difficulty].text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div 
                  className={`pt-4 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                >
                  <Button
                    type="submit"
                    className="w-full py-6 text-xl bg-black text-white hover:bg-gray-800 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] hover:scale-[1.02] transition-all group"
                  >
                    <Sparkles className="w-6 h-6 mr-2 inline group-hover:animate-spin" />
                    Start Interview
                    <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                  </Button>
                </div>
              </form>

              {/* Features Preview */}
              <div 
                className={`mt-8 pt-8 border-t-4 border-dashed border-gray-200 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: '1000ms' }}
              >
                <p className="text-gray-600 font-bold text-center mb-4">What you'll get:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: "🎤", text: "Voice Responses" },
                    { icon: "📊", text: "Real-time Feedback" },
                    { icon: "🏆", text: "Detailed Analysis" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-black font-bold text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <div 
            className={`mt-8 text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            <div className="inline-block bg-white border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-black font-bold">
                💡 <span className="font-black">Pro Tip:</span> Find a quiet space and use headphones for the best experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div 
        className="absolute top-40 left-10 w-16 h-16 bg-blue-300 rounded-full border-4 border-black transform rotate-12 animate-float pointer-events-none hidden md:block"
        style={{ transform: `translateY(${scrollY * 0.1}px) rotate(12deg)` }}
      ></div>
      <div 
        className="absolute bottom-40 right-20 w-12 h-12 bg-yellow-300 rounded-full border-4 border-black animate-float animation-delay-2000 pointer-events-none hidden md:block"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 right-40 w-10 h-10 bg-purple-300 border-4 border-black transform -rotate-12 animate-float animation-delay-4000 pointer-events-none hidden md:block"
        style={{ transform: `translateY(${scrollY * 0.12}px) rotate(-12deg)` }}
      ></div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default InterviewSetup;