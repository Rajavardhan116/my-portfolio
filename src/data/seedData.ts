import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: 'Raja Vardhan Reddy',
    fullName: 'Iragam Reddy Raja Vardhan Reddy',
    headline: 'Aspiring Data Analyst | Healthcare Data & Analytics | AI & Data Science Undergraduate',
    subheadline: 'Translating complex clinical workflows and operational datasets into decision-ready executive dashboards, OLAP cubes, and predictive healthcare models.',
    bio: 'AI & Data Science undergraduate at Dhanalakshmi Srinivasan University with a dedicated concentration on Data Analytics, Healthcare Analytics, and Business Intelligence. Experienced in building end-to-end analytical pipelines with Python, SQL, Power BI, Excel, and OLAP multidimensional data modeling to solve clinical and business intelligence challenges.',
    email: 'iragamreddyrajavardhanreddy@gmail.com',
    phone: '+91 9346617316',
    location: 'Kadapa, Andhra Pradesh, India',
    linkedinUrl: 'https://www.linkedin.com/in/raja-vardhan-86a889376/',
    githubUrl: 'https://github.com/Rajavardhan116',
    profilePhotoUrl: '',
    heroPrimaryCtaText: 'Explore Projects',
    heroSecondaryCtaText: 'Download Resume',
    statusText: 'Open to Data Analyst & Healthcare Analytics Internships / Roles',
    yearsOfStudy: '2023 - 2027'
  },
  about: {
    summary: 'Iragam Reddy Raja Vardhan Reddy is an AI & Data Science undergraduate focused on bridging raw clinical & operational data with actionable physician-facing reports and business intelligence.',
    highlights: [
      'Core focus on Healthcare Data & Analytics, Physician Workflow Reporting, and Patient Experience Dashboards.',
      'Proficient in multidimensional OLAP modeling, KPI discovery, exploratory data analysis (EDA), and automated reporting.',
      'Hands-on with modern analytics stack: Python (Pandas/NumPy), SQL databases, Microsoft Power BI, and advanced Excel modeling.',
      'Completed Virtual Internship with Deloitte focused on enterprise data analytics simulation.'
    ],
    focusAreas: [
      {
        title: 'Healthcare Data & Analytics',
        description: 'Analyzing clinical metrics, patient experience feedback, and physician workload parameters to surface high-priority care delivery trends.',
        icon: 'Activity'
      },
      {
        title: 'Multidimensional OLAP & BI',
        description: 'Architecting OLAP cubes, time-series slice-and-dice queries, and interactive Power BI dashboards with drill-downs and dynamic slicers.',
        icon: 'Layers'
      },
      {
        title: 'Statistical EDA & Cleaning',
        description: 'Rigorous data wrangling, missing data imputation, outlier detection, and statistical hypothesis validation using Python and SQL.',
        icon: 'BarChart3'
      },
      {
        title: 'Business & Physician Reporting',
        description: 'Translating dense tabular records into crisp, executive-ready KPI scorecards and automated recurring report workflows.',
        icon: 'FileSpreadsheet'
      }
    ],
    quickStats: [
      { label: 'CGPA', value: '8.5 / 10', sublabel: 'DSU B.Tech AI & Data Science' },
      { label: 'Certifications', value: '5+', sublabel: 'Google, Cisco, Coursera, FSP' },
      { label: 'Core Tools', value: 'Power BI · SQL', sublabel: 'Python · Excel · OLAP' },
      { label: 'Focus Sector', value: 'Healthcare', sublabel: 'Clinical & BI Dashboards' }
    ]
  },
  skills: [
    // Programming
    { id: 'sk-prog-1', name: 'Python', category: 'programming', level: 'Proficient', order: 1, source: 'resume' },
    { id: 'sk-prog-2', name: 'SQL', category: 'programming', level: 'Proficient', order: 2, source: 'resume' },
    { id: 'sk-prog-3', name: 'Java', category: 'programming', level: 'Intermediate', order: 3, source: 'resume' },
    { id: 'sk-prog-4', name: 'C', category: 'programming', level: 'Intermediate', order: 4, source: 'resume' },

    // Data & Analytics
    { id: 'sk-ana-1', name: 'Data Cleaning', category: 'analytics', level: 'Proficient', order: 5, source: 'resume' },
    { id: 'sk-ana-2', name: 'EDA (Exploratory Data Analysis)', category: 'analytics', level: 'Proficient', order: 6, source: 'resume' },
    { id: 'sk-ana-3', name: 'Statistics', category: 'analytics', level: 'Intermediate', order: 7, source: 'resume' },
    { id: 'sk-ana-4', name: 'OLAP (Online Analytical Processing)', category: 'analytics', level: 'Proficient', order: 8, source: 'resume' },
    { id: 'sk-ana-5', name: 'Data Visualization', category: 'analytics', level: 'Proficient', order: 9, source: 'resume' },
    { id: 'sk-ana-6', name: 'KPI Reporting', category: 'analytics', level: 'Proficient', order: 10, source: 'resume' },
    { id: 'sk-ana-7', name: 'Trend Analysis', category: 'analytics', level: 'Proficient', order: 11, source: 'resume' },

    // BI & Tools
    { id: 'sk-tool-1', name: 'Power BI', category: 'tools', level: 'Proficient', order: 12, source: 'resume' },
    { id: 'sk-tool-2', name: 'Excel (Advanced)', category: 'tools', level: 'Proficient', order: 13, source: 'resume' },
    { id: 'sk-tool-3', name: 'Git', category: 'tools', level: 'Intermediate', order: 14, source: 'resume' },
    { id: 'sk-tool-4', name: 'GitHub', category: 'tools', level: 'Intermediate', order: 15, source: 'resume' },
    { id: 'sk-tool-5', name: 'VS Code', category: 'tools', level: 'Proficient', order: 16, source: 'resume' },

    // Domain
    { id: 'sk-dom-1', name: 'Healthcare Data & Analytics', category: 'domain', level: 'Specialization', order: 17, source: 'resume' },
    { id: 'sk-dom-2', name: 'Physician Workflow Reporting', category: 'domain', level: 'Specialization', order: 18, source: 'resume' },
    { id: 'sk-dom-3', name: 'Patient Experience Dashboards', category: 'domain', level: 'Specialization', order: 19, source: 'resume' },

    // Currently Building
    { id: 'sk-bld-1', name: 'Machine Learning / scikit-learn', category: 'building', level: 'In Progress', order: 20, source: 'resume' },
    { id: 'sk-bld-2', name: 'AWS & Azure Cloud Fundamentals', category: 'building', level: 'In Progress', order: 21, source: 'resume' },
    { id: 'sk-bld-3', name: 'HTML / CSS', category: 'building', level: 'In Progress', order: 22, source: 'resume' }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Data Analytics Intern',
      company: 'Deloitte',
      companyLocation: 'Virtual Internship',
      period: 'Virtual Internship Program',
      type: 'Virtual Internship',
      description: 'Engaged in a simulated corporate data analytics consulting engagement, executing data wrangling, KPI identification, dashboard synthesis, and client-facing analytical presentations.',
      bulletPoints: [
        'Analyzed business and organizational datasets to uncover operational patterns and actionable growth opportunities.',
        'Structured analytical workflows for executive stakeholders with clear visual storytelling.',
        'Synthesized data findings into structured insights to drive evidence-based business recommendations.'
      ],
      skills: ['Data Analytics', 'Business Intelligence', 'Data Wrangling', 'Executive Presentation', 'EDA'],
      order: 1,
      status: 'published',
      source: 'resume'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Weather Analytics Dashboard (OLAP)',
      shortDescription: 'Interactive multidimensional OLAP analytics platform analyzing historical weather patterns and environmental metrics across time, geography, and atmospheric variables.',
      fullDescription: 'A comprehensive analytical dashboard built to demonstrate Online Analytical Processing (OLAP) capabilities on multi-variate meteorological datasets. Users can execute multidimensional slicing, dicing, roll-up, and drill-down across temporal dimensions (year, month, day), regional locations, and climate attributes like temperature, pressure, precipitation, and humidity.',
      problemStatement: 'Atmospheric and climate datasets contain millions of time-series observations across multiple geographic coordinate points, making conventional flat relational queries slow and ineffective for interactive exploration.',
      features: [
        'Multidimensional OLAP cube slicing across temporal, geographic, and climatic dimensions.',
        'Fast aggregation queries powered by structured SQL indexing and denormalized OLAP schema.',
        'Interactive data visualization frontend delivering responsive trend exploration.',
        'Extreme weather anomaly detection and comparative period-over-period variance metrics.'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'SQL', 'OLAP'],
      screenshots: [
        'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1200&auto=format&fit=crop'
      ],
      challenges: 'Optimizing SQL aggregations over millions of records to maintain sub-second response times during real-time OLAP drill-down queries.',
      results: 'Delivered an intuitive interactive analytics tool allowing researchers to analyze 5+ weather parameters simultaneously with instant multidimensional filtering.',
      githubUrl: 'https://github.com/Rajavardhan116',
      liveDemoUrl: '',
      featured: true,
      order: 1,
      status: 'published',
      source: 'resume',
      createdAt: '2024-05-10',
      updatedAt: '2024-11-15'
    },
    {
      id: 'proj-2',
      title: 'Sales Performance Dashboard',
      shortDescription: 'Executive Power BI & Excel BI suite featuring KPI discovery, automated recurring reports, dynamic slicers, and multi-tier drill-down insights.',
      fullDescription: 'An enterprise sales performance analytics suite developed utilizing Microsoft Power BI and advanced Excel modeling. Combines automated data transformation pipelines, dynamic multi-attribute slicers, and granular drill-down hierarchies (Region -> Territory -> Account Representative -> Product SKU) to empower business leaders with immediate decision-ready visibility.',
      problemStatement: 'Sales leadership struggled with delayed, manual spreadsheet aggregation, inconsistent regional revenue reporting, and lack of visibility into representative quota pacing.',
      features: [
        'Executive KPI scorecard highlighting Net Revenue, Gross Margin, Quota Attainment, and MoM Growth.',
        'Dynamic interactive slicers for territory, product category, and customer tier filtering.',
        'Multi-level drill-down reports allowing exploration from global performance down to individual customer transactions.',
        'Automated recurring reporting pipeline reducing manual data compilation cycles.',
        'Data-driven insights surfacing high-margin cross-sell opportunities.'
      ],
      technologies: ['Power BI', 'Excel', 'KPI Reporting', 'DAX', 'Data Modeling'],
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
      ],
      challenges: 'Establishing robust data relationships and DAX time-intelligence formulas to accurately compute Year-over-Year variance without manual report recalculation.',
      results: 'Standardized KPI metrics across regional operations, providing single-pane-of-glass executive visibility and automated reporting.',
      githubUrl: 'https://github.com/Rajavardhan116',
      liveDemoUrl: '',
      featured: true,
      order: 2,
      status: 'published',
      source: 'resume',
      createdAt: '2024-07-20',
      updatedAt: '2024-12-02'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Google Data Analytics Professional Certificate',
      issuer: 'Coursera (Google)',
      issueDate: '2024',
      credentialUrl: 'https://www.coursera.org',
      description: 'Comprehensive 8-course professional certification covering the entire data analysis lifecycle: ask, prepare, process, analyze, share, and act. Hands-on mastery in SQL, R programming, Tableau, and spreadsheet modeling.',
      skills: ['Data Analysis', 'SQL', 'Spreadsheets', 'Data Visualization', 'Problem Solving'],
      featured: true,
      order: 1,
      status: 'published',
      source: 'resume'
    },
    {
      id: 'cert-2',
      title: 'Introduction to Data Science in Python',
      issuer: 'Coursera (University of Michigan)',
      issueDate: '2024',
      credentialUrl: 'https://www.coursera.org',
      description: 'In-depth program focused on Python data science foundations, NumPy, Pandas DataFrame manipulation, series indexing, and statistical cleaning of real-world datasets.',
      skills: ['Python', 'Pandas', 'NumPy', 'Data Wrangling'],
      featured: true,
      order: 2,
      status: 'published',
      source: 'resume'
    },
    {
      id: 'cert-3',
      title: 'Data Analytics Essentials',
      issuer: 'Cisco Networking Academy',
      issueDate: '2024',
      credentialUrl: 'https://www.netacad.com',
      description: 'Foundations of data analytics, data lifecycle management, transforming raw data into business intelligence, and ethical data handling.',
      skills: ['Data Lifecycle', 'Business Analytics', 'Data Security'],
      featured: false,
      order: 3,
      status: 'published',
      source: 'resume'
    },
    {
      id: 'cert-4',
      title: 'Microsoft Excel for Data Analysis',
      issuer: 'Coursera',
      issueDate: '2024',
      credentialUrl: 'https://www.coursera.org',
      description: 'Advanced data transformation, XLOOKUP, nested formulas, Pivot Tables, Power Query, scenario planning, and statistical modeling in Excel.',
      skills: ['Excel', 'Pivot Tables', 'Power Query', 'Data Analysis'],
      featured: true,
      order: 4,
      status: 'published',
      source: 'resume'
    },
    {
      id: 'cert-5',
      title: 'Exploratory Data Analysis',
      issuer: 'Future Skills Prime',
      issueDate: '2024',
      credentialUrl: '',
      description: 'Systematic statistical data exploration, distribution analysis, bivariate/multivariate correlations, and outlier remediation techniques.',
      skills: ['EDA', 'Data Cleaning', 'Statistics', 'Distribution Analysis'],
      featured: false,
      order: 5,
      status: 'published',
      source: 'resume'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech — Artificial Intelligence & Data Science',
      institution: 'Dhanalakshmi Srinivasan University',
      period: '2023 – 2027',
      cgpa: '8.5 / 10',
      highlights: [
        'Dedicated concentration on Data Analytics, Applied Machine Learning, and Big Data Architecture.',
        'Active contributor in departmental technical symposiums and academic data innovation labs.',
        'Academic coursework in Database Systems (SQL), Probability & Statistics, Data Structures, and Clinical Data Frameworks.'
      ],
      order: 1,
      source: 'resume'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Hackathons & Technical Events Participation',
      category: 'Competitions',
      description: 'Actively participated in collegiate and inter-university data science hackathons and technical symposiums focusing on analytical solutions.',
      order: 1,
      source: 'resume'
    },
    {
      id: 'ach-2',
      title: 'Industry & Professional Certifications',
      category: 'Continuous Learning',
      description: 'Earned competitive certifications from Google, Cisco Networking Academy, Coursera, and Future Skills Prime in Data Analytics, Excel, and Python.',
      order: 2,
      source: 'resume'
    },
    {
      id: 'ach-3',
      title: 'Academic Projects Solving Real-World Data Problems',
      category: 'Project Innovation',
      description: 'Architected practical analytical systems including OLAP multidimensional weather intelligence and business sales dashboards that simulate real industry data challenges.',
      order: 3,
      source: 'resume'
    }
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Professional Working', order: 1, source: 'resume' },
    { id: 'lang-2', language: 'Telugu', proficiency: 'Native / Bilingual', order: 2, source: 'resume' },
    { id: 'lang-3', language: 'Hindi', proficiency: 'Conversational', order: 3, source: 'resume' },
    { id: 'lang-4', language: 'Tamil', proficiency: 'Conversational', order: 4, source: 'resume' }
  ],
  resumeVersions: [
    {
      id: 'res-v1',
      filename: 'Raja_Vardhan_Data_Analytics_Resume_2026.pdf',
      versionTag: 'v1.0 (Initial Seed)',
      uploadedAt: '2026-09-26T22:00:00Z',
      fileSize: 142800,
      pdfUrl: '/api/resume/download',
      isCurrent: true,
      notes: 'Initial verified resume content parsed and seeded into portfolio.'
    }
  ],
  syncJobs: [],
  siteSettings: {
    themeDefault: 'dark',
    darkThemeName: 'Royal Crimson',
    lightThemeName: 'Ocean Royale',
    enableAiAssistant: true,
    enable3dScene: true,
    maintenanceMode: false
  },
  contactMessages: []
};
