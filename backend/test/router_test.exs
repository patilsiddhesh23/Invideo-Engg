defmodule ShaderBackend.RouterTest do
  use ExUnit.Case, async: true
  use Plug.Test
  alias ShaderBackend.Router

  @opts Router.init([])

  test "shader endpoint" do
    conn = conn(:post, "/api/shader", %{prompt: "plasma"}) |> put_req_header("content-type", "application/json")
    conn = Router.call(conn, @opts)
    assert conn.status == 200
    body = Jason.decode!(conn.resp_body)
    assert is_binary(body["shader"]) and String.length(body["shader"]) > 10
  end
end
