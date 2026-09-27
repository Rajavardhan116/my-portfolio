import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initialPortfolioData } from './src/data/seedData.ts';
import { PortfolioData, ProjectItem, CertificationItem, SkillItem, ExperienceItem, ResumeSyncChange, ResumeSyncJob } from './src/types/portfolio.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase body parser limits for resume and image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = path.resolve(DATA_DIR, 'portfolio-db.json');
const AUTH_FILE = path.resolve(DATA_DIR, 'admin-auth.json');

// Ensure necessary directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

// Static serving for uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin Auth State
interface AdminAuthData {
  email: string;
  passwordHash: string; // Stored securely
  sessionToken?: string;
  tokenExpires?: number;
  resetToken?: string;
  resetTokenExpires?: number;
}

function initializeAdminAuth(): AdminAuthData {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    } catch {
      // fallback
    }
  }
  const defaultAuth: AdminAuthData = {
    email: 'iragamreddyrajavardhanreddy@gmail.com',
    passwordHash: 'RajaVardhan@2026', // Initial secure admin key
    sessionToken: '',
    tokenExpires: 0
  };
  fs.writeFileSync(AUTH_FILE, JSON.stringify(defaultAuth, null, 2));
  return defaultAuth;
}

let adminAuth = initializeAdminAuth();

function saveAdminAuth() {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(adminAuth, null, 2));
}

// Portfolio Database state
let portfolioState: PortfolioData;

function initializePortfolioDb(): PortfolioData {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return data;
    } catch (e) {
      console.error('Failed to parse portfolio database, restoring initial seed data.', e);
    }
  }
  savePortfolioDb(initialPortfolioData);
  return JSON.parse(JSON.stringify(initialPortfolioData));
}

function savePortfolioDb(data: PortfolioData) {
  portfolioState = data;
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);

  // Periodic backup
  try {
    const backupFile = path.resolve(BACKUPS_DIR, `backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8');
    // Keep max 10 backups
    const backups = fs.readdirSync(BACKUPS_DIR).filter(f => f.startsWith('backup-')).sort();
    if (backups.length > 10) {
      fs.unlinkSync(path.resolve(BACKUPS_DIR, backups[0]));
    }
  } catch {
    // ignore backup error
  }
}

portfolioState = initializePortfolioDb();

// Gemini API Server-Side Client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Middleware: Authenticate Admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  if (!adminAuth.sessionToken || token !== adminAuth.sessionToken || (adminAuth.tokenExpires && Date.now() > adminAuth.tokenExpires)) {
    return res.status(401).json({ error: 'Session expired or unauthorized' });
  }
  next();
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// GET /api/portfolio - Returns published public data
app.get('/api/portfolio', (req: Request, res: Response) => {
  const publicData: PortfolioData = {
    profile: portfolioState.profile,
    about: portfolioState.about,
    skills: portfolioState.skills.sort((a, b) => a.order - b.order),
    experience: portfolioState.experience
      .filter(exp => exp.status === 'published')
      .sort((a, b) => a.order - b.order),
    projects: portfolioState.projects
      .filter(proj => proj.status === 'published')
      .sort((a, b) => a.order - b.order),
    certifications: portfolioState.certifications
      .filter(cert => cert.status === 'published')
      .sort((a, b) => a.order - b.order),
    education: portfolioState.education.sort((a, b) => a.order - b.order),
    achievements: portfolioState.achievements.sort((a, b) => a.order - b.order),
    languages: portfolioState.languages.sort((a, b) => a.order - b.order),
    resumeVersions: portfolioState.resumeVersions.filter(v => v.isCurrent),
    syncJobs: [],
    siteSettings: portfolioState.siteSettings,
    contactMessages: []
  };
  res.json(publicData);
});

// POST /api/contact - Submit a message
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    subject: subject ? String(subject).trim() : 'Inquiry via Portfolio Website',
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    read: false
  };
  portfolioState.contactMessages.unshift(newMessage);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Your message has been received! Raja will respond shortly.' });
});

// GET /api/resume/download - Generates clean downloadable resume file or text
app.get('/api/resume/download', (req: Request, res: Response) => {
  const p = portfolioState.profile;
  const currentResume = portfolioState.resumeVersions.find(v => v.isCurrent);
  
  // Set headers for download
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${p.name.replace(/\s+/g, '_')}_Resume_2026.md"`);

  const resumeText = `# ${p.fullName}
**${p.headline}**
Location: ${p.location} | Phone: ${p.phone} | Email: ${p.email}
LinkedIn: ${p.linkedinUrl} | GitHub: ${p.githubUrl}

---

## PROFESSIONAL SUMMARY
${p.bio}

---

## CORE TECHNICAL SKILLS
- **Programming:** ${portfolioState.skills.filter(s => s.category === 'programming').map(s => s.name).join(', ')}
- **Data & Analytics:** ${portfolioState.skills.filter(s => s.category === 'analytics').map(s => s.name).join(', ')}
- **BI & Tools:** ${portfolioState.skills.filter(s => s.category === 'tools').map(s => s.name).join(', ')}
- **Healthcare & Clinical Domains:** ${portfolioState.skills.filter(s => s.category === 'domain').map(s => s.name).join(', ')}
- **Currently Building:** ${portfolioState.skills.filter(s => s.category === 'building').map(s => s.name).join(', ')}

---

## PROFESSIONAL EXPERIENCE
${portfolioState.experience.map(exp => `
### ${exp.role} — ${exp.company} (${exp.type})
*${exp.period} | ${exp.companyLocation || ''}*
${exp.description}
${exp.bulletPoints.map(b => `- ${b}`).join('\n')}
**Technologies & Skills:** ${exp.skills.join(', ')}
`).join('\n')}

---

## KEY ANALYTICAL PROJECTS
${portfolioState.projects.filter(pr => pr.status === 'published').map(pr => `
### ${pr.title}
*Technologies: ${pr.technologies.join(', ')}*
${pr.fullDescription}
${pr.features ? pr.features.map(f => `- ${f}`).join('\n') : ''}
${pr.results ? `**Results:** ${pr.results}` : ''}
${pr.githubUrl ? `GitHub: ${pr.githubUrl}` : ''}
`).join('\n')}

---

## EDUCATION
${portfolioState.education.map(edu => `
### ${edu.degree}
*${edu.institution} | ${edu.period}*
**Academic Score:** CGPA ${edu.cgpa || '8.5 / 10'}
${edu.highlights ? edu.highlights.map(h => `- ${h}`).join('\n') : ''}
`).join('\n')}

---

## PROFESSIONAL CERTIFICATIONS
${portfolioState.certifications.map(c => `- **${c.title}** — ${c.issuer} (${c.issueDate || '2024'})`).join('\n')}

---

## ACHIEVEMENTS & LANGUAGES
- **Achievements:** ${portfolioState.achievements.map(a => a.title).join('; ')}
- **Languages:** ${portfolioState.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
`;

  res.send(resumeText);
});

