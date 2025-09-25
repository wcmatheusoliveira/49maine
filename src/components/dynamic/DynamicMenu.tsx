"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
  priceOptions?: string;
  isPopular?: boolean;
  isAvailable?: boolean;
  image?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

interface DynamicMenuProps {
  categories: MenuCategory[];
  title?: string;
  subtitle?: string;
}

export default function DynamicMenu({ categories, title = "The Good Stuff", subtitle = "Wood-fired, fresh-made, and always worth it" }: DynamicMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const parsePriceOptions = (priceOptions: string | undefined) => {
    if (!priceOptions) return null;
    try {
      return JSON.parse(priceOptions);
    } catch {
      return null;
    }
  };

  return (
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
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:text-lg text-base font-headline"
          style={{ color: "#144663", opacity: 0.7 }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              const element = document.getElementById(`category-${category.id}`);
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
        {categories.map((category, categoryIndex) => (
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
                const priceOptions = parsePriceOptions(item.priceOptions);

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
                    <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#144663]/10 relative overflow-hidden ${!item.isAvailable ? 'opacity-60' : ''}`}>
                      {/* Item Content */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4
                            className="text-2xl font-bold mb-2 group-hover:scale-[1.02] transition-transform origin-left"
                            style={{ color: "#144663" }}
                          >
                            {item.name}
                            {!item.isAvailable && <span className="text-sm ml-2 text-red-500">(Not Available)</span>}
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
  );
}