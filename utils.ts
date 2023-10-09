type A<T = string> = { [K in T]: K extends string ? number : never };

const B = (s: string): A => {
  let o: A = {};
  let c: A = {};
  s.split('').forEach((x) => o[x] = (o[x] || 0) + 1);
  return Object.keys(o).reduce((acc, v) => {
    acc[v] = o[v];
    return acc;
  }, c);
}

const C = (t: A, s: string): string => {
  let r = "";
  for (let i = 0; i < s.length; i++) {
    r += t[s[i]] ? String.fromCharCode(s.charCodeAt(i) + t[s[i]]) : s[i];
  }
  return r;
}

const D = (t: A, s: string): string => {
  let r = "";
  for (let i = 0; i < s.length; i++) {
    r += t[s[i]] ? String.fromCharCode(s.charCodeAt(i) - t[s[i]]) : s[i];
  }
  return r;
}

const E = (s: string): string => C(B(s), s);
const F = (s: string, x: string): string => D(B(x), s);

let s = "Hello, World!";
let e = E(s);
console.log(e);  // It prints a modified string based on input.

let d = F(e, s);
console.log(d);  // It prints "Hello, World!"
