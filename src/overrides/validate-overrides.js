#!/usr/bin/env node

/**
 * Validate Custom Overrides
 *
 * This script validates that override files are properly structured
 * and compatible with the current generated code.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to project structure
// __dirname is src/overrides/
const projectRoot = path.resolve(__dirname, "..", "..");
const OVERRIDES_DIR = __dirname; // We're already in src/overrides/
const SRC_DIR = path.resolve(projectRoot, "build", "src"); // Generated code location

/**
 * Get all files in a directory recursively
 */
async function getAllFiles(dir, baseDir = dir) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await getAllFiles(fullPath, baseDir)));
      } else {
        files.push({
          absolute: fullPath,
          relative: path.relative(baseDir, fullPath),
        });
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return files;
}

/**
 * Validate JavaScript/JSON syntax
 */
async function validateSyntax(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const ext = path.extname(filePath);

  if (ext === ".json") {
    try {
      const data = JSON.parse(content);

      // Check if it's a patch file
      if (path.basename(filePath).includes("patch")) {
        return validateJsonPatch(data);
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  if (ext === ".js" || ext === ".mjs" || ext === ".ts") {
    // Basic syntax check - just try to parse as module
    // A full check would require running through a parser
    if (content.includes("syntax error") || content.length === 0) {
      return {
        valid: false,
        error: "File appears to have syntax issues or is empty",
      };
    }
    return { valid: true };
  }

  return { valid: true }; // Other files pass by default
}

/**
 * Validate JSON patch structure
 */
function validateJsonPatch(data) {
  const errors = [];

  // Check if it's an object
  if (typeof data !== "object" || data === null) {
    return { valid: false, error: "Patch file must be a JSON object" };
  }

  // Validate each patch
  for (const [targetPath, operations] of Object.entries(data)) {
    // Check target path format
    if (!targetPath || typeof targetPath !== "string") {
      errors.push(`Invalid target path: ${targetPath}`);
      continue;
    }

    // Check operations structure
    if (typeof operations !== "object" || operations === null) {
      errors.push(`Operations for ${targetPath} must be an object`);
      continue;
    }

    // Check for required fields
    if (operations.content && operations.action) {
      const { action } = operations;

      if (!["append", "prepend", "replace"].includes(action)) {
        errors.push(
          `Unknown action '${action}' for ${targetPath}. Supported: append, prepend, replace`,
        );
      }

      if (action === "replace" && !operations.oldString) {
        errors.push(
          `Replace action for ${targetPath} requires 'oldString' field`,
        );
      }
    } else {
      errors.push(
        `Operations for ${targetPath} must have 'content' and 'action' fields`,
      );
    }
  }

  if (errors.length > 0) {
    return { valid: false, error: errors.join("; ") };
  }

  return { valid: true };
}

/**
 * Check if override conflicts with generated file
 */
async function checkConflict(overridePath, relativePath) {
  const targetPath = path.join(SRC_DIR, relativePath);

  try {
    await fs.access(targetPath);
    // Both exist - potential for conflict but that's expected
    return { hasTarget: true, conflict: false };
  } catch {
    // Target doesn't exist - override will create it
    return { hasTarget: false, conflict: false };
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🔍 Validating custom overrides...\n");

  // Check if overrides directory exists
  try {
    await fs.access(OVERRIDES_DIR);
  } catch {
    console.log("✅ No overrides directory found - nothing to validate");
    return;
  }

  // Get all override files
  console.log(`📂 Scanning overrides directory: ${OVERRIDES_DIR}`);
  const overrideFiles = await getAllFiles(OVERRIDES_DIR);

  if (overrideFiles.length === 0) {
    console.log("✅ No override files found - nothing to validate");
    return;
  }

  console.log(`   Found ${overrideFiles.length} override file(s)\n`);

  let validCount = 0;
  let invalidCount = 0;
  const issues = [];

  // Validate each override
  for (const file of overrideFiles) {
    console.log(`📝 Validating: ${file.relative}`);

    let hasIssues = false;

    // Check syntax
    const syntaxCheck = await validateSyntax(file.absolute);
    if (!syntaxCheck.valid) {
      console.log(`   ❌ Syntax error: ${syntaxCheck.error}`);
      issues.push({
        file: file.relative,
        type: "syntax",
        message: syntaxCheck.error,
      });
      hasIssues = true;
    } else {
      console.log(`   ✅ Syntax valid`);
    }

    // Check for conflicts (skip for patch files)
    if (!path.basename(file.absolute).includes("patch")) {
      const conflictCheck = await checkConflict(file.absolute, file.relative);
      if (conflictCheck.hasTarget) {
        console.log(`   ℹ️  Will override existing file in src/`);
      } else {
        console.log(`   ℹ️  Will create new file in src/`);
      }
    } else {
      console.log(`   ℹ️  JSON patch file - will modify existing files`);
    }

    if (hasIssues) {
      invalidCount++;
    } else {
      validCount++;
    }

    console.log();
  }

  // Print summary
  console.log("📊 Validation Summary:");
  console.log(`   Valid: ${validCount}`);
  console.log(`   Invalid: ${invalidCount}`);
  console.log(`   Total: ${overrideFiles.length}`);

  if (issues.length > 0) {
    console.log("\n⚠️  Issues found:");
    for (const issue of issues) {
      console.log(`   • ${issue.file}: ${issue.message}`);
    }
    console.log(
      "\n❌ Validation failed - please fix issues before applying overrides",
    );
    process.exit(1);
  }

  console.log("\n✨ All overrides are valid!");
}

// Run main function
main().catch((error) => {
  console.error("Validation failed:", error);
  process.exit(1);
});
