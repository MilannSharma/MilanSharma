import { createClient } from '@supabase/supabase-js';
import { PERSONAL_INFO, SKILLS, PROJECTS, CERTIFICATIONS, LIFESTYLE, RESUME_DATA } from './constants';
import { POSTS } from './blogData';
import { PortfolioSettings, Lead } from './types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial seeding / default settings
export const DEFAULT_SETTINGS: PortfolioSettings = {
  name: PERSONAL_INFO.name,
  role: PERSONAL_INFO.role,
  location: PERSONAL_INFO.location,
  email: PERSONAL_INFO.email,
  phone: PERSONAL_INFO.phone,
  github: PERSONAL_INFO.github,
  linkedin: PERSONAL_INFO.linkedin,
  avatar: PERSONAL_INFO.avatar,
  resumeLink: PERSONAL_INFO.resumeLink,
  bio: "I am a Python Developer and Data Engineer with a passion for building scalable solutions and solving real-world problems. My expertise spans Python development, Data Science, Backend APIs, and Data Analysis.",
  skills: SKILLS,
  projects: PROJECTS,
  certifications: CERTIFICATIONS,
  lifestyle: LIFESTYLE,
  products: [
    {
      id: "nexa-billing",
      title: "Nexa Billing System",
      description: "Advanced enterprise billing and invoicing platform.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
      link: "https://www.linkedin.com/company/nexatechnology-pvt-ltd/"
    }
  ],
  blogs: POSTS,
  resumeData: RESUME_DATA,
  sectionsOrder: ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'],
  customSections: [],
  githubSettings: {
    importedRepoIds: []
  }
};

export type SupabaseStatus = 'connected' | 'missing_keys' | 'tables_missing' | 'error';

let currentStatus: SupabaseStatus = supabase ? 'connected' : 'missing_keys';
let lastError: string | null = null;

export const getDbStatus = (): { status: SupabaseStatus; error: string | null } => {
  if (!supabase) {
    return { status: 'missing_keys', error: 'Supabase URL or Anon Key is missing in environment variables.' };
  }
  return { status: currentStatus, error: lastError };
};

// SQL Schema for the user to copy-paste
export const SQL_SCHEMA = `-- Supabase SQL Schema for Milan Sharma's Portfolio CMS

-- 1. Create table for portfolio settings
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS & Policies
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Allow public upsert/write" ON portfolio_settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Create table for contact leads
CREATE TABLE IF NOT EXISTS portfolio_leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE portfolio_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON portfolio_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON portfolio_leads FOR SELECT USING (true);
CREATE POLICY "Allow public delete" ON portfolio_leads FOR DELETE USING (true);

-- 3. Create table for analytics events
CREATE TABLE IF NOT EXISTS portfolio_analytics (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'visit' or 'resume_download'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE portfolio_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON portfolio_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON portfolio_analytics FOR SELECT USING (true);

-- 4. Create table for comments
CREATE TABLE IF NOT EXISTS portfolio_comments (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE portfolio_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON portfolio_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON portfolio_comments FOR SELECT USING (true);

-- 5. Create table for likes
CREATE TABLE IF NOT EXISTS portfolio_likes (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON portfolio_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON portfolio_likes FOR SELECT USING (true);

-- 6. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_likes;
`;

