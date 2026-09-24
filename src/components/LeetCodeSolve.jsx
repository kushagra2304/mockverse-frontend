import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Target, Play, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { getQuestionById, languageMeta } from "@/data/leetcodeQuestions";

// const API_BASE = "https://mockverse-backend-leqo.onrender.com";
const API_BASE = "http://localhost:5000";

const difficultyStyles = {
  Easy: "bg-green-100 text-green-800 border-green-400",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Hard: "bg-red-100 text-red-800 border-red-400",
};

const LeetCodeSolve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = getQuestionById(id);

  const [language, setLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState({});
  const [activeTab, setActiveTab] = useState("console"); // 'console' | 'tests'
  const [consoleOutput, setConsoleOutput] = useState(null); // { stdout, stderr, compileStderr }
  const [testResults, setTestResults] = useState(null); // { results, passedCount, totalCount, compileError }
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (question) {
      setCodeByLanguage({ ...question.starterCode });
      setLanguage("javascript");
      setConsoleOutput(null);
      setTestResults(null);
      setCustomInput(question.testCases[0]?.input || "");
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const code = codeByLanguage[language] || "";

  const setCode = (value) => {
    setCodeByLanguage((prev) => ({ ...prev, [language]: value ?? "" }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab("console");
    setConsoleOutput(null);
    try {
      const { data } = await axios.post(`${API_BASE}/execute`, {
        language,
        source: code,
        stdin: customInput,
      });
      setConsoleOutput(data);
    } catch (err) {
      setConsoleOutput({
        stderr: err.response?.data?.details || err.message || "Failed to run code.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTests = async () => {
    setIsTesting(true);
    setActiveTab("tests");
    setTestResults(null);
    try {
      const { data } = await axios.post(`${API_BASE}/run-tests`, {
        language,
        source: code,
        testCases: question.testCases,
      });
      setTestResults(data);
    } catch (err) {
      setTestResults({
        compileError: err.response?.data?.details || err.message || "Failed to run tests.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Question not found</h1>
          <Button onClick={() => navigate("/leetcode")} className="font-bold">
            ← Back to question list
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b-4 border-black flex-shrink-0">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/leetcode")}
                className="flex items-center gap-1 font-bold text-black hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Questions
              </button>
              <div className="hidden sm:flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center transform -rotate-6">
                  <Target className="w-5 h-5 text-yellow-300" />
                </div>
                <h2 className="text-xl font-black text-black tracking-tight">
                  Mock<span className="text-purple-600">verse</span>
                </h2>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border-2 border-black rounded-xl px-3 py-2 font-bold bg-white"
            >
              {Object.entries(languageMeta).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Main split layout */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Problem description panel */}
        <div className="lg:w-2/5 border-b-4 lg:border-b-0 lg:border-r-4 border-black overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-2xl font-black text-black">{question.title}</h1>
            <span
              className={`text-xs font-black uppercase px-3 py-1 rounded-full border-2 ${difficultyStyles[question.difficulty]}`}
            >
              {question.difficulty}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold px-2 py-1 bg-gray-100 border-2 border-black rounded-full text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-black font-medium leading-relaxed mb-6 whitespace-pre-line">
            {question.description}
          </p>

          <h3 className="font-black text-black mb-2">Examples</h3>
          <div className="space-y-3 mb-6">
            {question.examples.map((ex, i) => (
              <div key={i} className="bg-gray-50 border-2 border-black rounded-xl p-3 font-mono text-sm">
                <div>
                  <span className="font-bold">Input:</span> {ex.input}
                </div>
                <div>
                  <span className="font-bold">Output:</span> {ex.output}
                </div>
                {ex.explanation && (
                  <div className="text-gray-600 mt-1">
                    <span className="font-bold">Explanation:</span> {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="font-black text-black mb-2">Constraints</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 font-medium mb-6 space-y-1">
            {question.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 text-sm text-blue-900 font-medium">
            💡 <span className="font-bold">I/O format:</span> {question.ioNote}
          </div>
        </div>

        {/* Editor + output panel */}
        <div className="lg:w-3/5 flex flex-col min-h-0">
          <div className="flex-1 min-h-[300px]">
            <Editor
              height="100%"
              language={languageMeta[language].monacoId}
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="border-t-4 border-black p-3 flex gap-3 flex-shrink-0 bg-white">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-white text-black hover:bg-gray-100 rounded-xl font-black border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Run
            </Button>
            <Button
              onClick={handleRunTests}
              disabled={isTesting}
              className="bg-black text-white hover:bg-gray-800 rounded-xl font-black border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Run Tests
            </Button>
          </div>

          {/* Output panel */}
          <div className="border-t-4 border-black flex-shrink-0 max-h-64 overflow-y-auto bg-gray-950">
            <div className="flex border-b-2 border-gray-800">
              <button
                onClick={() => setActiveTab("console")}
                className={`px-4 py-2 font-bold text-sm ${
                  activeTab === "console" ? "text-white bg-gray-800" : "text-gray-400"
                }`}
              >
                Console
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-4 py-2 font-bold text-sm ${
                  activeTab === "tests" ? "text-white bg-gray-800" : "text-gray-400"
                }`}
              >
                Test Results {testResults?.totalCount ? `(${testResults.passedCount}/${testResults.totalCount})` : ""}
              </button>
            </div>

            {activeTab === "console" && (
              <div className="p-4 font-mono text-sm">
                <div className="mb-3">
                  <label className="text-gray-400 text-xs font-bold uppercase block mb-1">Custom stdin</label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                {consoleOutput ? (
                  <>
                    {consoleOutput.compileStderr && (
                      <pre className="text-red-400 whitespace-pre-wrap mb-2">{consoleOutput.compileStderr}</pre>
                    )}
                    {consoleOutput.stdout && (
                      <pre className="text-green-400 whitespace-pre-wrap">{consoleOutput.stdout}</pre>
                    )}
                    {consoleOutput.stderr && (
                      <pre className="text-red-400 whitespace-pre-wrap">{consoleOutput.stderr}</pre>
                    )}
                    {!consoleOutput.stdout && !consoleOutput.stderr && !consoleOutput.compileStderr && (
                      <p className="text-gray-500">(no output)</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Run your code to see output here.</p>
                )}
              </div>
            )}

            {activeTab === "tests" && (
              <div className="p-4 font-mono text-sm space-y-3">
                {testResults?.compileError && (
                  <pre className="text-red-400 whitespace-pre-wrap">{testResults.compileError}</pre>
                )}
                {testResults?.results?.map((r, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-3 ${
                      r.passed ? "border-green-700 bg-green-950/40" : "border-red-700 bg-red-950/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`font-bold ${r.passed ? "text-green-400" : "text-red-400"}`}>
                        Test case {i + 1} {r.passed ? "passed" : "failed"}
                      </span>
                    </div>
                    <div className="text-gray-300 text-xs space-y-0.5">
                      <div>Input: {JSON.stringify(r.input)}</div>
                      <div>Expected: {r.expectedOutput}</div>
                      <div>Got: {r.actualOutput}</div>
                      {r.stderr && <div className="text-red-400">stderr: {r.stderr}</div>}
                    </div>
                  </div>
                ))}
                {!testResults && <p className="text-gray-500">Run tests to see results here.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeSolve;
