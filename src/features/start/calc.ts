/**
 * The little calculator in the Start menu's search: typing `12*(3+4)` shows 84.
 *
 * It is a small parser of its own, not `eval`: the text comes from a box a
 * person types in, and only numbers, + - * / ^ %, brackets and the signs × and ÷
 * are understood. Anything else is not arithmetic and gives null.
 */

/** The value of an arithmetic expression, or null if it is not one (or is not worth showing). */
export function calculate(input: string): number | null {
  const src = input.replace(/\s+/g, "").replace(/,/g, "").replace(/×/g, "*").replace(/÷/g, "/");
  if (!/^[0-9+\-*/^%().]+$/.test(src)) return null;
  // a bare number is not a sum
  if (!/[0-9]/.test(src) || !/[+\-*/^%]/.test(src.replace(/^[-+]/, ""))) return null;

  let i = 0;
  const peek = () => src[i];

  // percent follows a number: 50% is 0.5
  const primary = (): number => {
    let value: number;
    if (peek() === "(") {
      i++;
      value = sum();
      if (peek() !== ")") throw new Error("unclosed bracket");
      i++;
    } else {
      const start = i;
      while (i < src.length && /[0-9.]/.test(src[i])) i++;
      if (i === start) throw new Error("number expected");
      value = Number(src.slice(start, i));
      if (!Number.isFinite(value)) throw new Error("not a number");
    }
    while (peek() === "%") {
      i++;
      value /= 100;
    }
    return value;
  };
  const unary = (): number => {
    if (peek() === "-") {
      i++;
      return -unary();
    }
    if (peek() === "+") {
      i++;
      return unary();
    }
    return primary();
  };
  // a power binds to the right: 2^3^2 is 2^9
  const power = (): number => {
    const base = unary();
    if (peek() === "^") {
      i++;
      return Math.pow(base, power());
    }
    return base;
  };
  const product = (): number => {
    let value = power();
    while (peek() === "*" || peek() === "/") {
      const op = src[i++];
      const right = power();
      value = op === "*" ? value * right : value / right;
    }
    return value;
  };
  const sum = (): number => {
    let value = product();
    while (peek() === "+" || peek() === "-") {
      const op = src[i++];
      const right = product();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  };

  try {
    const result = sum();
    if (i !== src.length || !Number.isFinite(result)) return null;
    // twelve significant figures: 0.1+0.2 is 0.3, not 0.30000000000000004
    return Number(result.toPrecision(12));
  } catch {
    return null;
  }
}

/** A result as it is read: thousands separated, no trailing noise. */
export function formatResult(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 10 });
}
