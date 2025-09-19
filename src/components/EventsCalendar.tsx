"use client";

import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Calendar, Music, Wine, Users, Mic2, Utensils } from "lucide-react";

const events = [
  {
    id: 1,
    date: "Every Tuesday",
    title: "Trivia Night",
    time: "7:00 PM",
    description: "Test your knowledge, win prizes!",
    icon: <Mic2 className="w-5 h-5" />,
    color: "primary"
  },
  {
    id: 2,
    date: "Every Wednesday",
    title: "Wine & Dine",
    time: "5:00 PM - 9:00 PM",
    description: "Half-price on all bottles of wine",
    icon: <Wine className="w-5 h-5" />,
    color: "danger"
  },
  {
    id: 3,
    date: "Fridays",
    title: "Live Jazz",
    time: "8:00 PM",
    description: "Smooth tunes with your dinner",
    icon: <Music className="w-5 h-5" />,
    color: "secondary"
  },
  {
    id: 4,
    date: "Saturdays",
    title: "Chef's Table",
    time: "6:30 PM",
    description: "5-course tasting menu experience",
    icon: <Utensils className="w-5 h-5" />,
    color: "success"
  },
  {
    id: 5,
    date: "Last Sunday",
    title: "Community Brunch",
    time: "11:00 AM - 2:00 PM",
    description: "Special menu, family style",
    icon: <Users className="w-5 h-5" />,
    color: "warning"
  }
];

export default function EventsCalendar() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-primary">What's Happening</h2>
          </div>
          <p className="text-lg text-primary-600">
            Join us for special events and experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow bg-cream-50 border border-primary-100">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Chip
                        color={event.color as any}
                        variant="flat"
                        startContent={event.icon}
                        className="mb-3"
                      >
                        {event.date}
                      </Chip>
                      <h3 className="text-xl font-bold text-primary-700">{event.title}</h3>
                      <p className="text-sm text-primary-500 mt-1">{event.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-primary-600">{event.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <CardBody className="py-8">
              <h3 className="text-2xl font-bold mb-3">Private Events & Catering</h3>
              <p className="mb-6 text-white/90">
                Let us host your special occasion. From intimate gatherings to large celebrations.
              </p>
              <button className="bg-white text-primary-500 px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-colors">
                Inquire About Events
              </button>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}