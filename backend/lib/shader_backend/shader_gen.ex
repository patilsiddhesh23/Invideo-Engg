defmodule ShaderBackend.ShaderGen do
  @moduledoc """
  Generate GLSL fragment shaders. If an LLM API key is configured (OPENAI_API_KEY or GROQ_API_KEY),
  attempt a live call; otherwise fall back to rule-based snippets.
  """
  require Logger

  @fallback "precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main(){ vec2 uv=(gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.y; float t=u_time; float v=sin(uv.x*10.0+t)+cos(uv.y*10.0-t); vec3 col=0.5+0.5*cos(vec3(0.5,1.0,2.0)+v+vec3(0,2,4)); gl_FragColor=vec4(col,1.0);}"

  def generate(prompt) do
    Logger.info("Generate shader for: #{prompt}")
    with {:ok, shader} <- maybe_llm(prompt) do
      shader
    else
      _ -> rule_based(prompt)
    end
  rescue
    e ->
      Logger.error("Shader generation failed: #{inspect(e)}")
      @fallback
  end

  defp maybe_llm(prompt) do
    cond do
      key = System.get_env("OPENAI_API_KEY") -> call_openai(prompt, key)
      key = System.get_env("GROQ_API_KEY") -> call_groq(prompt, key)
      true -> {:error, :no_key}
    end
  end

  defp call_openai(prompt, key) do
    body = %{
      model: System.get_env("OPENAI_MODEL") || "gpt-4o-mini",
      messages: [
        %{role: "system", content: "Output ONLY valid WebGL compatible GLSL fragment shader code without markdown."},
        %{role: "user", content: "Create a fragment shader. Prompt: #{prompt}"}
      ],
      max_tokens: 512
    }
    Req.post("https://api.openai.com/v1/chat/completions",
      headers: [
        {"authorization", "Bearer #{key}"},
        {"content-type", "application/json"}
      ],
      json: body
    )
    |> case do
      {:ok, %{status: 200, body: %{"choices" => [first | _]}}} ->
        shader = get_in(first, ["message", "content"]) |> sanitize()
        {:ok, shader}
      other ->
        Logger.warn("OpenAI failure: #{inspect(other)}")
        {:error, :llm_fail}
    end
  end

  defp call_groq(prompt, key) do
    body = %{
      model: System.get_env("GROQ_MODEL") || "llama3-8b-8192",
      messages: [
        %{role: "system", content: "Output ONLY GLSL fragment shader code."},
        %{role: "user", content: prompt}
      ],
      max_tokens: 512
    }
    Req.post("https://api.groq.com/openai/v1/chat/completions",
      headers: [
        {"authorization", "Bearer #{key}"},
        {"content-type", "application/json"}
      ],
      json: body
    )
    |> case do
      {:ok, %{status: 200, body: %{"choices" => [first | _]}}} ->
        shader = get_in(first, ["message", "content"]) |> sanitize()
        {:ok, shader}
      other ->
        Logger.warn("Groq failure: #{inspect(other)}")
        {:error, :llm_fail}
    end
  end

  defp sanitize(nil), do: @fallback
  defp sanitize(code) do
    code
    |> String.replace("```glsl", "")
    |> String.replace("```", "")
    |> String.trim()
  end

  defp rule_based(prompt) do
    case prompt |> String.downcase do
      p when p =~ "plasma" -> plasma_shader()
      p when p =~ "wave" -> wave_shader()
      p when p =~ "circle" -> circle_shader()
      _ -> @fallback
    end
  end

  defp plasma_shader do
    "precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main(){ vec2 uv=(gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.y; float t=u_time; float v=sin(uv.x*10.0+t)+sin(uv.y*10.0+t)+sin((uv.x+uv.y)*10.0+t); vec3 col=0.5+0.5*cos(vec3(0.0,2.0,4.0)+v); gl_FragColor=vec4(col,1.0);}"
  end

  defp wave_shader do
    "precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main(){ vec2 uv=gl_FragCoord.xy/u_resolution.xy; float y=0.5+0.25*sin(uv.x*8.0+u_time*2.0); float d=abs(uv.y-y); float line=smoothstep(0.01,0.0,d); vec3 col=mix(vec3(0.0,0.1,0.3), vec3(0.2,0.6,1.0), uv.y) + line; gl_FragColor=vec4(col,1.0);}"
  end

  defp circle_shader do
    "precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main(){ vec2 uv=(gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.y; float r=sin(u_time)*0.3+0.5; float d=length(uv); float ring=smoothstep(r+0.02,r,d)-smoothstep(r,r-0.02,d); vec3 col=vec3(ring); gl_FragColor=vec4(col,1.0);}"
  end
end
