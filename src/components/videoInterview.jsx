import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { v4 as uuid } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/ContextAuth";

const VideoInterview = () => {
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  // const mediaRecorderRef = useRef(null);
  // const audioChunksRef = useRef([]);
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

  const navigate = useNavigate();
  const location = useLocation();
  const questions = location.state?.questions || [];

  
  const saveAttempt = async (isCorrect) => {
  const session_id = location.state?.sessionId;
const user_id = user?.id;
const question = questions[currentQuestionIndex];
const user_answer = transcript;
const is_correct = typeof isCorrect === "undefined" ? 0 : isCorrect; 

console.log("Payload to backend:", {
    session_id,
    user_id,
    question,
    user_answer,
    is_correct,
  });

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
    console.log("Attempt saved!");
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
        console.error("Error accessing media devices:", error);
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
    if (questions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentQuestionIndex((prev) => {
        if (prev < questions.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [questions]);


  useEffect(() => {
    if (questions.length > 0) {
      speakText(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (!speechSupported) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      setRecognitionState('listening');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
        console.log("Final transcript:", finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setRecognitionState('idle');
      
      if (event.error === 'no-speech') {
        console.log("No speech detected, will restart if still recording...");
      } else if (event.error === 'audio-capture') {
        alert("No microphone was found. Please check your microphone settings.");
        setRecording(false);
      } else if (event.error === 'not-allowed') {
        alert("Microphone access was denied. Please allow microphone access and try again.");
        setRecording(false);
      } else if (event.error === 'aborted') {
        console.log("Speech recognition aborted");
      } else {
        console.log("Other speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      setRecognitionState('idle');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {
          console.log("Recognition abort failed:", e);
        }
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
          console.log("Auto-restart failed:", error);
          setRecognitionState('idle');
        }
      }
    }, 500); 

    return () => clearTimeout(restartTimer);
  }, [recording, recognitionState, speechSupported]);

  // const toggleMic = () => {
  //   if (!streamRef.current) return;
  //   streamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  //   setMicOn((prev) => !prev);
  // };

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
        console.error("Error starting recognition:", error);
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
      } catch (error) {
        console.log("Error stopping recognition:", error);
      }
    }

    // Reset states
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
      console.log("📤 Sending to backend:", {
        question: questions[currentQuestionIndex],
        answer: userAnswer.trim()
      });
      
      const response = await axios.post('/check-answer', {
        question: questions[currentQuestionIndex],
        answer: userAnswer.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 
      });
      
      setFeedback(response.data.feedback);
      console.log("✅ Feedback received:", response.data.feedback);

    const isCorrect = response.data.is_correct ? 1 : 0; 
    await saveAttempt(isCorrect); 
      
    } catch (error) {
      console.error("❌ Error generating feedback:", error);
      
      if (error.response) {
        console.error("Server error:", error.response.status, error.response.data);
        setFeedback(`Server Error (${error.response.status}): ${error.response.data.error || 'Failed to get feedback from server'}`);
      } else if (error.request) {
        console.error("Network error - no response:", error.request);
        setFeedback("Network error: Unable to connect to server. Please check if your backend is running and accessible.");
      } else if (error.code === 'ECONNABORTED') {
        setFeedback("Request timeout: The server took too long to respond. Please try again.");
      } else {
        console.error("Request setup error:", error.message);
        setFeedback(`Error: ${error.message}. Please try again.`);
      }
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white px-4">
      {!speechSupported && (
        <div className="mb-4 bg-red-600 p-3 rounded text-center">
          <p>Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.</p>
        </div>
      )}

      <div className="flex gap-6 w-full max-w-6xl justify-center">
        <div className="flex flex-col items-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-[400px] h-[300px] rounded-xl border-2 border-white"
          />
          <p className="mt-2">You</p>
          {isListening && (
            <div className="mt-2 bg-green-500 px-2 py-1 rounded text-sm animate-pulse">
              🎤 Listening... (Speak now)
            </div>
          )}
          {recording && !isListening && recognitionState === 'starting' && (
            <div className="mt-2 bg-yellow-500 px-2 py-1 rounded text-sm animate-pulse">
              ⏳ Starting listener...
            </div>
          )}
          {recording && !isListening && recognitionState === 'idle' && (
            <div className="mt-2 bg-orange-500 px-2 py-1 rounded text-sm animate-pulse">
              🔄 Restarting listener...
            </div>
          )}
        </div>

        
        <div className="flex flex-col items-center">
          <div className="w-[400px] h-[300px] rounded-xl border-2 border-white bg-gray-800 flex items-center justify-center text-gray-200 text-lg px-4 text-center">
            {questions.length > 0 ? (
              <div>
                <p className="mb-2 text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <p>{questions[currentQuestionIndex]}</p>
              </div>
            ) : (
              <p>Loading questions...</p>
            )}
          </div>
          <p className="mt-2">AI Interviewer</p>
        </div>
      </div>


      <div className="flex gap-4 mt-10">
        {/* <button onClick={toggleMic} className={`px-4 py-2 rounded ${micOn ? 'bg-gray-800' : 'bg-red-600'}`}>
          {micOn ? "🎤 Mic On" : "🎤 Mic Off"}
        </button> */}
        <button onClick={toggleCamera} className={`px-4 py-2 rounded ${cameraOn ? 'bg-gray-800' : 'bg-red-600'}`}>
          {cameraOn ? "📹 Camera On" : "📹 Camera Off"}
        </button>
        <button onClick={endCall} className="bg-red-600 px-4 py-2 rounded">
          ❌ End Call
        </button>
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded ${recording ? 'bg-red-600' : 'bg-blue-600'} ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!speechSupported}
        >
          {recording ? "⏹️ Stop Answer" : "🎤 Start Answer"}
        </button>
      </div>

      {/* Current transcript display */}
      {recording && transcript && (
        <div className="mt-4 bg-gray-700 p-3 rounded w-full max-w-4xl">
          <p className="text-sm text-gray-300">Current transcript:</p>
          <p className="text-white">{transcript}</p>
        </div>
      )}

      {/* Transcript and Feedback */}
      {transcript && !recording && (
        <div className="mt-8 bg-gray-700 p-4 rounded w-full max-w-4xl text-left">
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
              className="mt-2 bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
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