export const fetchSettings = async (): Promise<PortfolioSettings> => {
  if (!supabase) {
    return DEFAULT_SETTINGS;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('data')
      .eq('id', 'milan')
      .maybeSingle();

    if (error) {
      if (error.code === '42P01') {
        currentStatus = 'tables_missing';
        lastError = 'Table "portfolio_settings" does not exist in Supabase database.';
      } else {
        currentStatus = 'error';
        lastError = error.message;
      }
      return DEFAULT_SETTINGS;
    }

    if (!data) {
      // Seed initial data
      const { error: insertError } = await supabase
        .from('portfolio_settings')
        .insert([{ id: 'milan', data: DEFAULT_SETTINGS }]);
      
      if (insertError) {
        console.error('Failed to seed default settings:', insertError);
      }
      currentStatus = 'connected';
      lastError = null;
      return DEFAULT_SETTINGS;
    }

    currentStatus = 'connected';
    lastError = null;
    return data.data as PortfolioSettings;
  } catch (err: any) {
    currentStatus = 'error';
    lastError = err.message || 'Unknown error fetching settings';
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (data: PortfolioSettings): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('portfolio_settings')
      .upsert({ id: 'milan', data, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Failed to save settings to Supabase:', error);
      if (error.code === '42P01') {
        currentStatus = 'tables_missing';
        lastError = 'Table "portfolio_settings" does not exist.';
      } else {
        lastError = error.message;
      }
      return false;
    }

    currentStatus = 'connected';
    lastError = null;
    return true;
  } catch (err: any) {
    lastError = err.message || 'Failed to save settings';
    return false;
  }
};

export const fetchLeads = async (): Promise<Lead[]> => {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('portfolio_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        currentStatus = 'tables_missing';
        lastError = 'Table "portfolio_leads" does not exist.';
      }
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      created_at: item.created_at
    }));
  } catch (err) {
    console.error('Error fetching leads:', err);
    return [];
  }
};

export const addLead = async (name: string, email: string, subject: string, message: string): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('portfolio_leads')
      .insert([{ name, email, subject, message }]);

    if (error) {
      console.error('Error adding lead:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error adding lead:', err);
    return false;
  }
};

export const trackEvent = async (eventType: 'visit' | 'resume_download'): Promise<void> => {
  if (!supabase) return;

  try {
    await supabase
      .from('portfolio_analytics')
      .insert([{ event_type: eventType }]);
  } catch (err) {
    console.error('Failed to track event:', eventType, err);
  }
};

export interface AnalyticsData {
  totalVisits: number;
  totalDownloads: number;
  recentLeadsCount: number;
  dailyTrends: { date: string; visits: number; downloads: number }[];
}

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  const defaultAnalytics = {
    totalVisits: 0,
    totalDownloads: 0,
    recentLeadsCount: 0,
    dailyTrends: []
  };

  if (!supabase) return defaultAnalytics;

  try {
    // 1. Total Visits
    const { count: visitCount, error: visitErr } = await supabase
      .from('portfolio_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'visit');

    // 2. Total Downloads
    const { count: downloadCount, error: downloadErr } = await supabase
      .from('portfolio_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'resume_download');

    // 3. Leads count
    const { count: leadsCount, error: leadsErr } = await supabase
      .from('portfolio_leads')
      .select('*', { count: 'exact', head: true });

    if (visitErr || downloadErr || leadsErr) {
      console.error('Error fetching count statistics');
      return defaultAnalytics;
    }

    // 4. Fetch daily events to compute trends for the last 7 days
    const { data: events, error: eventsErr } = await supabase
      .from('portfolio_analytics')
      .select('event_type, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const trendsMap: Record<string, { visits: number; downloads: number }> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendsMap[dateStr] = { visits: 0, downloads: 0 };
    }

    if (!eventsErr && events) {
      events.forEach(evt => {
        const dateStr = new Date(evt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (trendsMap[dateStr]) {
          if (evt.event_type === 'visit') {
            trendsMap[dateStr].visits += 1;
          } else if (evt.event_type === 'resume_download') {
            trendsMap[dateStr].downloads += 1;
          }
        }
      });
    }

    const dailyTrends = Object.entries(trendsMap).map(([date, data]) => ({
      date,
      visits: data.visits,
      downloads: data.downloads
    }));

    return {
      totalVisits: visitCount || 0,
      totalDownloads: downloadCount || 0,
      recentLeadsCount: leadsCount || 0,
      dailyTrends
    };

  } catch (err) {
    console.error('Error fetching analytics:', err);
    return defaultAnalytics;
  }
};

// Google Drive & normal image URL formatter
export const formatImageUrl = (url: string): string => {
  if (!url) return '';
  // Match normal Google Drive sharing link formats
  const gdRegex1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdRegex2 = /[\?&]id=([a-zA-Z0-9_-]+)/;
  
  let match = url.match(gdRegex1);
  if (match && match[1]) {
    return `https://docs.google.com/uc?export=download&id=${match[1]}`;
  }
  
  match = url.match(gdRegex2);
  if (match && match[1]) {
    return `https://docs.google.com/uc?export=download&id=${match[1]}`;
  }
  
  return url;
};

// Comments & Likes API Integration
export interface BlogComment {
  id: number;
  post_slug: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

export const fetchComments = async (postSlug: string): Promise<BlogComment[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('portfolio_comments')
      .select('*')
      .eq('post_slug', postSlug)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
    return (data || []).map(item => ({
      id: item.id,
      post_slug: item.post_slug,
      author_name: item.author_name,
      comment_text: item.comment_text,
      created_at: item.created_at
    }));
  } catch (err) {
    console.error('Error fetching comments:', err);
    return [];
  }
};

export const addComment = async (postSlug: string, authorName: string, commentText: string): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('portfolio_comments')
      .insert([{ post_slug: postSlug, author_name: authorName, comment_text: commentText }]);
    if (error) {
      console.error('Error adding comment:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error adding comment:', err);
    return false;
  }
};

export const fetchLikesCount = async (postSlug: string): Promise<number> => {
  if (!supabase) return 0;
  try {
    const { count, error } = await supabase
      .from('portfolio_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_slug', postSlug);
    if (error) {
      console.error('Error fetching likes count:', error);
      return 0;
    }
    return count || 0;
  } catch (err) {
    console.error('Error fetching likes count:', err);
    return 0;
  }
};

export const addLike = async (postSlug: string): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('portfolio_likes')
      .insert([{ post_slug: postSlug }]);
    if (error) {
      console.error('Error adding like:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error adding like:', err);
    return false;
  }
};