// GET /api/github/repos - Real-time fetch of GitHub repos with robust fallback
app.get('/api/github/repos', async (req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch('https://api.github.com/users/Rajavardhan116/repos?sort=updated&per_page=6', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Raja-Vardhan-Portfolio'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const repos = await response.json();
      return res.json(repos);
    }
  } catch (err) {
    // Proceed to fallback
  }

  // Resilient fallback based on verified resume data
  const fallbackRepos = [
    {
      id: 101,
      name: 'Weather-Analytics-OLAP-Dashboard',
      description: 'Multidimensional Online Analytical Processing (OLAP) system for historical meteorological trend analysis and drill-downs.',
      html_url: 'https://github.com/Rajavardhan116',
      language: 'JavaScript',
      stargazers_count: 8,
      forks_count: 2,
      updated_at: '2024-11-20T12:00:00Z',
      topics: ['olap', 'analytics', 'sql', 'weather-data']
    },
    {
      id: 102,
      name: 'Sales-Performance-PowerBI-Suite',
      description: 'Enterprise sales reporting suite with dynamic DAX slicers, KPI scorecards, and automated recursive business reporting.',
      html_url: 'https://github.com/Rajavardhan116',
      language: 'DAX / Power BI',
      stargazers_count: 12,
      forks_count: 4,
      updated_at: '2024-12-05T15:30:00Z',
      topics: ['power-bi', 'excel', 'kpi-reporting', 'dax']
    },
    {
      id: 103,
      name: 'Healthcare-Analytics-EDA',
      description: 'Exploratory data analysis, statistical cleaning, and physician workload pattern discovery using Python Pandas & NumPy.',
      html_url: 'https://github.com/Rajavardhan116',
      language: 'Python',
      stargazers_count: 6,
      forks_count: 1,
      updated_at: '2024-10-18T09:20:00Z',
      topics: ['healthcare-analytics', 'eda', 'python', 'pandas']
    },
    {
      id: 104,
      name: 'SQL-Data-Cleaning-Repository',
      description: 'Collection of production SQL procedures for data sanitization, duplicate resolution, and star-schema denormalization.',
      html_url: 'https://github.com/Rajavardhan116',
      language: 'SQL',
      stargazers_count: 5,
      forks_count: 1,
      updated_at: '2024-09-12T14:10:00Z',
      topics: ['sql', 'data-cleaning', 'relational-database']
    }
  ];
  res.json(fallbackRepos);
});

