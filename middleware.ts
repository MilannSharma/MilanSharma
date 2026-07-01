/**
 * Vercel Edge Middleware — Bot Dynamic Rendering for Blog Posts
 *
 * This file is picked up automatically by Vercel at deploy time.
 * It runs on the Edge Network (not Node.js) before any rewrite/SPA routing.
 *
 * For non-Next.js projects, Vercel middleware uses the Web Standard
 * Request/Response APIs (no next/server import needed).
 *
 * @see https://vercel.com/docs/functions/edge-middleware
 */

export const config = {
  // Only intercept /blog/* paths — all others pass through instantly
  matcher: '/blog/:slug*',
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SITE_URL = 'https://milansharma.qzz.io';

// Known bots that do NOT execute JavaScript
const BOT_PATTERNS = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'WhatsApp',
  'DuckDuckBot',
  'YandexBot',
  'Applebot',
  'Google-Extended',
  'meta-externalagent',
  'Bytespider',
];

function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((p) => ua.includes(p.toLowerCase()));
}

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
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
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
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows || !rows[0]?.data?.blogs) return null;
    const blogs: BlogPost[] = rows[0].data.blogs;
    return blogs.find((p) => p.slug === slug) || null;
  } catch {
    return null;
  }
}

/** Strip markdown to plain text paragraphs for bot-readable body */
function markdownToHtml(md: string): string {
  if (!md) return '';
  const plain = md
    .replace(/!\[.*?\]\(.*?\)/g, '')           // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // links → text
    .replace(/^#{1,6}\s+(.+)$/gm, '<h2>$1</h2>') // headers → h2
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/`{1,3}[^`]*`{1,3}/g, '')         // strip code blocks
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>') // list items
    .replace(/\{\{[^}]+\}\}/g, '')             // custom placeholders
    .replace(/\|[^\n]+\|/g, '');              // strip table rows

  // Wrap consecutive <li> in <ul>
  const withUl = plain.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Wrap plain text paragraphs (lines not already wrapped in a tag)
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

  // JSON-LD: BlogPosting
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
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/1769519621500.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  });

  // JSON-LD: FAQPage (critical for AEO — Google surfaces answers directly)
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
    ${post.resources
      .map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.title}</a></li>`)
      .join('\n    ')}
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
    <h3 itemprop="name">${q.question}</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">${q.answer}</p>
    </div>
  </div>`
    )
    .join('\n  ')}
</section>`
      : '';

  const pubDateStr = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${post.title} | Milan Sharma</title>
  <meta name="description" content="${post.description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="author" content="${authorName}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Milan Sharma — Neural Library" />
  <meta property="article:published_time" content="${publishedDate}" />
  <meta property="article:author" content="${authorName}" />
  ${(post.tags || []).map((tag) => `<meta property="article:tag" content="${tag}" />`).join('\n  ')}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${post.title}" />
  <meta name="twitter:description" content="${post.description}" />
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
      <h1 itemprop="headline">${post.title}</h1>
      <div class="meta">
        <span>By <strong itemprop="author">${authorName}</strong></span>
        <span itemprop="datePublished" content="${publishedDate}">${pubDateStr}</span>
      </div>
      <div class="tags" aria-label="Tags">
        ${(post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p itemprop="description"><em>${post.description}</em></p>
      <img src="${imageUrl}" alt="${post.title}" class="hero-img" itemprop="image" />
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

export default async function middleware(request: Request): Promise<Response | undefined> {
  const ua = request.headers.get('user-agent') || '';

  // Only intercept known bots — pass through all real browsers instantly
  if (!isBot(ua)) {
    return undefined; // Vercel: undefined = pass through to next handler
  }

  // Extract slug from pathname: /blog/:slug
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/blog\/([^/]+)$/);
  if (!match) return undefined;

  const slug = decodeURIComponent(match[1]);
  const post = await fetchBlogPost(slug);

  // If post not found, fall through — React SPA handles the 404
  if (!post) return undefined;

  return new Response(buildHtml(post), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
      'X-Robots-Tag': 'index, follow',
    },
  });
}
