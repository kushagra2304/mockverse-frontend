// src/pages/Home.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ContextAuth";
import {
  Menu,
  MenuButton,
  MenuItem,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";


const Home = () => {
    const { loggedIn, logout, user } = useAuth();
  const navigate = useNavigate();


   const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-6 bg-white/60 backdrop-blur-md shadow-md border-b border-white/30 rounded-b-xl">
        <h2 className="text-xl font-bold text-gray-800">
          Mock Interview AI
        </h2>
        <div className="flex gap-4">
            <div className="space-x-2">
        {loggedIn ? (
          <Menu
            menuButton={
              <MenuButton className="px-4 py-2 border rounded">
                👤 {user?.name|| user?.email || "Profile"}
              </MenuButton>
            }
            transition
          >
            <MenuItem onClick={() => alert("Profile page coming soon!")}>My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        ) : (
          <>
            <Button
            onClick={() => navigate("/login")}
            className="px-4 py-1"
            variant="outline"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="px-4 py-1"
            variant="default"
          >
            Signup
          </Button>
          </>
        )}
      </div>
        </div>
          
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Card className="w-full max-w-2xl text-center py-10 shadow-2xl rounded-2xl bg-white/60 backdrop-blur-md border border-white/30">
          <CardContent className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              Welcome to <span className="text-purple-700">Mock Interview AI</span>
            </h1>
            <p className="text-lg text-gray-700">
              Practice Real-Time Video Interviews with AI. Be confident. Be prepared.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => navigate("/setup")}
                className="px-6 py-2 text-lg"
                variant="default"
              >
                Get started
              </Button>
              {/* <Button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 text-lg"
                variant="secondary"
              >
                
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  );

};


export default Home;
