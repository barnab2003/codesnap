import React from 'react';
import { codeToHtml } from 'shiki';

export default function CodeEditor({ code, setCode, language = 'javascript' }) {
  const [highlightedCode, setHighlightedCode] = React.useState('');

  // Re-run Shiki whenever the code or language changes
  React.useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark', // Default theme for now, we will skin it later
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Shiki highlighting error:", error);
      }
    };

    highlight();
  }, [code, language]);

  return (
    <div className="relative w-full rounded-xl bg-[#24292e] shadow-2xl overflow-hidden font-mono text-sm sm:text-base">
      {/* Top Window Bar (Mac style) */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      <div className="relative p-6 min-h-[300px]">
        {/* Rendered Syntax Highlighted HTML */}
        <div
          className="absolute inset-0 p-6 pointer-events-none"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        
        {/* Invisible Textarea overlay for user input */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent caret-white resize-none outline-none no-scrollbar"
          style={{ whiteSpace: 'pre', tabSize: 2 }}
        />
      </div>
    </div>
  );
}