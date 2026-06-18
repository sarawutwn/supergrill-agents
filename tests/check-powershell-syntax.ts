const source = await Bun.file("install.ps1").text();

const pairs: Record<string, string> = {
  "(": ")",
  "{": "}",
  "[": "]",
};
const closers = new Set(Object.values(pairs));
const stack: Array<{ char: string; line: number; column: number }> = [];
let quote: "'" | "\"" | null = null;
let line = 1;
let column = 0;

for (let index = 0; index < source.length; index += 1) {
  const char = source[index];
  column += 1;

  if (char === "\n") {
    line += 1;
    column = 0;
    continue;
  }

  if (quote) {
    if (quote === "\"" && char === "`") {
      index += 1;
      column += 1;
      continue;
    }

    if (char === quote) {
      if (quote === "'" && source[index + 1] === "'") {
        index += 1;
        column += 1;
        continue;
      }

      quote = null;
    }

    continue;
  }

  if (char === "#") {
    while (index + 1 < source.length && source[index + 1] !== "\n") {
      index += 1;
      column += 1;
    }
    continue;
  }

  if (char === "'" || char === "\"") {
    quote = char;
    continue;
  }

  if (char in pairs) {
    stack.push({ char, line, column });
    continue;
  }

  if (closers.has(char)) {
    const opener = stack.pop();
    if (!opener || pairs[opener.char] !== char) {
      throw new Error(`Unexpected '${char}' at ${line}:${column}`);
    }
  }
}

if (quote) {
  throw new Error(`Unclosed ${quote} quote`);
}

const opener = stack.pop();
if (opener) {
  throw new Error(`Unclosed '${opener.char}' at ${opener.line}:${opener.column}`);
}

console.log("PowerShell syntax sanity check passed");
