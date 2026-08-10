import { useState, useRef } from 'react';
import { Download, LayoutTemplate, LogIn, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import CodeEditor from './components/CodeEditor';

function App() {
  const [code, setCode] = useState('const greet = () => {\n  console.log("Hello, CodeSnap!");\n};\n\ngreet();');
  const [language, setLanguage] = useState('javascript');
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref to target the specific DOM element for export
  const exportRef = useRef(null);

  // The export pipeline function
  const exportAsImage = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      // Generate PNG with high pixel ratio for retina-quality exports
      const dataUrl = await toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2, 
        // Filter out any UI elements that shouldn't be in the final image (if needed later)
      });
      
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.download = `codesnap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Oops, something went wrong exporting!', error);
      alert('Failed to export image. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* 1. Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">CodeSnap Studio</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Log In
          </button>
          
          {/* Updated Export Button */}
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

      {/* 2. Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar / Controls Panel */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-6 overflow-y-auto">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Settings</h2>
          
          <div className="space-y-6">
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML/CSS</option>
                <option value="rust">Rust</option>
              </select>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Canvas Size</label>
              <select 
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="auto">Auto (Fit Content)</option>
                <option value="1/1">Square (1:1)</option>
                <option value="16/9">Landscape (16:9)</option>
                <option value="4/5">Portrait (4:5)</option>
              </select>
            </div>
            
            <div className="p-4 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
              <p>🎨 Next up: Theming, padding sliders, and watermarks in Phase 3.</p>
            </div>
          </div>
        </aside>

        {/* Right Canvas / Live Preview Area */}
        <section className="flex-1 bg-slate-100 overflow-y-auto flex items-center justify-center p-8 lg:p-12">
          
          {/* Target for html-to-image */}
          <div 
            ref={exportRef}
            className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
            style={{ 
              aspectRatio: aspectRatio === 'auto' ? 'auto' : aspectRatio,
              width: aspectRatio !== 'auto' ? '100%' : 'auto',
              maxWidth: '800px'
            }}
          >
            <div className="w-full max-w-3xl">
              <CodeEditor 
                code={code} 
                setCode={setCode} 
                language={language} 
              />
            </div>
          </div>
          
        </section>
      </main>

    </div>
  );
}

export default App;