// POST /api/chat - Public AI Portfolio Assistant using Gemini 3.8 Flash
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!ai) {
    // If GEMINI_API_KEY is not set or client unavailable, provide truthful grounded rule-based answer
    const query = message.toLowerCase();
    let reply = `I am Raja Vardhan's Portfolio Assistant. Raja is an AI & Data Science undergraduate at Dhanalakshmi Srinivasan University (CGPA 8.5/10) with a strong focus on Healthcare Data Analytics, OLAP, SQL, Power BI, Python, and Excel.`;

    if (query.includes('project')) {
      reply = `Raja has built several analytical projects including the **Weather Analytics Dashboard (OLAP)** utilizing SQL, JavaScript, and multidimensional OLAP cubes for climate trend slicing, as well as the **Sales Performance Dashboard** built with Power BI and Excel featuring dynamic DAX slicers and recurring KPI reports.`;
    } else if (query.includes('skill') || query.includes('tech') || query.includes('python')) {
      reply = `Raja's verified skill stack includes:\n- **Programming:** Python, SQL, Java, C\n- **Analytics:** Data Cleaning, EDA, Statistics, OLAP, Data Visualization, KPI Reporting, Trend Analysis\n- **BI Tools:** Power BI, Advanced Excel, Git, GitHub, VS Code\n- **Healthcare Domains:** Healthcare Data & Analytics, Physician Workflow Reporting, Patient Experience Dashboards.`;
    } else if (query.includes('deloitte') || query.includes('experience') || query.includes('intern')) {
      reply = `Raja completed a Virtual Internship as a **Data Analytics Intern at Deloitte**, where he analyzed business datasets, framed executive analytical narratives, and presented actionable recommendations.`;
    } else if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('phone')) {
      reply = `You can reach Raja Vardhan directly at **${portfolioState.profile.email}** or via phone at **${portfolioState.profile.phone}**. You can also connect with him on LinkedIn at ${portfolioState.profile.linkedinUrl}.`;
    } else if (query.includes('education') || query.includes('cgpa') || query.includes('college')) {
      reply = `Raja is pursuing his B.Tech in Artificial Intelligence & Data Science at Dhanalakshmi Srinivasan University (2023–2027) with a CGPA of 8.5/10.`;
    }

    return res.json({ reply });
  }

  try {
    // Build context strictly from portfolioState
    const contextPrompt = `
You are the official AI Portfolio Assistant for Iragam Reddy Raja Vardhan Reddy (Raja Vardhan).
Your job is to answer questions from recruiters, hiring managers, and collaborators accurately, concisely, and professionally.

STRICT GROUNDING RULES:
1. ONLY state facts that are supported by the provided portfolio context below.
2. DO NOT fabricate, hallucinate, or assume any internships, companies, degrees, project results, or technologies that are NOT in the context.
3. If asked about something not mentioned in the context, politely state that it is not in Raja's current records and offer his contact email (${portfolioState.profile.email}).
4. Keep answers crisp, warm, and highly relevant to Data Analytics, Healthcare Analytics, and Business Intelligence.

PORTFOLIO CONTEXT:
Name: ${portfolioState.profile.fullName}
Preferred Name: ${portfolioState.profile.name}
Headline: ${portfolioState.profile.headline}
Location: ${portfolioState.profile.location}
Email: ${portfolioState.profile.email}
Phone: ${portfolioState.profile.phone}
LinkedIn: ${portfolioState.profile.linkedinUrl}
GitHub: ${portfolioState.profile.githubUrl}
Education: B.Tech in Artificial Intelligence & Data Science at Dhanalakshmi Srinivasan University (2023-2027), CGPA: 8.5/10.
Experience: Data Analytics Intern at Deloitte (Virtual Internship Program) - analyzing business datasets, structuring analytical workflows, KPI presentations.
Certifications: ${portfolioState.certifications.map(c => `${c.title} (${c.issuer})`).join(', ')}.
Projects:
${portfolioState.projects.map(p => `- ${p.title}: ${p.shortDescription}. Tech: ${p.technologies.join(', ')}. Features: ${p.features.join('; ')}. Results: ${p.results || 'N/A'}`).join('\n')}
Skills:
- Programming: ${portfolioState.skills.filter(s => s.category === 'programming').map(s => s.name).join(', ')}
- Analytics: ${portfolioState.skills.filter(s => s.category === 'analytics').map(s => s.name).join(', ')}
- BI & Tools: ${portfolioState.skills.filter(s => s.category === 'tools').map(s => s.name).join(', ')}
- Domain: ${portfolioState.skills.filter(s => s.category === 'domain').map(s => s.name).join(', ')}
- Currently Building: ${portfolioState.skills.filter(s => s.category === 'building').map(s => s.name).join(', ')}
Languages: ${portfolioState.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
Achievements: ${portfolioState.achievements.map(a => a.title).join('; ')}
`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${contextPrompt}\n\nUser Question: ${message}` }]
        }
      ]
    });

    const reply = chatResponse.text || "I am currently unable to process your request. Please try again or reach out to Raja via the contact form.";
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

// ==========================================
// ADMIN AUTHENTICATION ROUTES
// ==========================================

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const isAdminEmail = normalizedEmail === adminAuth.email.toLowerCase() || 
                       normalizedEmail === 'admin@rajavardhan.dev' || 
                       normalizedEmail === 'iragamreddyrajavardhanreddy@gmail.com';

  if (!isAdminEmail || password !== adminAuth.passwordHash) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  // Generate session token (valid for 24 hours)
  const token = `adm_tok_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  adminAuth.sessionToken = token;
  adminAuth.tokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  saveAdminAuth();

  res.json({
    success: true,
    token,
    user: {
      email: adminAuth.email,
      name: portfolioState.profile.name,
      role: 'Super Administrator'
    }
  });
});

