"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useState } from "react";
import { Gift, X } from "lucide-react";
import confetti from "canvas-confetti";

const prizes = [
  { id: 1, text: "Free Appetizer", color: "#ff8c73", angle: 0 },
  { id: 2, text: "20% Off", color: "#fbbf24", angle: 45 },
  { id: 3, text: "Free Dessert", color: "#6b8e6b", angle: 90 },
  { id: 4, text: "10% Off", color: "#6699b7", angle: 135 },
  { id: 5, text: "Free Drink", color: "#ff5e3b", angle: 180 },
  { id: 6, text: "15% Off", color: "#f59e0b", angle: 225 },
  { id: 7, text: "Try Again", color: "#a5bda5", angle: 270 },
  { id: 8, text: "25% Off", color: "#144663", angle: 315 },
];

export default function SpinWheel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<typeof prizes[0] | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setPrize(null);

    const spins = 5 + Math.random() * 5;
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + finalAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedAngle = finalAngle % 360;
      const prizeIndex = Math.floor(normalizedAngle / 45);
      const wonPrize = prizes[prizeIndex];
      setPrize(wonPrize);
      setIsSpinning(false);
      setHasSpun(true);

      if (wonPrize.text !== "Try Again") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 4000);
  };

  const resetWheel = () => {
    setPrize(null);
    setHasSpun(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      classNames={{
        body: "py-6",
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-2xl font-bold text-primary">Spin to Win!</h3>
          <p className="text-sm text-gray-600">Try your luck for exclusive discounts</p>
        </ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <div className="relative w-80 h-80">
            <svg className="absolute inset-0" viewBox="0 0 320 320">
              <defs>
                {prizes.map((prize, i) => (
                  <linearGradient key={`gradient-${i}`} id={`gradient-${i}`}>
                    <stop offset="0%" stopColor={prize.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={prize.color} stopOpacity="0.8" />
                  </linearGradient>
                ))}
              </defs>

              <motion.g
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
              >
                {prizes.map((prize, i) => {
                  const startAngle = (i * 45 - 90) * Math.PI / 180;
                  const endAngle = ((i + 1) * 45 - 90) * Math.PI / 180;
                  const x1 = 160 + 150 * Math.cos(startAngle);
                  const y1 = 160 + 150 * Math.sin(startAngle);
                  const x2 = 160 + 150 * Math.cos(endAngle);
                  const y2 = 160 + 150 * Math.sin(endAngle);

                  return (
                    <g key={i}>
                      <path
                        d={`M 160 160 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`}
                        fill={`url(#gradient-${i})`}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={160 + 90 * Math.cos((startAngle + endAngle) / 2)}
                        y={160 + 90 * Math.sin((startAngle + endAngle) / 2)}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${i * 45 + 22.5}, ${160 + 90 * Math.cos((startAngle + endAngle) / 2)}, ${160 + 90 * Math.sin((startAngle + endAngle) / 2)})`}
                      >
                        {prize.text}
                      </text>
                    </g>
                  );
                })}
              </motion.g>

              <circle cx="160" cy="160" r="20" fill="#144663" />
              <polygon points="160,10 170,40 150,40" fill="#ff5e3b" />
            </svg>
          </div>

          <AnimatePresence>
            {prize && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-lg font-semibold text-gray-600 mb-2">Congratulations! You won:</p>
                <p className="text-3xl font-bold" style={{ color: prize.color }}>
                  {prize.text}!
                </p>
                {prize.text !== "Try Again" && (
                  <p className="mt-4 text-sm text-gray-500">
                    Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">SPIN{prize.id}49</span>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>
        <ModalFooter className="flex justify-center gap-4">
          {!hasSpun ? (
            <Button
              color="primary"
              size="lg"
              onPress={spin}
              isDisabled={isSpinning}
              startContent={!isSpinning && <Gift />}
              className="font-semibold"
            >
              {isSpinning ? "Spinning..." : "Spin the Wheel!"}
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                variant="bordered"
                onPress={resetWheel}
                className="font-semibold"
              >
                Spin Again Tomorrow
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                className="font-semibold"
              >
                Claim Prize
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}