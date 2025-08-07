import React, { useState } from "react";
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
  Zap
} from "lucide-react";
import { useAuth } from "@/context/ContextAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loggedIn, logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
    const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };


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
      description: "Advanced AI technology simulates real interview scenarios with dynamic questioning and personalized feedback."
    },
    {
      icon: Shield,
      title: "Industry-Specific Practice",
      description: "Choose from 50+ industry categories including Tech, Finance, Healthcare, Marketing, and more."
    },
    {
      icon: Clock,
      title: "Real-Time Analysis",
      description: "Get instant feedback on your communication skills, body language, and answer quality during the interview."
    },
    {
      icon: Target,
      title: "Performance Tracking",
      description: "Track your progress over time with detailed analytics and personalized improvement recommendations."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "InterviewAce Pro helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me improve my technical communication skills.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager at Microsoft",
      content: "The practice sessions felt so realistic. I went into my actual interviews feeling completely confident and prepared.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Data Scientist at Netflix",
      content: "The industry-specific questions were spot on. I practiced for weeks and it made all the difference in my final interviews.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Mockverse
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {loggedIn ? (
                <div className="relative">
                  <Button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
                  >
                    👤 {user?.name || user?.email || "Profile"}
                  </Button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                      {/* <button 
                        onClick={() => alert("Profile page coming soon!")} 
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                      >
                        My Profile
                      </button> */}
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => {navigate("/login")}}
                    className="px-6 py-2 bg-transparent border-2 border-white/30 text-white hover:bg-white/10"
                    variant="outline"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/setup")}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
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
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Master Your Next
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Interview</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Practice with AI-powered mock interviews, get real-time feedback, and land your dream job with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                onClick={() => navigate("/setup")}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-2xl transform hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Interview
              </Button>
              <Button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl"
                variant="outline"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose InterviewAce Pro?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our cutting-edge AI technology provides the most realistic interview practice experience available.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Get started in just 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Role",
                description: "Select from 50+ job categories and difficulty levels tailored to your experience."
              },
              {
                step: "02",
                title: "Practice with AI",
                description: "Engage in realistic interviews with our advanced AI that adapts to your responses."
              },
              {
                step: "03",
                title: "Get Feedback",
                description: "Receive detailed analysis and personalized tips to improve your interview performance."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands who've landed their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                </CardHeader>
                <CardContent>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join 12,847+ professionals who've already improved their interview skills with InterviewAce Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/setup")

              }
              className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Your Free Interview
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl"
              variant="outline"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/20 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">InterviewAce Pro</span>
            </div>
            <div className="flex space-x-8 text-gray-300">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-gray-400">
            <p>&copy; 2025 InterviewAce Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;