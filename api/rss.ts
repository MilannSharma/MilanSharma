import type { VercelRequest, VercelResponse } from '@vercel/node';

import { POSTS } from '../blogData';

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
    return rows[0].data.blogs as BlogPost[];
  } catch {
    return fallback;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const blogs = await fetchBlogs();
  const buildDate = new Date().toUTCString();

  const items = blogs
    .map((post) => {
      const pubDate = post.date
        ? new Date(post.date).toUTCString()
        : buildDate;
      const category = (post.tags || ['AI'])[0];
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(category)}</category>
      <author>${escapeXml((post.author?.name) || 'Milan Sharma')}</author>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Milan Sharma — Neural Library</title>
    <link>${SITE_URL}/library</link>
    <description>Daily breakthroughs in AI, Data Science, and Agentic Workflows by Milan Sharma, Product Manager at Nexa Technologies.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/1769519621500.png</url>
      <title>Milan Sharma — Neural Library</title>
      <link>${SITE_URL}/library</link>
    </image>
${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