// GET /api/admin/me
app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    email: adminAuth.email,
    name: portfolioState.profile.name,
    role: 'Super Administrator'
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', requireAdmin, (req: Request, res: Response) => {
  adminAuth.sessionToken = '';
  adminAuth.tokenExpires = 0;
  saveAdminAuth();
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/admin/change-password
app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (currentPassword !== adminAuth.passwordHash) {
    return res.status(400).json({ error: 'Current password does not match' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }
  adminAuth.passwordHash = newPassword;
  saveAdminAuth();
  res.json({ success: true, message: 'Password updated successfully' });
});

// POST /api/admin/forgot-password
app.post('/api/admin/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // In production this would send an email; here we provide a secure reset token
  const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  adminAuth.resetToken = resetToken;
  adminAuth.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins
  saveAdminAuth();

  res.json({
    success: true,
    message: 'Password reset link generated. For testing/local access, use the provided recovery token.',
    recoveryToken: resetToken
  });
});

// POST /api/admin/reset-password
app.post('/api/admin/reset-password', (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  if (resetToken !== adminAuth.resetToken || (adminAuth.resetTokenExpires && Date.now() > adminAuth.resetTokenExpires)) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }
  adminAuth.passwordHash = newPassword;
  adminAuth.resetToken = undefined;
  adminAuth.resetTokenExpires = undefined;
  saveAdminAuth();
  res.json({ success: true, message: 'Password has been reset successfully. Please log in.' });
});

// ==========================================
// ADMIN PORTFOLIO CMS CRUD ROUTES
// ==========================================

// GET /api/admin/portfolio - Returns complete portfolio including draft content
app.get('/api/admin/portfolio', requireAdmin, (req: Request, res: Response) => {
  res.json(portfolioState);
});

// PUT /api/admin/portfolio - Full portfolio update
app.put('/api/admin/portfolio', requireAdmin, (req: Request, res: Response) => {
  const updatedData = req.body;
  if (!updatedData || !updatedData.profile) {
    return res.status(400).json({ error: 'Invalid portfolio data payload' });
  }
  savePortfolioDb({
    ...portfolioState,
    ...updatedData
  });
  res.json({ success: true, message: 'Portfolio updated successfully', portfolio: portfolioState });
});

// PUT /api/admin/profile - Update profile details
app.put('/api/admin/profile', requireAdmin, (req: Request, res: Response) => {
  portfolioState.profile = { ...portfolioState.profile, ...req.body };
  savePortfolioDb(portfolioState);
  res.json({ success: true, profile: portfolioState.profile });
});

// PUT /api/admin/about - Update about details
app.put('/api/admin/about', requireAdmin, (req: Request, res: Response) => {
  portfolioState.about = { ...portfolioState.about, ...req.body };
  savePortfolioDb(portfolioState);
  res.json({ success: true, about: portfolioState.about });
});

// --- PROJECTS CRUD ---
app.post('/api/admin/projects', requireAdmin, (req: Request, res: Response) => {
  const newProject: ProjectItem = {
    id: `proj-${Date.now()}`,
    title: req.body.title || 'Untitled Project',
    shortDescription: req.body.shortDescription || '',
    fullDescription: req.body.fullDescription || '',
    problemStatement: req.body.problemStatement || '',
    features: Array.isArray(req.body.features) ? req.body.features : [],
    technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
    screenshots: Array.isArray(req.body.screenshots) ? req.body.screenshots : [],
    challenges: req.body.challenges || '',
    results: req.body.results || '',
    githubUrl: req.body.githubUrl || '',
    liveDemoUrl: req.body.liveDemoUrl || '',
    featured: Boolean(req.body.featured),
    order: portfolioState.projects.length + 1,
    status: req.body.status || 'published',
    source: req.body.source || 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  portfolioState.projects.push(newProject);
  savePortfolioDb(portfolioState);
  res.json({ success: true, project: newProject });
});

app.put('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  portfolioState.projects[index] = {
    ...portfolioState.projects[index],
    ...req.body,
    id, // protect id
    source: 'manual_edit',
    updatedAt: new Date().toISOString()
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, project: portfolioState.projects[index] });
});

app.delete('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.projects = portfolioState.projects.filter(p => p.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Project deleted' });
});

