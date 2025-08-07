import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useAuth } from "@/context/ContextAuth";

const InterviewSetup = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sessionResponse = await axios.post("https://mockverse-backend-leqo.onrender.com/interview/start", {
        user_id: user.id,
      });
      const { sessionId } = sessionResponse.data;
      const response = await axios.post("https://mockverse-backend-leqo.onrender.com/start-interview", {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Setup Your Interview</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-white mb-2 block">Topic</Label>
              <Input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React, DSA"
                required
                className="bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Difficulty Level</Label>
              <Select onValueChange={setDifficulty} defaultValue="medium">
                <SelectTrigger className="bg-white/20 border border-white/30 text-white">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border border-white/20 text-white">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-xl transition-all"
            >
              Start Interview
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSetup;