import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ isDarkMode, toggleDarkMode }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signinToggle = () => navigate("/Auth");
  const signupToggle = () => navigate("/Auth");

  const navItems = [
    { name: "Templates", to: "/templates" },
    { name: "My Designs", to: "/dashboard" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  const isElevated = scrollPosition > 10;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } ${isElevated ? "shadow-md" : ""}`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10">
            <Link to="/">
              <span className="text-xl font-bold tracking-tight cursor-pointer">
                Genify
              </span>
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 mx-10">
          <ul className="flex items-center justify-center gap-12">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`relative font-medium hover:text-blue-500 transition-colors duration-200 py-2 
                    before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 
                    before:bg-blue-500 before:transition-all before:duration-300 
                    hover:before:w-full ${
                      isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className={`p-2 rounded-full transition-transform duration-300 ease-in-out hover:rotate-12 ${
              isDarkMode ? "bg-gray-800 text-yellow-300" : "bg-gray-100 text-gray-700"
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Sign In / Sign Up Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={signinToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={signupToggle}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
                isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
