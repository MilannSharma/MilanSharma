import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Bot Dynamic Rendering for Blog Posts
 *
 * This serverless function is invoked via vercel.json rewrites
 * when the User-Agent matches a known bot pattern. It fetches
 * the blog post from Supabase and returns fully rendered HTML
 * with JSON-LD schemas for SEO/AEO/GEO.
 */

import { POSTS } from './blogData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SITE_URL = 'https://milansharma.qzz.io';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  image: string;
  tags: string[];
  resources?: { title: string; url: string }[];
  questions?: { question: string; answer: string }[];
  author: { name: string; role: string; avatar: string };
}

async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const fallback = POSTS.find((p) => p.slug === slug) || null;
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
    return blogs.find((p) => p.slug === slug) || fallback;
  } catch {
    return fallback;
  }
}


function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Strip markdown to readable HTML paragraphs for bots */
function markdownToHtml(md: string): string {
  if (!md) return '';
  const plain = md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\|[^\n]+\|/g, '');

  const withUl = plain.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  return withUl
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => {
      if (/^<(h[1-6]|ul|ol|li|blockquote|div|pre)/.test(para)) return para;
      return `<p>${para.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
}

function buildHtml(post: BlogPost): string {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image?.startsWith('http')
    ? post.image
    : `${SITE_URL}${post.image}`;
  const publishedDate = post.date
    ? new Date(post.date).toISOString()
    : new Date().toISOString();
  const authorName = post.author?.name || 'Milan Sharma';
  const safeTitle = escapeHtml(post.title);
  const safeDesc = escapeHtml(post.description);

  const blogPostingSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: publishedDate,
    dateModified: publishedDate,
    keywords: (post.tags || []).join(', '),
    url: canonicalUrl,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://linkedin.com/in/milansharma01',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexa Technologies',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/1769519621500.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  });

  const faqSchema =
    post.questions && post.questions.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        })
      : null;

  const bodyHtml = markdownToHtml(post.content || '');

  const resourcesHtml =
    post.resources && post.resources.length > 0
      ? `<section aria-label="Resources">
  <h2>Resources &amp; Further Reading</h2>
  <ul>
    ${post.resources.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a></li>`).join('\n    ')}
  </ul>
</section>`
      : '';

  const faqHtml =
    post.questions && post.questions.length > 0
      ? `<section aria-label="FAQ">
  <h2>Frequently Asked Questions</h2>
  ${post.questions
    .map(
      (q) => `<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">${escapeHtml(q.question)}</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">${escapeHtml(q.answer)}</p>
    </div>
  </div>`
    )
    .join('\n  ')}
</section>`
      : '';

  const pubDateStr = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} | Milan Sharma</title>
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="author" content="${escapeHtml(authorName)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Milan Sharma — Neural Library" />
  <meta property="article:published_time" content="${publishedDate}" />
  <meta property="article:author" content="${escapeHtml(authorName)}" />
  ${(post.tags || []).map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n  ')}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- RSS Discovery -->
  <link rel="alternate" type="application/rss+xml" title="Milan Sharma — Neural Library" href="${SITE_URL}/api/rss" />

  <!-- JSON-LD: BlogPosting -->
  <script type="application/ld+json">${blogPostingSchema}</script>
  ${faqSchema ? `<!-- JSON-LD: FAQPage (AEO) -->\n  <script type="application/ld+json">${faqSchema}</script>` : ''}

  <style>
    *{box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:2rem 1rem;color:#1a1a1a;line-height:1.75;background:#fff}
    h1{font-size:2rem;margin:0 0 0.5rem;line-height:1.2}
    h2{font-size:1.35rem;margin:2.5rem 0 0.75rem;border-left:4px solid #d97706;padding-left:0.75rem}
    h3{font-size:1.1rem;margin:1.5rem 0 0.5rem;color:#d97706}
    p{margin:0.75rem 0}
    a{color:#d97706}
    ul{margin:0.5rem 0;padding-left:1.5rem}
    li{margin:0.3rem 0}
    nav{display:flex;gap:1rem;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid #eee}
    nav a{color:#555;text-decoration:none;font-size:0.9rem}
    nav a:hover{color:#d97706}
    .meta{color:#666;font-size:0.9rem;margin:0.5rem 0 1.5rem;display:flex;gap:1rem;flex-wrap:wrap}
    .tags{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.5rem}
    .tag{background:#fef3c7;color:#92400e;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.78rem;font-weight:600}
    .hero-img{width:100%;border-radius:12px;margin:1.5rem 0;display:block}
    footer{margin-top:3rem;padding-top:1rem;border-top:1px solid #eee;color:#666;font-size:0.85rem}
  </style>
</head>
<body>
  <nav aria-label="Site navigation">
    <a href="${SITE_URL}/">Home</a>
    <a href="${SITE_URL}/library">Neural Library</a>
    <a href="${SITE_URL}/resume">Resume</a>
    <a href="${SITE_URL}/contact">Contact</a>
  </nav>

  <article itemscope itemtype="https://schema.org/BlogPosting">
    <header>
      <h1 itemprop="headline">${safeTitle}</h1>
      <div class="meta">
        <span>By <strong itemprop="author">${escapeHtml(authorName)}</strong></span>
        <span itemprop="datePublished" content="${publishedDate}">${pubDateStr}</span>
      </div>
      <div class="tags" aria-label="Tags">
        ${(post.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <p itemprop="description"><em>${safeDesc}</em></p>
      <img src="${imageUrl}" alt="${safeTitle}" class="hero-img" itemprop="image" />
    </header>

    <section itemprop="articleBody">
      ${bodyHtml}
    </section>

    ${faqHtml}
    ${resourcesHtml}
  </article>

  <footer>
    <p>Milan Sharma — Product Manager, GenAI &amp; Agentic AI | <a href="${SITE_URL}">milansharma.qzz.io</a></p>
    <p>
      <a href="https://linkedin.com/in/milansharma01">LinkedIn</a> ·
      <a href="https://github.com/milannsharma">GitHub</a> ·
      <a href="${SITE_URL}/api/rss">RSS Feed</a> ·
      <a href="${SITE_URL}/library">All Posts</a>
    </p>
  </footer>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string;

  if (!slug) {
    res.status(400).send('Missing slug parameter');
    return;
  }

  const post = await fetchBlogPost(slug);

  if (!post) {
    // Post not found — redirect to SPA which will show 404
    res.redirect(302, `${SITE_URL}/blog/${slug}`);
    return;
  }

  const html = buildHtml(post);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.status(200).send(html);
}
