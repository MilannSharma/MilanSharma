
import { Skill, Project, CertificationCategory, LifeStyle, ResumeSection } from './types';

export const PERSONAL_INFO = {
  name: "Milan Sharma",
  role: "Python Developer & Data Engineer 🚀",
  location: "Pune, India",
  email: "milansharma942105@gmail.com",
  phone: "7378339012",
  github: "MilannSharma",
  linkedin: "milansharma01",
  avatar: "/1769519621500.png",
  resumeLink: "https://github.com/MilannSharma/Milan_Sharma_Portfolio/releases/download/pdf/Milan-Sharma.pdf" 
};

export const RESUME_DATA: ResumeSection[] = [
  {
    title: "Primary Roles",
    icon: "Briefcase",
    items: [
      {
        title: "Data Engineer",
        subtitle: "Data Engineer",
        dateRange: "Current",
        isRemote: true,
        isCurrent: true,
        bullets: [
          "Design and manage data pipelines",
          "ETL process development",
          "Database optimization",
          "Data warehousing solutions"
        ]
      },
      {
        title: "Python Developer",
        subtitle: "Python Developer",
        dateRange: "Current",
        isRemote: true,
        isCurrent: true,
        bullets: [
          "Backend API development with FastAPI and Flask",
          "Automation scripts and CLI tools",
          "Code optimization and refactoring",
          "Testing and debugging"
        ]
      },
      {
        title: "Data Analyst",
        subtitle: "Data Analyst",
        dateRange: "Current",
        isRemote: true,
        isCurrent: true,
        bullets: [
          "Exploratory Data Analysis (EDA)",
          "Statistical analysis and visualization",
          "Business intelligence and reporting",
          "Data-driven insights and recommendations"
        ]
      }
    ]
  },
  {
    title: "Education",
    icon: "GraduationCap",
    items: [
      {
        title: "Global Institute Of Technology Jaipur",
        subtitle: "B-Tech",
        location: "Jaipur, Rajasthan, India",
        dateRange: "2023 — 2026",
        bullets: [
          "Pursuing Bachelor of Technology degree",
          "Focus on Computer Science and Engineering",
          "Relevant Coursework: Data Structures, Algorithms, Database Management, Web Development, Software Engineering"
        ]
      },
      {
        title: "VP College Of Science Pune",
        subtitle: "12th Grade",
        location: "Pune, Maharashtra, India",
        dateRange: "2020 — 2021",
        bullets: [
          "Completed Senior Secondary Education",
          "Stream: Science"
        ]
      },
      {
        title: "Sharda Niketan English Medium School Pune",
        subtitle: "10th Grade",
        location: "Pune, Maharashtra, India",
        dateRange: "2018 — 2019",
        bullets: [
          "Completed Secondary Education"
        ]
      }
    ]
  },
  {
    title: "Freelance Services",
    icon: "PenTool",
    items: [
      {
        title: "UI/UX Design",
        subtitle: "UI/UX Design",
        dateRange: "Available",
        isRemote: true,
        bullets: [
          "User interface design",
          "User experience optimization"
        ]
      },
      {
        title: "Frontend Development",
        subtitle: "Frontend Development",
        dateRange: "Available",
        isRemote: true,
        bullets: [
          "Modern web technologies",
          "Responsive design"
        ]
      },
      {
        title: "Video Editing",
        subtitle: "Video Editing",
        dateRange: "Available",
        isRemote: true,
        bullets: [
          "Professional video editing",
          "Content creation"
        ]
      },
      {
        title: "SEO Optimization",
        subtitle: "SEO Optimization",
        dateRange: "Available",
        isRemote: true,
        bullets: [
          "Search engine optimization",
          "Digital marketing"
        ]
      },
      {
        title: "Web Store Creation",
        subtitle: "Web Store Creation",
        dateRange: "Available",
        isRemote: true,
        bullets: [
          "E-commerce platform development",
          "Payment gateway integration"
        ]
      }
    ]
  }
];

