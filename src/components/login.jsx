import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Mail, Lock, LogIn, UserPlus, Sparkles } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ContextAuth";

export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("https://mockverse-backend-leqo.onrender.com/api/login", {
        email,
        password,
      });

      if (res.status === 200) {
        login(res.data.user);
        alert("Login successful 🎉");
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Funky background pattern with parallax */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
      </div>

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
              ← Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-88px)] px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div 
            className={`text-center mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-6 py-2 bg-purple-100 text-purple-800 rounded-full font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome Back!
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-black mb-4 leading-tight">
              Login to
              <span className="inline-block transform rotate-2 bg-gradient-to-r from-yellow-300 to-orange-400 px-4 py-2 ml-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                Continue
              </span>
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              Ready to ace your next interview?
            </p>
          </div>

          {/* Login Card */}
          <Card 
            className={`bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <CardContent className="p-8 md:p-10 space-y-6">
              {/* Email Input */}
              <div 
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <label htmlFor="email" className="text-black font-black text-lg mb-3 block flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  onKeyPress={handleKeyPress}
                  className="bg-white border-4 border-black text-black placeholder-gray-400 text-lg px-6 py-4 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:-translate-y-0.5 transition-all"
                />
              </div>

              {/* Password Input */}
              <div 
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <label htmlFor="password" className="text-black font-black text-lg mb-3 block flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-purple-500" />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  onKeyPress={handleKeyPress}
                  className="bg-white border-4 border-black text-black placeholder-gray-400 text-lg px-6 py-4 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:-translate-y-0.5 transition-all"
                />
              </div>

              {/* Forgot Password Link */}
              <div 
                className={`text-right transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                <button className="text-purple-600 font-bold hover:text-purple-800 transition-colors text-sm hover:underline">
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <div 
                className={`pt-2 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full py-6 text-xl bg-black text-white hover:bg-gray-800 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6 mr-2 inline group-hover:translate-x-1 transition-transform" />
                      Login
                    </>
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div 
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: '900ms' }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-4 border-dashed border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 font-bold">OR</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div 
                className={`text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: '1000ms' }}
              >
                <p className="text-gray-700 font-medium mb-4">
                  Don't have an account yet?
                </p>
                <Button
                  onClick={() => navigate("/signup")}
                  className="w-full py-6 text-xl bg-gradient-to-r from-purple-100 to-pink-100 text-black hover:from-purple-200 hover:to-pink-200 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] transition-all group"
                >
                  <UserPlus className="w-6 h-6 mr-2 inline group-hover:scale-110 transition-transform" />
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div 
            className={`mt-6 text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            <div className="inline-block bg-white border-4 border-black rounded-2xl px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-black font-bold text-sm">
                🔒 Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div 
        className="absolute top-40 left-10 w-16 h-16 bg-blue-300 rounded-full border-4 border-black transform rotate-12 animate-float pointer-events-none hidden md:block"
        style={{ transform: `translateY(${scrollY * 0.1}px) rotate(12deg)` }}
      ></div>
      <div 
        className="absolute bottom-40 right-20 w-12 h-12 bg-yellow-300 rounded-full border-4 border-black animate-float animation-delay-2000 pointer-events-none hidden md:block"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 right-40 w-10 h-10 bg-purple-300 border-4 border-black transform -rotate-12 animate-float animation-delay-4000 pointer-events-none hidden md:block"
        style={{ transform: `translateY(${scrollY * 0.12}px) rotate(-12deg)` }}
      ></div>

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
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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