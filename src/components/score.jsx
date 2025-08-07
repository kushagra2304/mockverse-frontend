import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Score() {
  const { sessionId } = useParams();
  const [scoreData, setScoreData] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/interview/score/${sessionId}`);
        setScoreData(res.data);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-2xl">Loading score...</div>
      </div>
    );
  }

  const percent = scoreData.total > 0 ? Math.round((scoreData.correct / scoreData.total) * 100) : 0;
  const isPerfect = percent === 100;
  const isGood = percent >= 70;
  const emoji = isPerfect
    ? "🏆🎉"
    : isGood
    ? "👏✨"
    : "👍💪";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Hurrah! Your Interview Summary
          </h2>
          <p className="text-lg text-gray-200">
            <span className="text-2xl">✅</span> <strong>{scoreData.correct}</strong> Correct Answers
          </p>
          <p className="text-lg text-gray-200">
            <span className="text-2xl">📝</span> <strong>{scoreData.total}</strong> Attempted
          </p>
          <p className="text-lg text-gray-200">
            <span className="text-2xl">📊</span> Score:{" "}
            <strong className={isGood ? "text-green-400" : "text-yellow-400"}>
              {percent}%
            </strong>
          </p>
          <div className="mt-6">
            <Button
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-xl transition-all"
              onClick={() => navigate("/")}
            >
              🔁 Try Another Interview
            </Button>
          </div>
          <div className="mt-2 text-gray-400 text-sm">
            {isPerfect
              ? "Outstanding! You nailed every question! 🚀"
              : isGood
              ? "Great job! Keep practicing for perfection! 💯"
              : "Keep going! Every attempt makes you better! 🌱"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}