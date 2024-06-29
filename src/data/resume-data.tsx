import {
  AmbitLogo,
  BarepapersLogo,
  BimLogo,
  CDGOLogo,
  ClevertechLogo,
  ConsultlyLogo,
  EvercastLogo,
  Howdy,
  JarockiMeLogo,
  JojoMobileLogo,
  Minimal,
  MobileVikingsLogo,
  MonitoLogo,
  NSNLogo,
  ParabolLogo,
  TastyCloudLogo,
  YearProgressLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "David Ceballos",
  initials: "DC",
  location: "Indio, California",
  locationLink: "https://www.google.com/maps/place/Indio,+CA/",
  about: "Sr. Frontend Engineer",
  aboutLong: "Sr. Frontend Engineer specializing in UI/UX and micro-animations",
  summary:
    "Frontend Engineer with UI/UX design expertise. Building scalable, high-performance applications for thousands of concurrent users. Skilled in organizing complex projects and crafting clean, maintainable code. Focused on optimizing web performance and creating engaging user experiences through animations and intuitive responsive/mobile-first interfaces.",
  avatarUrl:
    "https://utfs.io/f/9c90db2b-2ff9-4a4f-bc1b-c6d3a711620f-hz3ilt.jpg",
  personalWebsiteUrl: "https://github.com/dceballos1991",
  contact: {
    email: "dceballos1991@gmail.com",
    tel: "760-972-1272",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/dceballos1991",
        icon: GitHubIcon,
      },
      // {
      //   name: "LinkedIn",
      //   url: "https://www.linkedin.com/in/bjarocki/",
      //   icon: LinkedInIcon,
      // },
      // {
      //   name: "X",
      //   url: "https://x.com/BartoszJarocki",
      //   icon: XIcon,
      // },
    ],
  },
  education: [
    {
      school: "Cal Poly Pomona",
      degree: "B.S. Mechanical Engineering - Magna Cum Laude",
      start: "2010",
      end: "2014",
    },
  ],
  work: [
    {
      company: "Nifty Island",
      link: "https://www.niftyisland.com/",
      isRemote: true,
      badges: [
        "NextJs",
        "TypeScript",
        "React",
        "Jest",
        "ThreeJS",
        "R3F",
        "Web3",
        "Crypto",
        "TailwindCSS",
      ],
      title: "Sr. Frontend Engineer - UI/UX",
      logo: ConsultlyLogo,
      start: "2022",
      end: null,
      description:
        "Architected a UGC frontend flow and a performance-focused 3D inspector using ThreeJS and R3F. Implemented memoization and lazy loading techniques, achieving a 30% reduction in load times and significantly enhancing user experience. Led the development of a cross-project component library with comprehensive unit testing, reducing regressions and improving code quality. Bootstrapped an internal Admin panel dashboard, implementing crucial features like content moderation to streamline administrative tasks.",
    },
    {
      company: "Tugboat Holdings",
      link: "https://www.tugboatholdings.com/",
      isRemote: true,
      badges: [
        "TypeScript",
        "React",
        "Material UI",
        "Jest",
        "HotJar",
        "SPA",
        "Cypress",
        "End-to-End Testing",
      ],
      title: "Sr. Frontend Engineer",
      logo: ParabolLogo,
      start: "2020",
      end: "2022",
      description:
        "Spearheaded the frontend development of the company's first two product applications from inception to launch, including an internal SDK. Engineered a recursive component rendering engine enabling non-technical staff to drive multiple application experience flows via JSON files. Optimized UX through user behavior analysis using HotJar, resulting in a 9% increase in funnel conversion rates and reduced bottlenecks.",
    },
    {
      company: "ReadyLink Healthcare",
      link: "https://www.linkedin.com/company/readyrn/",
      isRemote: false,
      badges: [
        "React",
        "Material UI",
        "SPA",
        "Virtualization",
        "Jest",
        "Cypress",
        "Unit Testing",
        "Integration Testing",
        "End-to-End Testing",
      ],
      title: "Frontend Engineer",
      logo: ConsultlyLogo,
      start: "2019",
      end: "2020",
      description:
        "Built and maintained a React-based SPA with Material UI. Implemented virtualization techniques to optimize the scheduling page, efficiently rendering hundreds of DOM elements, which significantly improved user satisfaction and reduced load times. Maintained comprehensive testing coverage, including unit, integration, and end-to-end tests, ensuring high-quality, reliable code.",
    },
    {
      company: "Wilorco (Strike Technology)",
      link: "https://www.wilorco.com/",
      isRemote: false,
      badges: [
        "Python",
        "OpenCV",
        "Automation",
        "Document Processing",
        "Software Development",
      ],
      title: "Frontend Engineer",
      logo: ParabolLogo,
      start: "2016",
      end: "2020",
      description:
        "Proposed and developed innovative redlining software to automate the comparison and redlining process of documentation. Utilized Python and OpenCV for document analysis and processing. This initiative significantly increased productivity and reduced human error in document processing, streamlining workflows and improving accuracy.",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Three.js",
    "Performance Optimization",
    "UI/UX Design",
    "TailwindCSS",
    "State Management",
    "RESTful APIs",
    "GraphQL",
    "Jest",
    "Cypress",
    "End-to-End Testing",
    "Virtualization",
    "Single Page Applications (SPA)",
    "Responsive Design",
    "CSS",
    "Git",
    "Python",
    "Frontend Architecture",
    "Figma",
  ],
  projects: [
    {
      title: "PiP Anything",
      techStack: [
        "JavaScript",
        "Chrome Extension",
        "Service Workers",
        "Chrome APIs",
        "tabCapture",
      ],
      description:
        "Developed a Chrome extension that allows users to convert any tab into a picture-in-picture pop-out window, enhancing productivity. This ongoing project leverages JavaScript, service workers, and Chrome APIs like tabCapture to provide a seamless multitasking experience.",
      logo: ParabolLogo,
      link: undefined,
    },
    {
      title: "Can't Have It All",
      techStack: ["NextJs", "AI", "React", "State Management"],
      description:
        "Created an interactive web application using Next.js and OpenAI's API, featuring three switches where only two can be active simultaneously. Implemented query state management to enable easy sharing of results. The project demonstrates integration of AI technologies with modern web development practices.",
      logo: ParabolLogo,
      link: "https://canthaveitall.com",
    },
    {
      title: "PID Feedback Control System",
      techStack: ["Control Systems", "Arduino", "C++", "UI Design"],
      description:
        "Designed and built a PID feedback control system with a user interface that accurately controlled the voltage delivered to a DC motor. The system maintained a specified RPM across a range of unexpected motor loads, showcasing skills in control systems, embedded programming, and UI design.",
      logo: ParabolLogo,
      link: undefined,
    },
  ],
} as const;

