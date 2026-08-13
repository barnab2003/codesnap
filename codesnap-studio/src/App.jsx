// src/App.jsx
import { useState, useMemo, useEffect } from 'react';
import { Download, LayoutTemplate, LogIn, LogOut, Loader2, Crown, FileText, Images } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { splitCodeIntoSlides } from './utils/splitCode';
import SlideCard from './components/SlideCard';
import { supabase } from './lib/supabase';

const THEME_BACKGROUNDS = {
  /* Minimalist */
  'minimalist-1': 'bg-slate-100',
  'minimalist-2': 'bg-zinc-900',
  'minimalist-3': 'bg-blue-100',
  'minimalist-4': 'bg-[#f4ebd8]', // Sepia
  'minimalist-5': 'bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0),linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-slate-50',
  
  /* Glassmorphism */
  'glass-1': 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'glass-2': 'bg-gradient-to-br from-blue-200 via-indigo-100 to-cyan-200',
  'glass-3': 'bg-gradient-to-tr from-fuchsia-900 to-violet-800',
  'glass-4': 'bg-gradient-to-br from-teal-500 to-cyan-700',
  'glass-5': 'bg-gradient-to-br from-rose-500 to-orange-400',

  /* Brutalist */
  'brutal-1': 'bg-[#FFDF00]',
  'brutal-2': 'bg-blue-600',
  'brutal-3': 'bg-orange-500',
  'brutal-4': 'bg-lime-400',
  'brutal-5': 'bg-red-600',

  /* Cyberpunk */
  'cyber-1': 'bg-slate-950 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
  'cyber-2': 'bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900 to-black',
  'cyber-3': 'bg-zinc-950 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.1)_10px,rgba(239,68,68,0.1)_20px)]',
  'cyber-4': 'bg-indigo-950',
  'cyber-5': 'bg-black',

  /* Y2K Retro */
  'y2k-1': 'bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-200',
  'y2k-2': 'bg-gradient-to-br from-pink-300 to-teal-300',
  'y2k-3': 'bg-gradient-to-b from-sky-300 to-white',
  'y2k-4': 'bg-gradient-to-tr from-orange-400 to-purple-500',
  'y2k-5': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-100 via-cyan-100 to-yellow-100',

  /* Claymorphism */
  'clay-1': 'bg-[#e0e5ec]',
  'clay-2': 'bg-[#ffd3b6]',
  'clay-3': 'bg-[#a8e6cf]',
  'clay-4': 'bg-[#2d3748]',
  'clay-5': 'bg-[#dcd3ff]',
};

