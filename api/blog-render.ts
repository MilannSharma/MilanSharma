import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Bot Dynamic Rendering for Blog Posts
 *
 * This serverless function is invoked via vercel.json rewrites
 * when the User-Agent matches a known bot pattern. It fetches
 * the blog post from Supabase and returns fully rendered HTML
 * with JSON-LD schemas for SEO/AEO/GEO.
 */

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

const POSTS: BlogPost[] = [
  {
    slug: 'deepseek-r1-the-reasoning-revolution',
    title: 'DeepSeek-R1: Redefining Open-Source Reasoning',
    description: 'An in-depth look at how DeepSeek-R1 achieves GPT-4o level performance through pure reinforcement learning and massive scale.',
    date: 'February 20, 2025',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600',
    tags: ['AI', 'Research'],
    author: {
      name: 'Dr. Elena Vance',
      role: 'Principal Research Scientist',
      avatar: 'https://i.pravatar.cc/150?u=elena'
    },
    resources: [
      { title: 'DeepSeek-R1 Technical Paper', url: 'https://arxiv.org/abs/2501.12948' },
      { title: 'RL Training Methodology', url: 'https://blog.deepseek.com/deepseek-r1/' },
      { title: 'MLA Attention Explanation', url: 'https://github.com/deepseek-ai/DeepSeek-V3' }
    ],
    questions: [
      { question: "What makes DeepSeek-R1's training unique?", answer: "It relies primarily on Reinforcement Learning (RL) rather than traditional supervised fine-tuning to develop reasoning patterns." },
      { question: "How does it achieve GPT-4o level performance?", answer: "Through massive scale and a Mixture-of-Experts (MoE) architecture that optimizes compute efficiency." },
      { question: "What is Multi-head Latent Attention (MLA)?", answer: "A custom attention mechanism that reduces KV cache overhead, allowing for longer context windows with less memory." },
      { question: "Does it support local hosting?", answer: "Yes, the open weights allow for local deployment on enterprise-grade hardware." },
      { question: "Is the training recipe open source?", answer: "Yes, DeepSeek has shared significant details about their RL methodology and data pipelines." }
    ],
    content: `
## The Emergence of Pure Reasoning

The release of DeepSeek-R1 has sent shockwaves through the AI community. Unlike previous models that relied heavily on supervised fine-tuning (SFT) to "mimic" reasoning, R1 was trained primarily through **Reinforcement Learning (RL)**.

### Zero-Shot Reasoning Capabilities
The most striking feature of R1 is its ability to self-correct during inference. When presented with a complex math problem, the model doesn't just output an answer; it enters a "chain-of-thought" (CoT) phase where it explores multiple paths, rejects dead ends, and arrives at a verified conclusion.

### Architectural Innovations
DeepSeek utilizes a **Multi-head Latent Attention (MLA)** mechanism and **DeepSeekMoE** (Mixture-of-Experts) architecture. This allows it to maintain high performance while drastically reducing compute requirements during inference. In benchmarks, it matches GPT-4o on logic tasks while costing a fraction to serve.

### Impact on the Ecosystem
By open-sourcing the weights and the training recipe, DeepSeek has effectively democratized "O1-class" reasoning for the entire developer community.
    `
  },
  {
    slug: 'openai-o3-mini-stem-breakthrough',
    title: 'OpenAI o3-mini: STEM Reasoning for the Masses',
    description: 'How OpenAI is bridging the gap between cost and intelligence with its latest reasoning-optimized small model.',
    date: 'February 18, 2025',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9757?auto=format&fit=crop&q=80&w=1600',
    tags: ['AI', 'Trends'],
    author: {
      name: 'Marcus Chen',
      role: 'ML Ops Lead',
      avatar: 'https://i.pravatar.cc/150?u=marcus'
    },
    resources: [
      { title: 'OpenAI API Docs', url: 'https://platform.openai.com/docs' },
      { title: 'STEM Benchmark Results', url: 'https://openai.com/research' }
    ],
    questions: [
      { question: "What is the primary target for o3-mini?", answer: "STEM subjects including Science, Tech, Engineering, and Mathematics where logic is the core requirement." },
      { question: "How does o3-mini handle complex coding tasks?", answer: "It uses an internal thinking budget to explore logical steps before generating the final code syntax." },
      { question: "Is it cheaper than o1-preview?", answer: "Yes, it is designed for high-frequency API usage at a significantly lower cost point." },
      { question: "Can it be used for real-time applications?", answer: "While reasoning takes time, o3-mini is optimized for faster 'thought' latency than its predecessors." },
      { question: "Does it replace GPT-4o?", answer: "No, it complements it for tasks requiring deep logical verification rather than just general knowledge." }
    ],
    content: `
## Efficiency in Thought

OpenAI's o3-mini represents a massive leap in efficiency. It brings the high-level reasoning capabilities of the 'o' series into a faster, cheaper package designed specifically for coding and STEM tasks.

### Benchmark Excellence
In competitive programming, o3-mini has shown to match or exceed the performance of models 5x its size. This is achieved through a specialized "thinking" process that allows the model to allocate more compute to harder problems.
    `
  },
  {
    slug: 'gemini-2-flash-native-multimodal',
    title: 'Gemini 2.0 Flash: Native Multimodal Architecture',
    description: 'Exploring Google’s transition to native multimodal processing and what it means for sub-200ms latency applications.',
    date: 'February 15, 2025',
    image: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=1600',
    tags: ['Engineering', 'AI'],
    author: {
      name: 'Sarah Jenkins',
      role: 'CDO, NeuralPath',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    resources: [
      { title: 'Google AI Blog', url: 'https://blog.google/technology/ai/' },
      { title: 'Multimodal API Guide', url: 'https://ai.google.dev/' }
    ],
    questions: [
      { question: "What defines 'Native Multimodality'?", answer: "A single unified transformer processing video, audio, and text tokens simultaneously in one latent space." },
      { question: "What is the average latency of Gemini 2.0 Flash?", answer: "It target sub-200ms latency for voice-to-voice interactions." },
      { question: "How does it differ from Gemini 1.5?", answer: "Native processing of audio/video rather than discrete chunking and separate encoders." },
      { question: "What are the key use cases?", answer: "Real-time AI assistants, live translation, and synchronized multimodal analysis." },
      { question: "Is it available via API?", answer: "Yes, Google offers it through their developer platform with high rate limits." }
    ],
    content: `
## Real-Time Intelligence

Gemini 2.0 Flash marks a transition from "static" multimodality to "native" multimodal streaming. Earlier models processed audio or video by converting them into discrete chunks; Gemini 2.0 processes continuous streams with sub-200ms latency.

### The Unified Latent Space
Unlike hybrid architectures that use separate encoders for vision and audio, Gemini 2.0 uses a single, unified transformer that accepts audio, video, and text tokens simultaneously.
    `
  },
  {
    slug: 'agentic-rag-patterns-2025',
    title: 'Agentic RAG: Beyond Simple Vector Search',
    description: 'Why naive RAG is failing and how agent-based retrieval patterns are solving the accuracy problem.',
    date: 'February 10, 2025',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1600',
    tags: ['Engineering', 'Data Science'],
    author: {
      name: 'Sarah Jenkins',
      role: 'Chief Data Officer',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    resources: [
      { title: 'LlamaIndex Agentic Docs', url: 'https://docs.llamaindex.ai' },
      { title: 'LangGraph Concepts', url: 'https://langchain-ai.github.io/langgraph/' }
    ],
    questions: [
      { question: "Why does standard RAG hallucinate?", answer: "Because it lacks a feedback loop to verify if the retrieved chunks actually answer the user query." },
      { question: "What is an Agentic Loop in RAG?", answer: "A process where the model critiques its retrieval, refines its search query, and iterates until high confidence is met." },
      { question: "Does this increase cost?", answer: "Yes, it requires multiple LLM calls per query, but dramatically improves accuracy." },
      { question: "What tools are used for Agentic RAG?", answer: "Frameworks like LangGraph and LlamaIndex are currently the industry standards." },
      { question: "Can it handle multi-step reasoning?", answer: "Yes, agents can decompose complex questions into sub-questions and aggregate results." }
    ],
    content: `
## The Failure of "Naive" RAG

Basic Retrieval-Augmented Generation (RAG) often fails because it treats retrieval as a single, static step. If the vector search returns irrelevant chunks, the model generates a hallucination.

### The Agentic Solution
Agentic RAG introduces a loop where the model critiques its own search results, rewrites queries, and validates the final answer against source documents.
    `
  }
];

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
