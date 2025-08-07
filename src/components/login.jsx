import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ContextAuth";

export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
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
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
        <CardContent className="p-8 space-y-8">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Welcome Back!</h1>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400"
            />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              className="bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400"
            />
            </div>
            <Button
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-xl shadow-xl transition-all"
              onClick={handleLogin}
            >
              Login
            </Button>
            <div className="text-center text-sm text-gray-300 mt-4">
              Not registered yet?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Create an account
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}