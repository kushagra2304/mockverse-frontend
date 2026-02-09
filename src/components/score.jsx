import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Trophy, TrendingUp, RefreshCw, Home, Share2, Download } from "lucide-react";
import axios from "axios";

export default function Score() {
  const { sessionId } = useParams();
  const [scoreData, setScoreData] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get(`https://mockverse-backend-leqo.onrender.com/interview/score/${sessionId}`);
        setScoreData(res.data);
        setIsVisible(true);
        
        // Trigger confetti for good scores
        const percent = res.data.total > 0 ? Math.round((res.data.correct / res.data.total) * 100) : 0;
        if (percent >= 70) {
          setConfettiActive(true);
        }
      } catch (error) {
        console.error("Failed to fetch score:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchScore();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {/* Funky background pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            <Trophy className="w-10 h-10 text-yellow-300 animate-spin" />
          </div>
          <div className="text-black text-2xl font-black">Calculating your score...</div>
          <div className="text-gray-600 font-bold mt-2">Analyzing your performance 📊</div>
        </div>
      </div>
    );
  }

  const percent = scoreData.total > 0 ? Math.round((scoreData.correct / scoreData.total) * 100) : 0;
  const isPerfect = percent === 100;
  const isGood = percent >= 70;
  const isMedium = percent >= 50;
  
  const getScoreColor = () => {
    if (isPerfect) return "from-yellow-400 to-orange-500";
    if (isGood) return "from-green-400 to-emerald-500";
    if (isMedium) return "from-blue-400 to-cyan-500";
    return "from-purple-400 to-pink-500";
  };

  const getScoreBg = () => {
    if (isPerfect) return "bg-gradient-to-br from-yellow-50 to-orange-50";
    if (isGood) return "bg-gradient-to-br from-green-50 to-emerald-50";
    if (isMedium) return "bg-gradient-to-br from-blue-50 to-cyan-50";
    return "bg-gradient-to-br from-purple-50 to-pink-50";
  };

  const getMessage = () => {
    if (isPerfect) return {
      title: "PERFECT SCORE!",
      subtitle: "You absolutely crushed it! 🚀",
      emoji: "🏆",
      tip: "Outstanding! You nailed every question!"
    };
    if (isGood) return {
      title: "GREAT JOB!",
      subtitle: "You're doing amazing! 💪",
      emoji: "🎉",
      tip: "Excellent work! Keep practicing for perfection!"
    };
    if (isMedium) return {
      title: "GOOD EFFORT!",
      subtitle: "You're on the right track! 📈",
      emoji: "👏",
      tip: "Nice progress! A few more practice sessions will help!"
    };
    return {
      title: "KEEP GOING!",
      subtitle: "Every attempt makes you better! 🌱",
      emoji: "💪",
      tip: "Don't give up! Practice makes perfect!"
    };
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Funky background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Confetti Effect */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#FCD34D', '#A78BFA', '#60A5FA', '#34D399', '#F472B6'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

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
              <Home className="w-5 h-5 mr-2 inline" />
              Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-88px)] px-4 py-12 relative z-10">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div 
            className={`text-center mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <div className="inline-block mb-4">
              <div className={`text-7xl md:text-8xl animate-bounce-slow ${isPerfect ? 'animate-wiggle' : ''}`}>
                {message.emoji}
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-black mb-3 leading-tight">
              {message.title}
            </h1>
            <p className="text-2xl text-gray-700 font-bold">
              {message.subtitle}
            </p>
          </div>

          {/* Score Card */}
          <Card 
            className={`bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Big Score Display */}
              <div className="text-center">
                <div className={`inline-block px-8 py-6 rounded-3xl bg-gradient-to-r ${getScoreColor()} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300`}>
                  <div className="text-white text-7xl md:text-8xl font-black leading-none">
                    {percent}%
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Correct Answers */}
                <div 
                  className={`${getScoreBg()} border-4 border-black rounded-2xl p-6 text-center hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-3xl font-black text-black">{scoreData.correct}</div>
                  <div className="text-gray-700 font-bold mt-1">Correct</div>
                </div>

                {/* Wrong Answers */}
                <div 
                  className={`${getScoreBg()} border-4 border-black rounded-2xl p-6 text-center hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="text-4xl mb-2">❌</div>
                  <div className="text-3xl font-black text-black">{scoreData.total - scoreData.correct}</div>
                  <div className="text-gray-700 font-bold mt-1">Incorrect</div>
                </div>

                {/* Total Questions */}
                <div 
                  className={`${getScoreBg()} border-4 border-black rounded-2xl p-6 text-center hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-3xl font-black text-black">{scoreData.total}</div>
                  <div className="text-gray-700 font-bold mt-1">Total</div>
                </div>
              </div>

              {/* Performance Message */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-black rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">
                  {isPerfect ? "🌟" : isGood ? "⭐" : isMedium ? "💫" : "✨"}
                </div>
                <p className="text-black font-black text-xl mb-2">Performance Analysis</p>
                <p className="text-gray-700 font-bold text-lg">
                  {message.tip}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Button
                  onClick={() => navigate("/setup")}
                  className="w-full py-6 text-lg bg-black text-white hover:bg-gray-800 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] transition-all group"
                >
                  <RefreshCw className="w-5 h-5 mr-2 inline group-hover:rotate-180 transition-transform duration-500" />
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="w-full py-6 text-lg bg-white text-black hover:bg-gray-100 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  <Home className="w-5 h-5 mr-2 inline" />
                  Go Home
                </Button>
              </div>

              {/* Share Section */}
              <div className="pt-6 border-t-4 border-dashed border-gray-300">
                <p className="text-center text-gray-600 font-bold mb-4">Share your achievement</p>
                <div className="flex justify-center gap-4">
                  <button className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                    <Share2 className="w-6 h-6 text-white" />
                  </button>
                  <button className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                    <Download className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div 
            className={`mt-8 text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="inline-block bg-white border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-black font-bold">
                💡 <span className="font-black">Next Step:</span> {isPerfect 
                  ? "Try a harder difficulty level to challenge yourself!" 
                  : "Practice more to improve your score!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-40 left-10 w-16 h-16 bg-blue-300 rounded-full border-4 border-black transform rotate-12 animate-float pointer-events-none hidden md:block"></div>
      <div className="absolute bottom-40 right-20 w-12 h-12 bg-yellow-300 rounded-full border-4 border-black animate-float animation-delay-2000 pointer-events-none hidden md:block"></div>
      <div className="absolute top-1/3 right-40 w-10 h-10 bg-purple-300 border-4 border-black transform -rotate-12 animate-float animation-delay-4000 pointer-events-none hidden md:block"></div>

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
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
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
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
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
}