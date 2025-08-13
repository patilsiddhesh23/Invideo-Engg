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
### Backend
```
cd backend
mix deps.get
mix test
mix run --no-halt
```
Endpoint: http://localhost:4000/api/shader (POST {"prompt":"plasma"})

Set OPENAI_API_KEY or GROQ_API_KEY to enable live LLM shader generation.

### Frontend
```
cd frontend
npm install
# build wasm (requires Rust + wasm32 target; otherwise skip)
npm run wasm
npm run dev
```
Visit: http://localhost:5173 (VITE_API_URL should point to backend, e.g. http://localhost:4000)

## Deployment (fly.io)
Each project has a Dockerfile + fly.toml. Replace CHANGE_ME_* with actual app names:
```
cd backend
fly launch --no-deploy
fly deploy

cd ../frontend
fly launch --no-deploy
# Update fly.toml VITE_API_URL to backend HTTPS URL
fly deploy
```
