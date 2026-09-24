import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Code2, ArrowRight } from "lucide-react";
import { leetcodeQuestions } from "@/data/leetcodeQuestions";

const difficultyStyles = {
  Easy: "bg-green-100 text-green-800 border-green-400",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Hard: "bg-red-100 text-red-800 border-red-400",
};

const LeetCodeList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return leetcodeQuestions;
    return leetcodeQuestions.filter((q) => q.difficulty === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-white">
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
              onClick={() => navigate("/interview-mode")}
              className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              ← Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center px-6 py-2 bg-blue-100 text-blue-800 rounded-full font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Code2 className="w-4 h-4 mr-2" />
            Coding Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black mb-3">Pick a Question</h1>
          <p className="text-lg text-gray-700 font-medium">
            Choose a problem below to open it in the code editor.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-5 py-2 rounded-2xl font-bold border-4 border-black transition-all ${
                filter === level
                  ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((q) => (
            <Card
              key={q.id}
              onClick={() => navigate(`/leetcode/${q.id}`)}
              className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-all duration-300 rounded-2xl cursor-pointer"
            >
              <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-black text-black">{q.title}</h3>
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full border-2 ${difficultyStyles[q.difficulty]}`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-bold px-2 py-1 bg-gray-100 border-2 border-black rounded-full text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-black flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeetCodeList;
