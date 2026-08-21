export const SIGNBRIDGE_PROFILE = {
  brand: "SignBridge",
  tagline: "Bridging Ideas with Technology.",
  shortDescription: "SignBridge is a technology startup building intelligent software, AI-powered applications, web platforms, IoT systems and digital products that transform real-world problems into practical technology solutions.",
  overview: "SignBridge is an emerging technology and software-development startup focused on building modern digital products, intelligent software solutions, AI-powered applications, and emerging-technology systems.",
  vision: "SignBridge aims to become a technology company that develops intelligent, accessible and practical digital solutions by combining software engineering, AI, automation, IoT and emerging technologies.",
  
  pillars: [
    "SOFTWARE",
    "AI",
    "WEB",
    "CLOUD",
    "IoT",
    "AUTOMATION",
    "INNOVATION"
  ],

  coreFocus: [
    "Software Development",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "Automation",
    "IoT & Embedded Systems",
    "Cloud & Backend Development",
    "Digital Product Development",
    "Startup MVP Development"
  ],

  skillSets: [
    {
      category: "Web Development",
      icon: "globe",
      color: "#00f2fe",
      skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS", "Responsive Web Design", "UI/UX implementation", "Frontend development", "Node.js", "Express.js", "REST APIs"]
    },
    {
      category: "AI & Machine Learning",
      icon: "cpu",
      color: "#ff4d38",
      skills: ["Python", "Machine Learning", "TensorFlow", "Computer Vision", "MediaPipe", "Roboflow", "Edge AI", "TinyML", "AI model integration", "Real-time object/gesture recognition", "Data processing"]
    },
    {
      category: "Programming",
      icon: "code",
      color: "#8b5cf6",
      skills: ["C", "C++", "Python", "Java", "JavaScript"]
    },
    {
      category: "Backend & Cloud",
      icon: "cloud",
      color: "#3b82f6",
      skills: ["Firebase", "Firebase Authentication", "Firestore", "Firebase Realtime Database", "Node.js", "Express.js", "REST API development", "Cloud-connected applications"]
    },
    {
      category: "IoT & Embedded Systems",
      icon: "zap",
      color: "#10b981",
      skills: ["ESP32", "ESP8266", "Arduino", "Raspberry Pi", "Sensor integration", "Embedded programming", "IoT monitoring", "Edge computing", "Wireless communication", "Hardware–software integration"]
    },
    {
      category: "Data & Signal Processing",
      icon: "bar-chart",
      color: "#ec4899",
      skills: ["Data analysis", "Sensor-data processing", "Signal processing", "FFT", "Current-signal analysis", "Real-time data visualization", "Machine-learning feature extraction"]
    }
  ],

  technologiesMatrix: [
    { category: "Programming", techs: "C, C++, Python, Java, JavaScript" },
    { category: "Frontend", techs: "HTML, CSS, JavaScript, React, Tailwind" },
    { category: "Backend", techs: "Node.js, Express.js" },
    { category: "Database", techs: "Firebase, Firestore, Realtime Database" },
    { category: "AI/ML", techs: "TensorFlow, MediaPipe, Roboflow" },
    { category: "Computer Vision", techs: "OpenCV, MediaPipe" },
    { category: "IoT", techs: "ESP32, ESP8266, Arduino" },
    { category: "Embedded", techs: "Arduino IDE, C/C++" },
    { category: "Edge AI", techs: "TinyML, TensorFlow Lite" },
    { category: "Cloud", techs: "Firebase, Cloud APIs" },
    { category: "Development", techs: "Git, GitHub, APIs" }
  ],

  pipeline: [
    { step: "01", name: "Problem", desc: "Identify real-world bottleneck or market need" },
    { step: "02", name: "Research", desc: "Technical feasibility, stack & user study" },
    { step: "03", name: "Idea", desc: "Conceptual architectural solution design" },
    { step: "04", name: "Prototype", desc: "Rapid 3D/UI low-fidelity build" },
    { step: "05", name: "AI/Software Dev", desc: "Core ML training & full-stack development" },
    { step: "06", name: "Testing", desc: "Validation, edge benchmarking & QA" },
    { step: "07", name: "MVP", desc: "Deployable minimum viable product" },
    { step: "08", name: "Deployment", desc: "Cloud & edge infrastructure launch" }
  ],

  rdCapabilities: [
    {
      id: "shopcart",
      number: "01",
      domain: "Web & Commerce",
      title: "ShopCart — Student Tech Marketplace",
      tagline: "A friendly storefront for affordable everyday technology accessories",
      category: "E-commerce Product Design",
      year: "2026",
      color: "#2563eb",
      image: "/assets/art1.png",
      description: "ShopCart is a clean student-focused shopping experience for discovering tech accessories, comparing products, and adding essentials to a cart without unnecessary friction.",
      stats: { catalog: "Tech Accessories", audience: "Students", flow: "Browse to Cart" },
      tags: ["Product UI", "Responsive Web", "Shopping Cart", "Catalog Design", "E-commerce"]
    },
    {
      id: "indianoil-sales-hub",
      number: "02",
      domain: "Retail Operations",
      title: "IndianOil Lube Sales Manager Hub",
      tagline: "A focused dashboard for lubricant sales, reporting, and daily operations",
      category: "Business Dashboard & Data",
      year: "2026",
      color: "#ff6b00",
      image: "/assets/art1.png",
      description: "A dark operations dashboard for tracking lubricant sales, filtering records by date or product, reviewing tax totals, and exporting reports for business use.",
      stats: { records: "Date to Date", reporting: "Excel Export", focus: "Sales Register" },
      tags: ["Dashboard UI", "Data Tables", "Sales Reporting", "Filters", "Business Tools"]
    },
    {
      id: "iot-edge-ai",
      number: "03",
      domain: "IoT & Edge AI",
      title: "EcoClamp — Smart Motor-Monitoring System",
      tagline: "Non-invasive current-sensing telemetry with ESP32 & TinyML",
      category: "Embedded Systems & Edge ML",
      year: "2026",
      color: "#ff4d38",
      image: "/assets/art1.png",
      description: "EcoClamp is an intelligent motor-health monitoring system utilizing non-invasive current transducers, ESP32 microcontrollers, FFT signal analysis, and localized TinyML anomaly detection.",
      stats: { sensors: "Non-Invasive SCT", edgeML: "TinyML On-Device", processing: "FFT Real-Time" },
      tags: ["ESP32", "TinyML", "FFT Signal Processing", "Current Sensing", "Predictive Maintenance"]
    },
    {
      id: "aerospace-tech",
      number: "04",
      domain: "Aerospace Technology",
      title: "Autonomous Space-Debris & Satellite Protection",
      tagline: "Companion spacecraft sensor-fusion & orbital tracking architecture",
      category: "Aerospace & AI Tracking",
      year: "2026",
      color: "#10b981",
      image: "/assets/art1.png",
      description: "Next-generation R&D concept for autonomous satellite protection and orbital debris monitoring using optical sensor fusion, trajectory prediction algorithms, and companion spacecraft hardware architecture.",
      stats: { tracking: "Multi-Object", fusion: "Sensor Fusion", compute: "Edge Orbital" },
      tags: ["Sensor Fusion", "AI Tracking", "Orbital Kinematics", "Companion Satellites"]
    }
  ]
};

