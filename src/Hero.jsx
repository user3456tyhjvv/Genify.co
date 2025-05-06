import React, { useState } from "react";
import { ArrowRight, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const signinToggle = () => navigate("/Auth");
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6 sm:px-10">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-60"></div>
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 rounded-full bg-teal-100 dark:bg-teal-900/20 blur-3xl opacity-70"></div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
        
        {/* Left: Text Content */}
        <div className="text-center lg:text-left flex-1 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            New Creative Tools Available
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Launch Your Brand with <span className="text-blue-600 dark:text-blue-400 relative">
              Impact
              <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 dark:bg-blue-700/40 -z-10 translate-y-2 skew-x-3"></span>
            </span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg sm:text-xl max-w-2xl">
            Create logos, thumbnails, stickers, and more — instantly and beautifully. Transform your ideas into stunning visuals in seconds.
          </p>
          
          {/* Feature Bullets */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto lg:mx-0">
            {["AI-Powered Design Tools", "100+ Professional Templates", "No Design Skills Required", "Export in Multiple Formats"].map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-200">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
            <button
              onClick={signinToggle}
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => setShowVideoModal(true)}
              className="group bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-3 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-md flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Demo
            </button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-${i*100} flex items-center justify-center text-xs text-white font-medium`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">5,000+</span> creators trust us for their design needs
            </p>
          </div>
        </div>
        
        {/* Right: Image with Floating Elements */}
        <div className="flex-1 relative">
          <div className="relative z-10 rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
          <div className="w-full h-auto">
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
 
  <rect x="0" y="0" width="800" height="500" rx="12" fill="#FFFFFF" />
  
 
  <rect x="40" y="40" width="720" height="420" rx="8" fill="#F7F9FC" stroke="#E2E8F0" stroke-width="1" />
  
  <rect x="40" y="40" width="720" height="50" rx="8 8 0 0" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  
 
  <circle cx="70" cy="65" r="10" fill="#3B82F6" />
  <circle cx="100" cy="65" r="10" fill="#EC4899" />
  <circle cx="130" cy="65" r="10" fill="#10B981" />

  <rect x="200" y="52.5" width="240" height="25" rx="4" fill="#F1F5F9" />
  <circle cx="215" cy="65" r="6" fill="#94A3B8" />
  <line x1="220" y1="70" x2="225" y2="75" stroke="#94A3B8" stroke-width="2" />
  
 
  <circle cx="730" cy="65" r="15" fill="#3B82F6" />
  <text x="730" y="70" font-family="Arial" font-size="14" fill="white" text-anchor="middle">U</text>
  
  <rect x="40" y="90" width="160" height="370" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  
  <rect x="55" y="110" width="130" height="36" rx="4" fill="#3B82F6" />
  <text x="85" y="133" font-family="Arial" font-size="14" fill="white">Dashboard</text>
  
  <rect x="55" y="156" width="130" height="36" rx="4" fill="#F1F5F9" />
  <text x="85" y="179" font-family="Arial" font-size="14" fill="#64748B">Templates</text>
  
  <rect x="55" y="202" width="130" height="36" rx="4" fill="#F1F5F9" />
  <text x="85" y="225" font-family="Arial" font-size="14" fill="#64748B">Projects</text>
  
  <rect x="55" y="248" width="130" height="36" rx="4" fill="#F1F5F9" />
  <text x="85" y="271" font-family="Arial" font-size="14" fill="#64748B">Assets</text>
  
  <rect x="55" y="294" width="130" height="36" rx="4" fill="#F1F5F9" />
  <text x="85" y="317" font-family="Arial" font-size="14" fill="#64748B">Settings</text>
  
 
  <rect x="200" y="90" width="560" height="370" fill="#F7F9FC" />
  
  
  <text x="230" y="130" font-family="Arial" font-size="20" font-weight="bold" fill="#1E293B">Recent Projects</text>
  
  <rect x="230" y="150" width="160" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="230" y="150" width="160" height="80" rx="8 8 0 0" fill="#3B82F6" />
  <text x="310" y="195" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Logo</text>
  <text x="250" y="250" font-family="Arial" font-size="14" fill="#64748B">Coffee Shop Logo</text>
  <text x="250" y="265" font-family="Arial" font-size="12" fill="#94A3B8">Edited 2h ago</text>
  
  
  <rect x="410" y="150" width="160" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="410" y="150" width="160" height="80" rx="8 8 0 0" fill="#EC4899" />
  <text x="490" y="195" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Card</text>
  <text x="430" y="250" font-family="Arial" font-size="14" fill="#64748B">Business Card</text>
  <text x="430" y="265" font-family="Arial" font-size="12" fill="#94A3B8">Edited 1d ago</text>
  

  <rect x="590" y="150" width="160" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="590" y="150" width="160" height="80" rx="8 8 0 0" fill="#10B981" />
  <text x="670" y="195" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Social</text>
  <text x="610" y="250" font-family="Arial" font-size="14" fill="#64748B">Instagram Story</text>
  <text x="610" y="265" font-family="Arial" font-size="12" fill="#94A3B8">Edited 3d ago</text>
  
  <rect x="230" y="290" width="160" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="230" y="290" width="160" height="80" rx="8 8 0 0" fill="#F59E0B" />
  <text x="310" y="335" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Banner</text>
  <text x="250" y="390" font-family="Arial" font-size="14" fill="#64748B">Website Banner</text>
  <text x="250" y="405" font-family="Arial" font-size="12" fill="#94A3B8">Edited 5d ago</text>
  
  
  <rect x="410" y="290" width="160" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="410" y="290" width="160" height="80" rx="8 8 0 0" fill="#8B5CF6" />
  <text x="490" y="335" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Flyer</text>
  <text x="430" y="390" font-family="Arial" font-size="14" fill="#64748B">Event Flyer</text>
  <text x="430" y="405" font-family="Arial" font-size="12" fill="#94A3B8">Edited 1w ago</text>
  
  
  <rect x="590" y="290" width="160" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="590" y="290" width="160" height="120" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 2" />
  <circle cx="670" cy="340" r="20" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" />
  <text x="670" y="345" font-family="Arial" font-size="24" fill="#94A3B8" text-anchor="middle">+</text>
  <text x="670" y="390" font-family="Arial" font-size="14" fill="#64748B" text-anchor="middle">New Project</text>
  
 
  <rect x="620" y="90" width="130" height="50" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <text x="640" y="110" font-family="Arial" font-size="12" fill="#64748B">Total Projects</text>
  <text x="640" y="130" font-family="Arial" font-size="18" font-weight="bold" fill="#1E293B">24</text>
  
  <circle cx="730" cy="115" r="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <circle cx="730" cy="115" r="6" fill="#EF4444" />
 
  <rect x="100" y="400" width="100" height="40" rx="20" fill="#3B82F6" opacity="0.9" />
  <text x="150" y="425" font-family="Arial" font-size="12" fill="white" text-anchor="middle">AI Design Tools</text>
  
 
  <rect x="530" y="50" width="140" height="50" rx="8" fill="#10B981" opacity="0.9" />
  <text x="600" y="75" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Design Approved!</text>
  <text x="600" y="90" font-family="Arial" font-size="10" fill="#FFFFFF" opacity="0.8" text-anchor="middle">Just now</text>
</svg>
          </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 rotate-3 animate-float">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">Design Approved</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -left-8 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 -rotate-6 animate-float-delay">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Made with AI in seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl relative">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 z-10"
            >
              <X size={20} />
            </button>
            
            <div className="aspect-video w-full bg-black">
              {/* Replace the src with your actual video URL when ready */}
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="animate-pulse mb-4 rounded-full bg-blue-600 w-20 h-20 mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-blue-400 font-medium text-lg">Video placeholder - Add your URL later</p>
                  <p className="text-gray-500 text-sm mt-2">Your demo video will appear here</p>
                </div>
              </div>
              {/* When ready, uncomment this and add your video URL
              <iframe 
                className="w-full h-full" 
                src="YOUR_VIDEO_URL"
                title="Product Demo"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              */}
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Demo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Watch how our AI-powered design platform helps you create professional-grade designs in seconds.
              </p>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;