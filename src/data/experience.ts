export interface Project {
  name: string
  description?: string
}

export interface ExperienceCategory {
  id: number
  title: string
  role: string
  description: string
  projects: Project[]
  technologies: string[]
}

export const experienceCategories: ExperienceCategory[] = [
  {
    id: 1,
    title: "WEB DEVELOPMENT",
    role: "WEB DEVELOPER",
    description: "Focus on building responsive, production-ready websites and web applications. Frontend development, responsive interfaces, JavaScript applications, React-based interfaces, API integrations, interactive experiences, performance and responsive optimization.",
    projects: [
      { name: "CULTUR ALWAYS WINS", description: "Premium fashion / culture e-commerce experience built around Shopify, Liquid, custom storefront development and highly interactive product experiences." },
      { name: "DELLAH'S HAIR", description: "E-commerce / brand website focused on presenting products and services through a polished digital storefront." },
      { name: "KINGZCONNECT", description: "Personal technology portfolio and interactive 3D web experience." },
      { name: "CONSTANTFLOW PROCUREMENT", description: "Corporate procurement platform focused on connecting buyers with suppliers and creating a competitive procurement workflow." }
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Shopify", "Liquid"]
  },
  {
    id: 2,
    title: "E-COMMERCE",
    role: "WEB & E-COMMERCE DEVELOPER",
    description: "Experience building and customizing digital storefronts and content-driven websites.",
    projects: [
      { name: "CULTUR ALWAYS WINS", description: "Shopify development including custom Liquid sections, product experiences, collection pages, custom UI, product interactions, delivery estimation, restock experiences, custom order confirmation, SEO implementation, Shopify theme customization." },
      { name: "DELLAH'S HAIR", description: "E-commerce website development with emphasis on product presentation, conversion-focused layouts, responsive design, customer experience, CMS management." },
      { name: "WORDPRESS PROJECTS", description: "Experience working with WordPress, Elementor, Astra, SEO, schema and custom website implementations." }
    ],
    technologies: ["Shopify", "Liquid", "WordPress", "WooCommerce", "Elementor", "Astra", "JavaScript", "SEO", "Schema"]
  },
  {
    id: 3,
    title: "DIGITAL PRODUCTS",
    role: "PRODUCT DEVELOPER",
    description: "Experience developing digital products rather than simply static websites.",
    projects: [
      { name: "TASK2K", description: "A Nigerian product-research platform designed to help product teams gather feedback from qualified users and conduct remote studies. Work includes concepts around research workflows, study creation, screener questions, participant qualification, user responses, AI-assisted research participation, product research infrastructure." },
      { name: "CONSTANTFLOW PROCUREMENT", description: "A procurement platform designed around corporate buyers, suppliers and competitive procurement workflows. Work includes procurement interfaces, vendor experiences, RFQ workflows, product/fleet inventory, competitive bidding concepts, responsive dashboards, API-driven architecture." }
    ],
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "Firebase", "REST APIs"]
  },
  {
    id: 4,
    title: "MOBILE APPLICATIONS",
    role: "MOBILE APP DEVELOPER",
    description: "Experience extending digital products beyond the browser.",
    projects: [
      { name: "APEX", description: "Sports prediction application covering football, basketball and tennis. Work includes sports data integration, match prediction interfaces, prediction engine integration, fixtures, results, notifications, mobile UI, API integration." },
      { name: "AXON", description: "Trading-oriented mobile application focused on providing users with trading signals and automated/semi-automated workflows. Work includes React Native application development, API integration, Firebase, push notifications, FCM, Notifee, Android deployment, ad integration." }
    ],
    technologies: ["React Native", "Expo", "Firebase", "FCM", "Notifee", "Android"]
  },
  {
    id: 5,
    title: "DATA & INTELLIGENT SYSTEMS",
    role: "APPLICATION & DATA SYSTEMS DEVELOPER",
    description: "Experience working with applications that rely on external data, automation and intelligent processing.",
    projects: [
      { name: "APEX", description: "Sports prediction system using sports APIs and prediction-engine concepts to process match data and generate predictions. Work includes external API aggregation, sports data processing, prediction pipelines, Python services, statistical modelling, automated processing, backend workers, data-driven application logic." }
    ],
    technologies: ["Python", "APIs", "ARIMA", "Prophet", "LSTM", "Redis", "Celery"]
  },
  {
    id: 6,
    title: "PROCUREMENT TECHNOLOGY",
    role: "PRODUCT / WEB DEVELOPER",
    description: "A procurement technology platform focused on corporate procurement and supplier competition.",
    projects: [
      { name: "CONSTANTFLOW PROCUREMENT", description: "Experience with corporate procurement workflows, supplier/vendor interfaces, RFQ systems, vehicle/fleet procurement, competitive bidding, real-time interaction concepts, product inventory, procurement UX." }
    ],
    technologies: ["React", "TypeScript", "Vite", "Node.js", "APIs", "Real-time Systems"]
  },
  {
    id: 7,
    title: "INDEPENDENT PRODUCT BUILDING",
    role: "INDEPENDENT PRODUCT BUILDER",
    description: "Experimenting with and developing own digital product ideas. Focus on product development, web applications, mobile applications, marketplaces, AI-assisted products, automation, e-commerce.",
    projects: [
      { name: "TASK2K", description: "Product research and user-testing platform." },
      { name: "VEYRA", description: "Equipment rental marketplace concept connecting customers with equipment rental companies." },
      { name: "APEX", description: "Sports prediction platform." },
      { name: "AXON", description: "Trading-oriented mobile application." },
      { name: "CONSTANTFLOW PROCUREMENT", description: "Procurement technology platform." },
      { name: "KINGZCONNECT", description: "Personal interactive technology portfolio." }
    ],
    technologies: ["React", "React Native", "Node.js", "Firebase", "Shopify", "Next.js"]
  }
]

// Legacy export for backward compatibility
export const experiences = experienceCategories