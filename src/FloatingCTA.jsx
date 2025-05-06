import React, { useState, useEffect } from "react";
import { X, ChevronRight, Video, MessageSquare, Send, Minimize2 } from "lucide-react";

const FloatingCTA = ({ onShowVideoDemo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("initial"); // initial, chat, video-promo
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  
  // Check if user has visited before (using localStorage)
  useEffect(() => {
    const visited = localStorage.getItem("hasVisitedBefore");
    if (visited) {
      setHasVisitedBefore(true);
    } else {
      // After 3 seconds, show the CTA for new visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
        setView("video-promo");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Save visit to localStorage
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem("hasVisitedBefore", "true");
      setHasVisitedBefore(true);
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: "user", text: message }];
    setMessages(newMessages);
    setMessage("");
    
    // Simulate auto-response after a short delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          sender: "bot", 
          text: "Thanks for reaching out! Our team will get back to you shortly. In the meantime, would you like to watch our product demo video?",
          action: {
            label: "Watch Demo",
            handler: () => {
              setIsOpen(false);
              onShowVideoDemo();
            }
          }
        }
      ]);
    }, 1000);
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setView("initial");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Main Chat Window */}
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-medium text-lg">
              {view === "initial" && "How can we help?"}
              {view === "chat" && "Support Chat"}
              {view === "video-promo" && "See it in action!"}
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
              >
                <Minimize2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="h-80">
            {view === "initial" && (
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Welcome to BrandLaunch! We're here to help you get started.
                  </p>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => setView("video-promo")}
                      className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Video size={20} />
                        <span>Watch product demo</span>
                      </div>
                      <ChevronRight size={18} />
                    </button>
                    
                    <button 
                      onClick={() => setView("chat")}
                      className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={20} />
                        <span>Chat with support</span>
                      </div>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Typical response time: Under 5 minutes
                </p>
              </div>
            )}
            
            {view === "chat" && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center">
                      <MessageSquare className="mx-auto mb-2 text-gray-400" size={24} />
                      <p>Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs rounded-lg px-4 py-2 ${
                            msg.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <p>{msg.text}</p>
                          {msg.action && (
                            <button 
                              onClick={msg.action.handler}
                              className="mt-2 text-sm bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              {msg.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors"
                    disabled={!message.trim()}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
            
            {view === "video-promo" && (
              <div className="p-4 h-full flex flex-col">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse mb-3 rounded-full bg-blue-600 w-16 h-16 mx-auto flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setIsOpen(false);
                        onShowVideoDemo();
                      }}
                    >
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Watch our product demo</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  See how our AI-powered platform can transform your design workflow in just 2 minutes!
                </p>
                
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      onShowVideoDemo();
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Watch Full Demo
                  </button>
                  
                  <button 
                    onClick={() => setView("chat")}
                    className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    I have questions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Toggle Button */}
      <button 
        onClick={toggleChat}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all group"
      >
        {!isOpen && (
          <>
            <span className="flex items-center justify-center w-8 h-8">
              {view === "video-promo" || (!hasVisitedBefore && !isOpen) ? (
                <Video size={24} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
                </svg>
              )}
            </span>
            <span className="absolute right-full mr-2 bg-blue-700 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap">
              {view === "video-promo" || (!hasVisitedBefore && !isOpen) ? "Watch Demo" : "Need help?"}
            </span>
          </>
        )}
        {isOpen && <X size={24} />}
      </button>
    </div>
  );
};

export default FloatingCTA;