# Full Stack WASM + Shader Demo

This workspace contains two projects:

- frontend: React + Rust WASM calculator (Tab 1) & Shader Lab (Tab 2)
- backend: Elixir (Plug/Cowboy) API providing /api/shader with optional LLM integration

## Features
- Rust -> WASM arithmetic & Fibonacci via wasm-bindgen
- WebGL fragment shader playground
- Prompt -> backend -> (LLM or rule-based) -> GLSL -> live render
- Optional OpenAI or Groq integration via environment variables

## Local Development

### Frontend
```
cd frontend
npm install
npm run wasm
npm run dev
```
Visit: http://localhost:5173 (VITE_API_URL should point to backend, e.g. http://localhost:4000)

## Deployment (vercel)

