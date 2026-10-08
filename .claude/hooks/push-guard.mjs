#!/usr/bin/env node
// Push guard: runs before any `git push` Claude makes in this repo.
// 1. Refuses pushes to main (the September 2026 rebuild went straight to main
//    and dropped the whole <head>; see CLAUDE.md).
// 2. Runs `npm test` and refuses the push if anything fails.
// Exit code 2 blocks the command and shows the message to Claude.
import { execSync } from "node:child_process";

let input = "";
for await (const chunk of process.stdin) input += chunk;

const command = JSON.parse(input || "{}").tool_input?.command ?? "";
if (!/\bgit\s+push\b/.test(command)) process.exit(0);

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const block = (msg) => {
  console.error(`Push guard: ${msg}`);
  process.exit(2);
};

let branch = "";
try {
  branch = execSync("git branch --show-current", { cwd }).toString().trim();
} catch {}

const pushArgs = command.slice(command.search(/\bgit\s+push\b/));
if (/(^|[\s:])(refs\/heads\/)?main(\s|$)/.test(pushArgs) || (branch === "main" && !/\s(origin|upstream)\s+\S/.test(pushArgs))) {
  block("pushing to main is blocked. Push a feature branch and open a PR instead.");
}

try {
  execSync("npm test --silent", { cwd, stdio: "pipe" });
} catch (err) {
  const out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
  const failures = out.split("\n").filter((l) => /^not ok|# fail|Error|expected|actual/i.test(l)).slice(0, 30).join("\n");
  block(`npm test failed, so the push was stopped. Fix these first:\n${failures || out.slice(-3000)}`);
}

process.exit(0);
