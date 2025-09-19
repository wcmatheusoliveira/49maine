export interface MenuItem {
  name: string;
  description?: string;
  price: string | { small?: string; large?: string; options?: string[] };
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuData: MenuSection[] = [
  {
    title: "Soups & Starters",
    items: [
      {
        name: "House Tots",
        description: "Crispy potatoes, cheddar, bacon, scallions, cheese sauce",
        price: "$11"
      },
      {
        name: "House Cut Fries",
        price: "$8"
      },
      {
        name: "Wood-Fired Chicken Wings",
        description: "Dry rubbed, choice of sauce",
        price: { options: ["5uni $10", "10uni $18"] }
      },
      {
        name: "Maine Cheese Board",
        description: "Artisan cheeses, fruit, nuts, bread",
        price: "$22"
      },
      {
        name: "Mussels in Garlic White Wine",
        description: "Garlic, white wine, tomato, basil, butter",
        price: "$18"
      },
      {
        name: "Maple Soy Pork Belly",
        description: "Glazed pork belly, dressed greens",
        price: "$14"
      },
      {
        name: "Crispy Brussels Sprouts",
        description: "Wood-fired, parmesan, hot honey",
        price: "$9"
      },
      {
        name: "Pretzel Bites",
        description: "With salt, cheese sauce, mustard",
        price: "$9"
      }
    ]
  },
  {
    title: "Salads",
    items: [
      {
        name: "Garden Salad",
        description: "Fresh greens, tomato, cucumber, bell pepper, red onion, house vinaigrette",
        price: { small: "$7", large: "$14" }
      },
      {
        name: "Caesar Salad",
        description: "Romaine, parmesan, dressing, croutons — Add chicken $10 | Add salmon $14",
        price: { small: "$7", large: "$14" }
      },
      {
        name: "Greek Salad",
        description: "Fire-roasted tomato, cucumber, bell pepper, red onion, Kalamata olives, feta, Greek dressing",
        price: { small: "$7", large: "$14" }
      },
      {
        name: "Cobb Salad",
        description: "Mixed greens, hard-boiled egg, cherry tomatoes, bacon, caramelized onion, blue cheese, avocado-basil vinaigrette",
        price: { options: ["$18 chicken", "$32 lobster"] }
      },
      {
        name: "Warm Walnut & Mushroom Salad",
        description: "Greens, balsamic, sherry, goat cheese",
        price: { small: "$8", large: "$16" }
      }
    ]
  },
  {
    title: "Sandwiches",
    items: [
      {
        name: "Cuban",
        description: "Roast pork, ham, Swiss, pickles, mustard, toasted bread",
        price: "$18"
      },
      {
        name: "49 Smash Burger",
        description: "Beef patty, pub cheese, lettuce, tomato, pickles, brioche bun",
        price: "$16"
      },
      {
        name: "Lincoln Smash Burger",
        description: "Beef patty, pub cheese, pickled jalapeños, lettuce, tomato, crispy onions, brioche bun",
        price: "$18"
      },
      {
        name: "Blackened Chicken Sandwich",
        description: "Spiced chicken, bacon, tomato, pepper jack, brioche bun",
        price: "$18"
      }
    ]
  },
  {
    title: "Wood-Fired Pizzas",
    items: [
      {
        name: "Cheese",
        description: "Tomato sauce, mozzarella, parmesan",
        price: "$18"
      },
      {
        name: "Pepperoni",
        description: "Tomato sauce, pepperoni, mozzarella",
        price: "$21"
      },
      {
        name: "Margherita",
        description: "Tomato sauce, roasted tomatoes, buffalo mozzarella, basil, olive oil",
        price: "$20"
      },
      {
        name: "Hawaiian",
        description: "Tomato sauce, mozzarella, grilled pineapple, prosciutto, red onion",
        price: "$22"
      },
      {
        name: "Greek",
        description: "Olive oil, spinach, roasted tomato, Kalamata olives, feta",
        price: "$20"
      },
      {
        name: "BBQ Chicken",
        description: "Grilled chicken, BBQ sauce, mozzarella, red onion",
        price: "$22"
      },
      {
        name: "Veggie Pie",
        description: "Olive oil, mozzarella, chef's daily fire-roasted vegetables",
        price: "$20"
      }
    ]
  },
  {
    title: "Mains",
    items: [
      {
        name: "Wood-Fired Half Chicken",
        description: "Bone-in, pan jus, roasted potatoes",
        price: "$28"
      },
      {
        name: "Chicken in Sand",
        description: "Pan-fried chicken breast, roasted tomatoes, garlic, basil, jasmine rice",
        price: "$24"
      },
      {
        name: "Broiled Haddock",
        description: "Fresh haddock, butter, wine, herbs, jasmine rice",
        price: "$24"
      },
      {
        name: "Scallop Risotto",
        description: "Sea scallops, lemon-parmesan risotto",
        price: "$32"
      },
      {
        name: "NY Strip Steak (Wagyu)",
        description: "12oz strip, herbed mushrooms, mashed potatoes",
        price: "$48"
      },
      {
        name: "Ribeye Steak",
        description: "14oz ribeye, rosemary-garlic butter, mashed potatoes",
        price: "$48"
      },
      {
        name: "Creamy Garlic Parmesan Pasta",
        description: "House-made pasta, roasted garlic, parmesan, cream sauce — Add chicken $26 | Add seafood $38",
        price: "$22"
      },
      {
        name: "Mac & Cheese",
        price: "$18"
      }
    ]
  }
];

export const specialOffers = [
  {
    title: "Happy Hour",
    description: "Enjoy 20% off all appetizers and draft beers",
    time: "Tuesday - Friday, 4:00 PM - 6:00 PM",
    icon: "🍻"
  },
  {
    title: "Wine Wednesday",
    description: "Half-price on all bottles of wine",
    time: "Every Wednesday",
    icon: "🍷"
  },
  {
    title: "Weekend Brunch",
    description: "Special brunch menu with bottomless mimosas",
    time: "Saturday & Sunday, 10:00 AM - 2:00 PM",
    icon: "🥂"
  }
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "The wood-fired pizzas are absolutely incredible! The crust is perfect and the ingredients are so fresh. This has become our family's favorite spot.",
    date: "2 weeks ago"
  },
  {
    name: "Michael Chen",
    rating: 5,
    text: "Best steak I've had in Maine! The Wagyu strip was cooked to perfection. The atmosphere is cozy and the service was exceptional.",
    date: "1 month ago"
  },
  {
    name: "Emily Rodriguez",
    rating: 5,
    text: "As a seafood lover, I'm impressed by the freshness and preparation. The scallop risotto is to die for! Can't wait to come back.",
    date: "3 weeks ago"
  },
  {
    name: "David Thompson",
    rating: 5,
    text: "The maple soy pork belly is a must-try! Creative menu with local ingredients. Love that they support Maine producers.",
    date: "1 week ago"
  }
];