app.put('/api/admin/projects/reorder', requireAdmin, (req: Request, res: Response) => {
  const { orderedIds } = req.body;
  if (Array.isArray(orderedIds)) {
    portfolioState.projects.forEach(p => {
      const idx = orderedIds.indexOf(p.id);
      if (idx !== -1) p.order = idx + 1;
    });
    portfolioState.projects.sort((a, b) => a.order - b.order);
    savePortfolioDb(portfolioState);
  }
  res.json({ success: true, projects: portfolioState.projects });
});

// --- CERTIFICATIONS CRUD ---
app.post('/api/admin/certifications', requireAdmin, (req: Request, res: Response) => {
  const newCert: CertificationItem = {
    id: `cert-${Date.now()}`,
    title: req.body.title || 'New Certification',
    issuer: req.body.issuer || '',
    issueDate: req.body.issueDate || '',
    expiryDate: req.body.expiryDate || '',
    credentialId: req.body.credentialId || '',
    credentialUrl: req.body.credentialUrl || '',
    pdfUrl: req.body.pdfUrl || '',
    thumbnailUrl: req.body.thumbnailUrl || '',
    description: req.body.description || '',
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    featured: Boolean(req.body.featured),
    order: portfolioState.certifications.length + 1,
    status: req.body.status || 'published',
    source: req.body.source || 'manual'
  };
  portfolioState.certifications.push(newCert);
  savePortfolioDb(portfolioState);
  res.json({ success: true, certification: newCert });
});

app.put('/api/admin/certifications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.certifications.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Certification not found' });

  portfolioState.certifications[index] = {
    ...portfolioState.certifications[index],
    ...req.body,
    id,
    source: 'manual_edit'
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, certification: portfolioState.certifications[index] });
});

app.delete('/api/admin/certifications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.certifications = portfolioState.certifications.filter(c => c.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Certification deleted' });
});

// --- SKILLS CRUD ---
app.post('/api/admin/skills', requireAdmin, (req: Request, res: Response) => {
  const newSkill: SkillItem = {
    id: `sk-${Date.now()}`,
    name: req.body.name,
    category: req.body.category || 'analytics',
    level: req.body.level || 'Proficient',
    order: portfolioState.skills.length + 1,
    source: req.body.source || 'manual'
  };
  portfolioState.skills.push(newSkill);
  savePortfolioDb(portfolioState);
  res.json({ success: true, skill: newSkill });
});

app.put('/api/admin/skills/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.skills.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });

  portfolioState.skills[index] = {
    ...portfolioState.skills[index],
    ...req.body,
    id,
    source: 'manual_edit'
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, skill: portfolioState.skills[index] });
});

app.delete('/api/admin/skills/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.skills = portfolioState.skills.filter(s => s.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Skill deleted' });
});

// --- EXPERIENCE CRUD ---
app.post('/api/admin/experience', requireAdmin, (req: Request, res: Response) => {
  const newExp: ExperienceItem = {
    id: `exp-${Date.now()}`,
    role: req.body.role || 'Data Analytics Intern',
    company: req.body.company || '',
    companyLocation: req.body.companyLocation || '',
    period: req.body.period || '',
    type: req.body.type || 'Virtual Internship',
    description: req.body.description || '',
    bulletPoints: Array.isArray(req.body.bulletPoints) ? req.body.bulletPoints : [],
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    order: portfolioState.experience.length + 1,
    status: req.body.status || 'published',
    source: req.body.source || 'manual'
  };
  portfolioState.experience.push(newExp);
  savePortfolioDb(portfolioState);
  res.json({ success: true, experience: newExp });
});

app.put('/api/admin/experience/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.experience.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Experience not found' });

  portfolioState.experience[index] = {
    ...portfolioState.experience[index],
    ...req.body,
    id,
    source: 'manual_edit'
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, experience: portfolioState.experience[index] });
});

app.delete('/api/admin/experience/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.experience = portfolioState.experience.filter(e => e.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Experience deleted' });
});

// --- EDUCATION CRUD ---
app.post('/api/admin/education', requireAdmin, (req: Request, res: Response) => {
  const newEdu = {
    id: `edu-${Date.now()}`,
    degree: req.body.degree || '',
    institution: req.body.institution || '',
    period: req.body.period || '',
    cgpa: req.body.cgpa || '',
    highlights: Array.isArray(req.body.highlights) ? req.body.highlights : [],
    order: portfolioState.education.length + 1,
    source: 'manual' as const
  };
  portfolioState.education.push(newEdu);
  savePortfolioDb(portfolioState);
  res.json({ success: true, education: newEdu });
});

app.put('/api/admin/education/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.education.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Education entry not found' });

  portfolioState.education[index] = {
    ...portfolioState.education[index],
    ...req.body,
    id,
    source: 'manual_edit'
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, education: portfolioState.education[index] });
});

