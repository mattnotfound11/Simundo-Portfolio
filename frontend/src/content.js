/* Jan Louis Simundo, site content (follows Simundo-Portfolio-Sitemap.pdf).
   Everything the site says lives here. Edit this file to update the portfolio.
   Leave a link empty ("") to hide it; the pages adjust. */
window.CONTENT = {
  person: {
    first: "Jan",
    name: "Jan Louis Simundo",
    role: "Developer",
    tagline: "Building things for the web.",
    initials: "JLS",
    // One photo used everywhere (hero avatar, About portrait, page shell).
    avatar: "assets/images/profile.jpg",
    portrait: "assets/images/profile.jpg",
  },

  // Preloader lines under the big name
  taglines: ["Developer", "Building things for the web."],

  links: {
    email: "simundojanlouis@gmail.com",
    github: "", // e.g. "https://github.com/your-username"
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-name"
    resume: "resume.pdf", // put the file at frontend/resume.pdf
  },

  /* ---------- 01 #about: bio and tech highlights ---------- */
  aboutCards: [
    { title: "Education", text: "BS Information Technology at the University of San Agustin (USA), from 1st to 3rd year." },
    { title: "Building", text: "Mind Bridge, a student mental health check-in and counselor booking site. Open it in Work." },
    { title: "Leadership", text: "3-C Holotech Representative since 2023 and CAS Officer since 2024." },
  ],
  mindset: {
    heading: "Mindset",
    text: "I like to understand the problem first, then build something clear and reliable.",
    closing: "Tech I work with: TypeScript, React and Next.js, Node.js, Supabase, Tailwind and Python.",
    stack: [
      { label: "TypeScript", icon: "typescript", tone: "linear-gradient(135deg,#0ea5e9,#0c4a6e)" },
      { label: "React / Next.js", icon: "react", tone: "linear-gradient(135deg,#38bdf8,#1e3a8a)" },
      { label: "Supabase", icon: "supabase", tone: "linear-gradient(135deg,#7dd3fc,#0369a1)" },
      { label: "Python", icon: "python", tone: "linear-gradient(135deg,#60a5fa,#1e40af)" },
    ],
  },
  craft: {
    heading: "Craft",
    text: "Building things for the web, from interface to database.",
    status: "Open to opportunities",
    closing: "Open to internships, freelance work and collaborations.",
    strips: [
      ["typescript", "react", "nextdotjs", "nodedotjs", "supabase", "tailwindcss", "python"],
      ["html5", "css", "javascript", "postgresql", "git", "github", "vercel", "figma"],
    ],
  },
  location: { city: "Iloilo City", country: "Philippines", coords: "10.7202° N, 122.5621° E", timezone: "GMT+8" },

  // Tech highlights (pill colours by kind, all shades of light blue)
  kindColor: { frontend: "#38bdf8", backend: "#93c5fd", tools: "#7dd3fc", language: "#bae6fd" },
  skillsTop: [
    { name: "TypeScript", kind: "language" },
    { name: "React", kind: "frontend" },
    { name: "Next.js", kind: "frontend" },
    { name: "Tailwind CSS", kind: "frontend" },
    { name: "HTML5", kind: "frontend" },
    { name: "CSS", kind: "frontend" },
    { name: "JavaScript", kind: "language" },
    { name: "Responsive design", kind: "frontend" },
  ],
  skillsBottom: [
    { name: "Node.js", kind: "backend" },
    { name: "Supabase", kind: "backend" },
    { name: "PostgreSQL", kind: "backend" },
    { name: "Python", kind: "language" },
    { name: "Git", kind: "tools" },
    { name: "GitHub", kind: "tools" },
    { name: "Vercel", kind: "tools" },
    { name: "Figma", kind: "tools" },
  ],
  globe: [
    { slug: "typescript", name: "TypeScript" },
    { slug: "react", name: "React" },
    { slug: "nextdotjs", name: "Next.js" },
    { slug: "nodedotjs", name: "Node.js" },
    { slug: "supabase", name: "Supabase" },
    { slug: "tailwindcss", name: "Tailwind" },
    { slug: "python", name: "Python" },
    { slug: "html5", name: "HTML5" },
    { slug: "css", name: "CSS" },
    { slug: "javascript", name: "JavaScript" },
    { slug: "postgresql", name: "PostgreSQL" },
    { slug: "git", name: "Git" },
    { slug: "github", name: "GitHub" },
    { slug: "vercel", name: "Vercel" },
    { slug: "vite", name: "Vite" },
    { slug: "npm", name: "npm" },
    { slug: "figma", name: "Figma" },
    { slug: "markdown", name: "Markdown" },
  ],

  /* ---------- 02 #experience ---------- */
  experience: [
    { title: "Representative", org: "3-C Holotech", badge: "3C", years: "2023 - 2026" },
    { title: "CAS Officer", org: "CAS", badge: "CAS", years: "2024 - 2026" },
  ],

  /* ---------- 03 #work: project case studies ---------- */
  projects: [
    {
      slug: "mind-bridge",
      n: "01",
      category: "Web app",
      title: "Mind Bridge",
      summary: "A private wellness check-in for University of San Agustin students: a short screening, crisis support and booking a campus guidance counselor.",
      tags: ["Web app", "Student wellbeing"],
      href: "https://mind-bridge-omega.vercel.app",
      image: "assets/media/mind-bridge.jpg?v=3",
      imageAlt: "Mind Bridge home page: Ask for help quietly, reach a counselor sooner, with the four steps from check-in to chat.",
      imagePosition: "top",
      tone: "linear-gradient(135deg,#7f1d1d,#450a0a)",
    },
  ],

  /* ---------- #multimedia: videos ----------
     "drive" is the Google Drive file ID (the part after /file/d/ in the share link).
     The file must be shared as "Anyone with the link: Viewer" to play here.
     "poster" is the still shown on the card (save it in assets/media/). */
  multimedia: [
    {
      title: "Sanag",
      category: "Multimedia",
      year: "2026",
      summary: "Filmed on campus at the University of San Agustin.",
      tags: [],
      drive: "1YkQ3lCEkzNpkV3_WT5TLaMwtvaAYp48N",
      poster: "assets/media/sanag-poster.jpg",
    },
    {
      title: "Mind Bridge Infographic",
      category: "Multimedia",
      year: "2026",
      summary: "One-page overview of the Mind Bridge student mental health monitoring system: problem, solution, methodology and timeline.",
      tags: [],
      file: "assets/media/infographics.pdf",
      poster: "assets/media/infographics-poster.jpg",
      posterPosition: "top",
    },
    {
      title: "The Farmer's Phone",
      category: "Multimedia",
      year: "2026",
      summary: "A presentation by Jan Louis Simundo, Kervin Sarmiento and Tim Gabriel Nuñal.",
      tags: [],
      file: "assets/media/farmers-phone.pdf",
      poster: "assets/media/farmers-phone-poster.jpg",
    },
  ],

  /* ---------- 05 #credentials ---------- */
  credentials: [
    {
      title: "Bachelor of Science in Information Technology (BSIT)",
      school: "University of San Agustin",
      detail: "1st to 3rd Year",
      years: "1st - 3rd Year",
      place: "Iloilo City, Philippines",
    },
    { title: "Senior High School", school: "Santa Barbara National Comprehensive High School", place: "Santa Barbara, Iloilo" },
    { title: "Junior High School", school: "Santa Barbara National Comprehensive High School", place: "Santa Barbara, Iloilo" },
  ],

  // The hero assistant answers from this list (first match wins).
  answers: [
    [/build|make|project|work|see|mind ?bridge/, "My featured project is Mind Bridge, a student wellness check-in site for USA. Open it from the Work section."],
    [/contact|email|reach|hire|talk|message/, "Email me at simundojanlouis@gmail.com, or use the Contact page."],
    [/skill|stack|know|tech|python|react|type|node|supabase|tailwind|language/, "I work with TypeScript, React and Next.js, Node.js, Supabase, Tailwind and Python."],
    [/video|multimedia|film|edit|sanag/, "Check the Multimedia section for my video work, like Sanag, filmed on campus at USA."],
    [/experience|holotech|cas|officer|representative|lead/, "I've been a 3-C Holotech Representative since 2023 and a CAS Officer since 2024."],
    [/school|study|stud|educ|univ|usa|course|degree|year|santa barbara/, "I'm a BS Information Technology student at the University of San Agustin. I finished junior and senior high at Santa Barbara National Comprehensive High School."],
    [/who|name|about|yourself|jan/, "I'm Jan Louis Simundo, a developer building things for the web."],
    [/hi|hello|hey|yo|sup/, "Hi! Ask me about my projects, my tech stack or how to contact me."],
  ],
  fallback: "Good question! I'm still adding answers here. Email me at simundojanlouis@gmail.com and I'll get back to you.",
};
