#!/usr/bin/env node

/**
 * Windmill MCP Server Runtime Loader
 *
 * This is the main entry point that:
 * 1. Checks if the requested Windmill version is cached
 * 2. Downloads pre-built artifact from GitHub Releases if not cached
 * 3. Falls back to local generation if artifact not available
 * 4. Loads and runs the MCP server
 */

import {
  isCached,
  getCachedCodePath,
  listCachedVersions,
  clearCache,
} from "./cache.js";
import { downloadArtifact, listAvailableVersions } from "./downloader.js";
import { generateLocally, isGeneratorAvailable } from "./generator.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

/**
 * Main entry point
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);

  // Handle CLI commands
  if (args.includes("--clear-cache")) {
    const version = args[args.indexOf("--clear-cache") + 1];
    await clearCache(version);
    return;
  }

  if (args.includes("--list-cached")) {
    const versions = await listCachedVersions();
    console.log("📦 Cached versions:");
    versions.forEach((v) => console.log(`   - ${v}`));
    return;
  }

  if (args.includes("--list-available")) {
    const versions = await listAvailableVersions();
    console.log("🌐 Available versions:");
    versions.forEach((v) => console.log(`   - ${v}`));
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  // Get Windmill version from environment variable
  const windmillVersion = process.env.WINDMILL_VERSION || "latest";
  const packageJson = require("../../package.json");
  const packageVersion = packageJson.version;

  console.log("🚀 Starting Windmill MCP Server");
  console.log(`   Windmill version: ${windmillVersion}`);
  console.log(`   Package version: ${packageVersion}`);
  console.log("");

  // Check if cached
  if (await isCached(windmillVersion)) {
    console.log(`✅ Using cached version`);
    await loadMCPServer(windmillVersion);
    return;
  }

  console.log(`📦 Version not cached, attempting to download...`);

  // Try to download artifact
  const downloaded = await downloadArtifact(windmillVersion, packageVersion);

  if (downloaded) {
    await loadMCPServer(windmillVersion);
    return;
  }

  // Fallback: generate locally
  console.log(`⚠️  Artifact not available, generating locally...`);

  if (!(await isGeneratorAvailable())) {
    console.error(`❌ Generator not available.`);
    console.error(
      `   Please install the full package or use a released version.`,
    );
    process.exit(1);
  }

  await generateLocally(windmillVersion);
  await loadMCPServer(windmillVersion);
}

/**
 * Load and run the MCP server
 * @param {string} windmillVersion - Windmill version
 */
async function loadMCPServer(windmillVersion) {
  const mcpServerPath = getCachedCodePath(windmillVersion);

  console.log("");
  console.log(`🎯 Loading MCP server from: ${mcpServerPath}`);
  console.log("");

  try {
    // Dynamically import the generated MCP server
    await import(mcpServerPath);
  } catch (error) {
    console.error(`❌ Failed to load MCP server: ${error.message}`);
    console.error(
      `   Cache may be corrupted. Try: --clear-cache ${windmillVersion}`,
    );
    process.exit(1);
  }
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
Windmill MCP Server

Usage:
  windmill-mcp [options]

Options:
  --help, -h              Show this help message
  --list-cached           List cached versions
  --list-available        List available versions from GitHub
  --clear-cache [version] Clear cache (all if no version specified)

Environment Variables:
  WINDMILL_VERSION        Windmill version to use (default: "latest")
  WINDMILL_BASE_URL       Windmill instance URL (required)
  WINDMILL_API_TOKEN      Windmill API token (required)
  WINDMILL_MCP_CACHE_DIR  Custom cache directory (optional)

Examples:
  # Use latest version
  windmill-mcp

  # Use specific version
  WINDMILL_VERSION=1.520.1 windmill-mcp

  # Clear cache for a version
  windmill-mcp --clear-cache 1.520.1

  # List cached versions
  windmill-mcp --list-cached
`);
}

// Run main function
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