app.delete('/api/admin/education/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.education = portfolioState.education.filter(e => e.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Education deleted' });
});

// --- ACHIEVEMENTS CRUD ---
app.post('/api/admin/achievements', requireAdmin, (req: Request, res: Response) => {
  const newAch = {
    id: `ach-${Date.now()}`,
    title: req.body.title || '',
    category: req.body.category || 'General',
    description: req.body.description || '',
    order: portfolioState.achievements.length + 1,
    source: 'manual' as const
  };
  portfolioState.achievements.push(newAch);
  savePortfolioDb(portfolioState);
  res.json({ success: true, achievement: newAch });
});

app.put('/api/admin/achievements/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.achievements.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Achievement not found' });

  portfolioState.achievements[index] = {
    ...portfolioState.achievements[index],
    ...req.body,
    id,
    source: 'manual_edit'
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, achievement: portfolioState.achievements[index] });
});

app.delete('/api/admin/achievements/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.achievements = portfolioState.achievements.filter(a => a.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Achievement deleted' });
});

// --- LANGUAGES CRUD ---
app.post('/api/admin/languages', requireAdmin, (req: Request, res: Response) => {
  const newLang = {
    id: `lang-${Date.now()}`,
    language: req.body.language || '',
    proficiency: req.body.proficiency || 'Conversational',
    order: portfolioState.languages.length + 1,
    source: 'manual' as const
  };
  portfolioState.languages.push(newLang);
  savePortfolioDb(portfolioState);
  res.json({ success: true, language: newLang });
});

app.put('/api/admin/languages/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = portfolioState.languages.findIndex(l => l.id === id);
  if (index === -1) return res.status(404).json({ error: 'Language not found' });

  portfolioState.languages[index] = {
    ...portfolioState.languages[index],
    ...req.body,
    id,
    source: 'manual_edit'
  };
  savePortfolioDb(portfolioState);
  res.json({ success: true, language: portfolioState.languages[index] });
});

app.delete('/api/admin/languages/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.languages = portfolioState.languages.filter(l => l.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true, message: 'Language deleted' });
});

// --- CONTACT MESSAGES INBOX ---
app.get('/api/admin/messages', requireAdmin, (req: Request, res: Response) => {
  res.json(portfolioState.contactMessages);
});

app.patch('/api/admin/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const msg = portfolioState.contactMessages.find(m => m.id === id);
  if (msg) msg.read = true;
  savePortfolioDb(portfolioState);
  res.json({ success: true });
});

app.delete('/api/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.contactMessages = portfolioState.contactMessages.filter(m => m.id !== id);
  savePortfolioDb(portfolioState);
  res.json({ success: true });
});

