import { useState } from 'react';
import { Download, LayoutTemplate, LogIn } from 'lucide-react';
import CodeEditor from './components/CodeEditor';

function App() {
  const [code, setCode] = useState('const greet = () => {\n  console.log("Hello, CodeSnap!");\n};\n\ngreet();');
  const [language, setLanguage] = useState('javascript');

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
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm cursor-not-allowed opacity-70">
            <Download className="w-4 h-4" /> Export Image
          </button>
        </div>
      </header>

      {/* 2. Main Workspace (Split View) */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar / Controls Panel (Placeholder for Phase 3) */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-6 overflow-y-auto">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Settings</h2>
          
          <div className="space-y-6">
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
            
            <div className="p-4 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
              <p>🎨 Theming, sizing, and watermarks will be implemented in Phase 3.</p>
            </div>
          </div>
        </aside>

        {/* Right Canvas / Live Preview Area */}
        <section className="flex-1 bg-slate-100 overflow-y-auto flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-3xl flex items-center justify-center">
            
            {/* The actual exportable container we will target in Phase 2 */}
            <div className="p-8 w-full max-w-3xl">
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