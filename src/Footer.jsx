import React from "react";
import { ArrowUpRight, Facebook, Instagram, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Templates", href: "/templates" },
        { name: "Pricing", href: "/pricing" },
        { name: "AI Tools", href: "/docs" },
        { name: "Integrations", href: "/docs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },// social media links
        { name: "Tutorials", href: "/tutorials" },// youtube tutorials
        { name: "Documentation", href: "/docs" },
        { name: "Support", href: "/Contact" },
        { name: "API", href: "/docs" },// under development
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Contact", href: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://facebook.com" },
    { icon: <Twitter size={20} />, href: "https://twitter.com" },
    { icon: <Instagram size={20} />, href: "https://instagram.com" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com" },
    { icon: <Github size={20} />, href: "https://github.com" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand and newsletter */}
          <div className="space-y-8">
            {/* Logo */}
            <div>
              <Link to="/" className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white"/>
                    <path d="M12 8L16 10V14L12 16L8 14V10L12 8Z" fill="#3B82F6"/>
                  </svg>
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">BrandLaunch@Genify</span>
              </Link>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                Transform your ideas into stunning visuals with our AI-powered design platform.
              </p>
            </div>

            {/* Newsletter signup */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Get the latest design tips and inspiration delivered to your inbox.
              </p>
              <form className="mt-4 flex gap-2">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-1 rounded-lg border-0 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Follow us
              </h3>
              <div className="mt-4 flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {social.icon}
                    <span className="sr-only">{social.href.split(".com")[0].split("//")[1]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:underline flex items-center"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} BrandLaunch@Genify. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Privacy
            </Link>
            <Link to="/cookies" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Cookies
            </Link>
            <Link to="/sitemap" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
        
        {/* Floating CTA is now imported as a separate component */}
      </div>
    </footer>
  );
};

export default Footer;