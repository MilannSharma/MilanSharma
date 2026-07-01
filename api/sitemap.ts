import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SITE_URL = 'https://milansharma.qzz.io';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/resume', priority: '0.8', changefreq: 'monthly' },
  { path: '/products', priority: '0.8', changefreq: 'monthly' },
  { path: '/library', priority: '0.9', changefreq: 'daily' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
];

interface BlogPost {
  slug: string;
  date: string;
  title: string;
}

const POSTS: BlogPost[] = [
  {
    slug: 'deepseek-r1-the-reasoning-revolution',
    title: 'DeepSeek-R1: Redefining Open-Source Reasoning',
    date: 'February 20, 2025'
  },
  {
    slug: 'openai-o3-mini-stem-breakthrough',
    title: 'OpenAI o3-mini: STEM Reasoning for the Masses',
    date: 'February 18, 2025'
  },
  {
    slug: 'gemini-2-flash-native-multimodal',
    title: 'Gemini 2.0 Flash: Native Multimodal Architecture',
    date: 'February 15, 2025'
  },
  {
    slug: 'agentic-rag-patterns-2025',
    title: 'Agentic RAG: Beyond Simple Vector Search',
    date: 'February 10, 2025'
  }
];

async function fetchBlogs(): Promise<BlogPost[]> {
  const fallback = POSTS.map(p => ({ slug: p.slug, date: p.date, title: p.title }));
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return fallback;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_settings?id=eq.milan&select=data`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) return fallback;
    const rows = await res.json();
    if (!rows || !rows[0]?.data?.blogs) return fallback;
    const blogs: BlogPost[] = rows[0].data.blogs;
    return blogs.find((p) => p.slug) ? blogs : fallback;
  } catch {
    return fallback;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const blogs = await fetchBlogs();
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = STATIC_ROUTES.map(
    (r) => `
  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join('');

  const blogUrls = blogs
    .map((post) => {
      const lastmod = post.date
        ? new Date(post.date).toISOString().split('T')[0]
        : today;
      return `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
