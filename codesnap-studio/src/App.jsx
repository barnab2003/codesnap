import { useState, useRef } from 'react';
import { Download, LayoutTemplate, LogIn, Loader2, Crown } from 'lucide-react';
import { toPng } from 'html-to-image';
import CodeEditor from './components/CodeEditor';

const THEME_BACKGROUNDS = {
  minimalist: 'bg-slate-100',
  glassmorphism: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  brutalist: 'bg-[#FFDF00]',
  cyberpunk: 'bg-slate-950 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
  y2k: 'bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-200',
  claymorphism: 'bg-[#e0e5ec]',
};

export default function App() {
  // Core State
  const [code, setCode] = useState('const buildSaaS = async () => {\n  const idea = "CodeSnap Studio";\n  await code(idea);\n  return launch();\n};');
  const [language, setLanguage] = useState('javascript');
  const [aspectRatio, setAspectRatio] = useState('auto');
  
  // Customization State
  const [theme, setTheme] = useState('glassmorphism');
  const [frame, setFrame] = useState('macos');
  const [padding, setPadding] = useState(64);
  const [fontSize, setFontSize] = useState(16);
  const [watermark, setWatermark] = useState('@myhandle');
  
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  const exportAsImage = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `codesnap-${theme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">CodeSnap Studio</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Log In
          </button>
          <button 
            onClick={exportAsImage}
            disabled={isExporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Exporting...' : 'Export Image'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Controls */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Section: Base Settings */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canvas Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML/CSS</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Aspect Ratio</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="auto">Auto (Fit Content)</option>
                  <option value="1/1">Square (1:1)</option>
                  <option value="16/9">Landscape (16:9)</option>
                  <option value="4/5">Portrait (4:5)</option>
                </select>
              </div>
            </div>

            {/* Section: Themes */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Theme & Style</h2>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'minimalist', name: 'Minimalist' },
                  { id: 'glassmorphism', name: 'Glass' },
                  { id: 'brutalist', name: 'Brutalist', pro: true },
                  { id: 'cyberpunk', name: 'Cyberpunk', pro: true },
                  { id: 'y2k', name: 'Y2K Retro', pro: true },
                  { id: 'claymorphism', name: 'Clay', pro: true }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative p-2 text-xs font-medium rounded-lg border text-left transition-all ${theme === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}
                  >
                    {t.name}
                    {t.pro && <Crown className="w-3 h-3 absolute top-2 right-2 text-amber-500" />}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frame Style</label>
                <select value={frame} onChange={(e) => setFrame(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="macos">macOS Dots</option>
                  <option value="windows">Windows 95</option>
                  <option value="clean">Clean Border</option>
                  <option value="none">No Frame</option>
                </select>
              </div>
            </div>

            {/* Section: Layout Adjustments */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Layout</h2>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Padding</label>
                  <span className="text-xs text-slate-500">{padding}px</span>
                </div>
                <input type="range" min="16" max="128" step="8" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Font Size</label>
                  <span className="text-xs text-slate-500">{fontSize}px</span>
                </div>
                <input type="range" min="12" max="24" step="1" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
            </div>

            {/* Section: Branding */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Branding</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Watermark</label>
                <input 
                  type="text" 
                  value={watermark} 
                  onChange={(e) => setWatermark(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

          </div>
        </aside>

        {/* Right Canvas Preview */}
        <section className="flex-1 bg-slate-200/50 overflow-y-auto flex items-center justify-center p-8 lg:p-12 background-pattern">
          
          <div 
            ref={exportRef}
            className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden ${THEME_BACKGROUNDS[theme]}`}
            style={{ 
              aspectRatio: aspectRatio === 'auto' ? 'auto' : aspectRatio,
              width: aspectRatio !== 'auto' ? '100%' : 'auto',
              maxWidth: '900px',
              padding: `${padding}px`
            }}
          >
            <div className="w-full max-w-3xl z-10">
              <CodeEditor 
                code={code} 
                setCode={setCode} 
                language={language}
                theme={theme}
                frame={frame}
                fontSize={fontSize}
              />
            </div>

            {/* Canvas Watermark */}
            {watermark && (
              <div className="absolute bottom-4 right-6 text-white/70 font-medium text-sm drop-shadow-md z-20 mix-blend-overlay">
                {watermark}
              </div>
            )}
          </div>
          
        </section>
      </main>

    </div>
  );
}