export type Product = {
  id: string;
  name: string;
  meta: string; // small line above title
  description: string;
  image: string;
  tier: "Premium" | "Standard" | "Luxury";
  tags: string[];
  slug?: string; // SEO-friendly slug
  video?: string; // YouTube URL
  specs?: {
    dimensions?: string;
    power?: string;
    capacity?: string;
    technology?: string;
    support?: string;
    setup?: string;
  };
  useCases?: string[];
};

export const products: Product[] = [
  {
    id: "iboothme-x",
    name: "IBOOTHME X",
    meta: "Premium | AI Technology",
    description:
      "An awesome vertical-screen AI photo booth built for social-first formats. Sleek, modern, and engineered for studio-quality results that amplify your brand activations.",
    image: "/iboothmex.jpg",
    tier: "Premium",
    tags: ["Vertical Screen","AI Photo Booth","Studio-Quality","Brand Activation"],
    slug: "ai-photo-booth",
    video: "https://youtu.be/Zimi28A13jg",
    specs: {
      dimensions: "H160cm x W60cm",
      power: "13 Amp 220V AC",
      capacity: "70-100+ guests per hour",
      technology: "AI Effects / Creative Results / Real-time processing",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    },
    useCases: ["Corporate Events","Product Launches","Brand Activations","Retail Experiences"]
  },
  {
    id: "glamdroid",
    name: "GlamDroid",
    meta: "Premium | Robotic Technology",
    description:
      "GlamDroid puts cinematic robotics in your guests' hands. With the freedom to select multiple camera moves, every shot is built to go viral while safety sensors keep it smooth and secure.",
    image: "/glamdroid.jpg",
    tier: "Premium",
    tags: ["Cinematic Robotics","Multiple Camera Moves","Safety Sensors","Viral Shots"],
    slug: "glamdroid-robotic-arm",
    video: "https://youtu.be/jfxTh0QykI4",
    specs: {
      dimensions: "H91cm x W70cm x Top 30.5cm",
      power: "13 Amp 220V AC",
      capacity: "50+ guests per hour",
      technology: "High-Speed Video Capture | Dynamic Cinematic Feel",
      support: "24/7 online / On-site",
      setup: "3-5 hours (power ready)"
    }
  },
  {
    id: "claw-machine",
    name: "Claw X",
    meta: "Premium | Interactive Gaming & Prize Distribution",
    description:
      "Claw Machine is built to pull a crowd. The iconic claw is re-engineered for brands where guests play, grab, and win while your products sit at the center of the action. Suspense, buzz, and instant shareability in one machine.",
    image: "/TheClaw.jpg",
    tier: "Premium",
    tags: ["Iconic Claw","Brandable Cabinet","High Engagement","Prize Distribution"],
    slug: "claw-machine",
    video: "https://youtu.be/rc8kHOgyfzI",
    specs: {
      dimensions: "H180cm x W76cm",
      power: "13 Amp 220V AC",
      capacity: "100+ guests per hour",
      technology: "Arcade claw system + digital integration",
      support: "24/7 online / On-site",
      setup: "1–2 hours"
    },
    useCases: ["Retail promotions","Sampling campaigns","Trade shows","High-traffic brand events"]
  },
  {
    id: "gumball-x",
    name: "Gumball X",
    meta: "Premium | Interactive & Brand Activation",
    description:
      "Gumball X turns the iconic gumball machine into a powerful brand activation tool. Guests twist to reveal prizes or rewards, creating suspense, shareability, and instant buzz with your product at the center.",
    image: "/images/gumball-x-purple.png",
    tier: "Premium",
    tags: ["Spin & Win","Reward Reveal","Buzz Creator"],
    slug: "gumball-machine-activation",
    video: "https://youtu.be/EdIOdHDaU68",
    specs: {
      dimensions: "[to be confirmed]",
      power: "13 Amp 220V AC",
      capacity: "100+ interactions per hour",
      technology: "Smart dispensing with gamified flow",
      support: "24/7 online / On-site",
      setup: "1–2 hours (power ready)"
    },
    useCases: ["Brand Activations","Product Launches","Interactive Campaigns","Retail Experiences"]
  },
  {
    id: "locker-x",
    name: "Locker X",
    meta: "Premium | Interactive Product Distribution",
    description:
      "Locker X turns prizes into a game. Guests scan, play, and unlock — with your products at the heart of the experience.",
    image: "/locker-x.jpg",
    tier: "Premium",
    tags: ["Scan-Play-Unlock","Interactive Engagement","Smart Distribution"],
    slug: "smart-prize-locker",
    video: "https://youtube.com/shorts/tFq9ZfcXNmE",
    specs: {
      dimensions: "H170cm x W60cm x D60cm",
      power: "13 Amp 220V AC",
      capacity: "100+ interactions per hour",
      technology: "Smart locking system with digital integration",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    },
    useCases: ["Product Launches","Educational Campaigns","Retail Promotions","Event Traffic Generation"]
  },
  {
    id: "vending-x",
    name: "Vending X",
    meta: "Premium | Vending & AI Integration",
    description:
      "Vending X is a smart vending machine built for activations. Fully brandable, stocked with your products, and powered by gamification to keep guests engaged while distributing your products.",
    image: "/vendingx.jpg",
    tier: "Premium",
    tags: ["Smart Vending","Brandable","Gamified","AI-Powered"],
    slug: "ai-vending-machine",
    video: "https://youtu.be/PUh6I3Y1Ya4",
    specs: {
      dimensions: "H170cm x W70cm x D70cm",
      power: "13 Amp 220V AC",
      capacity: "100+ interactions per hour",
      technology: "AI-powered vending with custom experiences",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    },
    useCases: ["Product Sampling","Brand Education Events","Retail Activations","Trade Show Engagement"]
  },
  {
    id: "arcade-x",
    name: "Arcade X",
    meta: "Premium | Gaming & Brand Engagement",
    description:
      "Arcade X fuses retro gaming with branded interaction. Guests play custom-designed games, unlock rewards, and walk away with experiences and prizes that reinforce your brand.",
    image: "/arcade-x.jpg",
    tier: "Premium",
    tags: ["Retro Gaming","Custom Games","Reward Unlocking"],
    slug: "arcade-vending-machine",
    video: "https://youtu.be/B8X5zcpfnO0",
    specs: {
      dimensions: "Front 70 x 185cmH | Back 70 x 195cmH | Side 69 x 182cmH | Top 70 x 29cmH",
      power: "13 Amp 220V AC",
      capacity: "100+ guests per hour",
      technology: "Arcade Games / Gift distribution / Recording while interacting",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    },
    useCases: ["Brand Awareness Campaigns","Product Launches","Trade Show Engagement","Retail Entertainment"]
  },
  {
    id: "slider-12",
    name: "120 Slider",
    meta: "Standard | Video Booth & Cinematic",
    description: "120 Slider brings smooth cinematic motion to your activations. Engineered for short-form content, it transforms every shot into scroll-stopping video with an AI touch. Compact, portable, and made for events where branded video is everything.",
    image: "/images/12-slider-purple.png",
    tier: "Standard",
    tags: ["Cinematic Motion","Portable","AI-Enhanced","Social-first"],
    slug: "120-slider",
    video: "https://youtu.be/M48azd5whPg",
    specs: {
      dimensions: "H70cm x W91cm x D30cm (slider not brandable, base can be wrapped)",
      power: "13 Amp 220V AC",
      capacity: "80+ interactions per hour",
      technology: "Cinematic video slider + AI effects",
      support: "24/7 online / On-site",
      setup: "1–2 hours"
    },
    useCases: ["Fashion events","Premium launches","Social-first campaigns","Brand storytelling clips"]
  },
  {
    id: "slider-180",
    name: "180 Photo Booth",
    meta: "Premium | Photo Booth & Dynamic",
    description: "iboothme 180 photo booth is a multi-camera photo booth that creates dynamic, shareable content. With its striking setup and synchronized cameras, it makes a big statement at any event — an experience your prospects can't miss.",
    image: "/images/180-slider-purple.png",
    tier: "Premium",
    tags: ["Multi-camera","Dynamic Content","Synchronized Cameras","Striking Setup"],
    slug: "180-degree-photo-booth",
    video: "https://youtu.be/iskenBYoPjk",
    specs: {
      dimensions: "Body H143cm x W70cm | Top H32cm x W190cm",
      power: "13 Amp 220V AC",
      capacity: "80+ interactions per hour",
      technology: "Slow-Motion Effects | 5-Camera or 11-Camera Setup",
      support: "24/7 online / On-site",
      setup: "2-3 hours (power ready)"
    },
    useCases: ["Fashion Events","Product Launches","Social Media Campaigns","Premium Brand Activations"]
  },
  {
    id: "booth-360",
    name: "360 Videobooth",
    meta: "Premium | Video Booth & 360°",
    description: "iBoothme 360 captures every angle with an automated rotating arm. Powered by AI, it delivers bold, cinematic videos with fully customizable effects and styles tailored to your brand.",
    image: "/images/360-purple.png",
    tier: "Premium",
    tags: ["Automated Arm","AI-Powered","Cinematic","Customizable Effects"],
    slug: "360-degree-video-booth",
    video: "https://youtu.be/dcNqPEgbm_0",
    specs: {
      dimensions: "H33cm x ⌀80cm",
      power: "13 Amp 220V AC",
      capacity: "100+ guests per hour",
      technology: "360° rotation platform with video capture",
      support: "24/7 online / On-site",
      setup: "1 hour (power ready)"
    },
    useCases: ["Social Media Campaigns","Influencer Events","Product Showcases","Entertainment Venues"]
  },
  {
    id: "catch-baton",
    name: "Catch The Baton",
    meta: "Standard | Interactive & Gaming",
    description: "Equipped with an interactive touchscreen, this unit engages guests with a reflex-testing game while capturing valuable data.",
    image: "/images/catch-baton-purple.png",
    tier: "Standard",
    tags: ["Interactive Touchscreen","Reflex Game","Data Capture"],
    slug: "catch-the-baton",
    video: "https://youtu.be/O8tdFXcLbhU",
    specs: {
      dimensions: "Top ⌀72.5cm x Body H192cm x W10cm",
      power: "13 Amp 220V AC",
      capacity: "100+ interactions per hour",
      technology: "Interactive gaming",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    },
    useCases: ["Gaming Events","Youth Activations","Interactive Campaigns","Entertainment Venues"]
  },
  {
    id: "gift-box",
    name: "Gift Box",
    meta: "Standard | Interactive & Surprise",
    description: "An iboothme invention designed for in-store activations and driving footfall. Guests receive a code through our photo booth units: correct unlocks a prize, wrong unlocks a discount. Either way, your brand wins the interaction.",
    image: "/GiftBox.jpg",
    tier: "Standard",
    tags: ["In-store Activation","Prize or Discount","Code Unlock"],
    slug: "interactive-prize-vault",
    video: "https://youtu.be/DFcO5sxTw0U",
    specs: {
      dimensions: "H42cm x W47cm x D28.6cm",
      power: "13 Amp 220V AC",
      capacity: "120+ guests per hour",
      technology: "Digital surprise reveal system",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    },
    useCases: ["Gift Campaigns","Surprise Activations","Compact Venues","High-Traffic Events"]
  },
  {
    id: "scribble-booth",
    name: "Scribble Booth",
    meta: "Premium | Interactive & Creative",
    description:
      "The Scribble Booth turns creativity into branded content. Guests draw, write, or leave messages on a glass screen while a hidden camera captures it live. The output: personalized videos that connect creativity with your brand.",
    image: "/Scriblebooth.jpg",
    tier: "Premium",
    tags: ["Creative Drawing","Live Capture","Personalized Video"],
    slug: "scribble-video-booth",
    video: "https://youtu.be/oEjVunPv6HI",
    specs: {
      dimensions: "H200cm x W100cm x D100cm",
      power: "13 Amp 220V AC",
      capacity: "100+ guests per hour",
      technology: "Interactive drawing and video processing",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    }
  },
  {
    id: "gobooth",
    name: "Goboothme X",
    meta: "Standard | Photo Booth & Portable",
    description: "Portable, professional, and AI-powered Goboothme X takes photo activations anywhere your audience is. With studio-quality results in a compact unit, it transforms any space into a branded content hub.",
    image: "/images/gobooth-purple.png",
    tier: "Standard",
    tags: ["Portable","AI-Powered","Studio-Quality","Compact","Roaming"],
    slug: "roaming-photo-booth",
    video: "https://youtu.be/fHKuVhofkxc",
    specs: {
      dimensions: "Portable compact design",
      power: "Battery or AC power",
      capacity: "100+ guests per hour",
      technology: "Background Removal photo | Professional Photographer quality",
      support: "24/7 online support / On-site support",
      setup: "1-2 hours with power ready on site"
    },
    useCases: ["Mobile Events","Outdoor Activations","Remote Locations","Flexible Venue Requirements"]
  },
  {
    id: "mega-vending",
    name: "Mega Vending",
    meta: "Premium | Vending & Interactive",
    description: "Mega Vending is a smart vending unit built for high-impact activations. Fully brandable and stocked with products or rewards, it engages crowds through gamification while seamlessly delivering your products.",
    image: "/images/mega-vending-purple.png",
    tier: "Premium",
    tags: ["High-Impact","Brandable","Gamified","Seamless Delivery"],
    slug: "mega-vending-machine",
    video: "https://youtu.be/QgNf4eVpZmo",
    specs: {
      dimensions: "[to be confirmed]",
      power: "13 Amp 220V AC",
      capacity: "100+ interactions per hour",
      technology: "AI-powered vending with gamification",
      support: "24/7 online / On-site",
      setup: "1–2 hours (power ready)"
    },
    useCases: ["Large Events","Trade Shows","Major Brand Activations","High-Volume Product Distribution"]
  },
  {
    id: "retro-x",
    name: "Retro X",
    meta: "Standard | Retro & Immersive",
    description: "Retro X blends the charm of old-school photo booths with modern AI. With striking LED lighting and a large touchscreen, it delivers a stylish, high-impact experience.",
    image: "/images/retro-x.jpg",
    tier: "Standard",
    tags: ["Old-school Charm","LED Lighting","Large Touchscreen","High Impact"],
    slug: "retro-photo-booth",
    video: "https://youtu.be/yFy-ffmNP6o",
    specs: {
      dimensions: "H180cm x W80cm x D80cm",
      power: "13 Amp 220V AC",
      capacity: "80+ guests per hour",
      technology: "AI photo processing with retro styling",
      support: "24/7 online / On-site",
      setup: "1-2 hours (power ready)"
    }
  },
];
