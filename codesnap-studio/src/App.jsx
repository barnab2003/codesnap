// src/App.jsx
import { useState, useMemo } from 'react';
import { Download, LayoutTemplate, LogIn, Loader2, Crown } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { splitCodeIntoSlides } from './utils/splitCode';
import SlideCard from './components/SlideCard';

const THEME_BACKGROUNDS = {
  minimalist: 'bg-slate-100',
  glassmorphism: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  brutalist: 'bg-[#FFDF00]',
  cyberpunk: 'bg-slate-950 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
  y2k: 'bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-200',
  claymorphism: 'bg-[#e0e5ec]',
};

export default function App() {
  const [code, setCode] = useState('// Generating LinkedIn carousels\nconst buildCarousel = async () => {\n  const idea = "CodeSnap Studio";\n  const impact = await scale(idea);\n  return impact;\n};\n\n// Keep scrolling to see more...\nconsole.log("Next slide!");\n\n// More code here\nconst result = "High engagement";\nconsole.log(result);');
  const [language, setLanguage] = useState('javascript');
  const [linesPerSlide, setLinesPerSlide] = useState(12);
  
  const [theme, setTheme] = useState('glassmorphism');
  const [frame, setFrame] = useState('macos');
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(18);
  const [watermark, setWatermark] = useState('@myhandle');
  const [isExporting, setIsExporting] = useState(false);

  // Derive slides array automatically when code or slider changes
  const slides = useMemo(() => splitCodeIntoSlides(code, linesPerSlide), [code, linesPerSlide]);

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">CodeSnap Studio <span className="text-sm font-normal text-slate-400">| Carousel Generator</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Log In
          </button>
          <button 
            onClick={exportAsPDFCarousel}
            disabled={isExporting || slides.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Building PDF...' : 'Download Carousel PDF'}
          </button>
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
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'minimalist', name: 'Minimalist' }, { id: 'glassmorphism', name: 'Glass' },
                  { id: 'brutalist', name: 'Brutalist', pro: true }, { id: 'cyberpunk', name: 'Cyberpunk', pro: true },
                  { id: 'y2k', name: 'Y2K Retro', pro: true }, { id: 'claymorphism', name: 'Clay', pro: true }
                ].map((t) => (
                  <button key={t.id} onClick={() => setTheme(t.id)} className={`relative p-2 text-xs font-medium rounded-lg border text-left transition-all ${theme === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                    {t.name} {t.pro && <Crown className="w-3 h-3 absolute top-2 right-2 text-amber-500" />}
                  </button>
                ))}
              </div>
              <select value={frame} onChange={(e) => setFrame(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="macos">macOS Dots</option>
                <option value="windows">Windows 95</option>
                <option value="clean">Clean Border</option>
                <option value="none">No Frame</option>
              </select>
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
                  frame={frame}
                  fontSize={fontSize}
                  padding={padding}
                  pageIndex={index + 1}
                  totalPages={slides.length}
                  watermark={watermark}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}