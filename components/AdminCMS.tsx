import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FolderGit2, 
  Wrench, 
  GraduationCap, 
  Heart, 
  BookOpen, 
  Database,
  Users, 
  Download, 
  Plus, 
  Trash2, 
  Github, 
  Save, 
  LogOut,
  RefreshCw,
  FileDown,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Cpu,
  Sparkles,
  Settings,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { PortfolioSettings, Lead, Product, Skill, Project, CertificationCategory, LifeStyle } from '../types';
import { getDbStatus, SQL_SCHEMA, fetchLeads, fetchAnalytics, AnalyticsData, supabase } from '../db';
import { BlogPost } from '../types';

interface AdminCMSProps {
  settings: PortfolioSettings;
  onSaveSettings: (newSettings: PortfolioSettings) => Promise<boolean>;
  onLogout: () => void;
}

type CMSTab = 
  | 'dashboard'
  | 'leads'
  | 'profile'
  | 'experience'
  | 'products'
  | 'projects'
  | 'blogs'
  | 'skills_certs'
  | 'database'
  | 'settings';

// Mock AI Content Generator for Blog Posts
const generateAIPost = (prompt: string) => {
  const topic = prompt.toLowerCase();
  
  if (topic.includes('python') || topic.includes('performance')) {
    return {
      title: 'Optimizing Python Memory: Generators vs Lists',
      description: 'A deep-dive comparison of Python generators and list comprehensions under high load.',
      tags: ['Python', 'Backend'],
      readTime: '6 MIN READ',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      content: `## The Performance Bottleneck
When dealing with large datasets in Python, loading entire lists into memory can quickly exhaust system resources. This is where generators shine by evaluating data lazily.

## Python Performance Comparison
Here is a comparison of resource consumption and speed between lists and generators:

| Operation Type | List Comprehension | Generator Expression |
|---|---|---|
| Memory Footprint | High (O(N)) | Negligible (O(1)) |
| Startup Time | Slow (Generates all) | Instant (Lazy loading) |
| Iteration Speed | Fast | Slightly slower (overhead) |
| Support Indices | Yes (random access) | No (one-way stream) |

## Implementation Code Example
Here is how you can write generator functions in your Python pipelines:
\`\`\`python
# List comprehension (Memory intensive)
big_list = [x * 2 for x in range(10000000)]

# Generator expression (Lazy execution)
lazy_gen = (x * 2 for x in range(10000000))
\`\`\`

## Visualizing Memory Streams
![Data Pipeline Diagram](https://drive.google.com/file/d/1t87oV2d2Jb09y-X67h8o90y_xyz_abc/view)

Using lazy sequences helps preserve server RAM and ensures scalability under production workloads.`
    };
  }
  
  if (topic.includes('supabase') || topic.includes('realtime') || topic.includes('database')) {
    return {
      title: 'Supabase Realtime Architectures: Polling vs WebSockets',
      description: 'How to build high-performance, live-updating applications using Postgres changes publication.',
      tags: ['Supabase', 'Realtime'],
      readTime: '8 MIN READ',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      content: `## The Real-time Paradigm
Traditionally, real-time feel was achieved via client-side polling. Modern platforms leverage Postgres Replication publications to stream database changes directly to clients over WebSockets.

## Real-time Strategy Matrix
Let's compare these two common approaches:

| Metric | Short Polling | WebSocket Replication |
|---|---|---|
| Latency | High (2-5s delay) | Ultra Low (<100ms) |
| Database Connections | High (repeated connections) | Single Persistent Conn |
| Setup Complexity | Very simple | Moderate (pub/sub config) |
| Server Cost | High (redundant queries) | Low (event-driven) |

## Postgres Settings Table
You can configure replication publications directly in your SQL editor:
\`\`\`sql
-- Enable Realtime Replication for leads
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_leads;
\`\`\`

## System Diagram
![Supabase Realtime Flow](https://drive.google.com/file/d/1XyZ-902Jb10y-Z98h8o90y_pqr_xyz/view)

This ensures client applications automatically render updates without manually refreshing.`
    };
  }

  if (topic.includes('vite') || topic.includes('react') || topic.includes('bundle')) {
    return {
      title: 'Supercharging Bundles: Vite vs Webpack in React',
      description: 'Uncovering the performance secrets behind ES modules and fast developer feedback loops.',
      tags: ['React', 'Vite'],
      readTime: '5 MIN READ',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      content: `## The Evolution of Bundling
Webpack serves as a module bundler by analyzing dependency trees and building a monolithic bundle. Vite bypasses this step in development by serving source code over native ES Modules.

## Bundling Comparison Table
A detailed comparison of developer experience and production outputs:

| Phase | Webpack Bundler | Vite ES Modules |
|---|---|---|
| Dev Server Start | Slow (minutes on large apps) | Instant (<300ms) |
| Hot Module Replacement | Linear to project size | Constant time |
| Production Build | Webpack (highly optimized) | Rollup (efficient) |
| Config Complexity | Complex config files | Clean, simple plugins |

## Configuration Sample
\`\`\`typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
\`\`\`

## Flow Illustration
![Bundling Architecture](https://drive.google.com/file/d/1b789oV2d2Jb09y-X67h8o90y_abc_def/view)

Vite makes developing reactive user interfaces seamless, significantly shortening development feedback loops.`
    };
  }

  // Default Fallback
  const cleanTopic = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  return {
    title: `Architecting Modern Solutions: ${cleanTopic}`,
    description: `Exploring key technical design patterns and best practices for building scalable ${cleanTopic} setups.`,
    tags: ['Engineering', 'Design'],
    readTime: '7 MIN READ',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    content: `## The Architecture of ${cleanTopic}
Implementing scalable systems requires decoupling the data layers, defining rigid schema parameters, and configuring automated background triggers.

## Performance Analysis Table
Comparing traditional stacks versus modern event-driven architectures:

| System Layer | Legacy Monolith | Modern Event-Driven |
|---|---|---|
| Latency | High | Sub-milliseconds |
| Resilience | Single point of failure | Distributed / Fail-safe |
| Maintenance | High overhead | Serverless / Auto-managed |
| Scaling | Vertical scale-up | Horizontal auto-scale |

## Schema Design snippet
\`\`\`sql
-- Simple modern analytics tracking table
CREATE TABLE IF NOT EXISTS system_analytics (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

## High Level Diagram
![Architecture Flowchart](https://drive.google.com/file/d/1d89oV2d2Jb09y-X67h8o90y_xyz_abc/view)

Decoupling systems using this approach yields high developer productivity and low runtime overhead.`
  };
};

