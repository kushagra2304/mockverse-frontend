import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Mic, Target, ArrowRight, Sparkles } from "lucide-react";

const InterviewMode = () => {
  const navigate = useNavigate();

  const modes = [
    {
      icon: Code2,
      title: "Solve LeetCode Questions",
      description:
        "Practice coding problems in a real editor. Pick a problem, write your solution in JavaScript, Python, or C++, run it, and check it against test cases.",
      badge: "Coding Practice",
      color: "from-blue-400 to-cyan-500",
      cta: "Browse Questions",
      onClick: () => navigate("/leetcode"),
    },
    {
      icon: Mic,
      title: "AI Q&A Interview",
      description:
        "Answer AI-generated interview questions for any topic and difficulty, with real-time feedback on your responses.",
      badge: "Verbal Practice",
      color: "from-purple-400 to-pink-500",
      cta: "Configure Interview",
      onClick: () => navigate("/setup"),
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div
              className="flex items-center space-x-3 cursor-pointer"
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
              className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-88px)] px-4 py-12 relative z-10">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-6 py-2 bg-purple-100 text-purple-800 rounded-full font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-4 h-4 mr-2" />
                Choose Your Interview Type
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-black mb-4 leading-tight">
              How do you want to
              <span className="inline-block transform rotate-2 bg-gradient-to-r from-yellow-300 to-orange-400 px-4 py-2 ml-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                practice?
              </span>
            </h1>
            <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto mt-6">
              Sharpen your coding skills or work on your verbal interview answers — you can always come back and try the other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modes.map((mode, index) => (
              <Card
                key={index}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer"
                onClick={mode.onClick}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4`}
                  >
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="inline-block w-fit text-xs font-black uppercase tracking-wide px-3 py-1 bg-gray-100 border-2 border-black rounded-full mb-2">
                    {mode.badge}
                  </span>
                  <CardTitle className="text-2xl font-black text-black">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed font-medium mb-6">{mode.description}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      mode.onClick();
                    }}
                    className="w-full py-5 text-lg bg-black text-white hover:bg-gray-800 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                  >
                    {mode.cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewMode;
