import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Clock, 
  Brain, 
  ArrowLeft, 
  Play, 
  Users, 
  Award,
  CheckCircle,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ContextAuth";
import axios from "axios";

const InterviewSetup = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 Get user to pass user_id

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Step 1: Get session ID from backend
    const sessionResponse = await axios.post("http://localhost:5000/interview/start", {
      user_id: user.id, // 👈 Pass user_id here
    });
    const { sessionId } = sessionResponse.data;

    // Step 2: Call start-interview with session ID
    const response = await axios.post("http://localhost:5000/start-interview", {
      user_id: user.id,
      topic,
      difficulty,
      session_id: sessionId, // 👈 Include session ID in payload
    });

    const { interview_id, questions } = response.data;

    // Step 3: Navigate to interview page with full session data
    navigate("/interview", {
      state: {
        topic,
        difficulty,
        questions,
        interview_id,     // Optional: might be same as sessionId
        sessionId,        // 👈 Include for session identification
      },
    });
  } catch (error) {
    console.error("Failed to start interview:", error);
    alert("Failed to generate questions. Please try again.");
  }
};


  const topicOptions = [
    "Software Engineering", "Data Science", "Product Management", "Marketing", 
    "Sales", "Business Analyst", "DevOps", "UI/UX Design", "Project Management",
    "Data Structures & Algorithms", "System Design", "React/Frontend", "Backend Development"
  ];

  const experienceOptions = [
    "0-1 years (Entry Level)", "1-3 years (Junior)", "3-5 years (Mid Level)", 
    "5-8 years (Senior)", "8+ years (Lead/Principal)"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">InterviewAce Pro</span>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Setup Form */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-400" />
                Setup Your Interview
              </CardTitle>
              <p className="text-gray-300">
                Configure your personalized interview experience
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                
                {/* Job Role */}
                {/* <div className="space-y-2">
                  <Label className="text-white font-medium">Job Role / Position</Label>
                  <Input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                    required
                  />
                </div> */}

                {/* Topic/Specialization */}
                <div className="space-y-2">
  <Label className="text-white font-medium">Topic / Specialization</Label>
  <input
    type="text"
    placeholder="Enter your interview focus"
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    required
    className="bg-white/10 border border-white/20 text-white placeholder-white/70 rounded-md px-3 py-2 focus:outline-none focus:border-purple-400 w-full"
  />
</div>

                

                {/* Experience Level */}
                {/* <div className="space-y-2">
                  <Label className="text-white font-medium">Experience Level</Label>
                  <Select onValueChange={setExperience} required>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {experienceOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-white hover:bg-slate-700">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Difficulty Level */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">Difficulty Level</Label>
                  <Select onValueChange={setDifficulty} defaultValue="medium">
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="easy" className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Easy - Basic Questions
                        </div>
                      </SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          Medium - Moderate Challenge
                        </div>
                      </SelectItem>
                      <SelectItem value="hard" className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          Hard - Advanced Questions
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                {/* <div className="space-y-2">
                  <Label className="text-white font-medium">Interview Duration</Label>
                  <Select onValueChange={setDuration} defaultValue="30">
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="15" className="text-white hover:bg-slate-700">15 minutes</SelectItem>
                      <SelectItem value="30" className="text-white hover:bg-slate-700">30 minutes</SelectItem>
                      <SelectItem value="45" className="text-white hover:bg-slate-700">45 minutes</SelectItem>
                      <SelectItem value="60" className="text-white hover:bg-slate-700">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Preparing Interview...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Start Interview
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <div className="space-y-6">
            
            {/* What to Expect */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">AI-Powered Questions</h4>
                    <p className="text-gray-300 text-sm">Dynamic questions tailored to your role and experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Real-time Feedback</h4>
                    <p className="text-gray-300 text-sm">Instant analysis of your responses and delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Performance Metrics</h4>
                    <p className="text-gray-300 text-sm">Detailed scoring and improvement suggestions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  Interview Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <p className="text-sm">Ensure good lighting and a quiet environment</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <p className="text-sm">Maintain eye contact with the camera</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <p className="text-sm">Speak clearly and at a moderate pace</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <p className="text-sm">Have your resume and notes ready</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-white/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">12,847+</div>
                    <div className="text-xs text-gray-300">Active Users</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Award className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">94.2%</div>
                    <div className="text-xs text-gray-300">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;