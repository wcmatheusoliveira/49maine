"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Chip, Button, Input, Tabs, Tab } from "@heroui/react";
import { Search, Filter, Wine, Flame, Leaf, Star, TrendingUp, Clock } from "lucide-react";
import { menuData } from "@/data/menu";

const dietaryTags = {
  vegetarian: { icon: <Leaf className="w-4 h-4" />, color: "success" },
  spicy: { icon: <Flame className="w-4 h-4" />, color: "danger" },
  popular: { icon: <Star className="w-4 h-4" />, color: "warning" },
  new: { icon: <TrendingUp className="w-4 h-4" />, color: "secondary" },
};

const winePairings: { [key: string]: string } = {
  "NY Strip Steak": "Cabernet Sauvignon",
  "Ribeye Steak": "Malbec",
  "Scallop Risotto": "Pinot Grigio",
  "Broiled Haddock": "Sauvignon Blanc",
  "Wood-Fired Half Chicken": "Pinot Noir",
  "Margherita": "Chianti",
  "Greek": "Assyrtiko",
};

const menuTags: { [key: string]: string[] } = {
  "Crispy Brussels Sprouts": ["vegetarian"],
  "Garden Salad": ["vegetarian"],
  "Warm Walnut & Mushroom Salad": ["vegetarian"],
  "Wild Mushroom Risotto": ["vegetarian"],
  "Veggie Pie": ["vegetarian", "new"],
  "Wood-Fired Chicken Wings": ["spicy", "popular"],
  "49 Smash Burger": ["popular"],
  "NY Strip Steak (Wagyu)": ["popular"],
  "Maine Cheese Board": ["vegetarian"],
  "Pepperoni": ["spicy"],
};

export default function InteractiveMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("0");
  const [showPairings, setShowPairings] = useState(false);

  const filteredMenu = useMemo(() => {
    return menuData.map(section => ({
      ...section,
      items: section.items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = !selectedFilter ||
                            menuTags[item.name]?.includes(selectedFilter);

        return matchesSearch && matchesFilter;
      })
    }));
  }, [searchQuery, selectedFilter]);

  const renderPrice = (price: any) => {
    if (typeof price === "string") {
      return <span className="text-primary font-bold text-lg">{price}</span>;
    }
    if (price.small && price.large) {
      return (
        <span className="text-primary font-bold">
          S: {price.small} | L: {price.large}
        </span>
      );
    }
    if (price.options) {
      return (
        <span className="text-primary font-bold">
          {price.options.join(" | ")}
        </span>
      );
    }
    return null;
  };

  const MealBuilder = () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const total = useMemo(() => {
      return selectedItems.reduce((sum, itemName) => {
        const item = menuData.flatMap(s => s.items).find(i => i.name === itemName);
        if (item && typeof item.price === "string") {
          const price = parseInt(item.price.replace("$", ""));
          return sum + (isNaN(price) ? 0 : price);
        }
        return sum;
      }, 0);
    }, [selectedItems]);

    return (
      <Card className="bg-gradient-to-r from-amber-50 to-sage-50 mb-8">
        <CardBody className="p-6">
          <h3 className="text-xl font-bold text-primary-700 mb-4">
            Build Your Perfect Meal
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Chip color="primary" variant="flat">Appetizer</Chip>
            <Chip color="primary" variant="flat">Main Course</Chip>
            <Chip color="primary" variant="flat">Dessert</Chip>
          </div>
          {selectedItems.length > 0 && (
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm text-primary-600 mb-2">Your Selection:</p>
              {selectedItems.map(item => (
                <p key={item} className="text-primary-700">• {item}</p>
              ))}
              <p className="font-bold text-primary mt-3">Estimated Total: ${total}</p>
            </div>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Explore Our Menu
          </h2>
          <p className="text-xl text-primary-600">
            Discover your perfect dish
          </p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-5 h-5 text-primary-400" />}
              classNames={{
                input: "text-primary",
                inputWrapper: "bg-cream-50 border-primary-200"
              }}
              className="flex-1"
            />
            <Button
              color={showPairings ? "primary" : "default"}
              variant={showPairings ? "solid" : "bordered"}
              startContent={<Wine className="w-5 h-5" />}
              onPress={() => setShowPairings(!showPairings)}
              className="font-semibold"
            >
              Wine Pairings
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-primary-600 font-medium mr-2">Filter by:</span>
            {Object.entries(dietaryTags).map(([key, { icon, color }]) => (
              <Chip
                key={key}
                color={selectedFilter === key ? color as any : "default"}
                variant={selectedFilter === key ? "solid" : "bordered"}
                startContent={icon}
                onClick={() => setSelectedFilter(selectedFilter === key ? null : key)}
                className="cursor-pointer capitalize"
              >
                {key}
              </Chip>
            ))}
          </div>
        </div>

        <MealBuilder />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 flex-wrap justify-center",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary font-semibold"
          }}
        >
          {filteredMenu.map((section, index) => (
            <Tab key={index.toString()} title={`${section.title} (${section.items.length})`}>
              <div className="grid gap-4 mt-8">
                <AnimatePresence mode="wait">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: itemIndex * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow bg-cream-50">
                        <CardBody className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-primary-700">
                                  {item.name}
                                </h3>
                                <div className="flex gap-2">
                                  {menuTags[item.name]?.map(tag => (
                                    <Chip
                                      key={tag}
                                      size="sm"
                                      color={(dietaryTags as any)[tag]?.color as any}
                                      variant="flat"
                                      startContent={(dietaryTags as any)[tag]?.icon}
                                    >
                                      {tag}
                                    </Chip>
                                  ))}
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-primary-600 mb-2">{item.description}</p>
                              )}
                              {showPairings && winePairings[item.name] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-3 p-3 bg-amber-50 rounded-lg flex items-center gap-2"
                                >
                                  <Wine className="w-5 h-5 text-amber-600" />
                                  <span className="text-sm text-amber-700">
                                    Pairs well with: <strong>{winePairings[item.name]}</strong>
                                  </span>
                                </motion.div>
                              )}
                            </div>
                            <div className="text-right">
                              {renderPrice(item.price)}
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  className="font-semibold"
                                >
                                  Add to Order
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
}