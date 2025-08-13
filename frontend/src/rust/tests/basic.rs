use calc_wasm::{add, sub, mul, div, fib};

#[test]
fn arithmetic() {
    assert_eq!(add(2.0,3.0), 5.0);
    assert_eq!(sub(5.0,2.0), 3.0);
    assert_eq!(mul(3.0,4.0), 12.0);
    assert_eq!(div(8.0,2.0), 4.0);
    assert!(div(1.0,0.0).is_nan());
}

#[test]
fn fibonacci() {
    assert_eq!(fib(0), 0);
    assert_eq!(fib(1), 1);
    assert_eq!(fib(5), 5);
    assert_eq!(fib(10), 55);
}
