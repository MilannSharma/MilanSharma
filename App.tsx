import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SkillCard from './components/SkillCard';
import ProjectCard from './components/ProjectCard';
import CertificationCard from './components/CertificationCard';
import LifeStyleCard from './components/LifeStyleCard';
import SubscribeModal from './components/SubscribeModal';
import Globe from './components/Globe';
import Resume from './components/Resume';
import AdminLogin from './components/AdminLogin';
import AdminCMS from './components/AdminCMS';
import ProductsSection from './components/ProductsSection';
import { PortfolioSettings } from './types';
import { fetchSettings, saveSettings, addLead, trackEvent, DEFAULT_SETTINGS, fetchComments, addComment, fetchLikesCount, addLike, parseMarkdown, formatImageUrl } from './db';
import { 
  Zap, 
  MapPin, 
  User,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Newspaper,
  BookOpen,
  ArrowLeft,
  Clock,
  HelpCircle,
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react';

type TabType = 'about' | 'resume' | 'products' | 'contact' | 'library';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  
  // Custom settings loaded from DB
  const [settings, setSettings] = useState<PortfolioSettings>(DEFAULT_SETTINGS);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Contact Form State
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  // Blog Detail Features (Likes, Comments)
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Settings on Mount
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchSettings();
      setSettings(data);
      // Track real-time visitor event
      trackEvent('visit');
    };
    loadData();

    if (sessionStorage.getItem('admin_logged_in') === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  // Sync state with location pathname
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      setSelectedPostSlug(slug);
      setActiveTab('library');
    } else if (path === '/' || path === '/about') {
      setActiveTab('about');
      setSelectedPostSlug(null);
    } else if (path === '/admin') {
      setIsAdminLoginOpen(true);
    } else {
      const tab = path.replace('/', '') as TabType;
      if (['about', 'resume', 'products', 'contact', 'library'].includes(tab)) {
        setActiveTab(tab);
        setSelectedPostSlug(null);
      }
    }
  }, [location.pathname]);

  // Fetch comments and likes for selected blog
  useEffect(() => {
    if (!selectedPostSlug) return;
    
    const loadBlogMeta = async () => {
      const likesCount = await fetchLikesCount(selectedPostSlug);
      const blogComments = await fetchComments(selectedPostSlug);
      setLikes(likesCount);
      setComments(blogComments);
      setHasLiked(localStorage.getItem(`liked_${selectedPostSlug}`) === 'true');
    };
    
    loadBlogMeta();
  }, [selectedPostSlug]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingNav(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic SEO & Metadata Updates
  useEffect(() => {
    const siteUrl = 'https://milansharma-ai.vercel.app';
    let title = 'Milan Sharma | AI Product Manager & Founder of Nexa Technologies';
    let description = 'Milan Sharma | AI Product Manager, SaaS Product Manager, Technical Product Manager, and Founder of Nexa Technologies. Product portfolio, experience, bio, and neural library blogs.';
    let canonical = `${siteUrl}${location.pathname}`;
    let ogType = 'website';
    let ogImage = settings.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
    let schemaData: any = null;

    if (selectedPostSlug) {
      const post = settings.blogs.find(p => p.slug === selectedPostSlug);
      if (post) {
        title = `${post.title} | Milan Sharma`;
        description = post.description || description;
        ogType = 'article';
        ogImage = formatImageUrl(post.image);
        
        // BlogPosting Schema
        schemaData = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "image": formatImageUrl(post.image),
          "datePublished": new Date(post.date).toISOString().slice(0, 10),
          "author": {
            "@type": "Person",
            "name": post.author?.name || settings.name,
            "image": post.author?.avatar || settings.avatar
          },
          "publisher": {
            "@type": "Organization",
            "name": "Nexa Technologies",
            "logo": {
              "@type": "ImageObject",
              "url": settings.avatar
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical
          }
        };
      }
    } else {
      // Tab-specific metadata
      switch (activeTab) {
        case 'about':
          title = 'Milan Sharma | AI & SaaS Product Manager';
          description = `Milan Sharma's official portfolio. AI Product Manager, SaaS Product Manager, Technical Product Manager, and Founder of Nexa Technologies.`;
          break;
        case 'resume':
          title = 'Milan Sharma | Resume & Core Work Experience';
          description = `Read Milan Sharma's professional resume. Review competencies, tech stack, leading AI initiatives, and product strategy.`;
          break;
        case 'products':
          title = 'Milan Sharma | Products & Enterprise Solutions';
          description = `Explore SaaS platforms and enterprise tools built by Milan Sharma, including Nexa Billing System.`;
          break;
        case 'library':
          title = 'NeuralPath Library | AI & Agentic Workflow Insights';
          description = `High-signal insights and technical deep dives into AI engineering, Agentic Workflows, and Data Science.`;
          break;
        case 'contact':
          title = 'Contact Milan Sharma | Get In Touch';
          description = `Have an AI project in mind or want to collaborate on product strategy? Connect directly with Milan Sharma.`;
          break;
      }

      // Person & Website Schemas for Root/About Page
      if (activeTab === 'about') {
        schemaData = [
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": settings.name,
            "jobTitle": settings.role,
            "url": siteUrl,
            "sameAs": [
              `https://github.com/${settings.github}`,
              `https://linkedin.com/in/${settings.linkedin}`
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "Nexa Technologies"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": `${settings.name} Portfolio`,
            "url": siteUrl
          }
        ];
      } else {
        // Breadcrumb Schema for subpages
        schemaData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": siteUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
              "item": canonical
            }
          ]
        };
      }
    }

    // Set Document Title
    document.title = title;

    // Helper function to update meta tags
    const updateOrCreateMeta = (propertyAttr: string, attrValue: string, contentValue: string) => {
      let meta = document.querySelector(`meta[${propertyAttr}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(propertyAttr, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentValue);
    };

    // Update standard & SEO meta tags
    updateOrCreateMeta('name', 'description', description);
    updateOrCreateMeta('name', 'robots', 'index, follow');
    updateOrCreateMeta('name', 'keywords', 'Product Manager Portfolio, AI Product Manager, Technical Product Manager, Product Strategy, SaaS Product Manager, AI Product Management');

    // Update Open Graph tags
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:url', canonical);
    updateOrCreateMeta('property', 'og:image', ogImage);
    updateOrCreateMeta('property', 'og:site_name', 'Milan Sharma Portfolio');

    // Update Twitter Card tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', ogImage);

    // Update Canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    // Update / Inject JSON-LD Script tag
    let ldScript = document.getElementById('jsonld-seo') as HTMLScriptElement;
    if (ldScript) {
      ldScript.textContent = JSON.stringify(schemaData);
    } else {
      ldScript = document.createElement('script');
      ldScript.id = 'jsonld-seo';
      ldScript.type = 'application/ld+json';
      ldScript.textContent = JSON.stringify(schemaData);
      document.head.appendChild(ldScript);
    }
  }, [activeTab, selectedPostSlug, settings, location.pathname]);

  const techStackIcons = [
    "python", "mysql", "flask", "docker", "pytorch", "tensorflow", 
    "fastapi", "pandas", "numpy", "git", "sqlite", "jupyter", "mongodb", "postgresql", "linux"
  ].map(slug => `https://cdn.simpleicons.org/${slug}`);

  const navigateToTab = (tab: TabType) => {
    navigate(tab === 'about' ? '/' : `/${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPost = (slug: string) => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    
    // Save to Supabase Leads Table
    const success = await addLead(formData.name, formData.email, formData.subject, formData.message);
    
    if (success) {
      setFormState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormState('idle'), 5000);
    } else {
      // Show success anyway to be user-friendly, but log error
      console.warn('DB Lead insert fell back');
      setFormState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormState('idle'), 5000);
    }
  };

  const handleSaveSettings = async (newSettings: PortfolioSettings) => {
    const success = await saveSettings(newSettings);
    if (success) {
      setSettings(newSettings);
    }
    return success;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    setIsAdminMode(false);
    setActiveTab('about');
  };

  const renderBlogDetail = () => {
    const post = settings.blogs.find(p => p.slug === selectedPostSlug);
    if (!post) return null;

    // Get 2 suggested blogs (not including current)
    const suggested = settings.blogs.filter(p => p.slug !== post.slug).slice(0, 2);

    const handleShareBlog = () => {
      const link = `${window.location.origin}/blog/${post.slug}`;
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <button 
          onClick={() => {
            navigate('/library');
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-[#f59e0b] transition-colors mb-6 md:mb-10 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Back to Library
        </button>
        
        <div className="mb-4 md:mb-6">
          <span className="text-[9px] md:text-[10px] font-black text-[#f59e0b] uppercase tracking-[0.3em] bg-[#f59e0b]/10 px-2.5 py-1 rounded-lg border border-[#f59e0b]/20">
            {post.tags[0]}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-[1.2] md:leading-[1.1] mb-8 md:mb-10">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 md:gap-8 pb-8 md:pb-10 border-b border-[#222] mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4">
            <img src={formatImageUrl(post.author.avatar)} alt={post.author.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#333] shadow-lg" />
            <div>
              <div className="text-[13px] md:text-[15px] font-bold text-white leading-none mb-1 md:mb-1.5">{post.author.name}</div>
              <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.author.role}</div>
            </div>
          </div>
          <div className="hidden md:block h-6 w-[1px] bg-[#333]"></div>
          <div className="flex items-center gap-4 md:gap-5 text-gray-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
            <span>{post.date}</span>
            <span className="w-1.5 h-1.5 bg-[#333] rounded-full hidden md:inline-block"></span>
            <span className="flex items-center gap-2"><Clock size={14} className="text-[#f59e0b]" /> {post.readTime || '10 MIN READ'}</span>
          </div>
        </div>

        <div className="aspect-[16/9] md:aspect-[21/9] w-full rounded-[24px] md:rounded-[40px] overflow-hidden mb-12 md:mb-16 border border-[#222] shadow-2xl">
          <img src={formatImageUrl(post.image)} alt="" className="w-full h-full object-cover transition-all duration-700" />
        </div>

        {/* Detailed Blog Content */}
        <div className="max-w-4xl mx-auto px-1 md:px-0">
          <div className="prose prose-invert prose-lg max-w-none space-y-6 md:space-y-8 text-gray-300 leading-[1.7] md:leading-[1.8] text-[16px] md:text-[18px]">
             <div 
               dangerouslySetInnerHTML={{ 
                 __html: parseMarkdown(post.content, post.images, post.buttons)
               }} 
             />
          </div>

          {/* Likes & Sharing Panel */}
          <div className="mt-12 pt-8 border-t border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={async () => {
                  if (hasLiked) return;
                  const success = await addLike(post.slug);
                  if (success) {
                    setLikes(prev => prev + 1);
                    setHasLiked(true);
                    localStorage.setItem(`liked_${post.slug}`, 'true');
                  }
                }}
                disabled={hasLiked}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${
                  hasLiked 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 cursor-default' 
                    : 'bg-[#121212] border-[#222] text-gray-400 hover:text-rose-400 hover:border-rose-400/50 hover:bg-rose-500/5'
                }`}
              >
                <span className={`text-lg transition-transform ${hasLiked ? 'scale-110' : 'hover:scale-120'}`}>❤️</span>
                <span className="text-xs font-black uppercase tracking-wider">{likes} Likes</span>
              </button>

              <button 
                onClick={handleShareBlog}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#121212] border border-[#222] text-gray-400 hover:text-[#f59e0b] hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/5 rounded-full transition-all"
              >
                <LinkIcon size={14} className={copiedLink ? "text-green-400" : ""} />
                <span className="text-xs font-black uppercase tracking-wider">
                  {copiedLink ? 'Link Copied!' : 'Share Insight'}
                </span>
              </button>
            </div>
          </div>

          {/* Real-time Comments Board */}
          <div className="mt-16 md:mt-24 p-6 md:p-10 bg-[#121212] rounded-[24px] md:rounded-[32px] border border-[#222] shadow-xl">
            <h3 className="text-lg font-black text-white tracking-tight mb-8 flex items-center gap-3">
              <MessageSquare size={18} className="text-[#f59e0b]" /> Comments Board ({comments.length})
            </h3>
            
            {/* Comment Form */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCommentAuthor.trim() || !newCommentText.trim() || isSubmittingComment) return;
                setIsSubmittingComment(true);
                const success = await addComment(post.slug, newCommentAuthor, newCommentText);
                if (success) {
                  setNewCommentText('');
                  // Reload comments
                  const blogComments = await fetchComments(post.slug);
                  setComments(blogComments);
                }
                setIsSubmittingComment(false);
              }}
              className="space-y-4 mb-10 pb-10 border-b border-[#222]/60"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={newCommentAuthor}
                  onChange={e => setNewCommentAuthor(e.target.value)}
                  required
                  className="bg-[#1a1a1a] border border-[#222] focus:border-[#f59e0b]/60 px-5 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
              <textarea 
                placeholder="Type your comment..." 
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                required
                rows={4}
                className="w-full bg-[#1a1a1a] border border-[#222] focus:border-[#f59e0b]/60 px-5 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-colors resize-none"
              />
              <button 
                type="submit" 
                disabled={isSubmittingComment}
                className="bg-[#f59e0b] hover:bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {isSubmittingComment ? 'Posting...' : 'Submit Comment'}
              </button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm italic py-4">No comments posted yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-5 bg-[#1a1a1a] border border-[#222]/80 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">{comment.author_name}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">
                        {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources Section */}
          {post.resources && post.resources.length > 0 && (
            <div className="mt-16 md:mt-24 p-6 md:p-10 bg-[#121212] rounded-[24px] md:rounded-[32px] border border-[#222] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 md:mb-10 flex items-center gap-3">
                <LinkIcon size={14} className="text-[#f59e0b]" /> Research & Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {post.resources.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 md:p-5 bg-[#1a1a1a] rounded-xl md:rounded-2xl border border-[#252525] hover:border-[#f59e0b]/40 hover:bg-[#1a1a1a]/80 transition-all group/link"
                  >
                    <span className="text-[13px] md:text-sm font-bold text-gray-300 group-hover/link:text-white truncate pr-4">{res.title}</span>
                    <ExternalLink size={16} className="text-gray-600 group-hover/link:text-[#f59e0b] transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Check: 5 Questions */}
          {post.questions && post.questions.length > 0 && (
            <div className="mt-16 md:mt-24">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center border border-[#f59e0b]/20">
                   <HelpCircle size={20} className="text-[#f59e0b]" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Technical Deep Dive Q&A</h3>
              </div>
              <div className="space-y-4 md:space-y-6">
                {post.questions.slice(0, 5).map((q, idx) => (
                  <div key={idx} className="bg-[#121212] p-6 md:p-8 rounded-[20px] md:rounded-[28px] border border-[#222] hover:border-[#f59e0b]/20 transition-all group">
                    <div className="flex gap-4 md:gap-6">
                      <span className="text-xl md:text-2xl font-black text-[#f59e0b]/20 group-hover:text-[#f59e0b]/40 transition-colors">0{idx + 1}</span>
                      <div className="space-y-2 md:space-y-4">
                        <h4 className="text-[15px] md:text-[17px] font-black text-white leading-snug">{q.question}</h4>
                        <p className="text-[14px] md:text-[15px] text-gray-400 font-medium leading-relaxed">{q.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Blogs */}
          <div className="mt-20 md:mt-32 pt-12 md:pt-16 border-t border-[#222]">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 md:mb-12">Related Breakthroughs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {suggested.map((sPost) => (
                <div 
                  key={sPost.slug}
                  onClick={() => handleOpenPost(sPost.slug)}
                  className="group cursor-pointer bg-[#121212] p-5 md:p-6 rounded-[20px] md:rounded-[28px] border border-[#222] hover:border-[#f59e0b]/40 transition-all flex flex-col gap-3 md:gap-4"
                >
                  <div className="aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden transition-all">
                    <img src={formatImageUrl(sPost.image)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-[#f59e0b] uppercase tracking-widest mb-1 block">{sPost.tags[0]}</span>
                    <h4 className="text-[15px] md:text-lg font-black text-white leading-tight group-hover:text-[#f59e0b] transition-colors">{sPost.title}</h4>
                    <button className="mt-3 md:mt-4 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-all">
                      Read Insight <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'resume':
        return <Resume resumeData={settings.resumeData} resumeLink={settings.resumeLink} />;
      case 'products':
        return <ProductsSection products={settings.products} onDownloadTrack={() => trackEvent('resume_download')} />;
      case 'library':
        if (selectedPostSlug) return renderBlogDetail();
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mb-10 md:mb-16">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 md:mb-6">NeuralPath Library</h1>
              <p className="text-gray-400 text-[14px] md:text-[16px] leading-relaxed font-medium">
                Daily breakthroughs in AI, Data Science, and Agentic Workflows.
                Explore our high-signal library of technical insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pb-20">
              {settings.blogs.map((post) => (
                <div 
                  key={post.slug}
                  onClick={() => handleOpenPost(post.slug)}
                  className="group cursor-pointer space-y-3 md:space-y-4"
                >
                  <div className="aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden border border-[#222] bg-[#121212]">
                    <img 
                      src={formatImageUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 px-1">
                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black text-[#f59e0b] uppercase tracking-widest">
                      <span>{post.tags[0]}</span>
                      <span className="w-1.5 h-1.5 bg-[#333] rounded-full"></span>
                      <span className="text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-black text-white group-hover:text-[#f59e0b] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-[12px] md:text-[13px] line-clamp-2 leading-relaxed font-medium">
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-3 md:gap-4 mb-10 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Get in Touch</h1>
              <p className="text-gray-400 font-medium max-w-xl text-sm md:text-base">Have a project in mind or just want to chat? Drop a message below and I'll get back to you as soon as possible.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#121212] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[#222] shadow-xl overflow-hidden">
                  <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] mb-6 md:mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                    Contact Information
                  </h3>
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 md:gap-5 group cursor-default">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-[#f59e0b] border border-[#252525] group-hover:border-[#f59e0b]/50 transition-all flex-shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Location</p>
                        <p className="text-[12px] md:text-[13px] text-gray-300 font-bold group-hover:text-white transition-colors break-words">{settings.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-5 group cursor-default">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-[#f59e0b] border border-[#252525] group-hover:border-[#f59e0b]/50 transition-all flex-shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Email</p>
                        <p className="text-[12px] md:text-[13px] text-gray-300 font-bold group-hover:text-white transition-colors break-all">{settings.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-[#252525]">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mb-4 md:mb-6">Social Networks</p>
                    <div className="flex flex-col gap-2.5 md:gap-3">
                      <a href={`https://linkedin.com/in/${settings.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 md:p-4 bg-[#1a1a1a] rounded-xl md:rounded-2xl border border-[#252525] hover:border-[#f59e0b]/30 group transition-all">
                        <span className="text-[11px] md:text-xs font-bold text-gray-400 group-hover:text-white transition-colors">LinkedIn</span>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-[#f59e0b]" />
                      </a>
                      <a href={`https://github.com/${settings.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 md:p-4 bg-[#1a1a1a] rounded-xl md:rounded-2xl border border-[#252525] hover:border-[#f59e0b]/30 group transition-all">
                        <span className="text-[11px] md:text-xs font-bold text-gray-400 group-hover:text-white transition-colors">GitHub</span>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-[#f59e0b]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-[#121212] p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-[#222] shadow-2xl relative overflow-hidden">
                  {formState === 'success' ? (
                    <div className="py-10 md:py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-5 md:mb-6">
                        <CheckCircle2 size={36} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">Message Received!</h3>
                      <p className="text-gray-400 max-w-xs text-[13px] md:text-sm">Thanks for reaching out, Milan. I'll get back to you shortly.</p>
                      <button 
                        onClick={() => setFormState('idle')}
                        className="mt-8 md:mt-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#f59e0b] hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-5 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Full Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. John Doe"
                            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all placeholder:text-gray-600"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Email Address</label>
                          <input 
                            required
                            type="email" 
                            placeholder="e.g. john@example.com"
                            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all placeholder:text-gray-600"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Subject</label>
                        <input 
                          required
                          type="text" 
                          placeholder="What is this about?"
                          className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all placeholder:text-gray-600"
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Your Message</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Write your message here..."
                          className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all placeholder:text-gray-600 resize-none"
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={formState === 'loading'}
                        className="w-full bg-[#f59e0b] text-black py-4 md:py-5 rounded-xl md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 mt-2 md:mt-4 shadow-xl shadow-[#f59e0b]/10"
                      >
                        {formState === 'loading' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'about':
      default:
        const order = settings.sectionsOrder && settings.sectionsOrder.length > 0
          ? settings.sectionsOrder
          : ['about', 'stats', 'skills', 'projects', 'products', 'certifications', 'lifestyle'];

        const renderSectionById = (id: string) => {
          if (id === 'about') {
            return (
              <section id="about" key="about" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold flex items-center gap-2">ls -al Milan Bio</h2>
                </div>
                <div className="space-y-4 md:space-y-6 text-gray-400 leading-relaxed text-[15px] md:text-[16px] font-medium max-w-3xl">
                  <p className="whitespace-pre-line">
                    {settings.bio}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-2">
                    Self-motivated, Problem solver, Tech enthusiast, Passionate coder
                  </p>
                </div>
              </section>
            );
          }
          
          if (id === 'stats') {
            return (
              <section id="stats" key="stats" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al Coding Stats</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  <div className="bg-[#121212] rounded-2xl pt-6 md:pt-8 pb-4 md:pb-6 px-6 md:px-8 border border-[#222] shadow-xl overflow-hidden relative glowing-border flex flex-col justify-center h-[180px] md:h-[220px]">
                    <div className="flex items-center gap-3 text-white mb-6 md:mb-8">
                      <Zap size={18} className="text-[#f59e0b]" />
                      <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">Tech Stacks</span>
                    </div>
                    <div className="relative w-full h-16 md:h-24 marquee-mask flex items-center overflow-hidden">
                      <div className="animate-marquee-ltr flex items-center">
                        {[...techStackIcons, ...techStackIcons].map((url, i) => (
                          <div key={`stack-${i}`} className="mx-6 md:mx-10 shrink-0 flex items-center justify-center">
                             <img src={url} className="h-10 w-10 md:h-14 md:w-14 object-contain transition-all hover:scale-125" alt="tech" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#121212] rounded-2xl border border-[#222] shadow-xl overflow-hidden relative flex flex-col glowing-border h-[180px] md:h-[220px]">
                    <div className="flex items-center gap-2 text-white p-4 md:p-5 z-20 absolute top-0 left-0 w-full pointer-events-none">
                      <MapPin size={18} className="text-[#f59e0b]" />
                      <h2 className="text-[10px] md:text-xs font-black tracking-widest uppercase whitespace-nowrap">{settings.location}</h2>
                    </div>
                    <div className="w-full h-full flex items-center justify-center scale-[1.1] md:scale-[1.25] translate-y-2 md:translate-y-4">
                       <Globe />
                    </div>
                  </div>
                </div>
              </section>
            );
          }
          
          if (id === 'skills') {
            return (
              <section id="skills" key="skills" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al Skills</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {settings.skills.map((skill, idx) => (
                    <SkillCard key={idx} {...skill} />
                  ))}
                </div>
              </section>
            );
          }
          
          if (id === 'projects') {
            return (
              <section id="projects" key="projects" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al Featured Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {settings.projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>
              </section>
            );
          }
          
          if (id === 'products') {
            return (
              <section id="products-list" key="products" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al Products</h2>
                </div>
                
                {settings.products.length === 0 ? (
                  <div className="bg-[#121212] rounded-[24px] p-8 border border-[#222] text-center text-gray-500 font-bold text-xs">
                    No products listed yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {settings.products.map((product) => (
                      <div 
                        key={product.id}
                        className="bg-[#121212] rounded-[24px] p-5 md:p-6 border border-[#222] hover:border-[#f59e0b]/40 transition-all flex flex-col gap-4 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#f59e0b]/10 transition-colors"></div>
                        <div className="aspect-[16/10] w-full rounded-xl md:rounded-2xl overflow-hidden border border-[#222] bg-[#1a1a1a] relative">
                          {product.image ? (
                            <img 
                              src={formatImageUrl(product.image)} 
                              alt={product.title} 
                              className="w-full h-full object-cover opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                              <Zap size={32} className="group-hover:text-[#f59e0b]/50 transition-colors" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 flex-1 flex flex-col">
                          <h3 className="text-base font-black text-white group-hover:text-[#f59e0b] transition-colors leading-tight">
                            {product.title}
                          </h3>
                          <p className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed font-medium flex-1 line-clamp-3">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-2.5 pt-3 border-t border-[#222]/40 mt-auto">
                            {product.fileUrl && (
                              <a 
                                href={product.fileUrl} 
                                onClick={() => trackEvent('resume_download')}
                                className="bg-[#f59e0b] hover:bg-white text-black px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                              >
                                Download Asset
                              </a>
                            )}
                            {product.link && (
                              <a 
                                href={product.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-[#1a1a1a] hover:bg-[#222] text-white px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border border-[#333] hover:border-[#f59e0b]/40 transition-all"
                              >
                                Explore
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          }
          
          if (id === 'certifications') {
            return (
              <section id="certifications" key="certifications" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al Certifications</h2>
                </div>
                <div className="space-y-10 md:space-y-12">
                  {settings.certifications.map((category, idx) => (
                    <div key={idx} className="space-y-4 md:space-y-6">
                      <h3 className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">{category.category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {category.items.map((cert, cIdx) => (
                          <CertificationCard key={cIdx} {...cert} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          
          if (id === 'lifestyle') {
            return (
              <section id="lifestyle" key="lifestyle" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al Life Style</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {settings.lifestyle.map((item, idx) => (
                    <LifeStyleCard key={idx} {...item} />
                  ))}
                </div>
              </section>
            );
          }
          
          // Render Custom Section
          const customSec = settings.customSections?.find(c => c.id === id);
          if (customSec) {
            return (
              <section id={customSec.id} key={customSec.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 md:mb-8 font-mono text-sm">
                  <span className="text-[#f59e0b] font-bold text-base">$</span>
                  <h2 className="text-gray-200 font-bold">ls -al {customSec.title}</h2>
                </div>
                <div 
                  className="text-gray-400 leading-relaxed text-[15px] md:text-[16px] font-medium space-y-4"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(customSec.markdown) }}
                />
              </section>
            );
          }
          
          return null;
        };

        return (
          <div className="space-y-16 md:space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {order.map(secId => renderSectionById(secId))}

            {/* Sticky Newsletter card always at the end */}
            <section id="newsletter-cta" className="pb-12 md:pb-16">
               <div className="bg-[#121212] rounded-[24px] md:rounded-[32px] p-6 md:p-12 border border-[#222] relative overflow-hidden group hover:border-[#f59e0b]/40 transition-all shadow-2xl main-card-shadow">
                  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
                    <div className="flex-1 space-y-3 md:space-y-4 text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#1a1a1a] flex items-center justify-center border border-[#252525]">
                          <Newspaper className="text-[#f59e0b]" size={24} />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Newsletter</span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                        SUBSCRIBE <span className="text-[#f59e0b]">TECH</span> NEWSLETTER
                      </h3>
                      <p className="text-gray-400 text-[14px] md:text-[15px] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Join NeuralPath to receive daily updates on AI breakthroughs and high-signal tech insights directly.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-4 w-full lg:w-auto">
                      <button
                        onClick={() => navigateToTab('library')}
                        className="flex items-center justify-center gap-3 md:gap-4 bg-[#1a1a1a] text-white px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[12px] md:text-sm uppercase tracking-widest border border-[#333] hover:border-[#f59e0b]/50 transition-all shadow-xl"
                      >
                        Open Library
                        <BookOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsSubscribeOpen(true)}
                        className="flex items-center justify-center gap-3 md:gap-4 bg-[#f59e0b] text-black px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[12px] md:text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                      >
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        );
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#090909] text-gray-300 font-sans selection:bg-[#f59e0b] selection:text-black">
        <AdminCMS 
          settings={settings} 
          onSaveSettings={handleSaveSettings} 
          onLogout={handleLogout} 
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090909] text-gray-300 p-3 sm:p-6 md:p-10 lg:p-16 font-sans selection:bg-[#f59e0b] selection:text-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-10 items-start relative z-10">
        <Sidebar profile={settings} onAdminTrigger={() => setIsAdminLoginOpen(true)} onNavigate={navigateToTab} />
        <main className="flex-1 bg-[#1a1a1a] rounded-[32px] md:rounded-[48px] border border-[#222] p-6 sm:p-10 md:p-14 main-card-shadow relative overflow-hidden mb-24 lg:mb-0">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 md:mb-16 relative z-10">
            <div className="flex flex-col gap-2 mb-6 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center justify-center md:justify-start gap-3 md:gap-4 whitespace-nowrap">
                {settings.name}
              </h1>
              <div className="w-12 md:w-16 h-1.5 bg-[#f59e0b] rounded-full mt-1 shadow-[0_0_15px_rgba(245,158,11,0.4)] mx-auto md:mx-0"></div>
            </div>
            
            <div className="bg-[#121212] px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-[#222]">
              <nav className="flex flex-nowrap gap-x-6 md:gap-x-10 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] text-gray-500 overflow-x-auto no-scrollbar justify-center">
                <button onClick={() => navigateToTab('about')} className={`${activeTab === 'about' ? 'text-[#f59e0b]' : 'hover:text-white'} transition-colors whitespace-nowrap`}>
                  About
                </button>
                <button onClick={() => navigateToTab('resume')} className={`${activeTab === 'resume' ? 'text-[#f59e0b]' : 'hover:text-white'} transition-colors whitespace-nowrap`}>
                  Resume
                </button>
                <button onClick={() => navigateToTab('library')} className={`${activeTab === 'library' ? 'text-[#f59e0b]' : 'hover:text-white'} transition-colors whitespace-nowrap`}>
                  Library
                </button>
                <button onClick={() => navigateToTab('contact')} className={`${activeTab === 'contact' ? 'text-[#f59e0b]' : 'hover:text-white'} transition-colors whitespace-nowrap`}>
                  Contact
                </button>
              </nav>
            </div>
          </div>

          <div className="relative z-10">
            {renderContent()}
          </div>

        </main>
      </div>

      <div className={`fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 transform ${showFloatingNav ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'} w-full px-4 md:px-6 max-w-sm md:max-w-md`}>
        <div className="bg-[#121212]/30 backdrop-blur-[28px] border border-white/10 px-6 md:px-10 py-4 md:py-5 rounded-[24px] md:rounded-[36px] flex items-center justify-between shadow-[0_25px_60px_rgba(0,0,0,0.6)] mobile-nav-shadow">
          <button onClick={() => navigateToTab('about')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'about' ? 'text-[#f59e0b] scale-110' : 'text-gray-500 hover:text-white'}`}>
            <User size={22} strokeWidth={2.5} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Bio</span>
          </button>
          <button onClick={() => navigateToTab('resume')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'resume' ? 'text-[#f59e0b] scale-110' : 'text-gray-500 hover:text-white'}`}>
            <FileText size={22} strokeWidth={2.5} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Work</span>
          </button>
          <button onClick={() => navigateToTab('library')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'library' ? 'text-[#f59e0b] scale-110' : 'text-gray-500 hover:text-white'}`}>
            <BookOpen size={22} strokeWidth={2.5} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Library</span>
          </button>
          <button onClick={() => navigateToTab('contact')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'contact' ? 'text-[#f59e0b] scale-110' : 'text-gray-500 hover:text-white'}`}>
            <MessageSquare size={22} strokeWidth={2.5} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Talk</span>
          </button>
        </div>
      </div>

      <SubscribeModal 
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      <AdminLogin 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminMode(true);
        }}
      />
    </div>
  );
};

export default App;