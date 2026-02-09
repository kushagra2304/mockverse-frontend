import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { v4 as uuid } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/ContextAuth";
import { 
  Target, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Play, 
  Square,
  Clock,
  MessageSquare,
  Sparkles,
  AlertCircle
} from "lucide-react";

const QUESTION_TIME = 30;

const VideoInterview = () => {
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const { user } = useAuth();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognitionState, setRecognitionState] = useState('idle');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(QUESTION_TIME);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const questions = location.state?.questions || [];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Responsive timer effect
  useEffect(() => {
    if (questions.length === 0) return;
    setQuestionTimer(QUESTION_TIME);

    const timerInterval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          setCurrentQuestionIndex((prevIndex) => {
            if (prevIndex < questions.length - 1) {
              return prevIndex + 1;
            }
            return prevIndex;
          });
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentQuestionIndex, questions]);

  const saveAttempt = async (isCorrect) => {
    const session_id = location.state?.sessionId;
    const user_id = user?.id;
    const question = questions[currentQuestionIndex];
    const user_answer = transcript;
    const is_correct = typeof isCorrect === "undefined" ? 0 : isCorrect;

    if (!session_id || !user_id || !question || !user_answer) {
      alert("Missing required data. Please try again.");
      return;
    }

    try {
      await axios.post('https://mockverse-backend-leqo.onrender.com/interview/save-answer', {
        session_id,
        user_id,
        question,
        user_answer,
        is_correct,
      });
    } catch (err) {
      console.error("Error saving attempt:", err);
    }
  };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSupported = SpeechRecognition !== undefined;
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const peer = new Peer(uuid());

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((error) => {
        alert("Please allow camera and microphone access to continue.");
      });

    return () => {
      peer.destroy();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      speakText(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (!speechSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setRecognitionState('listening');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setRecognitionState('idle');
      if (event.error === 'audio-capture' || event.error === 'not-allowed') {
        setRecording(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setRecognitionState('idle');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (!recording || recognitionState !== 'idle' || !speechSupported) {
      return;
    }
    const restartTimer = setTimeout(() => {
      if (recording && recognitionState === 'idle' && recognitionRef.current) {
        try {
          setRecognitionState('starting');
          recognitionRef.current.start();
        } catch (error) {
          setRecognitionState('idle');
        }
      }
    }, 500);
    return () => clearTimeout(restartTimer);
  }, [recording, recognitionState, speechSupported]);

  const toggleMic = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMicOn((prev) => !prev);
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setCameraOn((prev) => !prev);
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.cancel();
    navigate(`/interview/score/${location.state?.sessionId}`);
  };

  const startRecording = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (!micOn) {
      alert("Please unmute your microphone first.");
      return;
    }
    setRecording(true);
    setTranscript("");
    setFeedback("");
    setRecognitionState('starting');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setRecording(false);
        setRecognitionState('idle');
      }
    }
  };

  const stopRecording = () => {
    setRecording(false);
    setRecognitionState('stopping');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (error) {}
    }
    setTimeout(() => {
      setIsListening(false);
      setRecognitionState('idle');
      if (transcript.trim()) {
        generateFeedback(transcript);
      }
    }, 100);
  };

  const generateFeedback = async (userAnswer) => {
    if (!userAnswer.trim()) {
      setFeedback("No answer provided.");
      return;
    }
    setIsGeneratingFeedback(true);
    try {
      const response = await axios.post('https://mockverse-backend-leqo.onrender.com/check-answer', {
        question: questions[currentQuestionIndex],
        answer: userAnswer.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      setFeedback(response.data.feedback);
      const isCorrect = response.data.is_correct ? 1 : 0;
      await saveAttempt(isCorrect);
    } catch (error) {
      setFeedback("Error getting feedback. Please try again.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const getTimerColor = () => {
    if (questionTimer <= 10) return "from-red-400 to-pink-500";
    if (questionTimer <= 20) return "from-yellow-400 to-orange-500";
    return "from-green-400 to-emerald-500";
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Funky background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="relative">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center transform -rotate-6">
                  <Target className="w-7 h-7 text-yellow-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-black text-black tracking-tight">
                Mock<span className="text-purple-600">verse</span>
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-black text-black">Live Interview</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Browser Support Warning */}
      {!speechSupported && (
        <div 
          className={`mx-4 mt-4 bg-gradient-to-r from-red-50 to-orange-50 border-4 border-red-500 rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(239,68,68,1)] transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-red-800 text-lg">Browser Not Supported</p>
              <p className="text-red-700 font-bold mt-1">
                Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Progress Bar */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-black">Question Progress</span>
              <span className="font-bold text-gray-700">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Video and Question Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Your Video */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-black flex items-center">
                  <Video className="w-6 h-6 mr-2 text-purple-600" />
                  Your Video
                </h3>
                {recording && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 border-2 border-red-500 rounded-full animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-bold text-red-700 text-sm">REC</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full aspect-video rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-900"
                />
                {!cameraOn && (
                  <div className="absolute inset-0 bg-gray-900 rounded-2xl flex items-center justify-center">
                    <VideoOff className="w-16 h-16 text-gray-500" />
                  </div>
                )}
              </div>
              
              {/* Listening Status */}
              {isListening && (
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-500 rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] animate-pulse">
                  <div className="flex items-center justify-center space-x-2">
                    <Mic className="w-5 h-5 text-green-600 animate-bounce" />
                    <span className="font-black text-green-800">Listening... Speak now!</span>
                  </div>
                </div>
              )}
              
              {recording && !isListening && recognitionState === 'starting' && (
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-500 rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-600 animate-spin" />
                    <span className="font-black text-yellow-800">Starting listener...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Card */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-black flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
                  Question
                </h3>
                <div className={`px-4 py-2 bg-gradient-to-r ${getTimerColor()} border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="font-black text-white text-lg">{questionTimer}s</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-black rounded-2xl p-6 flex items-center justify-center">
                {questions.length > 0 ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-500 mb-4">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <p className="text-xl md:text-2xl font-black text-black leading-relaxed">
                      {questions[currentQuestionIndex]}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-black text-gray-600">Loading questions...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black text-black mb-4 text-center">Controls</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                className={`py-4 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center space-x-2 ${
                  cameraOn ? 'bg-white text-black' : 'bg-red-500 text-white'
                }`}
              >
                {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                <span className="hidden sm:inline">{cameraOn ? 'Camera On' : 'Camera Off'}</span>
              </button>

              {/* Mic Toggle */}
              <button
                onClick={toggleMic}
                className={`py-4 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center space-x-2 ${
                  micOn ? 'bg-white text-black' : 'bg-red-500 text-white'
                }`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                <span className="hidden sm:inline">{micOn ? 'Mic On' : 'Mic Off'}</span>
              </button>

              {/* Record Toggle */}
              <button
                onClick={recording ? stopRecording : startRecording}
                disabled={!speechSupported}
                className={`py-4 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center space-x-2 ${
                  recording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {recording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="hidden sm:inline">{recording ? 'Stop' : 'Answer'}</span>
              </button>

              {/* End Call */}
              <button
                onClick={endCall}
                className="py-4 rounded-2xl font-black border-4 border-black bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5 transform rotate-135" />
                <span className="hidden sm:inline">End</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Transcript */}
        {recording && transcript && (
          <div 
            className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-blue-500 rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] animate-fade-in"
          >
            <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Live Transcript
            </h3>
            <p className="text-black font-medium text-lg leading-relaxed break-words">
              {transcript}
            </p>
          </div>
        )}

        {/* Answer & Feedback Section */}
        {transcript && !recording && (
          <div 
            className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-fade-in"
          >
            <h3 className="text-2xl font-black text-black mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
              Your Answer & Feedback
            </h3>
            
            {/* Answer */}
            <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-gray-300 rounded-2xl p-4">
              <p className="font-bold text-gray-700 mb-2">Your Answer:</p>
              <p className="text-black font-medium leading-relaxed break-words">
                {transcript}
              </p>
            </div>

            {/* Feedback */}
            {isGeneratingFeedback ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-400 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-black text-yellow-900 text-lg">AI is analyzing your answer...</span>
                </div>
              </div>
            ) : feedback ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-500 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]">
                <p className="font-bold text-green-900 mb-3 text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Feedback:
                </p>
                <p className="text-black font-medium leading-relaxed">
                  {feedback}
                </p>
              </div>
            ) : (
              <button
                onClick={() => generateFeedback(transcript)}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                Get AI Feedback
              </button>
            )}
          </div>
        )}
      </div>

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
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
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

export default VideoInterview;