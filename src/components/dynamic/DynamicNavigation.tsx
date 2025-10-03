"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Phone } from "lucide-react";

interface NavigationData {
  logo?: string;
  navItems?: Array<{
    name: string;
    to: string;
  }>;
  showCallButton?: boolean;
  callButtonText?: string;
  backgroundColor?: string;
  textColor?: string;
  stickyBehavior?: 'none' | 'sticky' | 'reveal'; // none = not fixed, sticky = always visible, reveal = show on scroll up
}

interface DynamicNavigationProps {
  data: NavigationData;
  businessInfo?: any;
}

export default function DynamicNavigation({ data, businessInfo }: DynamicNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const defaultNavItems = [
    { name: "Menu", to: "menu" },
    { name: "Hours & Location", to: "location" },
    { name: "Reserve", to: "location" },
  ];

  const navItems = data.navItems || defaultNavItems;
  const logo = data.logo || "./logo.svg";
  const showCallButton = data.showCallButton !== false;
  const callButtonText = data.callButtonText || "Call Now";
  const backgroundColor = data.backgroundColor || "#FBF8EB";
  const textColor = data.textColor || "#144663";
  const stickyBehavior = data.stickyBehavior || 'none';

  // Handle reveal on scroll behavior
  useEffect(() => {
    if (stickyBehavior !== 'reveal') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or near top
        setIsVisible(true);
      } else {
        // Scrolling down
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, stickyBehavior]);

  // Determine header classes based on sticky behavior
  const getHeaderClasses = () => {
    switch (stickyBehavior) {
      case 'sticky':
        return 'sticky top-0 z-50';
      case 'reveal':
        return `fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`;
      case 'none':
      default:
        return 'sm:mb-8';
    }
  };

  return (
    <>
      {/* Spacer for fixed/reveal modes */}
      {(stickyBehavior === 'reveal') && (
        <div style={{ height: '80px' }} />
      )}

      <header
        className={`${getHeaderClasses()} flex items-center justify-between px-4 py-2 sm:px-0 sm:pb-4 sm:border-b`}
        style={{
          backgroundColor,
          borderColor: "rgba(20, 70, 99, 0.2)"
        }}
      >
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="49Maine"
          className="h-12 w-12 sm:h-24 sm:w-24"
        />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-8">
        {navItems.map((item) => (
          <ScrollLink
            key={item.name}
            to={item.to}
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="cursor-pointer hover:opacity-100 transition-opacity font-headline text-lg"
            style={{ color: textColor, opacity: 0.8 }}
          >
            {item.name}
          </ScrollLink>
        ))}
      </nav>

      {/* Desktop Call Button */}
      {showCallButton && (
        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-md"
          style={{ backgroundColor: textColor, color: backgroundColor }}
          onClick={() => (window.location.href = `tel:${businessInfo?.phone || "2075550149"}`)}
        >
          <Phone className="w-4 h-4" />
          {callButtonText}
        </button>
      )}

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden p-2 -mr-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ color: textColor }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-0 z-40 sm:hidden"
          style={{
            backgroundColor,
            top: "64px"
          }}
        >
          <div className="flex flex-col h-full px-6 py-8">
            <nav className="flex-1 flex flex-col gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ScrollLink
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className="text-3xl font-headline cursor-pointer block"
                    style={{ color: textColor }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </ScrollLink>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="border-t pt-6" style={{ borderColor: "rgba(20, 70, 99, 0.2)" }}>
              {showCallButton && (
                <button
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all"
                  style={{ backgroundColor: textColor, color: backgroundColor }}
                  onClick={() => (window.location.href = `tel:${businessInfo?.phone || "2075550149"}`)}
                >
                  <Phone className="w-5 h-5" />
                  Reserve a Table
                </button>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm font-headline" style={{ color: textColor, opacity: 0.7 }}>
                  Open Now • Closes at 10PM
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
    </>
  );
}