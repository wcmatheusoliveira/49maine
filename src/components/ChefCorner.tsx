"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Avatar, Button } from "@heroui/react";
import { ChefHat, Award, Quote } from "lucide-react";

const team = [
  {
    name: "Chef Marcus Sullivan",
    role: "Executive Chef",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=200&h=200&fit=crop",
    bio: "20 years crafting Maine's finest dishes",
    specialty: "Wood-fired cooking & seafood"
  },
  {
    name: "Sarah Chen",
    role: "Pastry Chef",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&h=200&fit=crop",
    bio: "Award-winning dessert creator",
    specialty: "Artisan breads & seasonal desserts"
  },
  {
    name: "Mike Rodriguez",
    role: "Sous Chef",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=200&h=200&fit=crop",
    bio: "Farm-to-table enthusiast",
    specialty: "Local ingredients & pasta"
  }
];

const weeklyRecipe = {
  title: "Chef's Secret: Wood-Fired Pizza Dough",
  ingredients: [
    "3 cups bread flour",
    "1¼ cups warm water",
    "1 tbsp honey",
    "2 tsp active dry yeast",
    "2 tbsp olive oil",
    "2 tsp sea salt"
  ],
  tip: "The secret is a 48-hour cold fermentation. It develops incredible flavor and the perfect chewy texture."
};

export default function ChefCorner() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-primary">Chef's Corner</h2>
          </div>
          <p className="text-lg text-primary-600">
            Meet the talented team behind our kitchen
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-xl transition-shadow bg-white">
                <CardBody className="py-8">
                  <Avatar
                    src={member.image}
                    className="w-32 h-32 mx-auto mb-4 text-large"
                  />
                  <h3 className="text-xl font-bold text-primary-700">{member.name}</h3>
                  <p className="text-primary-500 font-medium">{member.role}</p>
                  <p className="text-primary-600 mt-2">{member.bio}</p>
                  <div className="mt-4 pt-4 border-t border-cream-200">
                    <p className="text-sm text-primary-500">Specialty</p>
                    <p className="font-semibold text-primary-700">{member.specialty}</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-gradient-to-br from-sage-100 to-sage-50">
              <CardBody className="p-8">
                <h3 className="text-2xl font-bold text-primary-700 mb-4">Recipe of the Week</h3>
                <h4 className="text-lg font-semibold text-primary-600 mb-3">{weeklyRecipe.title}</h4>
                <p className="text-sm text-primary-500 mb-4">Ingredients:</p>
                <ul className="space-y-1 mb-6">
                  {weeklyRecipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="text-primary-600">• {ingredient}</li>
                  ))}
                </ul>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-primary-500 mb-2">Chef's Tip:</p>
                  <p className="text-primary-700 italic">{weeklyRecipe.tip}</p>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-gradient-to-br from-amber-50 to-amber-100">
              <CardBody className="p-8 flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-amber-600 mb-4" />
                  <p className="text-xl italic text-primary-700 mb-6">
                    "Cooking is not just about feeding people. It's about creating memories,
                    sharing stories, and bringing our community together around the table."
                  </p>
                  <p className="text-primary-500 font-semibold">— Chef Marcus Sullivan</p>
                </div>

                <div className="mt-8 pt-6 border-t border-amber-200">
                  <div className="flex items-center gap-4 mb-4">
                    <Award className="w-6 h-6 text-amber-600" />
                    <p className="font-semibold text-primary-700">Recent Accolades</p>
                  </div>
                  <ul className="space-y-2 text-primary-600">
                    <li>• Maine's Best New Restaurant 2024</li>
                    <li>• Chef's Choice Award - Wood-Fired Excellence</li>
                    <li>• Farm-to-Table Recognition 2023</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
            color="primary"
            size="lg"
            className="font-semibold"
          >
            Join Our Cooking Classes
          </Button>
        </motion.div>
      </div>
    </section>
  );
}