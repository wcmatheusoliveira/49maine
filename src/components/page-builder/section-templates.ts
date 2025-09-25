export interface SectionTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultData: any;
  thumbnail?: string;
}

export const sectionTemplates: SectionTemplate[] = [
  // Navigation
  {
    id: "navigation-header",
    type: "navigation",
    name: "Navigation Header",
    description: "Top navigation bar with logo and menu",
    icon: "🧭",
    category: "Navigation",
    defaultData: {
      logo: "./logo.svg",
      navItems: [
        { name: "Menu", to: "menu" },
        { name: "Hours & Location", to: "location" },
        { name: "Reserve", to: "reserve" }
      ],
      showCallButton: true,
      callButtonText: "Call Now",
      backgroundColor: "#FBF8EB",
      textColor: "#144663",
      sticky: true
    }
  },

  // Hero Sections
  {
    id: "hero-video",
    type: "hero",
    name: "Video Hero",
    description: "Full-screen hero with video background",
    icon: "🎬",
    category: "Hero",
    defaultData: {
      headline: "Come hungry, <span style='font-family: \"adventures-unlimited\", serif; font-size: 1.2em; font-style: italic;'>leave happy</span>",
      subheadline: "Experience culinary excellence",
      tagline: "Wood-fired goodness in the heart of Lincoln, Maine",
      specialAnnouncement: "Tonight's Special: Half-Price Wings After 8PM",
      valueProps: [
        "Serving Lincoln Since 2020",
        "4.8 Stars on Google",
        "Kids Eat Free Tuesdays",
        "Happy Hour 5-6PM Daily"
      ],
      showOpenStatus: true,
      openStatusText: "Open Now • Closes at 10PM",
      showLocallyOwned: true,
      locallyOwnedText: "Locally Owned & Operated",
      backgroundVideo: "/49maine-hero.mp4",
      overlayOpacity: 0.4,
      ctaButtons: [
        { text: "See Menu & Order", url: "#menu", variant: "primary" },
        { text: "Book a Table", url: "tel:2075550149", variant: "secondary" }
      ]
    }
  },
  {
    id: "hero-image",
    type: "hero",
    name: "Image Hero",
    description: "Hero section with background image",
    icon: "🖼️",
    category: "Hero",
    defaultData: {
      headline: "Delicious Food Awaits",
      subheadline: "Fresh ingredients, amazing flavors",
      backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      overlayOpacity: 0.5,
      ctaButtons: [
        { text: "Order Now", url: "#order", variant: "primary" }
      ]
    }
  },
  {
    id: "hero-minimal",
    type: "hero",
    name: "Minimal Hero",
    description: "Clean hero with solid background",
    icon: "✨",
    category: "Hero",
    defaultData: {
      headline: "Simple & Elegant",
      subheadline: "Less is more",
      backgroundColor: "#144663",
      textColor: "#ffffff",
      ctaButtons: [
        { text: "Get Started", url: "#start", variant: "primary" }
      ]
    }
  },

  // Content Sections
  {
    id: "about-simple",
    type: "content",
    name: "About Section",
    description: "Tell your story",
    icon: "📖",
    category: "Content",
    defaultData: {
      title: "Our Story",
      content: "<p>Share your restaurant's unique story and what makes you special.</p>",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      imagePosition: "right"
    }
  },
  {
    id: "features-grid",
    type: "features",
    name: "Features Grid",
    description: "Highlight key features",
    icon: "⭐",
    category: "Content",
    defaultData: {
      title: "Why Choose Us",
      features: [
        { icon: "🍴", title: "Fresh Ingredients", description: "Locally sourced, always fresh" },
        { icon: "👨‍🍳", title: "Expert Chefs", description: "Award-winning culinary team" },
        { icon: "🏆", title: "Best Service", description: "Exceptional dining experience" },
        { icon: "🌟", title: "5-Star Reviews", description: "Loved by our customers" }
      ]
    }
  },

  // Menu Sections
  {
    id: "menu-dynamic",
    type: "menu",
    name: "Dynamic Menu",
    description: "Display menu from database",
    icon: "🍽️",
    category: "Menu",
    defaultData: {
      title: "Our Menu",
      subtitle: "Fresh daily selections",
      showPrices: true,
      showDescriptions: true,
      layout: "grid"
    }
  },
  {
    id: "menu-featured",
    type: "menu-featured",
    name: "Featured Items",
    description: "Showcase special dishes",
    icon: "⭐",
    category: "Menu",
    defaultData: {
      title: "Chef's Specials",
      items: [
        {
          name: "Signature Dish",
          description: "Our most popular item",
          price: "$24",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        }
      ]
    }
  },

  // Gallery
  {
    id: "gallery-grid",
    type: "gallery",
    name: "Photo Gallery",
    description: "Showcase your best images",
    icon: "📸",
    category: "Media",
    defaultData: {
      title: "Gallery",
      columns: 3,
      images: [
        { url: "https://images.unsplash.com/photo-1552566626-52f8b828add9", alt: "Restaurant" },
        { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", alt: "Interior" },
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", alt: "Food" }
      ]
    }
  },

  // Testimonials
  {
    id: "testimonials-carousel",
    type: "testimonials",
    name: "Testimonials",
    description: "Customer reviews carousel",
    icon: "💬",
    category: "Social Proof",
    defaultData: {
      title: "What Our Customers Say",
      autoplay: true,
      testimonials: [] // Will be loaded from database
    }
  },

  // Location
  {
    id: "location-map",
    type: "location",
    name: "Location & Hours",
    description: "Map and business hours",
    icon: "📍",
    category: "Contact",
    defaultData: {
      title: "Find Us",
      subtitle: "We're easy to find",
      showMap: true,
      showHours: true
    }
  },

  // CTA Sections
  {
    id: "cta-simple",
    type: "cta",
    name: "Call to Action",
    description: "Simple CTA section",
    icon: "🎯",
    category: "CTA",
    defaultData: {
      title: "Ready to Dine?",
      subtitle: "Make your reservation today",
      backgroundColor: "#144663",
      button: {
        text: "Book Now",
        url: "#reserve"
      }
    }
  },
  {
    id: "cta-newsletter",
    type: "newsletter",
    name: "Newsletter Signup",
    description: "Email subscription form",
    icon: "📧",
    category: "CTA",
    defaultData: {
      title: "Stay Updated",
      subtitle: "Get the latest news and special offers",
      placeholder: "Enter your email",
      buttonText: "Subscribe"
    }
  },

  // Special
  {
    id: "special-offers",
    type: "special-offers",
    name: "Special Offers",
    description: "Display current promotions",
    icon: "🎁",
    category: "Special",
    defaultData: {
      title: "Special Offers",
      offers: [] // Will be loaded from database
    }
  },
  {
    id: "events-calendar",
    type: "events",
    name: "Events Calendar",
    description: "Upcoming events",
    icon: "📅",
    category: "Special",
    defaultData: {
      title: "Upcoming Events",
      showCalendar: true
    }
  }
];

export const getSectionsByCategory = () => {
  const categories: Record<string, SectionTemplate[]> = {};

  // Define category order
  const categoryOrder = [
    "Navigation",
    "Hero",
    "Content",
    "Menu",
    "Media",
    "Social Proof",
    "Contact",
    "CTA",
    "Special"
  ];

  // Initialize categories in order
  categoryOrder.forEach(cat => {
    categories[cat] = [];
  });

  // Add templates to their categories
  sectionTemplates.forEach(template => {
    if (!categories[template.category]) {
      categories[template.category] = [];
    }
    categories[template.category].push(template);
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};