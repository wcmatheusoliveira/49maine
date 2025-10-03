"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Phone } from "lucide-react";
import { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  priceOptions: string | null;
  isPopular: boolean;
  isAvailable: boolean;
  order: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  order: number;
  items: MenuItem[];
}

interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: string;
  socialMedia: string | null;
  mapEmbed: string | null;
}

interface HomePageProps {
  menuCategories: MenuCategory[];
  businessInfo: BusinessInfo | null;
}

export default function HomePage({ menuCategories, businessInfo }: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Menu", to: "menu" },
    { name: "Hours & Location", to: "location" },
    { name: "Reserve", to: "reserve" },
  ];

  const hours = businessInfo ? JSON.parse(businessInfo.hours || "{}") : {};
  const socialMedia = businessInfo ? JSON.parse(businessInfo.socialMedia || "{}") : {};

  return (
    <div style={{ backgroundColor: "#FBF8EB", minHeight: "100vh" }}>
      {/* Header and Main Content Container */}
      <div className="px-2 lg:px-12 py-8">
        <div className="mx-auto">
          {/* Simple Header */}
          <header
            className="sticky top-0 z-50 bg-[#FBF8EB] flex items-center justify-between px-4 py-2 sm:static sm:px-0 sm:mb-8 sm:pb-4 sm:border-b"
            style={{ borderColor: "rgba(20, 70, 99, 0.2)" }}
          >
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="./logo.svg"
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
                  style={{ color: "#144663", opacity: 0.8 }}
                >
                  {item.name}
                </ScrollLink>
              ))}
            </nav>

            {/* Desktop Call Button */}
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-md"
              style={{ backgroundColor: "#144663", color: "white" }}
              onClick={() => (window.location.href = `tel:${businessInfo?.phone || "2075550149"}`)}
            >
              <Phone className="w-4 h-4" />
              Call Now
            </button>

            {/* Mobile Menu Button - Simplified */}
            <button
              className="sm:hidden p-2 -mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: "#144663" }}
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
          </header>

          {/* Mobile Menu - Full Screen Overlay */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[#FBF8EB] sm:hidden"
              style={{ top: "64px" }}
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
                        style={{ color: "#144663" }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </ScrollLink>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Menu Footer */}
                <div className="border-t pt-6" style={{ borderColor: "rgba(20, 70, 99, 0.2)" }}>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all"
                    style={{ backgroundColor: "#144663", color: "white" }}
                    onClick={() => (window.location.href = `tel:${businessInfo?.phone || "2075550149"}`)}
                  >
                    <Phone className="w-5 h-5" />
                    Reserve a Table
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-sm font-headline" style={{ color: "#144663", opacity: 0.7 }}>
                      Open Now • Closes at 10PM
                    </p>
                    {socialMedia.instagram && socialMedia.facebook && (
                      <div className="flex justify-center gap-4 mt-4">
                        <a href={socialMedia.instagram} className="text-sm font-headline" style={{ color: "#144663", opacity: 0.7 }}>
                          Instagram
                        </a>
                        <span style={{ color: "#144663", opacity: 0.3 }}>•</span>
                        <a href={socialMedia.facebook} className="text-sm font-headline" style={{ color: "#144663", opacity: 0.7 }}>
                          Facebook
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div>
            {/* Hero Section - Fixed/Sticky */}
            <div className="sticky top-2 sm:top-5 z-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl sm:rounded-[32px] overflow-hidden relative"
                style={{ backgroundColor: "#144663", minHeight: "300px" }}
              >
                {/* Video Background */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.4)" }}
                >
                  <source src="./49maine-hero.mp4" type="video/mp4" />
                </video>

                {/* Gradient Overlay for Better Text Readability */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(20, 70, 99, 0.3) 0%, rgba(20, 70, 99, 0.5) 50%, rgba(20, 70, 99, 0.7) 100%)",
                  }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-center h-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] p-6 sm:p-12">
                  <div className="text-center text-white max-w-4xl mx-auto z-10">
                    {/* Special Announcement */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mb-6"
                    >
                      <span className="hidden sm:inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-xs sm:text-base font-medium">
                        Tonight's Special: Half-Price Wings After 8PM
                      </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold mb-4"
                    >
                      Come hungry,{" "}
                      <span
                        className="md:text-8xl text-7xl"
                        style={{
                          color: "#FFF",
                          fontFamily: '"adventures-unlimited", serif',
                        }}
                      >
                        leave happy
                      </span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90"
                    >
                      Wood-fired goodness in the heart of Lincoln, Maine
                    </motion.p>

                    {/* Value Props */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="flex flex-wrap justify-center gap-3 mb-8"
                    >
                      <span className="px-3 hidden sm:inline py-1 bg-white/10 backdrop-blur rounded-lg text-sm">
                        Serving Lincoln Since 2020
                      </span>
                      <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-lg text-sm">
                        4.8 Stars on Google
                      </span>
                      <span className="px-3 py-1 hidden sm:inline bg-white/10 backdrop-blur rounded-lg text-sm">
                        Kids Eat Free Tuesdays
                      </span>
                      <span className="px-3 py-1 hidden sm:inline bg-white/10 backdrop-blur rounded-lg text-sm">
                        Happy Hour 5-6PM Daily
                      </span>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                    >
                      <button
                        onClick={() =>
                          document
                            .getElementById("menu")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-8 py-3 bg-white text-[#144663] rounded-full font-bold text-lg hover:shadow-xl transition-all"
                      >
                        See Menu & Order
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `tel:${businessInfo?.phone || "2075550149"}`)
                        }
                        className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-[#144663] transition-all"
                      >
                        Book a Table
                      </button>
                    </motion.div>

                    {/* Quick Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm sm:text-base"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span>Open Now • Closes at 10PM</span>
                      </div>
                      <div className="hidden sm:block">|</div>
                      <div className="font-medium">
                        Locally Owned & Operated
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Featured Menu Section - Scrolls over hero */}
            <div
              id="menu"
              className="relative z-10 bg-white md:rounded-t-[40px] px-4 rounded-t-2xl sm:px-6 py-16 sm:py-20 lg:px-12 -mt-10 sm:-mt-20"
            >
              {/* Full Menu Section */}
              <div className="my-20">
                <div className="text-center mb-12">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="md:text-8xl text-6xl font-bold mb-3"
                    style={{
                      color: "#144663",
                      fontFamily: '"adventures-unlimited", serif',
                    }}
                  >
                    The Good Stuff
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="md:text-lg text-base font-headline"
                    style={{ color: "#144663", opacity: 0.7 }}
                  >
                    Wood-fired, fresh-made, and always worth it
                  </motion.p>
                </div>

                {/* Category Navigation */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {menuCategories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        const element = document.getElementById(
                          `category-${category.id}`
                        );
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-5 py-2 rounded-full font-headline text-base tracking-wide hover:scale-105 transition-all border-2"
                      style={{
                        backgroundColor: "transparent",
                        color: "#144663",
                        borderColor: "#144663",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#144663";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#144663";
                      }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>

                {/* Menu Categories */}
                <div className="space-y-16">
                  {menuCategories.map((category, categoryIndex) => (
                    <motion.div
                      key={category.id}
                      id={`category-${category.id}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Category Header */}
                      <div className="mb-8">
                        <h3
                          className="md:text-7xl text-6xl font-bold mb-2"
                          style={{
                            color: "#144663",
                            fontFamily: '"adventures-unlimited", serif',
                          }}
                        >
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-lg font-headline" style={{ color: "#144663", opacity: 0.7 }}>
                            {category.description}
                          </p>
                        )}
                        <div
                          className="h-1 w-20 rounded-full mt-2"
                          style={{ backgroundColor: "#fbbf24" }}
                        />
                      </div>

                      {/* Menu Items Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {category.items.map((item, itemIndex) => {
                          const priceOptions = item.priceOptions ? JSON.parse(item.priceOptions) : null;

                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-30px" }}
                              transition={{
                                delay: itemIndex * 0.05,
                                type: "spring",
                                stiffness: 100,
                              }}
                              className="group"
                            >
                              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#144663]/10 relative overflow-hidden">
                                {/* Item Content */}
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <h4
                                      className="text-2xl font-bold mb-2 group-hover:scale-[1.02] transition-transform origin-left"
                                      style={{ color: "#144663" }}
                                    >
                                      {item.name}
                                    </h4>
                                    {item.description && (
                                      <p
                                        className="text-base font-headline leading-relaxed"
                                        style={{
                                          color: "#144663",
                                          opacity: 0.7,
                                        }}
                                      >
                                        {item.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Price */}
                                  <div className="text-right flex-shrink-0">
                                    {item.isPopular && (
                                      <p
                                        className="text-xs font-semibold mb-1"
                                        style={{ color: "#ff8c73" }}
                                      >
                                        Guest favorite
                                      </p>
                                    )}
                                    {item.price && (
                                      <p
                                        className="font-bebas text-2xl tracking-wide"
                                        style={{ color: "#144663" }}
                                      >
                                        {item.price}
                                      </p>
                                    )}
                                    {priceOptions && (
                                      <div className="text-right">
                                        {Object.entries(priceOptions).map(([key, value]) => (
                                          <p
                                            key={key}
                                            className="whitespace-nowrap"
                                            style={{ color: "#144663" }}
                                          >
                                            <span className="font-headline text-sm" style={{ opacity: 0.7 }}>
                                              {key}
                                            </span>
                                            {" "}
                                            <span className="font-bebas text-xl tracking-wide">
                                              {value as string}
                                            </span>
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Hover Effect Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#144663]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Location & Hours Section */}
              {businessInfo && (
                <div id="location" className="mt-20">
                  {/* Section Header */}
                  <div className="text-center mb-12">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-6xl md:text-8xl font-bold mb-3"
                      style={{
                        color: "#144663",
                        fontFamily: '"adventures-unlimited", serif',
                      }}
                    >
                      Come Find Us
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-lg font-headline"
                      style={{ color: "#144663", opacity: 0.7 }}
                    >
                      Worth the trip, easy to find
                    </motion.p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Google Maps with Overlay Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="rounded-3xl overflow-hidden shadow-lg relative"
                      style={{ minHeight: "500px" }}
                    >
                      {businessInfo.mapEmbed ? (
                        <div dangerouslySetInnerHTML={{ __html: businessInfo.mapEmbed }} className="w-full h-full" />
                      ) : (
                        <iframe
                          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2851.6847391089!2d-68.61259!3d45.36215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(businessInfo.address + ' ' + businessInfo.city + ' ' + businessInfo.state + ' ' + businessInfo.zip)}!5e0!3m2!1sen!2sus!4v1234567890`}
                          width="100%"
                          height="100%"
                          style={{ border: 0, minHeight: "500px" }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      )}

                      {/* Address Overlay Card */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="backdrop-blur bg-white/80 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <p
                              className="font-headline font-bold text-base"
                              style={{ color: "#144663" }}
                            >
                              {businessInfo.address}
                            </p>
                            <p
                              className="font-headline text-base"
                              style={{ color: "#144663" }}
                            >
                              {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              window.open(
                                `https://maps.google.com/?q=${encodeURIComponent(businessInfo.address + ' ' + businessInfo.city + ' ' + businessInfo.state + ' ' + businessInfo.zip)}`,
                                "_blank"
                              )
                            }
                            className="px-5 py-2.5 rounded-full font-bebas text-base tracking-wide hover:scale-105 transition-all whitespace-nowrap w-full sm:w-auto"
                            style={{
                              backgroundColor: "#144663",
                              color: "white",
                            }}
                          >
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Hours & Contact */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex flex-col justify-center"
                    >
                      <div className="space-y-8">
                        {/* Hours Section */}
                        <div>
                          <h3
                            className="text-7xl font-bold mb-2"
                            style={{
                              color: "#144663",
                              fontFamily: '"adventures-unlimited", serif',
                            }}
                          >
                            Hours
                          </h3>
                          <div className="space-y-2 font-headline text-lg">
                            {Object.entries(hours).map(([day, time]) => (
                              <div
                                key={day}
                                className="flex justify-between"
                                style={{ color: "#144663" }}
                              >
                                <span>{day}</span>
                                <span className="font-headline">
                                  {time as string}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-[1px] bg-[#144663]/20"></div>

                        {/* Contact Section */}
                        <div>
                          <h3
                            className="text-7xl font-bold mb-6"
                            style={{
                              color: "#144663",
                              fontFamily: '"adventures-unlimited", serif',
                            }}
                          >
                            Contact
                          </h3>
                          <div className="space-y-2">
                            <a
                              href={`tel:${businessInfo.phone}`}
                              className="block font-headline text-lg hover:opacity-70 transition-opacity"
                              style={{ color: "#144663" }}
                            >
                              {businessInfo.phone}
                            </a>
                            <a
                              href={`mailto:${businessInfo.email}`}
                              className="block font-headline text-lg hover:opacity-70 transition-opacity"
                              style={{ color: "#144663" }}
                            >
                              {businessInfo.email}
                            </a>
                            {Object.keys(socialMedia).length > 0 && (
                              <div className="flex gap-4 mt-6">
                                {Object.entries(socialMedia)
                                  .filter(([, url]) => url)
                                  .map(([platform, url]) => (
                                  <a
                                    key={platform}
                                    href={url as string}
                                    className="font-headline text-base hover:opacity-70 transition-opacity capitalize"
                                    style={{ color: "#144663" }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {platform}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-4xl overflow-hidden relative z-10 mt-8"
            style={{ backgroundColor: "#144663", minHeight: "450px" }}
          >
            <footer className="flex items-center justify-center h-full min-h-[450px] text-center text-white">
              <div>
                <img
                  src="./logo.svg"
                  alt="49Maine"
                  className="h-20 w-20 mx-auto mb-6 opacity-90"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <h3 className="text-3xl font-headline font-bold mb-4">
                  Ready to Experience 49Maine?
                </h3>
                <p className="text-lg mb-8 opacity-90">
                  Call us to make a reservation
                </p>
                <button
                  className="px-8 py-3 rounded-lg font-bold text-base inline-flex items-center gap-2 transition-all hover:shadow-lg"
                  style={{ backgroundColor: "white", color: "#144663" }}
                  onClick={() => (window.location.href = `tel:${businessInfo?.phone || "2075550149"}`)}
                >
                  <Phone className="w-5 h-5" />
                  {businessInfo?.phone || "(207) 555-0149"}
                </button>
              </div>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}