export const SKILLS: Skill[] = [
  {
    title: "Python Development",
    items: ["Core Python", "OOP", "Modules & Packages", "Exception Handling", "File Handling & OS Operations", "Automation Scripts", "CLI Tools"]
  },
  {
    title: "Backend & API Development",
    items: ["FastAPI", "Flask", "RESTful API Design", "API Auth", "Request Validation", "Waitress Server", "API Testing"]
  },
  {
    title: "Data Engineering",
    items: ["ETL Pipelines", "Data Ingestion", "Data Parsing", "Schema Design", "Data Quality", "Workflow Automation"]
  },
  {
    title: "Data Analysis",
    items: ["EDA", "Data Wrangling", "Feature Engineering", "Statistical Analysis", "Business Insights", "Data Validation"]
  },
  {
    title: "Data Visualization",
    items: ["Matplotlib", "Seaborn", "Analytical Dashboards", "Pattern Analysis", "Report Visuals"]
  },
  {
    title: "Machine Learning",
    items: ["Scikit-Learn", "Regression", "Classification", "Clustering", "Evaluation Metrics", "Feature Scaling"]
  },
  {
    title: "Databases & SQL",
    items: ["SQL (Advanced)", "MySQL", "SQLite", "Window Functions", "Query Optimization", "Transaction Handling"]
  },
  {
    title: "ERP & Enterprise Systems",
    items: ["Oracle Fusion ERP", "P2P & O2C Workflows", "Inventory Mgt", "Transaction Processing", "Master Data Mgt"]
  },
  {
    title: "Software Engineering",
    items: ["Git & GitHub", "Modular Architecture", "Code Optimization", "Clean Code", "Debugging & Testing"]
  },
  {
    title: "Tools & Platforms",
    items: ["Jupyter Notebook", "VS Code", "API Testing Tools", "Automation Utilities"]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "streamfusion",
    name: "StreamFusion",
    description: "A powerful stream data processing and fusion system",
    glowColor: "rgba(120, 60, 40, 0.6)",
    link: "https://github.com/MilannSharma/StreamFusion"
  },
  {
    id: "farmhelp",
    name: "FarmHelp",
    description: "Smart farming assistance application with web and mobile support",
    glowColor: "rgba(20, 100, 60, 0.6)",
    link: "https://github.com/MilannSharma/FarmHelp"
  },
  {
    id: "jarvis",
    name: "Jarvis Assistant",
    description: "Intelligent voice assistant built with Python",
    glowColor: "rgba(60, 30, 90, 0.6)",
    link: "https://github.com/MilannSharma/Jarvis"
  },
  {
    id: "locksy",
    name: "LockSy",
    description: "Secure lock management system",
    glowColor: "rgba(120, 30, 30, 0.6)",
    link: "https://github.com/MilannSharma/LockSy"
  },
  {
    id: "netflix",
    name: "Netflix Recommendation System",
    description: "Advanced recommendation engine using machine learning",
    glowColor: "rgba(120, 80, 20, 0.6)",
    link: "https://github.com/MilannSharma/Netflix-RS"
  },
  {
    id: "nexa",
    name: "NEXA AI",
    description: "AI-powered dashboard and analytics platform",
    glowColor: "rgba(20, 80, 80, 0.6)",
    link: "https://github.com/MilannSharma/NEXA-AI"
  },
  {
    id: "insightflow",
    name: "InsightFlow",
    description: "Data insights and analytics workflow automation",
    glowColor: "rgba(20, 60, 120, 0.6)",
    link: "https://github.com/MilannSharma/InsightFlow"
  }
];

