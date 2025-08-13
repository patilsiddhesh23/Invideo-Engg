use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: f64, b: f64) -> f64 { a + b }

#[wasm_bindgen]
pub fn sub(a: f64, b: f64) -> f64 { a - b }

#[wasm_bindgen]
pub fn mul(a: f64, b: f64) -> f64 { a * b }

#[wasm_bindgen]
pub fn div(a: f64, b: f64) -> f64 { if b==0.0 { f64::NAN } else { a / b } }

#[wasm_bindgen]
pub fn fib(n: u32) -> u64 { fib_inner(n) }

fn fib_inner(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fib_inner(n-1) + fib_inner(n-2),
    }
}
