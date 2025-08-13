FROM hexpm/elixir:1.16.2-erlang-26.2.1-alpine-3.19 AS build
ENV MIX_ENV=prod
WORKDIR /app
RUN apk add --no-cache build-base git
COPY mix.exs mix.lock ./
RUN mix do local.hex --force, local.rebar --force
RUN mix deps.get --only prod
COPY config config
RUN mix deps.compile
COPY lib lib
RUN mix compile

FROM hexpm/elixir:1.16.2-erlang-26.2.1-alpine-3.19 AS runtime
ENV MIX_ENV=prod
WORKDIR /app
COPY --from=build /app .
EXPOSE 4000
CMD ["elixir", "-S", "mix", "run", "--no-halt"]
