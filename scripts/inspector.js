#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";
import process from "process";

async function checkBaseUrl(url) {
  try {
    // normalize
    const normalized = url.replace(/\/+$/, "");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${normalized}/api/version`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function runCmd(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, { stdio: "inherit", ...options });
    p.on("close", (code) =>
      code === 0 ? resolve(0) : reject(new Error(`Exited with ${code}`)),
    );
    p.on("error", (err) => reject(err));
  });
}

async function main() {
  const env = { ...process.env };
  // Show which token env vars are present (don't log secrets)
  const tokenVars = [
    "WINDMILL_API_TOKEN",
    "E2E_WINDMILL_TOKEN",
    "BEARER_TOKEN_BEARERAUTH",
    "API_KEY_COOKIEAUTH",
  ];
  const presentTokens = tokenVars.filter((k) => !!env[k]);
  console.log(
    "Inspector: token env vars present:",
    presentTokens.join(", ") || "(none)",
  );

  env.WINDMILL_BASE_URL = env.WINDMILL_BASE_URL || "http://localhost:8000";
  // Map common token env vars into generated-server expected names
  env.BEARER_TOKEN_BEARERAUTH =
    env.BEARER_TOKEN_BEARERAUTH ||
    env.WINDMILL_API_TOKEN ||
    env.E2E_WINDMILL_TOKEN;
  env.API_KEY_COOKIEAUTH =
    env.API_KEY_COOKIEAUTH || env.WINDMILL_API_TOKEN || env.E2E_WINDMILL_TOKEN;

  let reachable = await checkBaseUrl(env.WINDMILL_BASE_URL);

  // If not reachable and auto-start enabled, attempt to start dev server
  const autoStart =
    (env.INSPECTOR_AUTO_START_DEV || "true").toLowerCase() !== "false";
  if (!reachable && autoStart) {
    console.log(
      `\n⚙️  Windmill not reachable at ${env.WINDMILL_BASE_URL}. Attempting to start dev server (npm run docker:dev)...`,
    );
    try {
      await runCmd("npm", ["run", "docker:dev"], { env });
    } catch (err) {
      console.error("Failed to start dev server:", err.message);
      process.exit(2);
    }

    // Wait for service to become ready (poll)
    const maxAttempts = 30;
    const delayMs = 2000;
    for (let i = 0; i < maxAttempts; i++) {
      reachable = await checkBaseUrl(env.WINDMILL_BASE_URL);
      if (reachable) break;
      console.log(`Waiting for Windmill... (${i + 1}/${maxAttempts})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  if (!reachable) {
    console.error(
      `\n❌ Windmill not reachable at ${env.WINDMILL_BASE_URL}/api/version`,
    );
    console.error(
      "Start the local Windmill (e.g. `npm run docker:dev`) or set WINDMILL_BASE_URL to a reachable instance.\n",
    );
    process.exit(2);
  }

  const args = [
    "@modelcontextprotocol/inspector",
    "node",
    "build/dist/index.js",
  ];
  console.log(env);
  const p = spawn("npx", args, { stdio: "inherit", env });
  p.on("close", (code) => process.exit(code));
  p.on("error", (err) => {
    console.error("Failed to run inspector:", err.message);
    process.exit(3);
  });
}

main().catch((err) => {
  console.error("Inspector launcher failed:", err.message);
  process.exit(4);
});