const AdminCMS: React.FC<AdminCMSProps> = ({ settings, onSaveSettings, onLogout }) => {
  const [activeTab, setActiveTab] = useState<CMSTab>('dashboard');
  const [localSettings, setLocalSettings] = useState<PortfolioSettings>(settings);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    totalDownloads: 0,
    recentLeadsCount: 0,
    dailyTrends: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [dbInfo, setDbInfo] = useState(getDbStatus());
  
  // GitHub Repos State
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  
  // Temp Edit States
  const [newExp, setNewExp] = useState({
    title: '',
    subtitle: '',
    location: '',
    dateRange: '',
    isRemote: false,
    isCurrent: false,
    bulletsText: ''
  });
  const [expSection, setExpSection] = useState('Primary Roles');

  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    title: '',
    description: '',
    image: '',
    fileUrl: '',
    link: ''
  });

  // CMS Settings States
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [customSectionMarkdown, setCustomSectionMarkdown] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  const moveSectionUp = (idx: number) => {
    const order = localSettings.sectionsOrder && localSettings.sectionsOrder.length > 0
      ? [...localSettings.sectionsOrder]
      : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];
    if (idx <= 0) return;
    const temp = order[idx];
    order[idx] = order[idx - 1];
    order[idx - 1] = temp;
    const newSettings = { ...localSettings, sectionsOrder: order };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  const moveSectionDown = (idx: number) => {
    const order = localSettings.sectionsOrder && localSettings.sectionsOrder.length > 0
      ? [...localSettings.sectionsOrder]
      : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];
    if (idx >= order.length - 1) return;
    const temp = order[idx];
    order[idx] = order[idx + 1];
    order[idx + 1] = temp;
    const newSettings = { ...localSettings, sectionsOrder: order };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  const toggleSection = (id: string) => {
    const order = localSettings.sectionsOrder && localSettings.sectionsOrder.length > 0
      ? [...localSettings.sectionsOrder]
      : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];
    
    let newOrder;
    if (order.includes(id)) {
      newOrder = order.filter(x => x !== id);
    } else {
      newOrder = [...order, id];
    }
    const newSettings = { ...localSettings, sectionsOrder: newOrder };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  const addCustomSection = () => {
    if (!customSectionTitle.trim() || !customSectionMarkdown.trim()) return;
    const id = `custom-${customSectionTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    const customList = localSettings.customSections || [];
    const exists = customList.some(c => c.id === id);
    if (exists) {
      alert('A section with this name/ID already exists.');
      return;
    }
    
    const newCustom = [...customList, { id, title: customSectionTitle, markdown: customSectionMarkdown }];
    const order = localSettings.sectionsOrder && localSettings.sectionsOrder.length > 0
      ? [...localSettings.sectionsOrder]
      : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];
    
    const newSettings = {
      ...localSettings,
      customSections: newCustom,
      sectionsOrder: [...order, id]
    };
    
    setLocalSettings(newSettings);
    handleSave(newSettings);
    setCustomSectionTitle('');
    setCustomSectionMarkdown('');
  };

  const deleteCustomSection = (id: string) => {
    const customList = localSettings.customSections || [];
    const newCustom = customList.filter(c => c.id !== id);
    const order = localSettings.sectionsOrder && localSettings.sectionsOrder.length > 0
      ? [...localSettings.sectionsOrder]
      : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];
    const newOrder = order.filter(x => x !== id);
    
    const newSettings = {
      ...localSettings,
      customSections: newCustom,
      sectionsOrder: newOrder
    };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // AI Chat & Blog Auto-Generation States
  interface AIChatMessage {
    sender: 'ai' | 'user';
    text: string;
    generatedPost?: {
      title: string;
      description: string;
      content: string;
      image: string;
      readTime: string;
      tags: string[];
    };
  }

  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello Super Admin Milan! I am your portfolio AI writing assistant. Tell me what topic you want to write about, or click one of the quick presets below to draft a blog post with tables, images, and full code sections.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedToForm, setCopiedToForm] = useState(false);

  const handleSendChatMessage = async (promptText: string) => {
    if (!promptText.trim() || isAiLoading) return;
    
    // Add User Message
    const userMsg: AIChatMessage = { sender: 'user', text: promptText };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiLoading(true);
    
    const apiKey = localSettings.geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    
    if (apiKey && apiKey.trim() && apiKey !== 'PLACEHOLDER_API_KEY') {
      try {
        const systemPrompt = `You are a technical blog writer. Draft a comprehensive, high-quality blog post about the topic: "${promptText}". 
You must respond ONLY with a JSON object (no markdown wrapping like \`\`\`json) in this exact format:
{
  "title": "A short engaging title",
  "description": "A brief overview of the post",
  "tags": ["Tag1", "Tag2"],
  "readTime": "e.g. 5 MIN READ",
  "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
  "content": "Full markdown content starting with ## headers, using **bold**, inline code \`code\`, a markdown table | col | col |, and at least one Google Drive image reference formatted like ![System Flowchart](https://drive.google.com/file/d/1XyZ-902Jb10y-Z98h8o90y_pqr_xyz/view)"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });
        
        if (!res.ok) {
          throw new Error(`Gemini API returned status ${res.status}`);
        }
        
        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Clean markdown block wrappers if model wrapped it in ```json
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }
        
        const generated = JSON.parse(cleanText);
        
        const aiMsg: AIChatMessage = {
          sender: 'ai',
          text: `I have generated a live blog post about **"${generated.title}"** using Gemini 1.5 Flash! Review the contents below and click the convert button to load them into your editor.`,
          generatedPost: {
            title: generated.title || 'Untitled Blog Post',
            description: generated.description || 'Drafted by Gemini AI.',
            tags: Array.isArray(generated.tags) ? generated.tags : ['AI'],
            readTime: generated.readTime || '5 MIN READ',
            image: generated.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
            content: generated.content || 'Content generation was empty.'
          }
        };
        setChatMessages(prev => [...prev, aiMsg]);
        setIsAiLoading(false);
        return;
      } catch (err: any) {
        console.error('Gemini call failed, falling back to offline generator:', err);
      }
    }
    
    // Fallback Mock Generator
    setTimeout(() => {
      const post = generateAIPost(promptText);
      const aiMsg: AIChatMessage = {
        sender: 'ai',
        text: `[Offline Mode] I have generated a high-fidelity blog post about **"${post.title}"**. It contains formatted tables comparing key concepts, a sample Google Drive image placeholder, and markdown code blocks. Click the button below to load this content directly into your Blog Creator Form!`,
        generatedPost: post
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiLoading(false);
    }, 1200);
  };

  const [newBlog, setNewBlog] = useState<BlogPost>({
    slug: '',
    title: '',
    description: '',
    date: '',
    readTime: '',
    image: '',
    tags: ['AI'],
    content: '',
    resources: [],
    questions: [],
    author: {
      name: 'Milan Sharma',
      role: 'Founder',
      avatar: '/1769519621500.png'
    }
  });

  const [newBlogTag, setNewBlogTag] = useState('');
  const [newBlogResource, setNewBlogResource] = useState({ title: '', url: '' });
  const [newBlogQuestion, setNewBlogQuestion] = useState({ question: '', answer: '' });

  // Skills temp states
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillItem, setNewSkillItem] = useState('');
  const [selectedSkillIdx, setSelectedSkillIdx] = useState<number>(0);

  // Certifications temp states
  const [newCertCategory, setNewCertCategory] = useState('');
  const [newCertItem, setNewCertItem] = useState({ title: '', provider: '', date: '', id: '' });
  const [selectedCertCategoryIdx, setSelectedCertCategoryIdx] = useState<number>(0);

  // Lifestyle temp states
  const [newLifestyle, setNewLifestyle] = useState<LifeStyle>({ title: '', description: '', icon: 'Lightbulb' });

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Real-time listener for database updates & fallback polling
  useEffect(() => {
    loadAnalyticsAndLeads();
    const pollInterval = setInterval(loadAnalyticsAndLeads, 4000);

    let leadsSubscription: any = null;
    let analyticsSubscription: any = null;

    if (supabase) {
      leadsSubscription = supabase
        .channel('realtime-leads-cms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_leads' }, () => {
          loadAnalyticsAndLeads();
        })
        .subscribe();

      analyticsSubscription = supabase
        .channel('realtime-analytics-cms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_analytics' }, () => {
          loadAnalyticsAndLeads();
        })
        .subscribe();
    }

    return () => {
      clearInterval(pollInterval);
      if (supabase) {
        if (leadsSubscription) supabase.removeChannel(leadsSubscription);
        if (analyticsSubscription) supabase.removeChannel(analyticsSubscription);
      }
    };
  }, []);

  // Automatic Debounced Settings Sync
  useEffect(() => {
    if (JSON.stringify(localSettings) === JSON.stringify(settings)) {
      return;
    }

    const timer = setTimeout(() => {
      handleSave(localSettings);
    }, 800);

    return () => clearTimeout(timer);
  }, [localSettings]);

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchGitHubRepos();
    }
    setDbInfo(getDbStatus());
  }, [activeTab]);

  const loadAnalyticsAndLeads = async () => {
    const fetchedLeads = await fetchLeads();
    const fetchedAnalytics = await fetchAnalytics();
    setLeads(fetchedLeads);
    setAnalytics(fetchedAnalytics);
  };

  const fetchGitHubRepos = async () => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return;
    setIsFetchingRepos(true);
    try {
      // Try authenticated fetch
      let response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        // Fallback to public fetch
        response = await fetch(`https://api.github.com/users/${localSettings.github || 'MilannSharma'}/repos?per_page=100&sort=updated`);
      }

      if (response.ok) {
        const data = await response.json();
        setGithubRepos(data);
      }
    } catch (err) {
      console.error('Failed to fetch github repos:', err);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const handleSave = async (updatedSettings: PortfolioSettings) => {
    setSaveStatus('saving');
    const success = await onSaveSettings(updatedSettings);
    if (success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
    setDbInfo(getDbStatus());
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings({
          ...localSettings,
          avatar: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSave = () => {
    handleSave(localSettings);
  };

  // Experience edit handlers (LinkedIn auto-end-dating)
  const addExperience = () => {
    if (!newExp.title || !newExp.subtitle || !newExp.dateRange) return;

    let updatedResumeData = [...localSettings.resumeData];
    const secIdx = updatedResumeData.findIndex(s => s.title === expSection);
    if (secIdx === -1) return;

    const section = { ...updatedResumeData[secIdx] };
    let items = [...section.items];

    let newStartMonth = newExp.dateRange.split(' — ')[0] || newExp.dateRange;

    // LinkedIn Experience Logic:
    // If this is a current position, set all other current positions in this section to end at the new start date.
    if (newExp.isCurrent) {
      items = items.map(item => {
        if (item.isCurrent || item.dateRange.toLowerCase().includes('current')) {
          const prevStart = item.dateRange.split(' — ')[0] || 'Previous';
          return {
            ...item,
            isCurrent: false,
            dateRange: `${prevStart} — ${newStartMonth}`
          };
        }
        return item;
      });
      newExp.dateRange = `${newStartMonth} — Current`;
    }

    const bullets = newExp.bulletsText.split('\n').filter(b => b.trim() !== '');

    const itemToAdd = {
      title: newExp.title,
      subtitle: newExp.subtitle,
      location: newExp.location || undefined,
      dateRange: newExp.dateRange,
      isRemote: newExp.isRemote,
      isCurrent: newExp.isCurrent,
      bullets
    };

    items.unshift(itemToAdd);
    section.items = items;
    updatedResumeData[secIdx] = section;

    const newSettings = { ...localSettings, resumeData: updatedResumeData };
    setLocalSettings(newSettings);
    handleSave(newSettings);

    // Reset Form
    setNewExp({
      title: '',
      subtitle: '',
      location: '',
      dateRange: '',
      isRemote: false,
      isCurrent: false,
      bulletsText: ''
    });
  };

  const deleteExperience = (sectionIdx: number, itemIdx: number) => {
    let updatedResumeData = [...localSettings.resumeData];
    const section = { ...updatedResumeData[sectionIdx] };
    const items = [...section.items];
    items.splice(itemIdx, 1);
    section.items = items;
    updatedResumeData[sectionIdx] = section;

    const newSettings = { ...localSettings, resumeData: updatedResumeData };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // Products CRUD
  const addProduct = () => {
    if (!newProduct.title || !newProduct.description) return;
    const prodId = newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const prodToAdd = { ...newProduct, id: prodId };
    
    const updatedProducts = [...localSettings.products, prodToAdd];
    const newSettings = { ...localSettings, products: updatedProducts };
    setLocalSettings(newSettings);
    handleSave(newSettings);

    setNewProduct({ id: '', title: '', description: '', image: '', fileUrl: '', link: '' });
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = localSettings.products.filter(p => p.id !== id);
    const newSettings = { ...localSettings, products: updatedProducts };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // Blogs CRUD
  const addBlog = () => {
    if (!newBlog.title || !newBlog.content) return;
    const slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const blogToAdd = {
      ...newBlog,
      slug,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const updatedBlogs = [blogToAdd, ...localSettings.blogs];
    const newSettings = { ...localSettings, blogs: updatedBlogs };
    setLocalSettings(newSettings);
    handleSave(newSettings);

    // Reset Blog State
    setNewBlog({
      slug: '',
      title: '',
      description: '',
      date: '',
      readTime: '',
      image: '',
      tags: ['AI'],
      content: '',
      resources: [],
      questions: [],
      author: {
        name: 'Milan Sharma',
        role: 'Founder',
        avatar: '/1769519621500.png'
      }
    });
  };

  const deleteBlog = (slug: string) => {
    const updatedBlogs = localSettings.blogs.filter(b => b.slug !== slug);
    const newSettings = { ...localSettings, blogs: updatedBlogs };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // Skills CRUD
  const addSkillCategory = () => {
    if (!newSkillCategory) return;
    const updatedSkills = [...localSettings.skills, { title: newSkillCategory, items: [] }];
    const newSettings = { ...localSettings, skills: updatedSkills };
    setLocalSettings(newSettings);
    handleSave(newSettings);
    setNewSkillCategory('');
  };

  const addSkillItem = (catIdx: number) => {
    if (!newSkillItem) return;
    const updatedSkills = [...localSettings.skills];
    updatedSkills[catIdx].items.push(newSkillItem);
    
    const newSettings = { ...localSettings, skills: updatedSkills };
    setLocalSettings(newSettings);
    handleSave(newSettings);
    setNewSkillItem('');
  };

  const deleteSkillItem = (catIdx: number, itemIdx: number) => {
    const updatedSkills = [...localSettings.skills];
    updatedSkills[catIdx].items.splice(itemIdx, 1);
    
    const newSettings = { ...localSettings, skills: updatedSkills };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  const deleteSkillCategory = (catIdx: number) => {
    const updatedSkills = localSettings.skills.filter((_, idx) => idx !== catIdx);
    const newSettings = { ...localSettings, skills: updatedSkills };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // Certifications CRUD
  const addCertCategory = () => {
    if (!newCertCategory) return;
    const updatedCerts = [...localSettings.certifications, { category: newCertCategory, items: [] }];
    const newSettings = { ...localSettings, certifications: updatedCerts };
    setLocalSettings(newSettings);
    handleSave(newSettings);
    setNewCertCategory('');
  };

  const addCertItem = (catIdx: number) => {
    if (!newCertItem.title || !newCertItem.provider) return;
    const updatedCerts = [...localSettings.certifications];
    updatedCerts[catIdx].items.push({
      title: newCertItem.title,
      provider: newCertItem.provider,
      date: newCertItem.date || 'Jan 2026',
      id: newCertItem.id || 'N/A'
    });

    const newSettings = { ...localSettings, certifications: updatedCerts };
    setLocalSettings(newSettings);
    handleSave(newSettings);
    setNewCertItem({ title: '', provider: '', date: '', id: '' });
  };

  const deleteCertItem = (catIdx: number, itemIdx: number) => {
    const updatedCerts = [...localSettings.certifications];
    updatedCerts[catIdx].items.splice(itemIdx, 1);

    const newSettings = { ...localSettings, certifications: updatedCerts };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  const deleteCertCategory = (catIdx: number) => {
    const updatedCerts = localSettings.certifications.filter((_, idx) => idx !== catIdx);
    const newSettings = { ...localSettings, certifications: updatedCerts };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // Lifestyle CRUD
  const addLifestyle = () => {
    if (!newLifestyle.title || !newLifestyle.description) return;
    const updatedLifestyle = [...localSettings.lifestyle, newLifestyle];
    const newSettings = { ...localSettings, lifestyle: updatedLifestyle };
    setLocalSettings(newSettings);
    handleSave(newSettings);
    setNewLifestyle({ title: '', description: '', icon: 'Lightbulb' });
  };

  const deleteLifestyle = (idx: number) => {
    const updatedLifestyle = localSettings.lifestyle.filter((_, i) => i !== idx);
    const newSettings = { ...localSettings, lifestyle: updatedLifestyle };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // GitHub Repos Selector import
  const toggleRepoImport = (repo: any) => {
    const currentList = localSettings.githubSettings?.importedRepoIds || [];
    let updatedList = [...currentList];
    const repoIdStr = String(repo.id);

    const isCurrentlyImported = updatedList.includes(repoIdStr);
    let updatedProjects = [...localSettings.projects];

    if (isCurrentlyImported) {
      updatedList = updatedList.filter(id => id !== repoIdStr);
      // Remove from projects
      updatedProjects = updatedProjects.filter(p => p.id !== `github-${repo.name.toLowerCase()}`);
    } else {
      updatedList.push(repoIdStr);
      // Add to projects
      updatedProjects.push({
        id: `github-${repo.name.toLowerCase()}`,
        name: repo.name,
        description: repo.description || 'No description provided.',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        link: repo.html_url
      });
    }

    const newSettings = {
      ...localSettings,
      projects: updatedProjects,
      githubSettings: {
        importedRepoIds: updatedList
      }
    };
    setLocalSettings(newSettings);
    handleSave(newSettings);
  };

  // PDF Lead Export
  const downloadLeadsPDF = () => {
    if (leads.length === 0) return;

    const doc = new jsPDF();
    
    // Header Style
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 220, 40, 'F');
    
    doc.setTextColor(245, 158, 11); // Amber
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Milan Sharma Portfolio Leads", 20, 25);
    
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()} | Total Leads: ${leads.length}`, 20, 33);

    let y = 55;
    leads.forEach((lead, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }

      // Card Background border
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(250, 250, 250);
      doc.rect(15, y - 5, 180, 42, 'FD');

      // Lead Title
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${idx + 1}. Name: ${lead.name}`, 20, y + 2);

      // Metadata
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(`Email: ${lead.email}   |   Date: ${new Date(lead.created_at).toLocaleDateString()}`, 20, y + 8);

      // Subject
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Subject: ${lead.subject}`, 20, y + 15);

      // Message content
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const textLines = doc.splitTextToSize(`Message: ${lead.message}`, 170);
      doc.text(textLines, 20, y + 21);

      y += 50;
    });

    doc.save(`Milan_Sharma_Portfolio_Leads_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="flex h-screen w-screen bg-[#090909] text-gray-300 overflow-hidden font-sans">
      
      {/* CMS Side Navigation */}
      <aside className="w-[280px] bg-[#111111] border-r border-[#222] flex flex-col justify-between p-6 shrink-0 h-full select-none">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 pb-6 border-b border-[#222]">
            <h1 className="text-lg font-black text-white tracking-tighter flex items-center gap-2">
              Milan CMS <span className="text-[#f59e0b] text-xs font-mono uppercase bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded-lg">Admin</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Control Panel v2.0</p>
          </div>
          
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 no-scrollbar">
            <CMSNavItem active={activeTab === 'dashboard'} icon={<LayoutDashboard size={15} />} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
            <CMSNavItem active={activeTab === 'leads'} icon={<Users size={15} />} label="Leads Inbox" onClick={() => setActiveTab('leads')} />
            <CMSNavItem active={activeTab === 'profile'} icon={<User size={15} />} label="Profile & Bio" onClick={() => setActiveTab('profile')} />
            <CMSNavItem active={activeTab === 'experience'} icon={<Briefcase size={15} />} label="Experience" onClick={() => setActiveTab('experience')} />
            <CMSNavItem active={activeTab === 'products'} icon={<ChevronRight size={15} />} label="Products Section" onClick={() => setActiveTab('products')} />
            <CMSNavItem active={activeTab === 'projects'} icon={<FolderGit2 size={15} />} label="GitHub & Projects" onClick={() => setActiveTab('projects')} />
            <CMSNavItem active={activeTab === 'blogs'} icon={<BookOpen size={15} />} label="Blogs Manager" onClick={() => setActiveTab('blogs')} />
            <CMSNavItem active={activeTab === 'skills_certs'} icon={<Wrench size={15} />} label="Skills & Certs" onClick={() => setActiveTab('skills_certs')} />
            <CMSNavItem active={activeTab === 'database'} icon={<Database size={15} />} label="Supabase DB" onClick={() => setActiveTab('database')} />
            <CMSNavItem active={activeTab === 'settings'} icon={<Settings size={15} />} label="CMS Settings" onClick={() => setActiveTab('settings')} />
          </nav>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center justify-center gap-2.5 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all w-full mt-4"
        >
          <LogOut size={14} /> Log Out Session
        </button>
      </aside>

      {/* CMS Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#090909] flex flex-col h-full overflow-hidden">
        
        {/* Header Save Bar */}
        <div className="flex items-center justify-between border-b border-[#222] px-8 py-6 bg-[#111111]/40 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white capitalize">{activeTab.replace('_', ' & ')} Settings</h2>
            <p className="text-gray-500 text-xs mt-1">Configure and manage your portfolio website details.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {saveStatus === 'saving' && (
              <span className="text-xs text-gray-400 flex items-center gap-2 bg-[#121212] border border-[#222] px-3.5 py-1.5 rounded-xl">
                <RefreshCw size={12} className="animate-spin text-[#f59e0b]" /> 
                Auto-saving...
              </span>
            )}
            {saveStatus === 'success' && (
              <span className="text-xs text-green-400 flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-xl">
                <CheckCircle size={12} /> 
                Saved Real-time
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-400 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-xl">
                <AlertTriangle size={12} /> 
                Sync Failed
              </span>
            )}
            {saveStatus === 'idle' && (
              <span className="text-xs text-gray-500 flex items-center gap-1.5 bg-[#121212] border border-[#222]/60 px-3.5 py-1.5 rounded-xl select-none">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live Connected
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content Workspace */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Database status banner */}
              {dbInfo.status !== 'connected' && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl flex items-center gap-3 text-xs">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>
                    <strong>Database Warning:</strong> Supabase integration status is <strong>{dbInfo.status.toUpperCase()}</strong>.
                    Please click the "Supabase Connection" tab to complete setting up your database tables!
                  </span>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title="Real-Time Visits" value={analytics.totalVisits} trend="+12% this week" color="#3b82f6" />
                <DashboardCard title="Resume Downloads" value={analytics.totalDownloads} trend="+4% this week" color="#f59e0b" />
                <DashboardCard title="Submitted Leads" value={analytics.recentLeadsCount} trend="Active responses" color="#10b981" />
              </div>

              {/* Trends chart simulation */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#222]">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Weekly Visits & Downloads Trends</h3>
                
                {analytics.dailyTrends.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-600 text-xs">
                    No analytics logs recorded yet. Events will appear once website is visited.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-end justify-between h-48 pt-4 gap-2">
                      {analytics.dailyTrends.map((trend, i) => {
                        const maxVal = Math.max(...analytics.dailyTrends.map(t => Math.max(t.visits, t.downloads)), 1);
                        const visitsHeight = (trend.visits / maxVal) * 100;
                        const downloadsHeight = (trend.downloads / maxVal) * 100;

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div className="w-full flex items-end gap-1 justify-center h-full">
                              {/* Visits Bar */}
                              <div 
                                style={{ height: `${Math.max(visitsHeight, 5)}%` }} 
                                className="w-3 bg-blue-500 rounded-t-sm relative group"
                                title={`${trend.visits} visits`}
                              >
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">{trend.visits} v</span>
                              </div>
                              {/* Downloads Bar */}
                              <div 
                                style={{ height: `${Math.max(downloadsHeight, 5)}%` }} 
                                className="w-3 bg-[#f59e0b] rounded-t-sm relative group"
                                title={`${trend.downloads} downloads`}
                              >
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">{trend.downloads} d</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase">{trend.date}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 justify-center text-[10px] font-bold text-gray-500 pt-2 border-t border-[#222]">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Page Views</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full"></span> Resume Downloads</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Leads Inbox</h3>
                  <p className="text-gray-500 text-xs">Form inquiries submitted through the contact page.</p>
                </div>
                {leads.length > 0 && (
                  <button 
                    onClick={downloadLeadsPDF}
                    className="flex items-center gap-2 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-[#f59e0b]/30"
                  >
                    <FileDown size={14} /> Export to PDF
                  </button>
                )}
              </div>

              {leads.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-[#222] text-center text-gray-500 text-xs">
                  No form submissions received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#222] flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-white font-bold text-sm">{lead.name}</h4>
                          <span className="text-[#f59e0b] text-xs font-mono">{lead.email}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="bg-[#121212] p-4 rounded-xl border border-[#222]/40 text-xs space-y-2">
                        <div className="text-white font-black">Subject: {lead.subject}</div>
                        <p className="text-gray-400 leading-relaxed font-medium">{lead.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 bg-[#1a1a1a] p-6 rounded-2xl border border-[#222]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile Pic Upload */}
                <div className="flex flex-col items-center justify-center p-6 border border-[#222] rounded-2xl bg-[#121212]">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-[#f59e0b]/30 relative bg-[#1a1a1a]">
                    <img src={localSettings.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <label htmlFor="avatar-upload-input" className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 hover:bg-[#f59e0b]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all">
                    Upload Photo
                  </label>
                  <input id="avatar-upload-input" title="Avatar Image Upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <span className="text-[9px] text-gray-600 mt-2 font-mono">PNG / JPG up to 1MB</span>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CMSInputField label="Full Name" value={localSettings.name} onChange={val => setLocalSettings({...localSettings, name: val})} />
                  <CMSInputField label="Professional Role" value={localSettings.role} onChange={val => setLocalSettings({...localSettings, role: val})} />
                  <CMSInputField label="Location" value={localSettings.location} onChange={val => setLocalSettings({...localSettings, location: val})} />
                  <CMSInputField label="Email Address" value={localSettings.email} onChange={val => setLocalSettings({...localSettings, email: val})} />
                  <CMSInputField label="Phone Number" value={localSettings.phone} onChange={val => setLocalSettings({...localSettings, phone: val})} />
                  <CMSInputField label="Resume PDF Link / Filename" value={localSettings.resumeLink} onChange={val => setLocalSettings({...localSettings, resumeLink: val})} />
                  <CMSInputField label="GitHub Username" value={localSettings.github} onChange={val => setLocalSettings({...localSettings, github: val})} />
                  <CMSInputField label="LinkedIn Username" value={localSettings.linkedin} onChange={val => setLocalSettings({...localSettings, linkedin: val})} />
                  <CMSInputField label="Gemini API Key" value={localSettings.geminiApiKey || ''} onChange={val => setLocalSettings({...localSettings, geminiApiKey: val})} />
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-2 mt-4">
                <label htmlFor="bio-textarea" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">About Bio Description</label>
                <textarea 
                  id="bio-textarea"
                  title="About Bio Description"
                  placeholder="Enter your bio description"
                  rows={4}
                  value={localSettings.bio}
                  onChange={e => setLocalSettings({...localSettings, bio: e.target.value})}
                  className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 text-xs font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-8">
              
              {/* Add experience form */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Add Position (LinkedIn dating system)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="exp-section-select" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Timeline Section</label>
                    <select 
                      id="exp-section-select"
                      title="Timeline Section"
                      value={expSection}
                      onChange={e => setExpSection(e.target.value)}
                      className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 text-xs font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all"
                    >
                      <option value="Primary Roles">Primary Roles / Experience</option>
                      <option value="Education">Education</option>
                      <option value="Freelance Services">Freelance / Freelance Services</option>
                    </select>
                  </div>
                  
                  <CMSInputField label="Job Title / Degree / Service" value={newExp.title} onChange={val => setNewExp({...newExp, title: val})} />
                  <CMSInputField label="Company / School / Subtitle" value={newExp.subtitle} onChange={val => setNewExp({...newExp, subtitle: val})} />
                  <CMSInputField label="Location (e.g. Pune, India)" value={newExp.location} onChange={val => setNewExp({...newExp, location: val})} />
                  <CMSInputField label="Start Date / Month (e.g. June 2026)" value={newExp.dateRange} onChange={val => setNewExp({...newExp, dateRange: val})} />
                  
                  <div className="flex items-center gap-6 pt-6">
                    <label htmlFor="is-remote-checkbox" className="flex items-center gap-3 text-xs font-bold text-gray-400 select-none cursor-pointer">
                      <input 
                        id="is-remote-checkbox"
                        type="checkbox" 
                        title="Remote Job"
                        checked={newExp.isRemote}
                        onChange={e => setNewExp({...newExp, isRemote: e.target.checked})}
                        className="rounded bg-[#121212] border-[#252525] text-[#f59e0b] focus:ring-[#f59e0b]"
                      />
                      Remote Job
                    </label>
                    <label htmlFor="is-current-checkbox" className="flex items-center gap-3 text-xs font-bold text-gray-400 select-none cursor-pointer">
                      <input 
                        id="is-current-checkbox"
                        type="checkbox" 
                        title="Current Position"
                        checked={newExp.isCurrent}
                        onChange={e => setNewExp({...newExp, isCurrent: e.target.checked})}
                        className="rounded bg-[#121212] border-[#252525] text-[#f59e0b] focus:ring-[#f59e0b]"
                      />
                      Current Position
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="exp-bullets-textarea" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Bullets Details (One item per line)</label>
                  <textarea 
                    id="exp-bullets-textarea"
                    rows={3}
                    title="Bullets Details"
                    placeholder="ETL process development&#10;Database optimization"
                    value={newExp.bulletsText}
                    onChange={e => setNewExp({...newExp, bulletsText: e.target.value})}
                    className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 text-xs font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={addExperience}
                  className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  <Plus size={14} /> Add experience timeline item
                </button>
              </div>

              {/* Display existing timeline positions */}
              <div className="space-y-6">
                {localSettings.resumeData.map((section, sIdx) => (
                  <div key={sIdx} className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full"></span>
                      {section.title}
                    </h4>
                    
                    {section.items.length === 0 ? (
                      <p className="text-xs text-gray-500">No items listed in this category.</p>
                    ) : (
                      <div className="divide-y divide-[#222]/40 space-y-4">
                        {section.items.map((item, iIdx) => (
                          <div key={iIdx} className="pt-4 first:pt-0 flex items-start justify-between gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{item.title}</span>
                                <span className="text-[#f59e0b] font-bold">— {item.subtitle}</span>
                                {item.isCurrent && <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Current</span>}
                              </div>
                              <div className="text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                                {item.dateRange} {item.location && `| ${item.location}`} {item.isRemote && `| Remote`}
                              </div>
                              <ul className="list-disc pl-4 text-gray-400 space-y-1 mt-2">
                                {item.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                              </ul>
                            </div>
                            <button 
                              onClick={() => deleteExperience(sIdx, iIdx)}
                              aria-label="Delete Position"
                              title="Delete Position"
                              className="text-red-500/60 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product Creator Form */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Add Product Item</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CMSInputField label="Product Title" value={newProduct.title} onChange={val => setNewProduct({...newProduct, title: val})} />
                  <CMSInputField label="Product Image URL (Unsplash or simpleicon)" value={newProduct.image} onChange={val => setNewProduct({...newProduct, image: val})} />
                  <CMSInputField label="File Download URL (PDF/ZIP Link)" value={newProduct.fileUrl || ''} onChange={val => setNewProduct({...newProduct, fileUrl: val})} />
                  <CMSInputField label="External Link (LinkedIn/Product Hunt)" value={newProduct.link || ''} onChange={val => setNewProduct({...newProduct, link: val})} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="product-description-textarea" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Product Description</label>
                  <textarea 
                    id="product-description-textarea"
                    rows={3}
                    title="Product Description"
                    placeholder="Enter details of the product..."
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 text-xs font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={addProduct}
                  className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  <Plus size={14} /> Add Product to Portfolio
                </button>
              </div>

              {/* Current Products list */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Active Products ({localSettings.products.length})</h3>
                
                {localSettings.products.length === 0 ? (
                  <p className="text-xs text-gray-500">No products added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {localSettings.products.map(prod => (
                      <div key={prod.id} className="bg-[#121212] p-4 rounded-xl border border-[#222] flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          {prod.image && <img src={prod.image} className="w-12 h-12 object-cover rounded-lg border border-[#222]" alt="" />}
                          <div>
                            <h4 className="text-white font-bold text-xs">{prod.title}</h4>
                            <p className="text-gray-500 text-[10px] line-clamp-1">{prod.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteProduct(prod.id)}
                          aria-label="Delete Product"
                          title="Delete Product"
                          className="text-red-500/60 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              {/* Local projects management */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-4">Portfolio Projects List ({localSettings.projects.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localSettings.projects.map(proj => (
                    <div key={proj.id} className="bg-[#121212] p-4 rounded-xl border border-[#222] flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-white font-bold text-xs">{proj.name}</h4>
                        <p className="text-gray-500 text-[10px] line-clamp-1 mt-0.5">{proj.description}</p>
                        {proj.link && <a href={proj.link} target="_blank" className="text-[9px] text-[#f59e0b] hover:underline flex items-center gap-1 mt-1">Visit Link <ExternalLink size={8} /></a>}
                      </div>
                      <button 
                        onClick={() => {
                          const updated = localSettings.projects.filter(p => p.id !== proj.id);
                          const newSettings = { ...localSettings, projects: updated };
                          setLocalSettings(newSettings);
                          handleSave(newSettings);
                        }}
                        aria-label="Delete Project"
                        title="Delete Project"
                        className="text-red-500/60 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Fetch Settings */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Import Repositories from GitHub</h3>
                    <p className="text-gray-500 text-xs">Excludes or includes repositories dynamically on your public profile.</p>
                  </div>
                  <button 
                    onClick={fetchGitHubRepos}
                    className="flex items-center gap-2 bg-[#121212] border border-[#252525] hover:bg-[#1c1c1c] text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    <RefreshCw size={12} className={isFetchingRepos ? 'animate-spin' : ''} /> Refresh repos list
                  </button>
                </div>

                {!process.env.GITHUB_TOKEN && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <span>No <code>GITHUB_TOKEN</code> provided in settings. Make sure token is set to load private/detailed repo lists.</span>
                  </div>
                )}

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search github repositories..."
                    title="Search GitHub Repositories"
                    aria-label="Search GitHub Repositories"
                    value={repoSearch}
                    onChange={e => setRepoSearch(e.target.value)}
                    className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-gray-600 mb-4"
                  />
                </div>

                {isFetchingRepos ? (
                  <div className="py-12 flex items-center justify-center gap-3 text-xs text-gray-500 font-bold">
                    <RefreshCw size={16} className="animate-spin text-[#f59e0b]" />
                    Fetching Milan Sharma Repositories...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                    {githubRepos
                      .filter(repo => repo.name.toLowerCase().includes(repoSearch.toLowerCase()))
                      .map(repo => {
                        const repoIdStr = String(repo.id);
                        const isImported = (localSettings.githubSettings?.importedRepoIds || []).includes(repoIdStr);
                        
                        return (
                          <div 
                            key={repo.id} 
                            onClick={() => toggleRepoImport(repo)}
                            className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                              isImported 
                                ? 'bg-[#f59e0b]/5 border-[#f59e0b]/40 shadow-[0_0_15px_rgba(245,158,11,0.03)]' 
                                : 'bg-[#121212] border-[#222] hover:border-[#252525]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                              <Github size={18} className={isImported ? 'text-[#f59e0b]' : 'text-gray-600'} />
                              <div className="min-w-0">
                                <h4 className="text-white font-bold text-xs truncate">{repo.name}</h4>
                                <p className="text-gray-500 text-[9px] truncate mt-0.5">{repo.description || 'No description'}</p>
                              </div>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={isImported}
                              readOnly
                              title={`Import repository ${repo.name}`}
                              aria-label={`Import repository ${repo.name}`}
                              className="rounded bg-[#121212] border-[#252525] text-[#f59e0b] focus:ring-[#f59e0b] shrink-0"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Form & Active Blogs (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Blog Creator Form */}
                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Add Blog Post</h3>
                    {copiedToForm && (
                      <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg font-bold animate-pulse">
                        ✨ Imported from AI Chat!
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CMSInputField label="Blog Title" value={newBlog.title} onChange={val => setNewBlog({...newBlog, title: val})} />
                    <CMSInputField label="Brief Description" value={newBlog.description} onChange={val => setNewBlog({...newBlog, description: val})} />
                    <CMSInputField label="Cover Image URL (Google Drive / Unsplash)" value={newBlog.image} onChange={val => setNewBlog({...newBlog, image: val})} />
                    <CMSInputField label="Read Time (e.g. 10 MIN READ)" value={newBlog.readTime || ''} onChange={val => setNewBlog({...newBlog, readTime: val})} />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label htmlFor="blog-tag-input" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newBlog.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold bg-[#121212] border border-[#252525] text-[#f59e0b] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          {tag}
                          <button type="button" onClick={() => setNewBlog({...newBlog, tags: newBlog.tags.filter(t => t !== tag)})} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        id="blog-tag-input"
                        type="text" 
                        placeholder="Add tag (e.g. AI, Trends)"
                        title="Add Tag"
                        value={newBlogTag}
                        onChange={e => setNewBlogTag(e.target.value)}
                        className="bg-[#121212] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newBlogTag && !newBlog.tags.includes(newBlogTag as any)) {
                            setNewBlog({...newBlog, tags: [...newBlog.tags, newBlogTag as any]});
                            setNewBlogTag('');
                          }
                        }}
                        className="bg-[#121212] hover:bg-[#1a1a1a] text-white px-4 py-2 border border-[#252525] rounded-xl text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Markdown content */}
                  <div className="space-y-2">
                    <label htmlFor="blog-markdown-textarea" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Blog Markdown Content</label>
                    <textarea 
                      id="blog-markdown-textarea"
                      rows={6}
                      title="Blog Markdown Content"
                      placeholder="## Introduction&#10;Write post body here. Support ## titles, **bold** text, structured | tables |, and ![alt](image_url)."
                      value={newBlog.content}
                      onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                      className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 text-xs font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all font-mono"
                    />
                  </div>

                  <button 
                    onClick={addBlog}
                    className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={14} /> Add Blog Post
                  </button>
                </div>

                {/* List of current blogs */}
                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Active Blogs ({localSettings.blogs.length})</h3>
                  
                  {localSettings.blogs.length === 0 ? (
                    <p className="text-xs text-gray-500">No blog posts added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {localSettings.blogs.map(blog => (
                        <div key={blog.slug} className="bg-[#121212] p-4 rounded-xl border border-[#222] flex items-center justify-between gap-4">
                          <div className="flex gap-4 items-center">
                            {blog.image && <img src={blog.image} className="w-12 h-12 object-cover rounded-lg border border-[#222]" alt="" />}
                            <div>
                              <h4 className="text-white font-bold text-xs">{blog.title}</h4>
                              <p className="text-gray-500 text-[9px]">{blog.date} | {blog.readTime || '3 MIN READ'}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteBlog(blog.slug)}
                            aria-label="Delete Blog Post"
                            title="Delete Blog Post"
                            className="text-red-500/60 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: AI Writer Chatbot (5 cols) */}
              <div className="lg:col-span-5 bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] flex flex-col h-[650px] relative">
                <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-[#f59e0b]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Writing Assistant</h3>
                  </div>
                  <span className="text-[9px] text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 border border-[#f59e0b]/30 rounded font-black tracking-widest uppercase">
                    LLM Draft Mode
                  </span>
                </div>

                {/* Messages Board */}
                <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 no-scrollbar">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">
                        {msg.sender === 'user' ? 'Super Admin' : 'NeuralPath AI'}
                      </span>
                      <div className={`p-3.5 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-white rounded-tr-none' 
                          : 'bg-[#121212] border border-[#222] text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.text}

                        {/* Special interactive card if a blog was generated */}
                        {msg.generatedPost && (
                          <div className="mt-4 p-3 bg-[#1a1a1a] border border-[#252525] rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-wider">{msg.generatedPost.tags[0]}</span>
                              <span className="text-[9px] text-gray-500 uppercase tracking-wider">{msg.generatedPost.readTime}</span>
                            </div>
                            <h4 className="text-white font-bold text-xs leading-snug">{msg.generatedPost.title}</h4>
                            <p className="text-gray-500 text-[10px] line-clamp-2 leading-relaxed">{msg.generatedPost.description}</p>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (!msg.generatedPost) return;
                                setNewBlog({
                                  slug: msg.generatedPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                                  title: msg.generatedPost.title,
                                  description: msg.generatedPost.description,
                                  date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                                  readTime: msg.generatedPost.readTime,
                                  image: msg.generatedPost.image,
                                  tags: msg.generatedPost.tags as any[],
                                  content: msg.generatedPost.content,
                                  resources: [
                                    { title: 'Official Documentation', url: 'https://supabase.com' }
                                  ],
                                  questions: [
                                    { question: 'What is the main takeaway of this post?', answer: 'Applying standard optimizations and understanding runtime behavior is critical to web performance.' }
                                  ],
                                  author: {
                                    name: localSettings.name || 'Milan Sharma',
                                    role: 'Founder',
                                    avatar: localSettings.avatar || '/1769519621500.png'
                                  }
                                });
                                setCopiedToForm(true);
                                setTimeout(() => setCopiedToForm(false), 3000);
                              }}
                              className="w-full mt-2 bg-[#f59e0b] hover:bg-white text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md"
                            >
                              <Sparkles size={11} /> Convert to Blog Form
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">NeuralPath AI</span>
                      <div className="p-3.5 bg-[#121212] border border-[#222] text-gray-400 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
                        <Cpu className="animate-spin text-[#f59e0b]" size={14} />
                        Thinking and writing structured layout...
                      </div>
                    </div>
                  )}
                </div>

                {/* Preset Suggestions Chips */}
                <div className="pb-3 flex flex-wrap gap-1.5 border-t border-[#222]/60 pt-3">
                  <button 
                    type="button"
                    onClick={() => handleSendChatMessage('Draft a post about Python performance tips')}
                    className="text-[10px] font-bold bg-[#121212] hover:bg-[#1a1a1a] border border-[#222] text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    💡 Python Optimization
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSendChatMessage('Draft a post about Vite and React bundling benefits')}
                    className="text-[10px] font-bold bg-[#121212] hover:bg-[#1a1a1a] border border-[#222] text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    ⚡ React & Vite Bundles
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSendChatMessage('Draft a post about Supabase Realtime WebSocket features')}
                    className="text-[10px] font-bold bg-[#121212] hover:bg-[#1a1a1a] border border-[#222] text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    🌐 Supabase Realtime
                  </button>
                </div>

                {/* Input form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage(chatInput);
                  }}
                  className="flex gap-2"
                >
                  <input 
                    type="text" 
                    placeholder="Type blog post topic..."
                    title="AI Chat Topic Input"
                    aria-label="AI Chat Topic Input"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={isAiLoading}
                    className="flex-1 bg-[#121212] border border-[#222] focus:border-[#f59e0b]/60 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={isAiLoading || !chatInput.trim()}
                    aria-label="Send Message"
                    title="Send Message"
                    className="bg-[#f59e0b] hover:bg-white text-black p-3.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

            </div>
          )}

          {activeTab === 'skills_certs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Skills manager */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Skills Categories</h3>
                  <p className="text-gray-500 text-xs mt-1">Organize skill tags on your profile.</p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="New skill category..."
                    title="New Skill Category Name"
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value)}
                    className="flex-1 bg-[#121212] border border-[#252525] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-gray-600"
                  />
                  <button 
                    onClick={addSkillCategory}
                    className="bg-[#f59e0b] hover:bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {localSettings.skills.map((skill, catIdx) => (
                    <div key={catIdx} className="bg-[#121212] p-4 rounded-xl border border-[#222] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs uppercase tracking-wider">{skill.title}</span>
                        <button onClick={() => deleteSkillCategory(catIdx)} aria-label="Delete Skill Category" title="Delete Skill Category" className="text-red-500/60 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg"><Trash2 size={12} /></button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {skill.items.map((item, itemIdx) => (
                          <span key={itemIdx} className="text-[10px] bg-[#1a1a1a] border border-[#222] text-gray-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                            {item}
                            <button onClick={() => deleteSkillItem(catIdx, itemIdx)} aria-label="Delete Skill Item" title="Delete Skill Item" className="hover:text-red-500 font-bold">&times;</button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <input 
                          type="text" 
                          placeholder="New skill..."
                          title="New skill tag"
                          onChange={e => setNewSkillItem(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              addSkillItem(catIdx);
                            }
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-[#222] rounded-lg px-3 py-1.5 text-[11px] text-white focus:outline-none"
                        />
                        <button 
                          onClick={() => addSkillItem(catIdx)}
                          className="bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-lg text-[10px] font-bold border border-[#f59e0b]/20"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Manager */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Certifications Categories</h3>
                  <p className="text-gray-500 text-xs mt-1">Organize certifications on your profile.</p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="New category (e.g. AI & ML)..."
                    title="New Certificate Category Name"
                    value={newCertCategory}
                    onChange={e => setNewCertCategory(e.target.value)}
                    className="flex-1 bg-[#121212] border border-[#252525] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-gray-600"
                  />
                  <button 
                    onClick={addCertCategory}
                    className="bg-[#f59e0b] hover:bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {localSettings.certifications.map((cat, catIdx) => (
                    <div key={catIdx} className="bg-[#121212] p-4 rounded-xl border border-[#222] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs uppercase tracking-wider">{cat.category}</span>
                        <button onClick={() => deleteCertCategory(catIdx)} aria-label="Delete Certificate Category" title="Delete Certificate Category" className="text-red-500/60 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg"><Trash2 size={12} /></button>
                      </div>

                      <div className="divide-y divide-[#222]/40 space-y-2">
                        {cat.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="pt-2 first:pt-0 flex items-center justify-between gap-4 text-[11px]">
                            <div>
                              <div className="text-white font-bold">{item.title}</div>
                              <div className="text-gray-500">{item.provider} | {item.date}</div>
                            </div>
                            <button onClick={() => deleteCertItem(catIdx, itemIdx)} aria-label="Delete Certificate Item" title="Delete Certificate Item" className="text-red-500/50 hover:text-red-500"><Trash2 size={12} /></button>
                          </div>
                        ))}
                      </div>

                      {/* Add certification form */}
                      <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#222]/40 space-y-2 mt-2">
                        <input 
                          type="text" 
                          placeholder="Cert Title"
                          title="Certificate Title"
                          value={selectedCertCategoryIdx === catIdx ? newCertItem.title : ''}
                          onChange={e => {
                            setSelectedCertCategoryIdx(catIdx);
                            setNewCertItem({...newCertItem, title: e.target.value});
                          }}
                          className="w-full bg-[#121212] border border-[#222] rounded px-2 py-1 text-[10px] text-white"
                        />
                        <input 
                          type="text" 
                          placeholder="Provider"
                          title="Certification Provider"
                          value={selectedCertCategoryIdx === catIdx ? newCertItem.provider : ''}
                          onChange={e => {
                            setSelectedCertCategoryIdx(catIdx);
                            setNewCertItem({...newCertItem, provider: e.target.value});
                          }}
                          className="w-full bg-[#121212] border border-[#222] rounded px-2 py-1 text-[10px] text-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            placeholder="Date"
                            title="Certification Date"
                            value={selectedCertCategoryIdx === catIdx ? newCertItem.date : ''}
                            onChange={e => {
                              setSelectedCertCategoryIdx(catIdx);
                              setNewCertItem({...newCertItem, date: e.target.value});
                            }}
                            className="bg-[#121212] border border-[#222] rounded px-2 py-1 text-[10px] text-white"
                          />
                          <input 
                            type="text" 
                            placeholder="ID / Cred"
                            title="Credential Link or ID"
                            value={selectedCertCategoryIdx === catIdx ? newCertItem.id : ''}
                            onChange={e => {
                              setSelectedCertCategoryIdx(catIdx);
                              setNewCertItem({...newCertItem, id: e.target.value});
                            }}
                            className="bg-[#121212] border border-[#222] rounded px-2 py-1 text-[10px] text-white"
                          />
                        </div>
                        <button 
                          onClick={() => addCertItem(catIdx)}
                          className="w-full bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/20 py-1 rounded text-[9px] font-black uppercase"
                        >
                          Save Certificate
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-6">
              <div>
                <h3 className="text-base font-black text-white">Supabase Cloud Sync</h3>
                <p className="text-gray-500 text-xs">Examine environment bindings and synchronize database tables.</p>
              </div>

              {/* Status Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#121212] border border-[#222] rounded-xl space-y-2">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SUPABASE CONNECTION STATUS</div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${dbInfo.status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></span>
                    <span className="text-white font-bold text-sm uppercase">{dbInfo.status.replace('_', ' ')}</span>
                  </div>
                  {dbInfo.error && <p className="text-red-400 text-[10px] font-medium leading-relaxed mt-1">{dbInfo.error}</p>}
                </div>

                <div className="p-4 bg-[#121212] border border-[#222] rounded-xl space-y-2">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">DATABASE TARGET CONFIG</div>
                  <div className="text-[11px] font-mono text-gray-400 select-all overflow-x-auto truncate">
                    URL: {process.env.SUPABASE_URL || 'Missing SUPABASE_URL key'}
                  </div>
                  <div className="text-[11px] font-mono text-gray-500 truncate">
                    ANON_KEY: {process.env.SUPABASE_ANON_KEY ? '••••••••••••••••••••••••••••••••' : 'Missing ANON_KEY'}
                  </div>
                </div>
              </div>

              {/* SQL Migration Setup Guide */}
              {dbInfo.status === 'tables_missing' && (
                <div className="p-5 bg-[#d97706]/10 border border-[#d97706]/20 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-[#d97706] shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-white font-black text-xs uppercase tracking-wide">SQL Migration Required</h4>
                      <p className="text-gray-400 text-xs leading-relaxed mt-1">
                        Supabase is connected, but the required database tables do not exist. Copy the SQL script below, open your <strong>Supabase Dashboard</strong> &rarr; <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>, paste the script, and hit <strong>Run</strong>!
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="bg-[#121212] p-4 rounded-xl border border-[#252525] text-[10px] font-mono text-gray-300 overflow-x-auto max-h-48 select-all leading-normal">
                      {SQL_SCHEMA}
                    </pre>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(SQL_SCHEMA);
                        alert('SQL Schema script copied to clipboard!');
                      }}
                      className="absolute top-3 right-3 bg-[#1a1a1a] hover:bg-[#222] text-xs font-bold text-gray-400 border border-[#333] px-3 py-1 rounded"
                    >
                      Copy SQL
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-base font-black text-white">CMS Settings</h3>
                <p className="text-gray-500 text-xs">Configure your Gemini API access and customize your portfolio landing page sections.</p>
              </div>

              {/* Gemini API Key configuration */}
              <div className="bg-[#121212] p-5 rounded-2xl border border-[#222]/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center border border-[#f59e0b]/20">
                    <Sparkles size={14} className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider">Gemini API Configuration</h4>
                    <p className="text-gray-500 text-[10px]">Provide your Gemini API key to enable AI-powered writing assistant for blogs.</p>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type={showGeminiKey ? "text" : "password"}
                    value={localSettings.geminiApiKey || ''}
                    onChange={e => {
                      const newSettings = { ...localSettings, geminiApiKey: e.target.value };
                      setLocalSettings(newSettings);
                      handleSave(newSettings);
                    }}
                    placeholder="Enter Gemini API Key (stored securely in DB)"
                    title="Gemini API Key"
                    aria-label="Gemini API Key"
                    className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl pl-4 pr-12 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    aria-label="Toggle password visibility"
                    title="Toggle password visibility"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Page Sections Order Manager */}
              <div className="bg-[#121212] p-5 rounded-2xl border border-[#222]/80 space-y-6">
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Portfolio Sections Order</h4>
                  <p className="text-gray-500 text-[10px]">Arrange, enable, or disable components rendering on the public landing page.</p>
                </div>

                {/* List of active sections */}
                <div className="space-y-2">
                  {(() => {
                    const activeOrder = localSettings.sectionsOrder && localSettings.sectionsOrder.length > 0
                      ? localSettings.sectionsOrder
                      : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];

                    const getSectionLabel = (id: string) => {
                      if (id === 'about') return 'Milan Bio Section';
                      if (id === 'stats') return 'Coding Stats / Globe Section';
                      if (id === 'skills') return 'Skills Section';
                      if (id === 'projects') return 'Featured Projects Section';
                      if (id === 'products') return 'Products List Section';
                      if (id === 'certifications') return 'Certifications Section';
                      if (id === 'lifestyle') return 'Life Style Section';
                      
                      const custom = localSettings.customSections?.find(c => c.id === id);
                      return custom ? `Custom: ${custom.title}` : id;
                    };

                    return (
                      <div className="space-y-2 max-w-xl">
                        {activeOrder.map((secId, idx) => (
                          <div 
                            key={secId} 
                            className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-xl border border-[#252525]/85 group"
                          >
                            <span className="text-xs font-bold text-gray-300">
                              {idx + 1}. {getSectionLabel(secId)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => moveSectionUp(idx)}
                                disabled={idx === 0}
                                aria-label="Move Section Up"
                                title="Move Section Up"
                                className="p-1.5 bg-[#121212] hover:bg-[#252525] disabled:opacity-30 disabled:hover:bg-[#121212] text-gray-400 hover:text-white rounded-lg border border-[#222]/80 transition-all"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => moveSectionDown(idx)}
                                disabled={idx === activeOrder.length - 1}
                                aria-label="Move Section Down"
                                title="Move Section Down"
                                className="p-1.5 bg-[#121212] hover:bg-[#252525] disabled:opacity-30 disabled:hover:bg-[#121212] text-gray-400 hover:text-white rounded-lg border border-[#222]/80 transition-all"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (secId.startsWith('custom-')) {
                                    if (confirm('Delete this custom section?')) {
                                      deleteCustomSection(secId);
                                    }
                                  } else {
                                    toggleSection(secId);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all ml-2"
                                title={secId.startsWith('custom-') ? "Delete custom section" : "Disable section"}
                                aria-label={secId.startsWith('custom-') ? "Delete custom section" : "Disable section"}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Inactive Default Sections */}
                        {(() => {
                          const defaults = ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];
                          const inactive = defaults.filter(d => !activeOrder.includes(d));
                          if (inactive.length === 0) return null;
                          return (
                            <div className="pt-4 border-t border-[#222]/60 mt-4 space-y-2">
                              <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Disabled Default Sections</h5>
                              <div className="flex flex-wrap gap-2">
                                {inactive.map(secId => (
                                  <button
                                    key={secId}
                                    onClick={() => toggleSection(secId)}
                                    className="flex items-center gap-1.5 bg-[#f59e0b]/5 hover:bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/20 hover:border-[#f59e0b]/40 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                                  >
                                    <Plus size={10} /> Add {getSectionLabel(secId).replace(' Section', '')}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Add Custom Landing Page Section */}
              <div className="bg-[#121212] p-5 rounded-2xl border border-[#222]/80 space-y-4 max-w-xl">
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Add Custom Page Section</h4>
                  <p className="text-gray-500 text-[10px]">Create an entirely new section with custom title and markdown body content.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="custom-section-title-input" className="text-[8px] font-black uppercase tracking-widest text-gray-500">Section Title</label>
                    <input 
                      id="custom-section-title-input"
                      type="text" 
                      placeholder="e.g. Research Papers, Side Projects"
                      title="Section Title"
                      value={customSectionTitle}
                      onChange={e => setCustomSectionTitle(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="custom-section-markdown-textarea" className="text-[8px] font-black uppercase tracking-widest text-gray-500">Markdown Content</label>
                    <textarea 
                      id="custom-section-markdown-textarea"
                      placeholder="Write your custom section details using Markdown (headings, lists, links)..."
                      title="Markdown Content"
                      rows={5}
                      value={customSectionMarkdown}
                      onChange={e => setCustomSectionMarkdown(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all font-mono leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={addCustomSection}
                    disabled={!customSectionTitle.trim() || !customSectionMarkdown.trim()}
                    className="w-full bg-[#f59e0b] hover:bg-white text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:hover:bg-[#f59e0b]"
                  >
                    Add Custom Section
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const CMSNavItem = ({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-left whitespace-nowrap transition-all w-full select-none ${
      active 
        ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 shadow-sm' 
        : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]/50 border border-transparent'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const CMSInputField = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => {
  const inputId = `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 ml-1">{label}</label>
      <input 
        id={inputId}
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Enter ${label}`}
        title={label}
        className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3 text-xs font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all"
      />
    </div>
  );
};

const DashboardCard = ({ title, value, trend, color }: { title: string; value: number; trend: string; color: string }) => (
  <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] flex flex-col justify-between h-[120px] relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-20 h-20 blur-3xl rounded-full opacity-10 translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: color }}></div>
    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
    <div className="text-3xl font-black text-white mt-1">{value}</div>
    <span className="text-[10px] font-bold mt-2" style={{ color }}>{trend}</span>
  </div>
);

export default AdminCMS;
