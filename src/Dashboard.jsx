import React, { useState, useEffect } from "react";
import {
  Search, Bell, Plus, Moon, Sun, LayoutGrid, PenTool, FileImage, Settings,
  Home, LayoutTemplate, FolderOpen, ImagePlus, LogOut, Download, Share2, Trash2, X,
  Upload, Sparkles, Save, Copy, ChevronDown, User, Type, Image, Bot, Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/Authconnect';
import supabase from '../src/lib/supabase';
import ReplicateService from '../services/ReplicateService';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/YOUR_VIDEO_ID");
  const [aiModel, setAiModel] = useState("stability-ai/sdxl");
  const [aiMode, setAiMode] = useState("text-to-image");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [activeStyleDropdown, setActiveStyleDropdown] = useState(false);
  const [aiResolution, setAiResolution] = useState("1024x1024");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("New Project");
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [projectToShare, setProjectToShare] = useState(null);

  const { user: authUser, signOut } = useAuth();

  // Authentication check
  useEffect(() => {
    if (!authUser && !loadingUser) {
      navigate("/auth");
    }
  }, [authUser, loadingUser, navigate]);

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (authUser) {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', authUser.id)
            .single();

          if (!profileError && profileData) {
            setUserProfile(profileData);
          } else {
            // Create user profile if it doesn't exist
            const { data: newProfile } = await supabase
              .from('users')
              .insert([{
                auth_id: authUser.id,
                email: authUser.email,
                username: authUser.email.split('@')[0],
                avatar_url: authUser.user_metadata?.avatar_url || null,
                created_at: new Date().toISOString()
              }])
              .select()
              .single();
            
            setUserProfile(newProfile);
          }

          // Add welcome notification if no notifications exist
          const { data: existingNotifications } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', authUser.id);

          if (!existingNotifications || existingNotifications.length === 0) {
            await supabase.from('notifications').insert([
              {
                user_id: authUser.id,
                message: "Welcome to Genify! Watch our demo video to get started.",
                read: false,
                type: "welcome"
              },
              {
                user_id: authUser.id,
                message: "Tip: Use the AI generator to create designs quickly",
                read: false,
                type: "tip"
              }
            ]);
          }

          // Fetch all data
          const [
            { data: projectsData },
            { data: templatesData },
            { data: assetsData },
            { data: notificationsData },
            { data: aiGenData }
          ] = await Promise.all([
            supabase.from('projects').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }),
            supabase.from('templates').select('*').order('created_at', { ascending: false }),
            supabase.from('assets').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }),
            supabase.from('notifications')
              .select('*')
              .eq('user_id', authUser.id)
              .order('created_at', { ascending: false }),
            supabase.from('ai_generations')
              .select('*')
              .eq('user_id', authUser.id)
              .order('created_at', { ascending: false })
              .limit(5)
          ]);

          setProjects(projectsData || []);
          setTemplates(templatesData || []);
          setAssets(assetsData || []);
          setNotifications(notificationsData || []);
          setUnreadNotifications(notificationsData?.filter(n => !n.read).length || 0);
          setAiResults(aiGenData?.[0]?.results || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, [authUser]);

  // Sample activities - would be replaced with real data from Supabase
  const activities = [
    { id: 1, action: "edited", target: "Coffee Shop Logo", time: "2h ago" },
    { id: 2, action: "created", target: "New AI Design", time: "5h ago" },
    { id: 3, action: "downloaded", target: "Social Media Template", time: "1d ago" },
  ];

  // Toggle dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // AI style options
  const aiStyles = [
    "Photorealistic", "3D Render", "Digital Art", "Fantasy", "Anime", 
    "Watercolor", "Oil Painting", "Sketch", "Comic", "Minimalist",
    "Cyberpunk", "Steampunk", "Pixel Art", "Vaporwave", "Retro"
  ];

  // Handle file upload for image-to-image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle style selection
  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // AI generation function with Replicate
  const generateWithAI = async () => {
    if (!aiPrompt.trim() && aiMode === "text-to-image") return;
    if (!imageFile && aiMode === "image-to-image") return;
    
    setGenerating(true);
    try {
      let results;
      
      // This would be implemented in your ReplicateService
      if (aiMode === "text-to-image") {
        results = await ReplicateService.textToImage(aiPrompt, aiModel, aiResolution, selectedStyles);
      } else if (aiMode === "image-to-image") {
        results = await ReplicateService.imageToImage(imageFile, aiPrompt, aiModel, selectedStyles);
      }
      
      // For demonstration, we're using mock results
      const mockResults = [
        { id: 1, imageUrl: "/api/placeholder/300/300", prompt: aiPrompt, model: aiModel },
        { id: 2, imageUrl: "/api/placeholder/300/300", prompt: aiPrompt, model: aiModel },
        { id: 3, imageUrl: "/api/placeholder/300/300", prompt: aiPrompt, model: aiModel },
        { id: 4, imageUrl: "/api/placeholder/300/300", prompt: aiPrompt, model: aiModel }
      ];
      
      results = mockResults; // Replace with actual API results in production

      // Save to Supabase
      const { data } = await supabase.from('ai_generations').insert([
        {
          user_id: authUser.id,
          prompt: aiPrompt,
          model: aiModel,
          mode: aiMode,
          styles: selectedStyles,
          results: results,
          created_at: new Date().toISOString()
        }
      ]).select();

      setAiResults(results);
      
      // Create notification for successful generation
      await supabase.from('notifications').insert([
        {
          user_id: authUser.id,
          message: `Successfully generated ${results.length} images with AI`,
          read: false,
          type: "success"
        }
      ]);
      
      setUnreadNotifications(prev => prev + 1);
      
      // Close modal on success
      setShowAiModal(false);
      
    } catch (error) {
      console.error("Error generating with AI:", error);
      
      // Create notification for failed generation
      await supabase.from('notifications').insert([
        {
          user_id: authUser.id,
          message: `AI generation failed: ${error.message}`,
          read: false,
          type: "error"
        }
      ]);
      
      setUnreadNotifications(prev => prev + 1);
    } finally {
      setGenerating(false);
    }
  };

  // Mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;

      setUnreadNotifications(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Create new project
  const createNewProject = async () => {
    if (creatingProject) return;
    setCreatingProject(true);
    
    try {
      const projectName = newProjectName.trim() || "New Project";
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: authUser.id,
            title: projectName,
            type: 'Design',
            description: `Created on ${new Date().toLocaleDateString()}`,
            color: `bg-${['blue', 'green', 'purple', 'yellow', 'red', 'pink'][Math.floor(Math.random() * 6)]}-500`,
            edited_time: 'Just now',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      setProjects([data[0], ...projects]);
      
      // Add notification
      await supabase.from('notifications').insert([
        {
          user_id: authUser.id,
          message: `Project "${projectName}" created successfully`,
          read: false,
          type: "success"
        }
      ]);
      
      setUnreadNotifications(prev => prev + 1);
      setNewProjectName("New Project");
      setCreatingProject(false);
    } catch (error) {
      console.error("Error creating new project:", error);
      setCreatingProject(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== projectId));
      setShowDeleteConfirm(null);
      
      // Add notification
      await supabase.from('notifications').insert([
        {
          user_id: authUser.id,
          message: "Project deleted successfully",
          read: false,
          type: "success"
        }
      ]);
      
      setUnreadNotifications(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Save AI result as asset
  const saveAsAsset = async (result) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert([
          {
            user_id: authUser.id,
            name: `AI Generated - ${new Date().toLocaleDateString()}`,
            type: 'Image',
            url: result.imageUrl,
            prompt: result.prompt,
            source: 'ai',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      setAssets([data[0], ...assets]);
      
      // Add notification
      await supabase.from('notifications').insert([
        {
          user_id: authUser.id,
          message: "AI result saved to assets",
          read: false,
          type: "success"
        }
      ]);
      
      setUnreadNotifications(prev => prev + 1);
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  // Generate share link
  const generateShareLink = async (project) => {
    try {
      // Generate a unique slug for sharing
      const slug = `${project.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;
      
      // Update project with share slug
      const { error } = await supabase
        .from('projects')
        .update({ share_slug: slug, shared: true })
        .eq('id', project.id);

      if (error) throw error;
      
      // Create the share link
      const shareUrl = `${window.location.origin}/shared/${slug}`;
      setShareLink(shareUrl);
      setProjectToShare({...project, share_slug: slug});
      setShowShareModal(true);
    } catch (error) {
      console.error("Error generating share link:", error);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    
    // Show notification
    const notify = async () => {
      await supabase.from('notifications').insert([
        {
          user_id: authUser.id,
          message: "Share link copied to clipboard",
          read: false,
          type: "success"
        }
      ]);
      
      setUnreadNotifications(prev => prev + 1);
    };
    
    notify();
  };

  // Search functionality
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.prompt && asset.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Nav items with icons
  const navItems = [
    { name: "Dashboard", id: "dashboard", icon: <Home size={20} /> },
    { name: "AI Generator", id: "ai-generator", icon: <Sparkles size={20} /> },
    { name: "Templates", id: "templates", icon: <LayoutTemplate size={20} /> },
    { name: "Projects", id: "projects", icon: <FolderOpen size={20} /> },
    { name: "Assets", id: "assets", icon: <FileImage size={20} /> },
    { name: "Settings", id: "settings", icon: <Settings size={20} /> }
  ];

  // Video Modal Component
  const VideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Genify Demo Video</h3>
          <button
            onClick={() => setShowVideoModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              width="100%"
              height="450"
              src={videoUrl}
              title="Genify Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-md"
            ></iframe>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => setShowVideoModal(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // AI Generation Modal
  const AIGenerationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">AI Image Generator</h3>
          <button
            onClick={() => setShowAiModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          {/* Mode selector */}
          <div className="flex gap-4 mb-6">
            <button
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                aiMode === "text-to-image" 
                  ? "bg-blue-100 text-blue-600 border-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700" 
                  : "bg-gray-100 text-gray-700 border-2 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              }`}
              onClick={() => setAiMode("text-to-image")}
            >
              <Type size={20} />
              <span>Text to Image</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                aiMode === "image-to-image" 
                  ? "bg-blue-100 text-blue-600 border-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700" 
                  : "bg-gray-100 text-gray-700 border-2 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              }`}
              onClick={() => setAiMode("image-to-image")}
            >
              <Image size={20} />
              <span>Image to Image</span>
            </button>
          </div>
          
          {/* Image upload for image-to-image mode */}
          {aiMode === "image-to-image" && (
            <div className="mb-6">
              <label className="block mb-2 font-medium">Source Image</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="relative w-full flex justify-center">
                    <img src={imagePreview} alt="Preview" className="max-h-64 max-w-full object-contain rounded" />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Prompt input */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">
              {aiMode === "text-to-image" ? "Describe the image you want to generate" : "Additional instructions (optional)"}
            </label>
            <textarea
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={aiMode === "text-to-image" 
                ? "A futuristic city skyline with flying cars and neon lights, cyberpunk style" 
                : "Enhance lighting, make it look more professional"}
              rows="4"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            ></textarea>
          </div>
          
          {/* AI Model selection */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Select AI Model</label>
            <div className="relative">
              <select
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
              >
                <option value="stability-ai/sdxl">Stable Diffusion XL</option>
                <option value="stability-ai/stable-diffusion">Stable Diffusion 2.1</option>
                <option value="meta/llama-3">Llama 3 (Experimental)</option>
                <option value="midjourney/midjourney-v5">Midjourney Style</option>
              </select>
              <ChevronDown size={20} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Resolution selection - text-to-image only */}
          {aiMode === "text-to-image" && (
            <div className="mb-6">
              <label className="block mb-2 font-medium">Image Resolution</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`py-2 px-3 rounded border ${
                    aiResolution === "1024x1024" 
                      ? "bg-blue-100 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400" 
                      : "bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setAiResolution("1024x1024")}
                >
                  Square (1:1)
                </button>
                <button
                  className={`py-2 px-3 rounded border ${
                    aiResolution === "1024x768" 
                      ? "bg-blue-100 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400" 
                      : "bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setAiResolution("1024x768")}
                >
                  Landscape (4:3)
                </button>
                <button
                  className={`py-2 px-3 rounded border ${
                    aiResolution === "768x1024" 
                      ? "bg-blue-100 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400" 
                      : "bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setAiResolution("768x1024")}
                >
                  Portrait (3:4)
                </button>
              </div>
            </div>
          )}
          
          {/* Style selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Art Styles (Optional)</label>
              <button
                className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setActiveStyleDropdown(!activeStyleDropdown)}
              >
                {activeStyleDropdown ? "Collapse" : "View All Styles"}
              </button>
            </div>
            {activeStyleDropdown && (
              <div className="flex flex-wrap gap-2 mt-2">
                {aiStyles.map((style) => (
                  <button
                    key={style}
                    className={`py-1 px-3 rounded-full text-sm ${
                      selectedStyles.includes(style)
                        ? "bg-blue-100 text-blue-600 border border-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                        : "bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    }`}
                    onClick={() => toggleStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
            {!activeStyleDropdown && selectedStyles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedStyles.map((style) => (
                  <div 
                    key={style}
                    className="bg-blue-100 text-blue-600 border border-blue-500 py-1 px-3 rounded-full text-sm flex items-center dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                  >
                    {style}
                    <button 
                      className="ml-1.5" 
                      onClick={() => toggleStyle(style)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={() => setShowAiModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={generateWithAI}
            disabled={generating || (aiMode === "text-to-image" && !aiPrompt.trim()) || (aiMode === "image-to-image" && !imageFile)}
            className={`px-6 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 ${
              generating || (aiMode === "text-to-image" && !aiPrompt.trim()) || (aiMode === "image-to-image" && !imageFile)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {generating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Share Modal Component
  const ShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Share Project</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Share this link with anyone you want to give access to "{projectToShare?.title}":
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
            <button
              onClick={copyShareLink}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Anyone with the link can view this project</span>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => setShowShareModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // New Project Modal
  const NewProjectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Create New Project</h3>
          <button
            onClick={() => setCreatingProject(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Project Name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Awesome Project"
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={() => setCreatingProject(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={createNewProject}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );

  // Notification dropdown component
  const NotificationDropdown = () => {
    const [open, setOpen] = useState(false);

    const handleNotificationClick = (notification) => {
      if (notification.type === "welcome") {
        setShowVideoModal(true);
      }
      markNotificationsAsRead();
    };

    return (
      <div className="relative">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            setOpen(!open);
            if (!open && unreadNotifications > 0) markNotificationsAsRead();
          }}
        >
          <Bell size={20} />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-200 dark:border-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
              <button className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // AI Results Component
  const AIResultsDisplay = ({ results }) => (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Recent AI Generations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.length > 0 ? (
          results.map(result => (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <img 
                src={result.imageUrl} 
                alt={`AI generation: ${result.prompt}`} 
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{result.prompt}</p>
                <div className="flex justify-between">
                  <button 
                    onClick={() => saveAsAsset(result)}
                    className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 flex items-center gap-1">
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <Sparkles size={24} className="mx-auto mb-2" />
            <p>No AI generations yet. Try creating some!</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    if (loadingUser) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                  <p className="text-lg font-bold">{projects.length}</p>
                </div>
                <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Assets</p>
                  <p className="text-lg font-bold">{assets.length}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button 
                onClick={() => setShowAiModal(true)}
                className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-lg">
                  <Bot size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">AI Generator</h3>
                  <p className="text-sm opacity-80">Create images with AI</p>
                </div>
              </button>
              
              <button 
                onClick={() => setCreatingProject(true)}
                className="flex items-center p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all"
              >
                <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-lg">
                  <Plus size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">New Project</h3>
                  <p className="text-sm opacity-80">Create a design project</p>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveTab("templates")}
                className="flex items-center p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-lg">
                  <LayoutTemplate size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Templates</h3>
                  <p className="text-sm opacity-80">Start from a template</p>
                </div>
              </button>
            </div>
            
            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Projects</h2>
                <button 
                  onClick={() => setActiveTab("projects")}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  View All
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.slice(0, 3).map(project => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className={`h-28 ${project.color || 'bg-blue-500'} flex items-center justify-center`}>
                      <span className="text-white text-xl font-medium">{project.type}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Edited {project.edited_time}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                          <PenTool size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                          onClick={() => generateShareLink(project)}
                        >
                          <Share2 size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                          <Download size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400 ml-auto"
                          onClick={() => setShowDeleteConfirm(project.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        {/* Delete confirmation */}
                        {showDeleteConfirm === project.id && (
                          <div className="absolute right-0 mt-8 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <p className="text-sm mb-2">Delete this project?</p>
                            <div className="flex gap-2">
                              <button 
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => deleteProject(project.id)}
                              >
                                Yes
                              </button>
                              <button 
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 border-dashed hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => setCreatingProject(true)}
                >
                  <div className="h-full flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Plus size={24} className="text-gray-500" />
                    </div>
                    <p className="font-medium">New Project</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Results */}
            <AIResultsDisplay results={aiResults} />
            
            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {activities.length > 0 ? (
                  activities.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center px-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                    >
                      <span className="mr-3 text-blue-500">
                        {activity.action === "edited" && <PenTool size={16} />}
                        {activity.action === "created" && <Plus size={16} />}
                        {activity.action === "downloaded" && <Download size={16} />}
                      </span>
                      <div>
                        <span className="font-medium">
                          {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                        </span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">{activity.target}</span>
                        <span className="ml-2 text-xs text-gray-400">{activity.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No recent activity.
                  </div>
                )}
              </div>
            </div>
          </>
        );
      
      case "ai-generator":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">AI Image Generator</h1>
              <button
                onClick={() => setShowAiModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Sparkles size={18} />
                <span>New Generation</span>
              </button>
            </div>
            
            {/* Previous generations */}
            <AIResultsDisplay results={aiResults} />
            
            {/* Tips section */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-3">Tips for better AI results</h3>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Be specific in your prompts with details about style, lighting, and composition</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Try combining different art styles for unique results</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Use image-to-image to refine and enhance existing images</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Experiment with different models for varied artistic results</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      case "templates":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-6">Templates</h1>
            
            {/* Template categories */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {["All", "Social Media", "Presentations", "Marketing", "Print", "Web Design"].map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    category === "All" 
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => (
                  <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FileImage size={32} className="text-gray-400" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{template.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded dark:bg-gray-700 dark:text-gray-300">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{template.description}</p>
                      <button className="w-full py-2 text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Use Template
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <FileImage size={32} className="mx-auto mb-2" />
                  <p>No templates found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case "projects":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Projects</h1>
              <button
                onClick={() => setCreatingProject(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={18} />
                <span>New Project</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className={`h-28 ${project.color || 'bg-blue-500'} flex items-center justify-center`}>
                      <span className="text-white text-xl font-medium">{project.type}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Edited {project.edited_time}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                          <PenTool size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                          onClick={() => generateShareLink(project)}
                        >
                          <Share2 size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                          <Download size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400 ml-auto"
                          onClick={() => setShowDeleteConfirm(project.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        {/* Delete confirmation */}
                        {showDeleteConfirm === project.id && (
                          <div className="absolute right-0 mt-8 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <p className="text-sm mb-2">Delete this project?</p>
                            <div className="flex gap-2">
                              <button 
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => deleteProject(project.id)}
                              >
                                Yes
                              </button>
                              <button 
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <FolderOpen size={32} className="mx-auto mb-2" />
                  <p>No projects found. Create a new project to get started!</p>
                </div>
              )}
            </div>
          </div>
        );
      
        case "assets":
          return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Asset Library</h1>
                <button
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  <span>Generate with AI</span>
                </button>
              </div>
  
              {/* Asset filters */}
              <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {["All", "Images", "Videos", "AI Generated", "Uploads"].map(type => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      type === "All" 
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
  
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map(asset => (
                    <div key={asset.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="relative group">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {asset.type === 'Image' ? (
                            <img 
                              src={asset.url} 
                              alt={asset.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileImage size={32} className="text-gray-400" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100">
                              <Download size={16} />
                            </button>
                            <button className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100">
                              <Share2 size={16} />
                            </button>
                            <button 
                              className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                              onClick={() => setShowDeleteConfirm(`asset-${asset.id}`)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium truncate">{asset.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{asset.type}</p>
                        {asset.prompt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" title={asset.prompt}>
                            {asset.prompt}
                          </p>
                        )}
                      </div>
  
                      {/* Delete confirmation */}
                      {showDeleteConfirm === `asset-${asset.id}` && (
                        <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <p className="text-sm mb-2">Delete this asset?</p>
                          <div className="flex gap-2">
                            <button 
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('assets')
                                    .delete()
                                    .eq('id', asset.id);
  
                                  if (error) throw error;
  
                                  setAssets(assets.filter(a => a.id !== asset.id));
                                  setShowDeleteConfirm(null);
                                  
                                  // Add notification
                                  await supabase.from('notifications').insert([
                                    {
                                      user_id: authUser.id,
                                      message: "Asset deleted successfully",
                                      read: false,
                                      type: "success"
                                    }
                                  ]);
                                  
                                  setUnreadNotifications(prev => prev + 1);
                                } catch (error) {
                                  console.error("Error deleting asset:", error);
                                }
                              }}
                            >
                              Yes
                            </button>
                            <button 
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <FileImage size={32} className="mx-auto mb-2" />
                    <p>No assets found. Upload or generate some assets to get started!</p>
                    <button
                      onClick={() => setShowAiModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 mx-auto"
                    >
                      <Sparkles size={18} />
                      <span>Generate with AI</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
  
        case "settings":
          return (
            <div>
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Profile Settings */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium mb-4">Profile</h2>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          {userProfile?.avatar_url ? (
                            <img 
                              src={userProfile.avatar_url} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-medium text-gray-500">
                              {userProfile?.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600">
                          <PenTool size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Username</label>
                          <input
                            type="text"
                            defaultValue={userProfile?.username || ''}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue={userProfile?.email || ''}
                            disabled
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          />
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Account Preferences */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium mb-4">Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
                      >
                        {darkMode ? (
                          <Moon size={20} className="text-yellow-400" />
                        ) : (
                          <Sun size={20} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Danger Zone */}
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-4 text-red-500">Danger Zone</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete Account
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Log Out</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
                      </div>
                      <button 
                        onClick={signOut}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
  
        default:
          return <div>Page not found</div>;
      }
    };
  
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-blue-500 dark:text-blue-400">Genify</h1>
            </div>
            <div className="flex flex-col flex-grow p-4 overflow-auto">
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-500">
                      {userProfile?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{userProfile?.username || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile?.email || ''}</p>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
  
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top navigation */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                  <button className="md:hidden p-2 mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <LayoutGrid size={20} />
                  </button>
                  <div className="relative max-w-md w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? (
                      <Sun size={20} className="text-yellow-400" />
                    ) : (
                      <Moon size={20} className="text-gray-600" />
                    )}
                  </button>
                  <NotificationDropdown />
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    <Sparkles size={18} className="mr-2" />
                    <span>Generate with AI</span>
                  </button>
                </div>
              </div>
            </header>
  
            {/* Mobile bottom navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-around">
                {navItems.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center p-3 w-full ${
                      activeTab === item.id
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs mt-1">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
  
            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
              {renderContent()}
            </main>
          </div>
        </div>
  
        {/* Modals */}
        {showVideoModal && <VideoModal />}
        {showAiModal && <AIGenerationModal />}
        {showShareModal && <ShareModal />}
        {creatingProject && <NewProjectModal />}
      </div>
    );
  }