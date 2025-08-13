import React, { useState } from 'react';
import { Calculator } from './Calculator';
import { ShaderLab } from './ShaderLab';

export default function App() {
  const [tab, setTab] = useState<'calc' | 'shader'>('calc');
  return (
    <div style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>WASM + Shader Demo</h1>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('calc')} disabled={tab==='calc'}>Calculator</button>
        <button onClick={() => setTab('shader')} disabled={tab==='shader'}>Shader Lab</button>
      </nav>
      {tab === 'calc' ? <Calculator /> : <ShaderLab />}
    </div>
  );
}
