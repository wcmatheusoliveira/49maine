"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flame, Star, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const specials = [
  {
    id: 1,
    name: "Maine Lobster Roll",
    description: "Fresh lobster, butter, special seasoning",
    price: "$Market Price",
    type: "Today's Catch",
    icon: "🦞",
    available: "Limited Supply"
  },
  {
    id: 2,
    name: "Wood-Fired Prime Rib",
    description: "16oz cut, herb crusted, pan jus",
    price: "$42",
    type: "Chef's Special",
    icon: "🥩",
    available: "After 5PM"
  },
  {
    id: 3,
    name: "Wild Mushroom Risotto",
    description: "Truffle oil, parmesan, fresh herbs",
    price: "$24",
    type: "Vegetarian Special",
    icon: "🍄",
    available: "All Day"
  }
];

export default function DailySpecials() {
  const [currentSpecial, setCurrentSpecial] = useState(0);
  const [timeUntilHappyHour, setTimeUntilHappyHour] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecial((prev) => (prev + 1) % specials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const happyHour = new Date();
      happyHour.setHours(16, 0, 0, 0); // 4 PM

      if (now.getHours() >= 16 && now.getHours() < 18) {
        setTimeUntilHappyHour("HAPPY HOUR NOW! 🎉");
      } else if (now.getHours() >= 18) {
        happyHour.setDate(happyHour.getDate() + 1);
      }

      if (now < happyHour) {
        const diff = happyHour.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilHappyHour(`Happy Hour in ${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-coral-500 to-primary-500 text-white py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              <Flame className="w-6 h-6" />
            </motion.div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <span className="font-bold text-sm uppercase tracking-wider">Today's Special</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSpecial}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6 flex-1 justify-center"
            >
              <span className="text-3xl">{specials[currentSpecial].icon}</span>
              <div>
                <p className="font-bold text-lg">{specials[currentSpecial].name}</p>
                <p className="text-sm opacity-90">{specials[currentSpecial].description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{specials[currentSpecial].price}</p>
                <p className="text-xs opacity-75">{specials[currentSpecial].available}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{timeUntilHappyHour}</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🔥
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}