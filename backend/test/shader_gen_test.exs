defmodule ShaderBackend.ShaderGenTest do
  use ExUnit.Case, async: true
  alias ShaderBackend.ShaderGen

  test "plasma prompt" do
    code = ShaderGen.generate("cool plasma effect")
    assert code =~ "plasma"
  end

  test "fallback" do
    code = ShaderGen.generate("unknown pattern")
    assert is_binary(code)
  end
end
