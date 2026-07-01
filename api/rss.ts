import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SITE_URL = 'https://milansharma.qzz.io';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: { name: string };
}

const POSTS: BlogPost[] = [
  {
    slug: 'deepseek-r1-the-reasoning-revolution',
    title: 'DeepSeek-R1: Redefining Open-Source Reasoning',
    description: 'An in-depth look at how DeepSeek-R1 achieves GPT-4o level performance through pure reinforcement learning and massive scale.',
    date: 'February 20, 2025',
    tags: ['AI', 'Research'],
    author: { name: 'Dr. Elena Vance' }
  },
  {
    slug: 'openai-o3-mini-stem-breakthrough',
    title: 'OpenAI o3-mini: STEM Reasoning for the Masses',
    description: 'How OpenAI is bridging the gap between cost and intelligence with its latest reasoning-optimized small model.',
    date: 'February 18, 2025',
    tags: ['AI', 'Trends'],
    author: { name: 'Marcus Chen' }
  },
  {
    slug: 'gemini-2-flash-native-multimodal',
    title: 'Gemini 2.0 Flash: Native Multimodal Architecture',
    description: 'Exploring Google’s transition to native multimodal processing and what it means for sub-200ms latency applications.',
    date: 'February 15, 2025',
    tags: ['Engineering', 'AI'],
    author: { name: 'Sarah Jenkins' }
  },
  {
    slug: 'agentic-rag-patterns-2025',
    title: 'Agentic RAG: Beyond Simple Vector Search',
    description: 'Why naive RAG is failing and how agent-based retrieval patterns are solving the accuracy problem.',
    date: 'February 10, 2025',
    tags: ['Engineering', 'Data Science'],
    author: { name: 'Sarah Jenkins' }
  }
];

function escapeXml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchBlogs(): Promise<BlogPost[]> {
  const fallback = POSTS.map(p => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    author: { name: p.author.name }
  }));
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
  const buildDate = new Date().toUTCString();

  const items = blogs
    .map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : buildDate;
      const categories = (post.tags || []).map((tag) => `<category>${escapeXml(tag)}</category>`).join('');

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(post.author?.name || 'Milan Sharma')}</dc:creator>
      ${categories}
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml('Milan Sharma — Neural Library')}</title>
  <link>${SITE_URL}</link>
  <description>${escapeXml('Insights and research on Generative AI, Agentic workflows, and Data Engineering.')}</description>
  <lastBuildDate>${buildDate}</lastBuildDate>
  <pubDate>${buildDate}</pubDate>
  <language>en-us</language>
  <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(rss);
}
