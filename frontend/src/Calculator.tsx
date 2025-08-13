import React, { useEffect, useState } from 'react';

// Will be provided by wasm-bindgen output (attached to window or importable dynamically)
interface WasmExports {
  add(a: number, b: number): number;
  sub(a: number, b: number): number;
  mul(a: number, b: number): number;
  div(a: number, b: number): number;
  fib(n: number): number;
}

declare global { interface Window { wasmCalc?: WasmExports } }

export const Calculator: React.FC = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(5);
  const [n, setN] = useState(10);
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (window.wasmCalc) { setLoaded(true); return; }
      try {
        const mod: any = await import('/wasm/calc_wasm.js');
        if (typeof mod.default === 'function') {
          await mod.default();
        }
        window.wasmCalc = {
          add: mod.add,
          sub: mod.sub,
          mul: mod.mul,
          div: mod.div,
          fib: mod.fib
        } as WasmExports;
        setLoaded(true);
      } catch (e) {
        console.error('Failed to load wasm', e);
      }
    })();
  }, []);

  const runAll = () => {
    if(!window.wasmCalc) return;
    const w = window.wasmCalc;
    const lines = [
      `add = ${w.add(a,b)}`,
      `sub = ${w.sub(a,b)}`,
      `mul = ${w.mul(a,b)}`,
      `div = ${w.div(a,b)}`,
      `fib(${n}) = ${w.fib(n)}`
    ];
    setResult(lines.join('\n'));
  };

  return (
    <div>
      <h2>Rust WASM Calculator</h2>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <label>A <input type="number" value={a} onChange={e=>setA(+e.target.value)} /></label>
        <label>B <input type="number" value={b} onChange={e=>setB(+e.target.value)} /></label>
        <label>Fib N <input type="number" value={n} onChange={e=>setN(+e.target.value)} /></label>
        <button onClick={runAll} disabled={!loaded}>Compute</button>
      </div>
      <pre style={{background:'#111', color:'#0f0', padding:12, minHeight:120, marginTop:12}}>{result || (loaded? 'Results will appear here':'Loading WASM...')}</pre>
    </div>
  );
};
