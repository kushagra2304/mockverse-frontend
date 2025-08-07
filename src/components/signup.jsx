import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("https://mockverse-backend-leqo.onrender.com/api/signup", form);
      navigate("/login"); 
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
        <CardContent className="p-8 space-y-8">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Create Your Account</h1>
          <div className="space-y-6">
            <div>
            
                          <label htmlFor="name" className="block text-white mb-2">Full Name</label>
                         <Input
                id="name"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="bg-white/20 border border-white/30 text-white placeholder-white focus:ring-2 focus:ring-purple-400"
              />

            </div>
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="bg-white/20 border border-white/30 text-white placeholder-white focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
  value={form.password}
  onChange={handleChange}
  className="bg-white/20 border border-white/30 text-white placeholder-white focus:ring-2 focus:ring-purple-400"
/>
            <Button
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-xl transition-all"
              onClick={handleSignup}
            >
              Create Account
            </Button>
            </div>
            <div className="text-center text-sm text-gray-300 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}