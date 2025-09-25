"use client";

import DynamicHero from "./DynamicHero";
import DynamicMenu from "./DynamicMenu";
import DynamicLocation from "./DynamicLocation";
import DynamicNavigation from "./DynamicNavigation";
import { motion } from "framer-motion";

interface SectionData {
  id: string;
  type: string;
  name: string;
  data: string | any; // Can be JSON string or object
  isVisible: boolean;
}

interface DynamicSectionProps {
  section: SectionData;
  menuCategories?: any[]; // For menu sections
  businessInfo?: any; // For location sections
}

export default function DynamicSection({ section, menuCategories, businessInfo }: DynamicSectionProps) {
  if (!section.isVisible) return null;

  // Handle both JSON string and object formats
  const data = typeof section.data === 'string'
    ? JSON.parse(section.data || "{}")
    : section.data || {};

  switch (section.type) {
    case "navigation":
      return <DynamicNavigation data={data} businessInfo={businessInfo} />;

    case "hero":
      return <DynamicHero data={data} businessInfo={businessInfo} />;

    case "menu":
      return menuCategories ? (
        <DynamicMenu categories={menuCategories} {...data} />
      ) : null;

    case "location":
      return businessInfo ? (
        <DynamicLocation businessInfo={businessInfo} data={data} />
      ) : null;

    case "content":
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            {data.title && (
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-8" style={{ color: "#144663" }}>
                {data.title}
              </h2>
            )}
            {data.content && (
              <div
                className="prose prose-lg mx-auto"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            )}
          </div>
        </motion.div>
      );

    case "testimonials":
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 bg-[#FBF8EB]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#144663" }}>
              {data.title || "What Our Guests Say"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.testimonials?.map((testimonial: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{testimonial.text}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold" style={{ color: "#144663" }}>{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      );

    case "cta":
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-4xl overflow-hidden relative z-20 mt-8 isolate"
          style={{ backgroundColor: data.backgroundColor || "#144663", minHeight: "450px" }}
        >
          <div className="flex items-center justify-center h-full min-h-[450px] text-center text-white p-8">
            <div>
              {data.logo && (
                <img
                  src={data.logo}
                  alt="Logo"
                  className="h-20 w-20 mx-auto mb-6 opacity-90"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              )}
              {data.title && (
                <h3 className="text-3xl font-headline font-bold mb-4">
                  {data.title}
                </h3>
              )}
              {data.subtitle && (
                <p className="text-lg mb-8 opacity-90">
                  {data.subtitle}
                </p>
              )}
              {data.button && (
                <button
                  className="px-8 py-3 rounded-lg font-bold text-base inline-flex items-center gap-2 transition-all hover:shadow-lg"
                  style={{ backgroundColor: "white", color: data.backgroundColor || "#144663" }}
                  onClick={() => window.location.href = data.button.url}
                >
                  {data.button.icon && <span className="w-5 h-5">{data.button.icon}</span>}
                  {data.button.text}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}