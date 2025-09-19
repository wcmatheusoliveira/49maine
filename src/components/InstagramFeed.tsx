"use client";

import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import { Instagram, Heart } from "lucide-react";
import Image from "next/image";

const mockPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
    likes: 234,
    caption: "Wood-fired perfection 🔥"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
    likes: 187,
    caption: "Fresh from the oven!"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    likes: 312,
    caption: "Weekend specials 🦞"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
    likes: 289,
    caption: "Farm to table freshness"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop",
    likes: 401,
    caption: "Maine's finest 🌊"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
    likes: 256,
    caption: "Sweet endings 🍰"
  }
];

export default function InstagramFeed() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-cream to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-primary">@49Maine</h2>
          </div>
          <p className="text-lg text-primary-600">
            Follow our culinary journey
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer"
            >
              <Card className="overflow-hidden">
                <CardBody className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <Heart className="w-8 h-8 mx-auto mb-2 fill-white" />
                        <p className="font-bold">{post.likes}</p>
                        <p className="text-xs mt-2 px-2">{post.caption}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com/49maine"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Follow us for daily updates
          </a>
        </motion.div>
      </div>
    </section>
  );
}