export default function App() {
  const [code, setCode] = useState('// Generating LinkedIn carousels\nconst buildCarousel = async () => {\n  const idea = "CodeSnap Studio";\n  const impact = await scale(idea);\n  return impact;\n};\n\n// Keep scrolling to see more...\nconsole.log("Next slide!");\n\n// More code here\nconst result = "High engagement";\nconsole.log(result);');
  const [language, setLanguage] = useState('javascript');
  const [linesPerSlide, setLinesPerSlide] = useState(12);
  
  const [theme, setTheme] = useState('glass-1'); // Initialize with new naming convention
  const [frame, setFrame] = useState('macos');
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(18);
  const [watermark, setWatermark] = useState('@myhandle');
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingImages, setIsExportingImages] = useState(false);
  const [syntaxTheme, setSyntaxTheme] = useState('dracula');
  // Derive slides array automatically when code or slider changes
  const slides = useMemo(() => splitCodeIntoSlides(code, linesPerSlide), [code, linesPerSlide]);
  const [session, setSession] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setIsAuthLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setIsPro(false);
        setIsAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch the user's Pro status from our custom table
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_pro')
        .eq('id', userId)
        .single();
        
      if (data) setIsPro(data.is_pro);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    // Using GitHub OAuth for seamless developer login
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setTheme('glass-1'); // Kick them back to a free theme on logout
  };
  const exportAsPDFCarousel = async () => {
    setIsExporting(true);
    try {
      // 1080x1350 is the optimal 4:5 vertical standard for LinkedIn/Instagram
      const pdf = new jsPDF("p", "px", [1080, 1350]);
      
      // Target all elements rendered with this class
      const slideElements = document.querySelectorAll('.carousel-slide-export');
      
      for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i];
        
        // Render high-res PNG
        const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
        
        if (i > 0) pdf.addPage([1080, 1350], "p");
        
        // Draw the image filling the entire page
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1350);
      }
      
      pdf.save(`codesnap-carousel-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Failed to export PDF.');
    } finally {
      setIsExporting(false);
    }
  };
  const exportAsImagesZip = async () => {
    setIsExportingImages(true);
    try {
      const zip = new JSZip();
      const slideElements = document.querySelectorAll('.carousel-slide-export');
      
      for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i];
        
        // Render high-res PNG
        const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
        
        // html-to-image outputs a data URL (e.g., data:image/png;base64,iVBORw0KGgo...). 
        // JSZip needs just the raw base64 string, so we strip the prefix.
        const base64Data = dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
        
        // Add the image to the zip file
        zip.file(`codesnap-slide-${i + 1}.png`, base64Data, { base64: true });
      }
      
      // Generate the ZIP file as a blob and download it
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `codesnap-carousel-${Date.now()}.zip`;
      link.click();
      
    } catch (error) {
      console.error('ZIP Export failed:', error);
      alert('Failed to export ZIP file.');
    } finally {
      setIsExportingImages(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">CodeSnap Studio <span className="text-sm font-normal text-slate-400">| Carousel Generator</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Dynamic Auth & Monetization Button */}
          {isAuthLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : session ? (
            <div className="flex items-center gap-3">
              {isPro ? (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              ) : (
                <a 
                  href={`https://buy.stripe.com/test_your_link_here?client_reference_id=${session.user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-3 py-1.5 rounded-md transition-all shadow-sm"
                >
                  <Crown className="w-4 h-4" /> Upgrade to Pro
                </a>
              )}
              <button onClick={handleLogout} className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 ml-2">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Log In with GitHub
            </button>
          )}
          
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
            {/* PDF Download Button */}
            <button 
              onClick={exportAsPDFCarousel}
              disabled={isExporting || isExportingImages || slides.length === 0}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {isExporting ? 'Building...' : 'PDF'}
            </button>
            
            {/* ZIP Download Button */}
            <button 
              onClick={exportAsImagesZip}
              disabled={isExporting || isExportingImages || slides.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExportingImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4" />}
              {isExportingImages ? 'Zipping...' : 'Images'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-96 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paste Your Code</h2>
              <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="Paste code here..."
                spellCheck="false"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML/CSS</option>
                    <option value="rust">Rust</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lines / Slide</label>
                  <input type="number" min="6" max="25" value={linesPerSlide} onChange={(e) => setLinesPerSlide(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Theme & Style</h2>
              
              {/* Outer Wrapper Theme Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Canvas Theme</label>
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup label="Minimalist (Free)">
                    <option value="minimalist-1">Minimalist 1: Classic</option>
                    <option value="minimalist-2">Minimalist 2: Dark</option>
                    <option value="minimalist-3">Minimalist 3: Blueprint</option>
                    <option value="minimalist-4">Minimalist 4: Sepia</option>
                    <option value="minimalist-5">Minimalist 5: Wireframe</option>
                  </optgroup>
                  <optgroup label="Glassmorphism (Free)">
                    <option value="glass-1">Glass 1: Dark Frost</option>
                    <option value="glass-2">Glass 2: Light Frost</option>
                    <option value="glass-3">Glass 3: Amethyst</option>
                    <option value="glass-4">Glass 4: Deep Ocean</option>
                    <option value="glass-5">Glass 5: Rose</option>
                  </optgroup>
                  
                  {/* PRO THEMES - Locked if not pro */}
                  <optgroup label="Brutalist (Pro) 👑" disabled={!isPro}>
                    <option value="brutal-1">Brutalist 1: Classic Yellow</option>
                    <option value="brutal-2">Brutalist 2: Pop Pink</option>
                    <option value="brutal-3">Brutalist 3: Cyan Burst</option>
                    <option value="brutal-4">Brutalist 4: Hacker Lime</option>
                    <option value="brutal-5">Brutalist 5: Lavender Red</option>
                  </optgroup>
                  <optgroup label="Cyberpunk (Pro) 👑" disabled={!isPro}>
                    <option value="cyber-1">Cyber 1: Neon Pink</option>
                    <option value="cyber-2">Cyber 2: Toxic Green</option>
                    <option value="cyber-3">Cyber 3: Alert Red</option>
                    <option value="cyber-4">Cyber 4: Synthwave</option>
                    <option value="cyber-5">Cyber 5: High Voltage</option>
                  </optgroup>
                  <optgroup label="Y2K Retro (Pro) 👑" disabled={!isPro}>
                    <option value="y2k-1">Y2K 1: Silver Metal</option>
                    <option value="y2k-2">Y2K 2: Bubblegum</option>
                    <option value="y2k-3">Y2K 3: Frutiger Aero</option>
                    <option value="y2k-4">Y2K 4: Sunset</option>
                    <option value="y2k-5">Y2K 5: Holographic</option>
                  </optgroup>
                  <optgroup label="Claymorphism (Pro) 👑" disabled={!isPro}>
                    <option value="clay-1">Clay 1: Standard Gray</option>
                    <option value="clay-2">Clay 2: Peach</option>
                    <option value="clay-3">Clay 3: Mint</option>
                    <option value="clay-4">Clay 4: Midnight</option>
                    <option value="clay-5">Clay 5: Lilac</option>
                  </optgroup>
                </select>
                {!isPro && <p className="text-xs text-slate-500 mt-1">Unlock Pro themes with a one-time upgrade.</p>}
              </div>

              {/* NEW: Syntax Theme Dropdown (VS Code Themes) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Syntax Theme</label>
                <select value={syntaxTheme} onChange={(e) => setSyntaxTheme(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <optgroup label="Dark Themes">
                    <option value="dark-plus">Dark+ (VS Code)</option>
                    <option value="dracula">Dracula</option>
                    <option value="dracula-soft">Dracula Soft</option>
                    <option value="github-dark">GitHub Dark</option>
                    <option value="github-dark-dimmed">GitHub Dark Dimmed</option>
                    <option value="material-theme">Material Theme</option>
                    <option value="material-theme-darker">Material Theme Darker</option>
                    <option value="material-theme-ocean">Material Theme Ocean</option>
                    <option value="material-theme-palenight">Material Theme Palenight</option>
                    <option value="nord">Nord</option>
                    <option value="one-dark-pro">One Dark Pro</option>
                  </optgroup>
                  <optgroup label="Light Themes">
                    <option value="light-plus">Light+ (VS Code)</option>
                    <option value="github-light">GitHub Light</option>
                    <option value="material-theme-lighter">Material Theme Lighter</option>
                    <option value="min-light">Min Light</option>
                  </optgroup>
                </select>
              </div>

              {/* Frame Style Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Window Frame</label>
                <select value={frame} onChange={(e) => setFrame(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="macos">macOS Dots</option>
                  <option value="windows">Windows 95</option>
                  <option value="clean">Clean Border</option>
                  <option value="none">No Frame</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Layout & Branding</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Padding: {padding}px</label>
                  <input type="range" min="16" max="96" step="8" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Font: {fontSize}px</label>
                  <input type="range" min="12" max="24" step="1" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
              </div>
              
              {/* Opacity Slider */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Watermark Opacity: {watermarkOpacity}%</label>
                <input type="range" min="0" max="100" step="5" value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <input type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} placeholder="@username" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

          </div>
        </aside>

        {/* Right Canvas / Live Preview Stack */}
        <section className="flex-1 bg-slate-200 overflow-y-auto p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto space-y-8 flex flex-col items-center">
            {slides.map((chunk, index) => (
              <div 
                key={index} 
                className={`w-full shadow-2xl transition-all duration-300 ${THEME_BACKGROUNDS[theme]}`}
              >
                <SlideCard 
                  codeChunk={chunk}
                  language={language}
                  theme={theme}
                  syntaxTheme={syntaxTheme}
                  frame={frame}
                  fontSize={fontSize}
                  padding={padding}
                  pageIndex={index + 1}
                  totalPages={slides.length}
                  watermark={watermark}
                  watermarkOpacity={watermarkOpacity}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}