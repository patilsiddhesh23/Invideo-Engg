# Shader Backend

Minimal Plug/Cowboy service providing /api/shader that returns fragment shader code derived from a prompt.

## Running
```
mix deps.get
mix run --no-halt
```
Send a request:
```
curl -X POST http://localhost:4000/api/shader -H 'Content-Type: application/json' -d '{"prompt":"plasma"}'
```
