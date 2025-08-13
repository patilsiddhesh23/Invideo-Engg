import React, { useState } from 'react';
import { Calculator } from './Calculator';
import { ShaderLab } from './ShaderLab';

export default function App() {
  const [tab, setTab] = useState<'calc' | 'shader'>('calc');
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="gradient-text">WASM + Shader Lab</h1>
        <p className="subtitle">Rust powered compute • LLM assisted GLSL • Real‑time WebGL</p>
      </header>
      <nav role="tablist" aria-label="Primary" className="tabs">
        <button role="tab" aria-selected={tab==='calc'} className={tab==='calc'? 'tab-button active':'tab-button'} onClick={()=>setTab('calc')}>Calculator</button>
        <button role="tab" aria-selected={tab==='shader'} className={tab==='shader'? 'tab-button active':'tab-button'} onClick={()=>setTab('shader')}>Shader Lab</button>
        <div className="tabs-indicator" data-pos={tab} />
      </nav>
      <main className="content-area" role="tabpanel" aria-live="polite">
        {tab === 'calc' ? <Calculator /> : <ShaderLab />}
      </main>
      <footer className="app-footer">Built fast — demo quality code. <span className="accent">Rust</span> • <span className="accent">React</span> • <span className="accent">Elixir</span></footer>
    </div>
  );
}
