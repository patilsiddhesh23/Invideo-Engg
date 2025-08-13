import Config

if config_env() == :prod do
  host = System.get_env("FLY_APP_NAME") || "localhost"
  port = String.to_integer(System.get_env("PORT") || "4000")
  config :shader_backend, :host, host
  config :shader_backend, :port, port
end
