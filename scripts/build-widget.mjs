import { build } from "esbuild";
import { readFileSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

// Build the widget into a single IIFE bundle
await build({
  entryPoints: ["widget/easychat.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2017"],
  outfile: "dist/easychat.min.js",
  sourcemap: true,
});

// Also build a non-minified version for development
await build({
  entryPoints: ["widget/easychat.ts"],
  bundle: true,
  minify: false,
  format: "iife",
  target: ["es2017"],
  outfile: "dist/easychat.js",
});

console.log("✅ Widget built → dist/easychat.min.js + dist/easychat.js");
