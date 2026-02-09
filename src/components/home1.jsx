import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Award, 
  Target, 
  CheckCircle, 
  Star,
  Play,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/context/ContextAuth";
import { useNavigate } from "react-router-dom";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible];
};

const Home = () => {
  const { loggedIn, logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const navigate = useNavigate();
  
  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Refs for scroll animations
  const [statsRef, statsVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [stepsRef, stepsVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const stats = [
    { icon: Users, label: "Active Users", value: "12,847+" },
    { icon: Award, label: "Interviews Completed", value: "186,293+" },
    { icon: Target, label: "Success Rate", value: "94.2%" },
    { icon: TrendingUp, label: "Job Placements", value: "8,156+" }
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Interviews",
      description: "Advanced AI technology simulates real interview scenarios with dynamic questioning and personalized feedback.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: "Industry-Specific Practice",
      description: "Choose from 50+ industry categories including Tech, Finance, Healthcare, Marketing, and more.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Real-Time Analysis",
      description: "Get instant feedback on your communication skills, body language, and answer quality during the interview.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Target,
      title: "Performance Tracking",
      description: "Track your progress over time with detailed analytics and personalized improvement recommendations.",
      color: "from-green-400 to-emerald-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "InterviewAce Pro helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me improve my technical communication skills.",
      rating: 5,
      color: "bg-gradient-to-br from-yellow-50 to-orange-50"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager at Microsoft",
      content: "The practice sessions felt so realistic. I went into my actual interviews feeling completely confident and prepared.",
      rating: 5,
      color: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      name: "Emily Watson",
      role: "Data Scientist at Netflix",
      content: "The industry-specific questions were spot on. I practiced for weeks and it made all the difference in my final interviews.",
      rating: 5,
      color: "bg-gradient-to-br from-purple-50 to-pink-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b-4 border-black transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 animate-slide-in-left">
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
            <div className="flex items-center gap-4 animate-slide-in-right">
              {loggedIn ? (
                <div className="relative">
                  <Button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-2xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    👤 {user?.name || user?.email || "Profile"}
                  </Button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black z-10 animate-fade-in">
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-3 text-black font-bold hover:bg-yellow-100 rounded-2xl transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/setup")}
                    className="px-6 py-3 bg-yellow-300 text-black hover:bg-yellow-400 rounded-2xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-block mb-6 animate-fade-in-up">
              <span className="inline-flex items-center px-6 py-2 bg-purple-100 text-purple-800 rounded-full font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                <Sparkles className="w-4 h-4 mr-2" />
                #1 AI Interview Platform
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-black mb-8 leading-none animate-fade-in-up animation-delay-200">
              Master Your
              <br />
              <span className="inline-block transform -rotate-2 bg-gradient-to-r from-yellow-300 to-orange-400 px-6 py-2 mt-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300">
                Next Interview
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed font-medium max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
              Practice with AI-powered mock interviews, get real-time feedback, and land your dream job with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up animation-delay-600">
              <Button
                onClick={() => navigate("/setup")}
                className="px-10 py-6 text-xl bg-black text-white hover:bg-gray-800 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] hover:scale-105 transition-all group"
              >
                <Play className="w-6 h-6 mr-2 group-hover:animate-pulse" />
                Start Free Interview
              </Button>
              <Button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-6 text-xl bg-white text-black hover:bg-gray-50 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] transition-all group"
              >
                Learn More
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements with parallax */}
        <div 
          className="absolute top-40 left-10 w-20 h-20 bg-blue-300 rounded-full border-4 border-black transform rotate-12 animate-float"
          style={{ transform: `translateY(${scrollY * 0.1}px) rotate(12deg)` }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-300 rounded-full border-4 border-black animate-float animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
        <div 
          className="absolute top-60 right-40 w-12 h-12 bg-purple-300 border-4 border-black transform -rotate-12 animate-float animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.12}px) rotate(-12deg)` }}
        ></div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className={`py-20 bg-gradient-to-br from-gray-50 to-gray-100 border-y-4 border-black transition-all duration-1000 ${
          statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center group transition-all duration-500 ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-300">
                  <stat.icon className="w-10 h-10 text-black group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-black mb-2">{stat.value}</div>
                <div className="text-gray-600 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div 
            ref={featuresRef}
            className={`text-center mb-20 transition-all duration-1000 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
              Why Choose
              <span className="inline-block transform rotate-2 bg-gradient-to-r from-purple-300 to-pink-300 px-4 py-2 ml-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300">
                Mockverse?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Our cutting-edge AI technology provides the most realistic interview practice experience available.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 rounded-2xl overflow-hidden ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black text-black">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 to-orange-50 border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            ref={stepsRef}
            className={`text-center mb-20 transition-all duration-1000 ${
              stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Get started in just 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose Your Role",
                description: "Select from 50+ job categories and difficulty levels tailored to your experience.",
                color: "bg-blue-300"
              },
              {
                step: "02",
                title: "Practice with AI",
                description: "Engage in realistic interviews with our advanced AI that adapts to your responses.",
                color: "bg-purple-300"
              },
              {
                step: "03",
                title: "Get Feedback",
                description: "Receive detailed analysis and personalized tips to improve your interview performance.",
                color: "bg-green-300"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`text-center relative transition-all duration-700 ${
                  stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`w-24 h-24 ${item.color} rounded-2xl flex items-center justify-center text-4xl font-black text-black mx-auto mb-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 hover:rotate-0 hover:scale-110 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}>
                  {item.step}
                </div>
                <h3 className="text-3xl font-black text-black mb-4">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed font-medium text-lg">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 w-12 animate-bounce-horizontal">
                    <ArrowRight className="w-12 h-12 text-black opacity-20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={testimonialsRef}
            className={`text-center mb-20 transition-all duration-1000 ${
              testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Join thousands who've landed their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`${testimonial.color} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 rounded-2xl ${
                  testimonialsVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 -rotate-3'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 text-yellow-500 fill-current transition-all duration-300 ${
                          testimonialsVisible ? 'scale-100' : 'scale-0'
                        }`}
                        style={{ transitionDelay: `${(index * 150) + (i * 100)}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-800 leading-relaxed font-medium text-lg">"{testimonial.content}"</p>
                </CardHeader>
                <CardContent>
                  <div className="text-black font-black text-lg">{testimonial.name}</div>
                  <div className="text-gray-600 font-bold">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-100 to-pink-100 border-y-4 border-black">
        <div 
          ref={ctaRef}
          className={`max-w-4xl mx-auto text-center px-4 transition-all duration-1000 ${
            ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
            Ready to Ace Your
            <br />
            <span className="inline-block transform -rotate-1 bg-yellow-300 px-6 py-2 mt-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300">
              Next Interview?
            </span>
          </h2>
          <p className="text-xl text-gray-700 mb-12 font-medium">
            Join 12,847+ professionals who've already improved their interview skills
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => navigate("/setup")}
              className="px-10 py-6 text-xl bg-black text-white hover:bg-gray-800 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] hover:scale-105 transition-all"
            >
              Start Your Free Interview
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="px-10 py-6 text-xl bg-white text-black hover:bg-gray-50 rounded-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300">
                  <Target className="w-6 h-6 text-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <span className="text-2xl font-black">Mock<span className="text-yellow-300">verse</span></span>
            </div>
            <div className="flex space-x-8 text-white font-bold">
              <button className="hover:text-yellow-300 transition-colors hover:scale-110 transform duration-200">Privacy Policy</button>
              <button className="hover:text-yellow-300 transition-colors hover:scale-110 transform duration-200">Terms of Service</button>
              <button className="hover:text-yellow-300 transition-colors hover:scale-110 transform duration-200">Contact</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-2 border-gray-700 text-center text-gray-400 font-medium">
            <p>&copy; 2025 Mockverse. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
        
        @keyframes bounce-horizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
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
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        
        .animate-bounce-horizontal {
          animation: bounce-horizontal 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
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

export default Home;