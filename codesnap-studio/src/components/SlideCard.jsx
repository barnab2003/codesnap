// src/components/SlideCard.jsx
import React from 'react';
import { codeToHtml } from 'shiki';

const THEME_STYLES = {
  minimalist: {
    wrapper: 'bg-white border-2 border-slate-200 shadow-sm text-slate-800',
    headerBorder: 'border-slate-200',
    footerText: 'text-slate-400'
  },
  glassmorphism: {
    wrapper: 'bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-2xl text-white rounded-2xl',
    headerBorder: 'border-white/10',
    footerText: 'text-white' 
  },
  brutalist: {
    wrapper: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black rounded-none',
    headerBorder: 'border-black border-b-4',
    footerText: 'text-black font-bold'
  },
  cyberpunk: {
    wrapper: 'bg-slate-950 border-2 border-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] text-cyan-50 rounded-lg',
    headerBorder: 'border-cyan-400/50',
    footerText: 'text-cyan-400'
  },
  y2k: {
    wrapper: 'bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-slate-400 shadow-inner text-slate-900 rounded-lg',
    headerBorder: 'border-slate-400',
    footerText: 'text-slate-700'
  },
  claymorphism: {
    wrapper: 'bg-[#e0e5ec] rounded-3xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] border-none',
    headerBorder: 'border-slate-300/50',
    footerText: 'text-slate-500'
  }
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