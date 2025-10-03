"use client";

import { motion } from "framer-motion";
import DynamicSection from "./dynamic/DynamicSection";

interface Section {
  id: string;
  type: string;
  name: string;
  data: string;
  isVisible: boolean;
  order: number;
}

interface DynamicHomePageProps {
  sections: Section[];
  menuCategories: any[];
  businessInfo: any;
}

export default function DynamicHomePage({
  sections,
  menuCategories,
  businessInfo
}: DynamicHomePageProps) {
  // Separate sections by type
  const navigationSection = sections.find(s => s.type === 'navigation' && s.isVisible);
  const heroSection = sections.find(s => s.type === 'hero' && s.isVisible);

  // Find footer CTA (last CTA section or specific footer type)
  const footerSection = sections
    .filter(s => s.isVisible && (s.type === 'cta' || s.type === 'footer'))
    .sort((a, b) => b.order - a.order)[0]; // Get the last CTA/footer section

  // All other content sections go in the white container
  const contentSections = sections
    .filter(s => {
      return s.type !== 'navigation' &&
             s.type !== 'hero' &&
             s.id !== footerSection?.id &&
             s.isVisible;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div style={{ backgroundColor: "#FBF8EB", minHeight: "100vh" }}>
      <div className="px-2 lg:px-12 py-8">
        <div className="mx-auto">
          {/* Navigation - outside the main content container */}
          {navigationSection && (
            <DynamicSection
              section={navigationSection}
              menuCategories={menuCategories}
              businessInfo={businessInfo}
            />
          )}

          {/* Main Content Container */}
          <div>
            {/* Hero Section - Fixed/Sticky */}
            {heroSection && (
              <DynamicSection
                section={heroSection}
                menuCategories={menuCategories}
                businessInfo={businessInfo}
              />
            )}

            {/* White Content Container that scrolls over hero */}
            {contentSections.length > 0 && (
              <div
                className="relative z-10 bg-white md:rounded-t-[40px] px-4 rounded-t-2xl sm:px-6 py-16 sm:py-20 lg:px-12 -mt-10 sm:-mt-20"
              >
                {contentSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <DynamicSection
                      section={section}
                      menuCategories={menuCategories}
                      businessInfo={businessInfo}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer CTA - Outside the white container */}
            {footerSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <DynamicSection
                  section={footerSection}
                  menuCategories={menuCategories}
                  businessInfo={businessInfo}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}