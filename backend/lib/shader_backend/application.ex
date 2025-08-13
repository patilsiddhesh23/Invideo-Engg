defmodule ShaderBackend.Application do
  @moduledoc false
  use Application

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: ShaderBackend.Router, options: [port: port()]}
    ]
    opts = [strategy: :one_for_one, name: ShaderBackend.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp port, do: String.to_integer(System.get_env("PORT") || "4000")
end
