import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { v4 as uuid } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/ContextAuth";

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

  const navigate = useNavigate();
  const location = useLocation();
  const questions = location.state?.questions || [];

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-black text-white px-2 py-4 overflow-x-hidden">
      {!speechSupported && (
        <div className="mb-4 bg-red-600 p-3 rounded text-center w-full max-w-lg mx-auto">
          <p>Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.</p>
        </div>
      )}

      {/* Responsive layout for video and question */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center md:items-start mt-4">
        {/* Video */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm aspect-video rounded-xl border-2 border-white"
            style={{ background: "#222" }}
          />
          <p className="mt-2 text-sm">You</p>
          {isListening && (
            <div className="mt-2 bg-green-500 px-2 py-1 rounded text-xs animate-pulse">
              🎤 Listening... (Speak now)
            </div>
          )}
          {recording && !isListening && recognitionState === 'starting' && (
            <div className="mt-2 bg-yellow-500 px-2 py-1 rounded text-xs animate-pulse">
              ⏳ Starting listener...
            </div>
          )}
          {recording && !isListening && recognitionState === 'idle' && (
            <div className="mt-2 bg-orange-500 px-2 py-1 rounded text-xs animate-pulse">
              🔄 Restarting listener...
            </div>
          )}
        </div>

        {/* Question */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm h-48 rounded-xl border-2 border-white bg-gray-800 flex items-center justify-center text-gray-200 text-base px-2 sm:px-4 text-center">
            {questions.length > 0 ? (
              <div className="w-full">
                <div className="mb-2 text-xs sm:text-sm text-gray-400">
                  ⏳ Time left: <span className="font-bold">{questionTimer}s</span>
                </div>
                <p className="mb-2 text-xs sm:text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <p className="break-words">{questions[currentQuestionIndex]}</p>
              </div>
            ) : (
              <p>Loading questions...</p>
            )}
          </div>
          <p className="mt-2 text-sm">AI Interviewer</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-2xl justify-center">
        <button onClick={toggleCamera} className={`px-4 py-2 rounded ${cameraOn ? 'bg-gray-800' : 'bg-red-600'} w-full sm:w-auto`}>
          {cameraOn ? "📹 Camera On" : "📹 Camera Off"}
        </button>
        <button onClick={endCall} className="bg-red-600 px-4 py-2 rounded w-full sm:w-auto">
          ❌ End Call
        </button>
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded ${recording ? 'bg-red-600' : 'bg-blue-600'} ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''} w-full sm:w-auto`}
          disabled={!speechSupported}
        >
          {recording ? "⏹️ Stop Answer" : "🎤 Start Answer"}
        </button>
      </div>

      {/* Transcript display */}
      {recording && transcript && (
        <div className="mt-4 bg-gray-700 p-3 rounded w-full max-w-2xl text-xs sm:text-sm">
          <p className="text-gray-300">Current transcript:</p>
          <p className="text-white break-words">{transcript}</p>
        </div>
      )}

      {/* Transcript and Feedback */}
      {transcript && !recording && (
        <div className="mt-8 bg-gray-700 p-4 rounded w-full max-w-2xl text-left text-xs sm:text-base">
          <p><strong>Your Answer:</strong> {transcript}</p>
          {isGeneratingFeedback ? (
            <div className="mt-2 text-yellow-400">
              <strong>AI Feedback:</strong>
              <span className="ml-2 animate-pulse">Generating feedback...</span>
            </div>
          ) : feedback ? (
            <p className="mt-2"><strong>AI Feedback:</strong> {feedback}</p>
          ) : null}
          {!isGeneratingFeedback && !feedback && (
            <button
              onClick={() => generateFeedback(transcript)}
              className="mt-2 bg-blue-600 px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
            >
              Get Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoInterview;