"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

interface HeroData {
  headline: string;
  subheadline?: string;
  tagline?: string;
  ctaButtons?: Array<{
    text: string;
    url: string;
    variant: "primary" | "secondary";
  }>;
  specialAnnouncement?: string;
  valueProps?: Array<string>;
  showOpenStatus?: boolean;
  openStatusText?: string;
  showLocallyOwned?: boolean;
  locallyOwnedText?: string;
  backgroundVideo?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

interface DynamicHeroProps {
  data: HeroData;
  businessInfo?: any;
}

export default function DynamicHero({ data, businessInfo }: DynamicHeroProps) {
  return (
    <div className="sticky top-2 sm:top-5 z-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl sm:rounded-[32px] overflow-hidden relative isolate"
        style={{ backgroundColor: "#144663", minHeight: "300px" }}
      >
        {/* Background Media */}
        {data.backgroundVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ filter: `brightness(${data.overlayOpacity || 0.4})` }}
          >
            <source src={data.backgroundVideo} type="video/mp4" />
          </video>
        )}

        {data.backgroundImage && !data.backgroundVideo && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${data.backgroundImage})`,
              filter: `brightness(${data.overlayOpacity || 0.6})`
            }}
          />
        )}

        {/* Gradient Overlay */}
        {data.overlay !== false && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20, 70, 99, 0.3) 0%, rgba(20, 70, 99, 0.5) 50%, rgba(20, 70, 99, 0.7) 100%)",
            }}
          />
        )}

        {/* Content */}
        <div className="relative flex items-center justify-center h-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] p-6 sm:p-12">
          <div className="text-center text-white max-w-4xl mx-auto z-10">
            {/* Special Announcement */}
            {data.specialAnnouncement && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <span className="hidden sm:inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-xs sm:text-base font-medium">
                  {data.specialAnnouncement}
                </span>
              </motion.div>
            )}

            {/* Main Headline */}
            {data.headline && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold mb-4"
                style={{ fontWeight: 700 }}
                dangerouslySetInnerHTML={{ __html: data.headline }}
              />
            )}

            {/* Tagline */}
            {data.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90"
              >
                {data.tagline}
              </motion.p>
            )}

            {/* Value Props */}
            {data.valueProps && data.valueProps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {data.valueProps.map((prop, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 bg-white/10 backdrop-blur rounded-lg text-sm ${
                      index > 1 ? 'hidden sm:inline' : ''
                    }`}
                  >
                    {prop}
                  </span>
                ))}
              </motion.div>
            )}

            {/* CTAs */}
            {data.ctaButtons && data.ctaButtons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                {data.ctaButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (button.url.startsWith('tel:')) {
                        window.location.href = button.url;
                      } else if (button.url.startsWith('#')) {
                        document
                          .getElementById(button.url.substring(1))
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = button.url;
                      }
                    }}
                    className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
                      button.variant === 'primary'
                        ? 'bg-white text-[#144663] hover:shadow-xl'
                        : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#144663]'
                    }`}
                  >
                    {button.text}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Quick Info - Open Status and Locally Owned */}
            {(data.showOpenStatus || data.showLocallyOwned) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm sm:text-base"
              >
                {data.showOpenStatus && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>{data.openStatusText || "Open Now • Closes at 10PM"}</span>
                  </div>
                )}
                {data.showOpenStatus && data.showLocallyOwned && (
                  <div className="hidden sm:block">|</div>
                )}
                {data.showLocallyOwned && (
                  <div className="font-medium">
                    {data.locallyOwnedText || "Locally Owned & Operated"}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}