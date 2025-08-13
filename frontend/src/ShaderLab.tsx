import React, { useEffect, useRef, useState } from 'react';

interface ShaderResponse { shader: string; warnings?: string; }

export const ShaderLab: React.FC = () => {
  const [prompt, setPrompt] = useState('A pulsating purple plasma');
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<string>('Idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!canvasRef.current) return;
    const gl = canvasRef.current.getContext('webgl');
    if(!gl) { setStatus('WebGL not supported'); return; }
    glRef.current = gl;
    // Default shader until first fetch.
    compileAndRun(gl, defaultFragmentShader);    
  }, []);

  const fetchShader = async () => {
    setStatus('Requesting shader...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/shader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data: ShaderResponse = await res.json();
      setCode(data.shader);
      setStatus('Compiling');
      if(glRef.current) compileAndRun(glRef.current, data.shader);
      setStatus('Running');
    } catch (e:any) {
      console.error(e);
      setStatus('Error');
    }
  };

  const compileAndRun = (gl: WebGLRenderingContext, fragmentSrc: string) => {
    if(programRef.current) {
      gl.deleteProgram(programRef.current);
    }
    const vertexSrc = `attribute vec2 position; void main(){ gl_Position = vec4(position,0.0,1.0); }`;
    const vShader = gl.createShader(gl.VERTEX_SHADER)!; gl.shaderSource(vShader, vertexSrc); gl.compileShader(vShader);
    const fShader = gl.createShader(gl.FRAGMENT_SHADER)!; gl.shaderSource(fShader, fragmentSrc); gl.compileShader(fShader);
    if(!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fShader));
      setStatus('Shader compile error');
      return;
    }
    const program = gl.createProgram()!; gl.attachShader(program, vShader); gl.attachShader(program, fShader); gl.linkProgram(program);
    programRef.current = program;
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1,
      -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'position');

    const render = (time: number) => {
      gl.viewport(0,0,gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      const tLoc = gl.getUniformLocation(program, 'u_time');
      if(tLoc) gl.uniform1f(tLoc, (time - startTimeRef.current) / 1000.0);
      const rLoc = gl.getUniformLocation(program, 'u_resolution');
      if(rLoc) gl.uniform2f(rLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };

  return (
    <div>
      <h2>Shader Lab</h2>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <input style={{flex:1,minWidth:280}} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe an effect" />
        <button onClick={fetchShader}>Generate Shader</button>
        <span>{status}</span>
      </div>
      <div style={{display:'flex', gap:16, marginTop:12}}>
        <canvas ref={canvasRef} width={500} height={300} style={{border:'1px solid #444'}} />
        <pre style={{background:'#111', color:'#0f0', padding:12, flex:1, minHeight:300, overflow:'auto'}}>{code}</pre>
      </div>
    </div>
  );
};

const defaultFragmentShader = `precision mediump float; uniform float u_time; uniform vec2 u_resolution; 
void main(){ vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy)/u_resolution.y; float d = length(uv); float a = atan(uv.y, uv.x); float v = sin(10.0*d - u_time*3.0) + cos(a*3.0 + u_time); vec3 col = 0.5 + 0.5*cos(vec3(0.5,0.8,1.2)+v+vec3(0,2,4)); gl_FragColor = vec4(col,1.0);} `;
