#!/usr/bin/env node
// Normalizes legacy WINDMILL env vars to the names generated MCP expects
// and then requires the generated MCP server entrypoint.

import "dotenv/config";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const root = process.cwd();
const entry = path.join(root, "build", "dist", "index.js");

// Map of legacy env vars -> expected env var names
const mappings = [
  {
    legacy: "WINDMILL_API_TOKEN",
    targets: ["BEARER_TOKEN_BEARERAUTH", "API_KEY_COOKIEAUTH"],
  },
  {
    legacy: "E2E_WINDMILL_TOKEN",
    targets: ["BEARER_TOKEN_BEARERAUTH", "API_KEY_COOKIEAUTH"],
  },
  {
    legacy: "WINDMILL_TOKEN",
    targets: ["BEARER_TOKEN_BEARERAUTH", "API_KEY_COOKIEAUTH"],
  },
  {
    legacy: "TEST_WINDMILL_TOKEN",
    targets: ["BEARER_TOKEN_BEARERAUTH", "API_KEY_COOKIEAUTH"],
  },
];

for (const m of mappings) {
  const v = process.env[m.legacy];
  if (v) {
    for (const t of m.targets) {
      if (!process.env[t]) process.env[t] = v;
    }
  }
}

// If the built entry doesn't exist, try the source runtime as fallback
let runEntry = entry;
if (!fs.existsSync(runEntry)) {
  const fallback = path.join(root, "src", "runtime", "index.js");
  if (fs.existsSync(fallback)) runEntry = fallback;
}

if (!fs.existsSync(runEntry)) {
  console.error("Could not find generated MCP entry at", entry);
  process.exit(1);
}

// Spawn node to run the entry so signals and stdio are connected
const child = spawn(process.execPath, [runEntry, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
