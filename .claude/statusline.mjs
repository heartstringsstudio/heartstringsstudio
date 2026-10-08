#!/usr/bin/env node
// Heartstrings status line: amber-on-walnut strip at the bottom of Claude Code.
// Shows the branch and a porch saying that changes every few minutes.
import { execSync } from "node:child_process";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const cwd = JSON.parse(input || "{}").workspace?.current_dir || process.cwd();

let branch = "";
try {
  branch = execSync("git branch --show-current", { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
} catch {}

const sayings = [
  "Pull up a rocker",
  "Slow down, it's a ballad",
  "Sweet tea's on the porch",
  "Every story's got a song in it",
  "Hush now, the fiddle's tuning",
  "Mountains don't rush, neither do we",
  "Country roads, take me home",
  "Holler if you need me",
];
const saying = sayings[Math.floor(Date.now() / 300000) % sayings.length];

// Truecolor ANSI: amber #f0b86f, muted #d6bfa6, ink #fff1dc (style.css tokens).
const amber = "\x1b[38;2;240;184;111m";
const muted = "\x1b[38;2;214;191;166m";
const ink = "\x1b[38;2;255;241;220m";
const reset = "\x1b[0m";
const onMain = branch === "main";

const parts = [`${amber}🪕 Heartstrings Studio${reset}`];
if (branch) parts.push(`${onMain ? "\x1b[38;2;232;120;90m⚠ main" : `${ink}⎇ ${branch}`}${reset}`);
parts.push(`${muted}${saying}${reset}`);
console.log(parts.join(`${muted} · ${reset}`));