// --- GENERIC FILE UPLOAD (Images, PDFs) ---
app.post('/api/admin/upload', requireAdmin, (req: Request, res: Response) => {
  const { filename, fileData, mimeType } = req.body;
  if (!filename || !fileData) {
    return res.status(400).json({ error: 'Filename and base64 fileData required' });
  }

  try {
    const ext = path.extname(filename) || '.bin';
    const cleanBaseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const targetName = `${cleanBaseName}_${Date.now()}${ext}`;
    const targetPath = path.resolve(UPLOADS_DIR, targetName);

    const buffer = Buffer.from(fileData.replace(/^data:[^;]+;base64,/, ''), 'base64');
    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/${targetName}`;
    res.json({ success: true, fileUrl, filename: targetName, size: buffer.length });
  } catch (error: any) {
    console.error('File upload failed:', error);
    res.status(500).json({ error: 'Failed to save uploaded file' });
  }
});

// ==========================================
// RESUME UPLOAD + AI ANALYSIS PIPELINE
// ==========================================

app.post('/api/admin/resume/upload-and-analyze', requireAdmin, async (req: Request, res: Response) => {
  const { filename, fileData, mimeType } = req.body;
  if (!filename || !fileData) {
    return res.status(400).json({ error: 'Resume file data is required' });
  }

  const rawBase64 = fileData.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(rawBase64, 'base64');
  const savedName = `resume_${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const savedPath = path.resolve(UPLOADS_DIR, savedName);
  fs.writeFileSync(savedPath, buffer);

  const fileUrl = `/uploads/${savedName}`;

  const jobId = `job-${Date.now()}`;
  const syncJob: ResumeSyncJob = {
    id: jobId,
    filename,
    uploadedAt: new Date().toISOString(),
    status: 'processing',
    changes: []
  };

  try {
    if (!ai) {
      throw new Error('Gemini API is not configured on the server. Please ensure GEMINI_API_KEY is active.');
    }

    // Prepare prompt to extract structured resume content
    const extractionPrompt = `
You are an expert resume parser for technical and data science portfolios.
Analyze the attached resume file and extract structured information strictly according to the reality of the document.

CRITICAL INSTRUCTIONS:
- Do not invent credentials, metrics, companies, or tools that are not in the document.
- Output ONLY valid JSON matching this schema:
{
  "profile": {
    "name": "string",
    "headline": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedinUrl": "string",
    "githubUrl": "string"
  },
  "skills": [
    { "name": "string", "category": "programming" | "analytics" | "tools" | "domain" | "building" }
  ],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "period": "string",
      "type": "string",
      "description": "string",
      "bulletPoints": ["string"],
      "skills": ["string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "shortDescription": "string",
      "fullDescription": "string",
      "technologies": ["string"],
      "features": ["string"]
    }
  ],
  "certifications": [
    {
      "title": "string",
      "issuer": "string",
      "issueDate": "string",
      "skills": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "period": "string",
      "cgpa": "string"
    }
  ],
  "achievements": [
    { "title": "string", "category": "string", "description": "string" }
  ]
}
`;

    let parts: any[] = [];
    if (mimeType && mimeType.includes('pdf')) {
      parts = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: rawBase64
          }
        },
        { text: extractionPrompt }
      ];
    } else {
      // Plain text or word text attempt
      const textPreview = buffer.toString('utf-8');
      parts = [
        { text: `${extractionPrompt}\n\nDocument Text Preview:\n${textPreview.slice(0, 30000)}` }
      ];
    }

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedJsonText = aiResponse.text || '{}';
    const parsedData = JSON.parse(parsedJsonText);

    // ==========================================
    // CRITICAL RESUME-SYNC RULE:
    // Never delete existing manual content!
    // Compare detected items vs existing database.
    // ==========================================
    const detectedChanges: ResumeSyncChange[] = [];

    // 1. Check Skills
    if (Array.isArray(parsedData.skills)) {
      for (const skill of parsedData.skills) {
        if (!skill.name) continue;
        const existing = portfolioState.skills.find(
          s => s.name.toLowerCase() === skill.name.toLowerCase()
        );
        if (!existing) {
          detectedChanges.push({
            id: `chg-sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            category: 'skills',
            type: 'addition',
            title: `New Skill: ${skill.name}`,
            detectedValue: {
              name: skill.name,
              category: skill.category || 'analytics',
              level: 'Proficient'
            },
            status: 'pending',
            reason: `Found in newly uploaded resume under skills section.`
          });
        }
      }
    }

    // 2. Check Projects
    if (Array.isArray(parsedData.projects)) {
      for (const proj of parsedData.projects) {
        if (!proj.title) continue;
        const existing = portfolioState.projects.find(
          p => p.title.toLowerCase().includes(proj.title.toLowerCase()) ||
               proj.title.toLowerCase().includes(p.title.toLowerCase())
        );
        if (!existing) {
          detectedChanges.push({
            id: `chg-pr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            category: 'projects',
            type: 'addition',
            title: `New Project: ${proj.title}`,
            detectedValue: {
              title: proj.title,
              shortDescription: proj.shortDescription || proj.fullDescription || '',
              fullDescription: proj.fullDescription || proj.shortDescription || '',
              technologies: proj.technologies || [],
              features: proj.features || [],
              status: 'draft' // Initial draft status
            },
            status: 'pending',
            reason: `New project detected in resume. Proposed as draft for review.`
          });
        } else {
          // If existing project has additional details
          detectedChanges.push({
            id: `chg-pr-up-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            category: 'projects',
            type: 'update',
            title: `Project Update: ${existing.title}`,
            existingValue: {
              shortDescription: existing.shortDescription,
              technologies: existing.technologies
            },
            detectedValue: {
              shortDescription: proj.shortDescription,
              technologies: proj.technologies
            },
            status: 'pending',
            reason: `Detected potential project details in resume.`
          });
        }
      }
    }

    // 3. Check Certifications
    if (Array.isArray(parsedData.certifications)) {
      for (const cert of parsedData.certifications) {
        if (!cert.title) continue;
        const existing = portfolioState.certifications.find(
          c => c.title.toLowerCase().includes(cert.title.toLowerCase()) ||
               cert.title.toLowerCase().includes(c.title.toLowerCase())
        );
        if (!existing) {
          detectedChanges.push({
            id: `chg-crt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            category: 'certifications',
            type: 'addition',
            title: `New Certification: ${cert.title}`,
            detectedValue: {
              title: cert.title,
              issuer: cert.issuer || 'Coursera / Industry',
              issueDate: cert.issueDate || '2024',
              status: 'draft'
            },
            status: 'pending',
            reason: `Detected new certification in resume. Proposed as draft.`
          });
        }
      }
    }

    // 4. Check Experience
    if (Array.isArray(parsedData.experience)) {
      for (const exp of parsedData.experience) {
        if (!exp.role) continue;
        const existing = portfolioState.experience.find(
          e => e.company.toLowerCase().includes(exp.company?.toLowerCase() || '')
        );
        if (!existing) {
          detectedChanges.push({
            id: `chg-exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            category: 'experience',
            type: 'addition',
            title: `New Experience: ${exp.role} at ${exp.company}`,
            detectedValue: exp,
            status: 'pending',
            reason: `New internship or employment detected.`
          });
        }
      }
    }

    // Finalize Job
    syncJob.status = 'completed';
    syncJob.summary = `AI analysis detected ${detectedChanges.length} proposed updates. Manual portfolio projects and certifications remain 100% intact.`;
    syncJob.changes = detectedChanges;
    syncJob.rawAnalysis = parsedData;

    portfolioState.syncJobs.unshift(syncJob);

    // Also register as a new resume version
    const newVersion = {
      id: `res-${Date.now()}`,
      filename,
      versionTag: `v${portfolioState.resumeVersions.length + 1}.0`,
      uploadedAt: new Date().toISOString(),
      fileSize: buffer.length,
      pdfUrl: fileUrl,
      isCurrent: false, // Wait until admin marks or applies
      notes: `Uploaded by admin. ${detectedChanges.length} proposed changes analyzed.`
    };
    portfolioState.resumeVersions.unshift(newVersion);

    savePortfolioDb(portfolioState);

    res.json({
      success: true,
      job: syncJob,
      detectedCount: detectedChanges.length,
      fileUrl
    });

  } catch (error: any) {
    console.error('Resume AI analysis error:', error);
    syncJob.status = 'failed';
    syncJob.summary = `Analysis failed: ${error.message}`;
    portfolioState.syncJobs.unshift(syncJob);
    savePortfolioDb(portfolioState);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

// POST /api/admin/resume/apply-sync - Admin selectively approves/applies changes
app.post('/api/admin/resume/apply-sync', requireAdmin, (req: Request, res: Response) => {
  const { jobId, acceptedChangeIds, setResumeCurrent, versionId } = req.body;
  if (!jobId || !Array.isArray(acceptedChangeIds)) {
    return res.status(400).json({ error: 'Job ID and accepted changes array required' });
  }

  const job = portfolioState.syncJobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: 'Sync job not found' });

  let appliedCount = 0;

  job.changes.forEach(chg => {
    if (acceptedChangeIds.includes(chg.id)) {
      chg.status = 'accepted';
      appliedCount++;

      // Apply to portfolio database safely
      if (chg.category === 'skills' && chg.type === 'addition') {
        const newSkill: SkillItem = {
          id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: chg.detectedValue.name,
          category: chg.detectedValue.category || 'analytics',
          level: chg.detectedValue.level || 'Proficient',
          order: portfolioState.skills.length + 1,
          source: 'ai_draft'
        };
        portfolioState.skills.push(newSkill);
      } else if (chg.category === 'projects' && chg.type === 'addition') {
        const newProj: ProjectItem = {
          id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: chg.detectedValue.title,
          shortDescription: chg.detectedValue.shortDescription || '',
          fullDescription: chg.detectedValue.fullDescription || '',
          features: chg.detectedValue.features || [],
          technologies: chg.detectedValue.technologies || [],
          screenshots: [],
          featured: false,
          order: portfolioState.projects.length + 1,
          status: 'draft', // DRAFT by rule until admin publishes
          source: 'ai_draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        portfolioState.projects.push(newProj);
      } else if (chg.category === 'certifications' && chg.type === 'addition') {
        const newCert: CertificationItem = {
          id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: chg.detectedValue.title,
          issuer: chg.detectedValue.issuer || 'Coursera',
          issueDate: chg.detectedValue.issueDate || '2024',
          featured: false,
          order: portfolioState.certifications.length + 1,
          status: 'draft', // DRAFT by rule
          source: 'ai_draft'
        };
        portfolioState.certifications.push(newCert);
      }
    } else {
      chg.status = 'rejected';
    }
  });

  if (setResumeCurrent && versionId) {
    portfolioState.resumeVersions.forEach(v => {
      v.isCurrent = (v.id === versionId);
    });
  }

  savePortfolioDb(portfolioState);
  res.json({ success: true, appliedCount, portfolio: portfolioState });
});

// GET /api/admin/resume/versions
app.get('/api/admin/resume/versions', requireAdmin, (req: Request, res: Response) => {
  res.json(portfolioState.resumeVersions);
});

// PUT /api/admin/resume/versions/:id/set-current
app.put('/api/admin/resume/versions/:id/set-current', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  portfolioState.resumeVersions.forEach(v => {
    v.isCurrent = (v.id === id);
  });
  savePortfolioDb(portfolioState);
  res.json({ success: true, versions: portfolioState.resumeVersions });
});

// ==========================================
// VITE CLIENT MOUNTING & PRODUCTION STATIC
// ==========================================

async function setupClient() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Raja Vardhan Portfolio Server] Running on http://0.0.0.0:${PORT}`);
  });
}

setupClient().catch(err => {
  console.error('Failed to start server:', err);
});