export const RESUME_DATA_ME = {
  name: "David Ceballos",
  initials: "DC",
  location: "Indio, California, USA",
  locationLink: "https://www.google.com/maps/place/Indio,+CA/",
  about:
    "Detail-oriented mechanical engineer with software expertise, experienced in CAD, DFM, DFA, and automation.",
  summary:
    "Experienced Mechanical Engineer returning to the field with 5+ years in software development, enhancing my problem-solving and automation skills. My unique blend of mechanical and software expertise positions me to tackle complex engineering challenges with innovative solutions. Ready to leverage my diverse skill set to contribute effectively to impactful hardware projects.",
  avatarUrl:
    "https://utfs.io/f/9c90db2b-2ff9-4a4f-bc1b-c6d3a711620f-hz3ilt.jpg",
  personalWebsiteUrl: "https://github.com/dceballos1991",
  contact: {
    email: "dceballos1991@gmail.com",
    tel: "760-972-1272",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/dceballos1991",
        icon: GitHubIcon,
      },
      // {
      //   name: "LinkedIn",
      //   url: "https://www.linkedin.com/in/bjarocki/",
      //   icon: LinkedInIcon,
      // },
      // {
      //   name: "X",
      //   url: "https://x.com/BartoszJarocki",
      //   icon: XIcon,
      // },
    ],
  },
  education: [
    {
      school: "California State Polytechnic University, Pomona",
      degree: "B.S. / Mechanical Engineering- Magna Cum Laude",
      start: "2010",
      end: "2014",
    },
  ],
  work: {
    mechanical: [
      {
        company: "SacTec Solar",
        link: "https://www.sactecsolar.com/",
        badges: [],
        title: "Mechanical Engineer",
        logo: ConsultlyLogo,
        start: "2014",
        end: "2019",
        images: [
          "https://utfs.io/f/65f3fc53-34f4-4be8-8821-a9eeeb14358a-biv084.jpg",
          "https://utfs.io/f/b8c0e003-ec65-4e09-91b0-89e97f2bff3d-f1rsv7.png",
          "https://utfs.io/f/ea2adbf7-d94a-433c-a0fb-906b34f21e5d-rztncy.jpg",
        ],
        description:
          "Led R&D efforts for the design and manufacturing of an ISO-containerized and modular 20kW Mobile Solar Power system for commercial and military/government use. Modeled and managed multiple assemblies and sub-assemblies using SolidWorks; handled top assemblies of 2000+ components. Developed multiple test plans and procedure documentation including Validation and Verification (V&V), and safety guidelines such as Mobile solar deployment procedure and safety, and Energy data acquisition for testing",
      },
      {
        company: "Wilorco ",
        link: "https://www.wilorco.com/",
        badges: [],
        title: "Mechanical Engineer Contractor",
        logo: ParabolLogo,
        start: "2016",
        end: "2019",
        images: [
          "https://utfs.io/f/3a0b3eb2-21ff-42c1-b126-34f73bfa8e2f-rp6xiq.jpg",
          "https://utfs.io/f/2a3abe22-c0b1-47ef-9665-994924db0d2a-rp6xir.jpg",
        ],
        description:
          "Led the mechanical design efforts for the Lockheed Martin proposal to design an AC to DC Power Converter. In charge of creating and managing fabrication drawings for the Power Inverter subassembly on the Virginia Class Submarine Fire Control Systems (GDEB), where I maintained strict ECR/ECO documentation. Used GD&T and performed Tolerance stack-up analysis for complicated assemblies. Developed python program in order to automate comparison and redlining process documentation and created a simple graphical user interface (GUI). Automated the PCB conformal coating masking process by designing and rapid prototyping (FDM 3D printing) a PCB stencil cutting the conformal coating time by 80% and the total takt time by ~15%. In charge of updating legacy AutoCAD documentation of active programs and transitioning into new software (Solidworks)",
      },
    ],
    software: [
      {
        company: "Nifty Island",
        link: "https://www.niftyisland.com/",
        badges: ["Remote"],
        title: "Senior Fullstack Engineer",
        logo: ConsultlyLogo,
        start: "2022",
        end: null,
        description:
          "Architected a UGC (User Generated Content) frontend flow and performance-focused 3D inspector using ThreeJS and R3F; implemented memoization and lazy loading, reducing load times by 30%. Led development of a component library optimized for multiple projects, incorporating an extensive unit testing framework to reduce regressions and boost code quality.",
      },
      {
        company: "Tugboat Holdings",
        link: "https://tugboatholdings.com/",
        badges: ["Remote"],
        title: "Senior Frontend Developer",
        logo: ParabolLogo,
        start: "2020",
        end: "2022",
        description:
          "Wrote a recursive component rendering engine to drive multiple application experience flows via JSON files authored by non-technical individuals. Analyzed user behavior using HotJar and modified UX, increasing conversion rates by 9% and reducing bottlenecks. Built and maintained SPA with ReactJS and Material UI; maintained high testing coverage including unit, integration, and end-to-end tests.",
      },
    ],
  },
  skills: [
    "SolidWorks",
    "CATIA",
    "Matlab",
    "ANSYS",
    "COMSOL",
    "NI LabView",
    "Data Acquistion",
    "DFM, DFA, GD&T",
    "Tolerance Stack-up",
    "JavaScript",
    "TypeScript",
    "React/Next.js",
    "Node.js",
  ],
  projects: [
    {
      title: "Micro Turbine Senior Project",
      techStack: ["Data Acquistion", "Thermo Dynamics", "Safety", "Combustion"],
      description:
        "Developed and build a micro turbine in collaboration with 5 other Mechanical Engineers. I developed and built a two-stage model in MatLab applying the Brayton Cycle, and created a mathematical model for an absorption chiller for co-generation. I controlled the fuel delivery system using a logic controller correlated to downstream measurements in LabView, and designed combustion chamber components while developing safety documentation utilizing appropriate engineering empirical data and equations.",
      logo: ParabolLogo,
    },
    {
      title: "Feedback Control System for DC Motor",
      techStack: ["Control Systems", "Arduino", "C++", "Matlab"],
      description:
        "Designed and built a feedback control system for voltage control to a DC motor, maintaining specified RPM under varying loads. Created a UI for the system, allowing input of desired RPM and providing live RPM data and visual graphs of system response.",
      logo: EvercastLogo,
    },
  ],
} as const;
