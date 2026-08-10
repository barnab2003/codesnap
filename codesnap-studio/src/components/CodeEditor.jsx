import React from 'react';
import { codeToHtml } from 'shiki';

// Map our app themes to appropriate Shiki syntax themes and Tailwind wrapper styles
const THEME_STYLES = {
  minimalist: {
    shiki: 'github-light',
    wrapper: 'bg-white border-2 border-slate-200 shadow-sm text-slate-800',
    headerBorder: 'border-slate-200'
  },
  glassmorphism: {
    shiki: 'github-dark',
    wrapper: 'bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-2xl text-white rounded-2xl',
    headerBorder: 'border-white/10'
  },
  brutalist: {
    shiki: 'github-light',
    wrapper: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black rounded-none',
    headerBorder: 'border-black border-b-4'
  },
  cyberpunk: {
    shiki: 'dracula',
    wrapper: 'bg-slate-950 border-2 border-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] text-cyan-50 rounded-lg',
    headerBorder: 'border-cyan-400/50'
  },
  y2k: {
    shiki: 'nord',
    wrapper: 'bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-slate-400 shadow-inner text-slate-900 rounded-lg',
    headerBorder: 'border-slate-400'
  },
  claymorphism: {
    shiki: 'github-light',
    wrapper: 'bg-[#e0e5ec] rounded-3xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] border-none',
    headerBorder: 'border-slate-300/50'
  }
};

export default function CodeEditor({ code, setCode, language = 'javascript', theme = 'glassmorphism', frame = 'macos', fontSize = 16 }) {
  const [highlightedCode, setHighlightedCode] = React.useState('');
  const activeTheme = THEME_STYLES[theme];

  React.useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: activeTheme.shiki,
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Shiki highlighting error:", error);
      }
    };

    highlight();
  }, [code, language, activeTheme.shiki]);

  const renderFrame = () => {
    if (frame === 'none') return null;

    if (frame === 'windows') {
      return (
        <div className="flex justify-between items-center px-3 py-1.5 bg-blue-800 text-white font-sans text-xs font-bold">
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
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${activeTheme.headerBorder}`}>
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
    <div className={`relative w-full overflow-hidden transition-all duration-300 ${activeTheme.wrapper}`}>
      {renderFrame()}

      <div className="relative p-6 min-h-[200px]" style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}>
        {/* Rendered Syntax Highlighted HTML */}
        <div
          className="absolute inset-0 p-6 pointer-events-none [&>pre]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        
        {/* Invisible Textarea overlay for user input */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent caret-current resize-none outline-none no-scrollbar font-mono"
          style={{ whiteSpace: 'pre', tabSize: 2, fontSize: `${fontSize}px`, lineHeight: 1.5 }}
        />
      </div>
    </div>
  );
}