export const CERTIFICATIONS: CertificationCategory[] = [
  {
    category: "AI & Machine Learning",
    items: [
      { title: "Applied Artificial Intelligence - Learn, Build and Create an AI Agent 2025-26", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "PLAN-EC2A0C27B7E2" },
      { title: "Neural Networks and Deep Learning", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3955167" },
      { title: "Machine Learning", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3955165" },
      { title: "Exploring Artificial Intelligence", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3825247" }
    ]
  },
  {
    category: "Programming Languages",
    items: [
      { title: "15 Days Online Summer Training and Internship Program 2023 - Java Core", provider: "Learn and Build (LnB)", date: "07 Aug 2023", id: "IN23PM1124689610" }
    ]
  },
  {
    category: "Data Science",
    items: [
      { title: "AI and Data Scientist", provider: "OneRoadmap", date: "12 Sep 2025", id: "CERT-184EA4EE" },
      { title: "Data Science with Machine Learning & AI", provider: "Upflairs Pvt. Ltd.", date: "31 Jul 2025", id: "UF/0625/6362" },
      { title: "Data Analyst", provider: "OneRoadmap", date: "12 Sep 2025", id: "CERT-34EC3A32" },
      { title: "Exploring Data", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3825245" }
    ]
  },
  {
    category: "Database",
    items: [
      { title: "SQL", provider: "OneRoadmap", date: "12 Sep 2025", id: "CERT-84B925D" }
    ]
  },
  {
    category: "Professional Development",
    items: [
      { title: "IBM SkillsBuild Presents: Tips for Career Planning", provider: "IBM SkillsBuild", date: "15 Dec 2025", id: "URL-EE533F89DE36" }
    ]
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      { title: "Exploring Cloud Computing", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3825249" }
    ]
  },
  {
    category: "Security",
    items: [
      { title: "Exploring Cybersecurity", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3825251" }
    ]
  },
  {
    category: "Advanced Computing",
    items: [
      { title: "Exploring Quantum Computing", provider: "IBM SkillsBuild", date: "16 Dec 2025", id: "ALM-COURSE_3825253" }
    ]
  }
];

export const LIFESTYLE: LifeStyle[] = [
  {
    title: "Open Source Contributor",
    description: "Actively contributing to GitHub projects in Python development, Data Science, and Backend APIs to advance the tech community.",
    icon: "Github"
  },
  {
    title: "Problem Solver",
    description: "Dedicated to solving real-world problems through innovative solutions in data engineering and backend development.",
    icon: "Lightbulb"
  },
  {
    title: "Continuous Learner",
    description: "Committed to staying updated with the latest technologies and best practices in Python, Data Science, and System Design.",
    icon: "BookOpen"
  },
  {
    title: "Tech Enthusiast",
    description: "Passionate about exploring emerging technologies and their applications in building scalable, high-performance systems.",
    icon: "Monitor"
  }
];

export const PRELOADED_ICONS = [
  { name: "LinkedIn", slug: "linkedin", color: "#0A66C2" },
  { name: "Instagram", slug: "instagram", color: "#E4405F" },
  { name: "Facebook", slug: "facebook", color: "#1877F2" },
  { name: "Google Drive", slug: "googledrive", color: "#4285F4" },
  { name: "YouTube", slug: "youtube", color: "#FF0000" },
  { name: "GitHub", slug: "github", color: "#181717" },
  { name: "WhatsApp", slug: "whatsapp", color: "#25D366" },
  { name: "Twitter / X", slug: "x", color: "#000000" },
  { name: "Gmail", slug: "gmail", color: "#EA4335" },
  { name: "Discord", slug: "discord", color: "#5865F2" },
  { name: "Slack", slug: "slack", color: "#4A154B" },
  { name: "Telegram", slug: "telegram", color: "#26A5E4" },
  { name: "Figma", slug: "figma", color: "#F24E1E" },
  { name: "Medium", slug: "medium", color: "#000000" },
  { name: "Reddit", slug: "reddit", color: "#FF4500" },
  { name: "Spotify", slug: "spotify", color: "#1DB954" },
  { name: "Pinterest", slug: "pinterest", color: "#BD081C" },
  { name: "TikTok", slug: "tiktok", color: "#000000" },
  { name: "Stack Overflow", slug: "stackoverflow", color: "#F48024" },
  { name: "Notion", slug: "notion", color: "#000000" },
  { name: "Trello", slug: "trello", color: "#0079BF" },
  { name: "Zoom", slug: "zoom", color: "#2D8CFF" },
  { name: "Microsoft Teams", slug: "microsoftteams", color: "#6264A7" },
  { name: "Skype", slug: "skype", color: "#00AFF0" },
  { name: "Twitch", slug: "twitch", color: "#9146FF" },
  { name: "Dribbble", slug: "dribbble", color: "#EA4C89" },
  { name: "Behance", slug: "behance", color: "#1769FF" },
  { name: "Steam", slug: "steam", color: "#000000" },
  { name: "Epic Games", slug: "epicgames", color: "#313131" },
  { name: "Google Cloud", slug: "googlecloud", color: "#4285F4" },
  { name: "AWS", slug: "amazonwebservices", color: "#FF9900" },
  { name: "Microsoft Azure", slug: "microsoftazure", color: "#0089D6" },
  { name: "Docker", slug: "docker", color: "#2496ED" },
  { name: "Kubernetes", slug: "kubernetes", color: "#326CE5" },
  { name: "OpenAI", slug: "openai", color: "#412991" },
  { name: "Google Gemini", slug: "google", color: "#4285F4" },
  { name: "Python", slug: "python", color: "#3776AB" },
  { name: "JavaScript", slug: "javascript", color: "#F7DF1E" },
  { name: "TypeScript", slug: "typescript", color: "#3178C6" },
  { name: "React", slug: "react", color: "#61DAFB" },
  { name: "Vue.js", slug: "vuedotjs", color: "#4FC08D" },
  { name: "Angular", slug: "angular", color: "#DD0031" },
  { name: "Node.js", slug: "nodedotjs", color: "#339933" },
  { name: "PostgreSQL", slug: "postgresql", color: "#4169E1" },
  { name: "MongoDB", slug: "mongodb", color: "#47A248" },
  { name: "Vercel", slug: "vercel", color: "#000000" },
  { name: "Netlify", slug: "netlify", color: "#00C853" },
  { name: "Heroku", slug: "heroku", color: "#430098" },
  { name: "Git", slug: "git", color: "#F05032" },
  { name: "NPM", slug: "npm", color: "#CB3837" },
  { name: "Stripe", slug: "stripe", color: "#008CDD" },
  { name: "PayPal", slug: "paypal", color: "#003087" },
  { name: "Airbnb", slug: "airbnb", color: "#FF5A5F" },
  { name: "Product Hunt", slug: "producthunt", color: "#DA552F" },
  { name: "StackShare", slug: "stackshare", color: "#06B5ED" }
];
