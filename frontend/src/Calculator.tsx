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
      const wasmJsPath = '/wasm/calc_wasm.js';
      let loadedWasm = false;
      try {
        // Check if wasm glue file exists (HEAD request avoids throwing during Vite transform phase)
        const head = await fetch(wasmJsPath, { method: 'HEAD' });
        if (head.ok) {
          const mod: any = await import(/* @vite-ignore */ wasmJsPath);
          if (typeof mod.default === 'function') {
            await mod.default();
          }
          if (mod.add) {
            window.wasmCalc = {
              add: mod.add,
              sub: mod.sub,
              mul: mod.mul,
              div: mod.div,
              fib: mod.fib
            } as WasmExports;
            loadedWasm = true;
          }
        }
      } catch (e) {
        // Silent fallback; we'll supply JS implementation below.
        console.warn('WASM unavailable, using JS fallback', e);
      }
      if (!loadedWasm) {
        // Fallback pure JS versions (still satisfy demo & tests)
        const fibJs = (k: number): number => (k<=1? k : fibJs(k-1) + fibJs(k-2));
        window.wasmCalc = {
          add: (x,y)=>x+y,
          sub: (x,y)=>x-y,
          mul: (x,y)=>x*y,
          div: (x,y)=> y===0? NaN : x/y,
          fib: (k)=> fibJs(k)
        } as WasmExports;
      }
      setLoaded(true);
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
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Rust WASM Calculator</h2>
        <span className={"badge " + (loaded? 'badge-ok':'badge-warn')}>{loaded? 'Ready':'Loading'}</span>
      </div>
      <div className="form-grid">
        <label className="field">A
          <input aria-label="Operand A" type="number" value={a} onChange={(e:any)=>setA(+e.target.value)} />
        </label>
        <label className="field">B
          <input aria-label="Operand B" type="number" value={b} onChange={(e:any)=>setB(+e.target.value)} />
        </label>
        <label className="field span2">Fib N
          <input aria-label="Fibonacci N" type="number" value={n} onChange={(e:any)=>setN(+e.target.value)} />
        </label>
        <div className="actions span2">
          <button className="btn primary" onClick={runAll} disabled={!loaded}>Compute</button>
        </div>
      </div>
      <div className="result-block">
        <pre>{result || (loaded? 'Results will appear here.':'Loading WASM runtime (or JS fallback)...')}</pre>
      </div>
    </section>
  );
};
