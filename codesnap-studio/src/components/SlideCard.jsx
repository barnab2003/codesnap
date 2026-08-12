// src/components/SlideCard.jsx
import React from 'react';
import { codeToHtml } from 'shiki';

const THEME_STYLES = {
  /* ================== MINIMALIST ================== */
  'minimalist-1': { wrapper: 'bg-white border-2 border-slate-200 shadow-sm text-slate-800', headerBorder: 'border-slate-200', footerText: 'text-slate-500' },
  'minimalist-2': { wrapper: 'bg-zinc-950 border-2 border-zinc-800 shadow-sm text-zinc-300', headerBorder: 'border-zinc-800', footerText: 'text-zinc-500' },
  'minimalist-3': { wrapper: 'bg-blue-50 border-2 border-blue-200 shadow-sm text-blue-900', headerBorder: 'border-blue-200', footerText: 'text-blue-400' },
  'minimalist-4': { wrapper: 'bg-stone-50 border-2 border-stone-300 shadow-sm text-stone-800', headerBorder: 'border-stone-300', footerText: 'text-stone-400' },
  'minimalist-5': { wrapper: 'bg-white border-4 border-dashed border-slate-300 text-slate-800', headerBorder: 'border-dashed border-slate-300', footerText: 'text-slate-400' },

  /* ================== GLASSMORPHISM ================== */
  'glass-1': { wrapper: 'bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-2xl text-white rounded-2xl', headerBorder: 'border-white/10', footerText: 'text-white' },
  'glass-2': { wrapper: 'bg-white/40 backdrop-blur-md border border-white/40 shadow-xl text-slate-900 rounded-2xl', headerBorder: 'border-white/30', footerText: 'text-slate-800' },
  'glass-3': { wrapper: 'bg-fuchsia-900/40 backdrop-blur-md border border-fuchsia-300/20 shadow-2xl text-fuchsia-50 rounded-2xl', headerBorder: 'border-white/10', footerText: 'text-fuchsia-100' },
  'glass-4': { wrapper: 'bg-cyan-900/40 backdrop-blur-md border border-cyan-300/20 shadow-2xl text-cyan-50 rounded-2xl', headerBorder: 'border-white/10', footerText: 'text-cyan-100' },
  'glass-5': { wrapper: 'bg-rose-900/40 backdrop-blur-md border border-rose-300/20 shadow-2xl text-rose-50 rounded-2xl', headerBorder: 'border-white/10', footerText: 'text-rose-100' },

  /* ================== BRUTALIST ================== */
  'brutal-1': { wrapper: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black rounded-none', headerBorder: 'border-black border-b-4', footerText: 'text-black font-bold' },
  'brutal-2': { wrapper: 'bg-pink-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black rounded-none', headerBorder: 'border-black border-b-4', footerText: 'text-black font-bold' },
  'brutal-3': { wrapper: 'bg-cyan-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black rounded-none', headerBorder: 'border-black border-b-4', footerText: 'text-black font-bold' },
  'brutal-4': { wrapper: 'bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(132,204,22,1)] text-white rounded-none', headerBorder: 'border-zinc-800 border-b-4', footerText: 'text-black font-bold' },
  'brutal-5': { wrapper: 'bg-purple-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black rounded-none', headerBorder: 'border-black border-b-4', footerText: 'text-black font-bold' },

  /* ================== CYBERPUNK ================== */
  'cyber-1': { wrapper: 'bg-slate-950 border-2 border-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] text-cyan-50 rounded-lg', headerBorder: 'border-cyan-400/50', footerText: 'text-cyan-400' },
  'cyber-2': { wrapper: 'bg-zinc-950 border-2 border-lime-400 drop-shadow-[0_0_15px_rgba(132,204,22,0.5)] text-lime-50 rounded-lg', headerBorder: 'border-lime-400/50', footerText: 'text-lime-400' },
  'cyber-3': { wrapper: 'bg-black border-2 border-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] text-red-50 rounded-lg', headerBorder: 'border-red-500/50', footerText: 'text-red-500' },
  'cyber-4': { wrapper: 'bg-indigo-950 border-2 border-fuchsia-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] text-fuchsia-50 rounded-lg', headerBorder: 'border-fuchsia-500/50', footerText: 'text-fuchsia-400' },
  'cyber-5': { wrapper: 'bg-black border-2 border-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] text-yellow-50 rounded-lg', headerBorder: 'border-yellow-400/50', footerText: 'text-yellow-400' },

  /* ================== Y2K RETRO ================== */
  'y2k-1': { wrapper: 'bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-slate-400 shadow-inner text-slate-900 rounded-lg', headerBorder: 'border-slate-400', footerText: 'text-slate-700' },
  'y2k-2': { wrapper: 'bg-gradient-to-b from-pink-100 to-teal-100 border-2 border-pink-300 shadow-inner text-slate-800 rounded-lg', headerBorder: 'border-pink-300', footerText: 'text-slate-700' },
  'y2k-3': { wrapper: 'bg-gradient-to-b from-blue-50 to-blue-200 border-2 border-blue-400 shadow-inner text-blue-900 rounded-lg', headerBorder: 'border-blue-400', footerText: 'text-blue-800' },
  'y2k-4': { wrapper: 'bg-gradient-to-b from-orange-100 to-purple-200 border-2 border-orange-300 shadow-inner text-slate-900 rounded-lg', headerBorder: 'border-orange-300', footerText: 'text-purple-900' },
  'y2k-5': { wrapper: 'bg-gradient-to-tr from-cyan-100 via-fuchsia-100 to-yellow-100 border-2 border-fuchsia-300 shadow-inner text-slate-900 rounded-lg', headerBorder: 'border-fuchsia-300', footerText: 'text-fuchsia-800' },

  /* ================== CLAYMORPHISM ================== */
  'clay-1': { wrapper: 'bg-[#e0e5ec] rounded-3xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] border-none', headerBorder: 'border-slate-300/50', footerText: 'text-slate-500' },
  'clay-2': { wrapper: 'bg-[#ffd3b6] rounded-3xl shadow-[10px_10px_20px_#d9b39b,-10px_-10px_20px_#ffffff] border-none', headerBorder: 'border-orange-200/50', footerText: 'text-orange-800/60' },
  'clay-3': { wrapper: 'bg-[#a8e6cf] rounded-3xl shadow-[10px_10px_20px_#8fc4b0,-10px_-10px_20px_#c1ffed] border-none', headerBorder: 'border-emerald-200/50', footerText: 'text-emerald-800/60' },
  'clay-4': { wrapper: 'bg-[#2d3748] rounded-3xl shadow-[10px_10px_20px_#1a202c,-10px_-10px_20px_#4a5568] border-none', headerBorder: 'border-slate-600/50', footerText: 'text-slate-400' },
  'clay-5': { wrapper: 'bg-[#dcd3ff] rounded-3xl shadow-[10px_10px_20px_#bbb4d9,-10px_-10px_20px_#fdf2ff] border-none', headerBorder: 'border-purple-300/50', footerText: 'text-purple-600/60' }
};

export default function SlideCard({ 
  codeChunk, 
  language = 'javascript', 
  theme = 'glassmorphism', 
  syntaxTheme = 'dracula', // <-- NEW PROP
  frame = 'macos', 
  fontSize = 16,
  padding = 64,
  pageIndex,
  totalPages,
  watermark,
  watermarkOpacity = 70
}) {
  const [highlightedCode, setHighlightedCode] = React.useState('');
  const activeTheme = THEME_STYLES[theme];

  React.useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(codeChunk || ' ', {
          lang: language,
          theme: syntaxTheme, // <-- NOW DRIVEN BY THE DROPDOWN
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Shiki highlighting error:", error);
      }
    };
    highlight();
  }, [codeChunk, language, syntaxTheme]);

  const renderFrame = () => {
    if (frame === 'none') return null;
    if (frame === 'windows') {
      return (
        <div className="flex justify-between items-center px-3 py-1.5 bg-blue-800 text-white font-sans text-xs font-bold shrink-0">
          <span className="tracking-wide">CodeSnap.exe</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-slate-200 border border-white text-black flex items-center justify-center text-[10px]">_</div>
            <div className="w-4 h-4 bg-slate-200 border border-white text-black flex items-center justify-center text-[10px]">□</div>
            <div className="w-4 h-4 bg-slate-200 border border-white text-black flex items-center justify-center text-[10px]">X</div>
          </div>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 px-4 py-3 border-b shrink-0 ${activeTheme.headerBorder}`}>
        {frame === 'macos' && (
          <>
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-inner"></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      className="carousel-slide-export relative flex flex-col w-full aspect-[4/5] shrink-0 overflow-hidden"
      style={{ padding: `${padding}px` }}
    >
      <div className={`flex flex-col w-full flex-1 overflow-hidden transition-all duration-300 ${activeTheme.wrapper}`}>
        {renderFrame()}
        
        {/* We removed `p-6` from this wrapper and applied `[&>pre]:p-6 [&>pre]:h-full` 
            so Shiki's native background stretches to fill the whole editor window */}
        <div 
          className="flex-1 overflow-hidden pointer-events-none font-mono [&>pre]:p-6 [&>pre]:m-0 [&>pre]:h-full"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>

      <div 
        className={`flex justify-between items-center w-full shrink-0 text-sm font-medium ${activeTheme.footerText} mix-blend-luminosity z-20 mt-6 transition-all duration-300`}
        style={{ opacity: watermarkOpacity / 100 }}
      >
        <span>{watermark}</span>
        <span>{pageIndex} / {totalPages}</span>
      </div>
    </div>
  );
}