// Custom Markdown Parser supporting tables, images, bold, headers, and {{imageN}} placeholders
export const parseMarkdown = (markdown: string, images?: Record<string, string>): string => {
  if (!markdown) return '';
  let html = markdown;
  
  // 0. Replace {{imageN}} placeholders with markdown image syntax
  if (images) {
    html = html.replace(/\{\{(image\d+)\}\}/g, (match, key) => {
      const url = images[key];
      if (url) {
        const processedUrl = formatImageUrl(url.trim());
        return `![${key}](${processedUrl})`;
      }
      return match; // leave placeholder if no URL mapped
    });
  }
  
  // 1. Process headers (## header, ### header)
  html = html.replace(/^##\s+(.*$)/gim, '<h2 class="text-2xl md:text-3xl font-black text-white mt-12 md:mt-20 mb-6 md:mb-8 tracking-tight border-l-4 border-[#f59e0b] pl-4 md:pl-6">$1</h2>');
  html = html.replace(/^###\s+(.*$)/gim, '<h3 class="text-xl md:text-2xl font-bold text-white mt-8 md:mt-12 mb-4 md:mb-6 tracking-tight">$1</h3>');
  
  // 2. Process bold (**bold**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>');
  
  // 3. Process inline code (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="bg-[#121212] text-[#f59e0b] px-2 py-1 rounded-lg font-mono text-[14px] md:text-[15px] border border-[#222]">$1</code>');
  
  // 4. Process images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    const processedUrl = formatImageUrl(url.trim());
    return `<img src="${processedUrl}" alt="${alt}" class="my-8 rounded-2xl border border-[#222] w-full object-cover max-h-[450px]" />`;
  });

  // 5. Process tables:
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) {
        continue; 
      }
      
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      
      if (!inTable) {
        inTable = true;
        tableHtml = '<div class="overflow-x-auto my-8 border border-[#222] rounded-2xl bg-[#121212]"><table class="w-full text-left border-collapse text-xs md:text-sm">';
        tableHtml += '<thead><tr class="border-b border-[#222] bg-[#1a1a1a]">';
        cells.forEach(cell => {
          tableHtml += `<th class="px-5 py-4 font-black text-white uppercase tracking-wider">${cell}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr class="border-b border-[#222]/40 hover:bg-white/5 transition-colors">';
        cells.forEach(cell => {
          tableHtml += `<td class="px-5 py-4 font-medium text-gray-300">${cell}</td>`;
        });
        tableHtml += '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table></div>';
        newLines.push(tableHtml);
        tableHtml = '';
      }
      newLines.push(line);
    }
  }
  
  if (inTable) {
    tableHtml += '</tbody></table></div>';
    newLines.push(tableHtml);
  }
  
  return newLines.join('\n');
};
