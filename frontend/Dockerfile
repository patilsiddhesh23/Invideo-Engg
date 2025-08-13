FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --legacy-peer-deps || echo "Install fallback"

FROM rust:1.79-alpine AS wasm
RUN apk add --no-cache musl-dev build-base
RUN rustup target add wasm32-unknown-unknown
WORKDIR /app
COPY src/rust ./src/rust
WORKDIR /app/src/rust
RUN cargo build --target wasm32-unknown-unknown --release
RUN cargo install wasm-bindgen-cli --version 0.2.92
RUN wasm-bindgen --target web --out-dir /out --no-typescript target/wasm32-unknown-unknown/release/calc_wasm.wasm

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
COPY --from=wasm /out ./public/wasm
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /srv
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
