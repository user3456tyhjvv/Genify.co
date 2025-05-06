import React, { useState, useEffect, useRef  } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Hero from "./Hero";
import Footer from "./Footer";

import FloatingCTA from "./FloatingCTA";
import AuthPage from "./AuthPage";
import Templates from "./Templates";
import Dashboard from "./Dashboard";
//import useAuth from "./hooks/useAuth";
//import UserProfile from "./components/UserProfile";
import Contact from "./Contact";
import About from "./About";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };
  const [showVideoModal, setShowVideoModal] = useState(false);
  const HeroRef = useRef(null);
  
  // Function to handle showing video demo from FloatingCTA
  const handleShowVideoDemo = () => {
    setShowVideoModal(true);
    // If we have a ref to the HeroSection, we can call its method
    if (HeroRef.current && HeroRef.current.openVideoModal) {
      HeroRef.current.openVideoModal();
    }
  };
  // Hide Hero and Header on specific pages (e.g., Auth)
  const hideHeroAndHeader = ["/auth"].includes(location.pathname.toLowerCase());

  return (
    <div className={isDarkMode ? "dark" : ""}>
      {!hideHeroAndHeader && (
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      )}
      
      <Routes>
       
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/components" element={<UserProfile />} />
        <Route path="/hooks" element={<useAuth />} /> */}
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
      </Routes>
      <Footer />
      <FloatingCTA onShowVideoDemo={handleShowVideoDemo} />
    </div>
  );
}
