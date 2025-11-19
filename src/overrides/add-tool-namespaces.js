#!/usr/bin/env node

/**
 * Add Tool Namespaces
 *
 * This script modifies the generated MCP server code to prepend namespace
 * prefixes to tool names based on their categorization.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_INDEX_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "build/src/index.ts",
);

/**
 * Categorize tool based on operationId
 * Returns namespace:subgroup format
 */
import { getNamespace } from "../utils/tool-categories.js";

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Main function
 */
async function main() {
  console.log("🔧 Adding tool namespaces...");

  // Read generated index.ts
  let content;
  try {
    content = await fs.readFile(BUILD_INDEX_PATH, "utf-8");
  } catch (error) {
    console.error(`❌ Error reading ${BUILD_INDEX_PATH}:`, error.message);
    process.exit(1);
  }

  // Find all tool definitions using regex
  // Pattern 1: Map entries like ["operationId", { name: "operationId", ... }]
  // Pattern 2: name: "operationId", inside tool definitions

  const mapKeyPattern = /\[\s*["']([^"']+)["']\s*,\s*\{/g;
  const toolNamePattern = /name:\s*["']([^"']+)["'],/g;
  let match;
  const replacements = new Map();

  // First pass: Find Map keys and their corresponding namespaced names
  const mapKeyReplacements = new Map();
  let mapMatch;
  while ((mapMatch = mapKeyPattern.exec(content)) !== null) {
    const originalKey = mapMatch[1];
    const namespace = getNamespace(originalKey);
    const namespacedName = `${namespace}_${originalKey}`;
    mapKeyReplacements.set(originalKey, namespacedName);
  }

  // Second pass: Replace Map keys
  for (const [originalKey, namespacedName] of mapKeyReplacements) {
    const oldPattern = `["${originalKey}", {`;
    const newPattern = `["${namespacedName}", {`;
    content = content.replace(
      new RegExp(escapeRegex(oldPattern), "g"),
      newPattern,
    );
  }

  // Third pass: Replace name properties inside tool definitions
  while ((match = toolNamePattern.exec(content)) !== null) {
    const originalName = match[1];
    const namespace = getNamespace(originalName);
    const namespacedName = `${namespace}_${originalName}`;
    replacements.set(match[0], match[0].replace(originalName, namespacedName));
  }

  // Apply name property replacements
  let modifiedContent = content;
  for (const [oldStr, newStr] of replacements) {
    modifiedContent = modifiedContent.replace(oldStr, newStr);
  }

  const totalReplacements = mapKeyReplacements.size + replacements.size;

  // Write modified content
  try {
    await fs.writeFile(BUILD_INDEX_PATH, modifiedContent, "utf-8");
    console.log(`✅ Added namespaces to ${totalReplacements} tools`);
  } catch (error) {
    console.error(`❌ Error writing ${BUILD_INDEX_PATH}:`, error.message);
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