export const PROJECTS_DATA = SIGNBRIDGE_PROFILE.rdCapabilities;

export const FOUNDER_DATA = {
  name: "Surya V M",
  title: "Founder & Lead Product Designer",
  company: "SIGNBRIDGE",
  headlineMain: "Products that feel",
  headlineObvious: "obvious.",
  headlineSub: "Design that",
  headlineIsnt: "isn't.",
  bio: "Founding lead designing digital products end-to-end — intelligent software, AI applications, web platforms, and IoT systems.",
  photo: "/assets/founder.jpg",
  team: [
    {
      id: 1,
      name: "Surya V M",
      role: "Founder & Lead Product Designer",
      badge: "FOUNDER",
      image: "/assets/founder.jpg",
      bio: "Founding lead designing digital products end-to-end — spatial software, UX strategy, and WebGL experiences."
    },
    {
      id: 2,
      name: "Sowbigasri S",
      role: "UI/UX Designer",
      badge: "DESIGN",
      image: "/assets/uiux_designer.jpg",
      bio: "Crafting intuitive user interfaces, visual design systems, and seamless digital product interactions."
    },
    {
      id: 3,
      name: "Laksana S",
      role: "Database Engineer",
      badge: "DATA SYSTEMS",
      image: "/assets/db_engineer.jpg",
      bio: "Architecting high-performance database schemas, data telemetry pipelines, and spatial query engines."
    },
    {
      id: 4,
      name: "Kamalesh S",
      role: "Software Developer",
      badge: "ENGINEERING",
      image: "/assets/kamalesh.jpg",
      bio: "Full-stack software developer building scalable backend APIs, web applications, and interactive frontends."
    }
  ],
  stats: [
    { value: "10+", label: "Core Tech Disciplines", icon: "target", color: "#ff4d38" },
    { value: "4+", label: "Key R&D Domains", icon: "flask", color: "#00f2fe" },
    { value: "8-Step", label: "Dev Lifecycle Pipeline", icon: "repeat", color: "#8b5cf6" },
    { value: "100%", label: "Client & MVP Execution", icon: "star", color: "#10b981" }
  ]
};

