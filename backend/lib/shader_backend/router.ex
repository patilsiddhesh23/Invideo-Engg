defmodule ShaderBackend.Router do
  use Plug.Router
  require Logger

  plug Plug.Logger
  plug :match
  plug Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  plug :dispatch

  post "/api/shader" do
    {:ok, body, _conn} = read_body(conn)
    %{"prompt" => prompt} = Jason.decode!(body)
    shader = ShaderBackend.ShaderGen.generate(prompt)
    send_resp(conn, 200, Jason.encode!(%{shader: shader}))
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end
end
