#!/usr/bin/env node

/**
 * Apply Custom Overrides
 *
 * This script applies custom overrides from the overrides/ directory
 * to the generated code in src/, preserving customizations across regenerations.
 *
 * Supports both file replacement and JSON patch formats.
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
const BACKUP_DIR = path.resolve(projectRoot, "build", "temp", "backup");

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
 * Copy file with directory creation
 */
async function copyFile(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

/**
 * Check if file is a JSON patch file
 */
function isJsonPatchFile(filePath) {
  return (
    path.extname(filePath) === ".json" &&
    path.basename(filePath).includes("patch")
  );
}

/**
 * Apply JSON patch to a file
 */
async function applyJsonPatch(patchFilePath, srcDir) {
  console.log(`🔧 Applying JSON patch: ${path.basename(patchFilePath)}`);

  const patchContent = await fs.readFile(patchFilePath, "utf-8");
  let patches;

  // Support both array and object patch formats
  try {
    patches = JSON.parse(patchContent);
  } catch (err) {
    console.log(`   ❌ Invalid JSON patch file: ${err.message}`);
    return 0;
  }

  let appliedCount = 0;

  // If patches is an array (legacy), convert to our object format
  if (Array.isArray(patches)) {
    // Legacy format: [{ file: "tsconfig.json", operations: [{ type: 'replace', old: '...', new: '...'}]}]
    for (const item of patches) {
      const target = item.file;
      console.log(`   → Processing (legacy): ${target}`);
      const fullTargetPath = path.join(srcDir, target);

      // Ensure target file exists
      try {
        await fs.access(fullTargetPath);
      } catch {
        console.log(`   ⚠️  Target file not found: ${target}`);
        continue;
      }

      let fileContent = await fs.readFile(fullTargetPath, "utf-8");
      let modified = false;

      for (const op of item.operations || []) {
        if (op.type === "replace" && op.old && op.new) {
          if (fileContent.includes(op.old)) {
            fileContent = fileContent.replace(op.old, op.new);
            modified = true;
            console.log(`   ✅ Replaced content (legacy)`);
          } else {
            console.log(`   ⚠️  Old string not found for replacement (legacy)`);
          }
        } else {
          console.log(
            `   ⚠️  Unsupported legacy operation: ${JSON.stringify(op)}`,
          );
        }
      }

      if (modified) {
        await fs.writeFile(fullTargetPath, fileContent);
        appliedCount++;
      }
    }

    return appliedCount;
  }

  // Current object format: { "path": { action: 'replace', content: '...', oldString: '...' } }
  for (const [targetPath, operations] of Object.entries(patches)) {
    const fullTargetPath = path.join(srcDir, targetPath);

    console.log(`   → Processing: ${targetPath}`);

    // Try both srcDir location and build root (for tsconfig located at build/)
    let candidatePaths = [fullTargetPath, path.join(projectRoot, targetPath)];

    let found = false;
    let actualPath;
    for (const p of candidatePaths) {
      try {
        await fs.access(p);
        found = true;
        actualPath = p;
        break;
      } catch (err) {
        // continue
      }
    }

    if (!found) {
      console.log(`   ⚠️  Target file not found: ${targetPath}`);
      continue;
    }

    let fileContent = await fs.readFile(actualPath, "utf-8");
    let modified = false;

    if (operations.content && operations.action) {
      const { content, action, oldString } = operations;

      switch (action) {
        case "append":
          if (!fileContent.includes(content.trim())) {
            fileContent += "\n\n" + content;
            modified = true;
            console.log(`   ✅ Appended content`);
          } else {
            console.log(`   ℹ️  Content already exists, skipping`);
          }
          break;
        case "prepend":
          if (!fileContent.includes(content.trim())) {
            fileContent = content + "\n\n" + fileContent;
            modified = true;
            console.log(`   ✅ Prepended content`);
          } else {
            console.log(`   ℹ️  Content already exists, skipping`);
          }
          break;
        case "replace":
          if (oldString) {
            if (fileContent.includes(oldString)) {
              fileContent = fileContent.replace(oldString, content);
              modified = true;
              console.log(`   ✅ Replaced content`);
            } else {
              console.log(`   ⚠️  Old string not found for replacement`);
            }
          } else {
            console.log(`   ⚠️  Replace action requires oldString`);
          }
          break;
        default:
          console.log(`   ⚠️  Unknown action: ${action}`);
      }
    } else {
      console.log(`   ⚠️  Invalid patch format for: ${targetPath}`);
    }

    if (modified) {
      await fs.writeFile(actualPath, fileContent);
      appliedCount++;
    }
  }

  return appliedCount;
}

/**
 * Main function
 */
async function main() {
  console.log("🔄 Applying custom overrides...\n");

  // Check if overrides directory exists
  try {
    await fs.access(OVERRIDES_DIR);
  } catch {
    console.log("ℹ️  No overrides directory found");
    console.log(`   Create ${OVERRIDES_DIR} to add custom overrides`);
    return;
  }

  // Get all override files
  console.log(`📂 Scanning overrides directory: ${OVERRIDES_DIR}`);
  const overrideFiles = await getAllFiles(OVERRIDES_DIR);

  if (overrideFiles.length === 0) {
    console.log("ℹ️  No override files found");
    return;
  }

  console.log(`   Found ${overrideFiles.length} override file(s)\n`);

  // Create backup directory
  await fs.mkdir(BACKUP_DIR, { recursive: true });

  let appliedCount = 0;
  let skippedCount = 0;
  let patchAppliedCount = 0;

  // Apply each override
  for (const file of overrideFiles) {
    const srcPath = path.join(SRC_DIR, file.relative);
    const overridePath = file.absolute;
    const backupPath = path.join(BACKUP_DIR, file.relative);

    console.log(`📝 Processing: ${file.relative}`);

    try {
      // Handle JSON patch files differently
      if (isJsonPatchFile(file.absolute)) {
        const patchesApplied = await applyJsonPatch(overridePath, SRC_DIR);
        patchAppliedCount += patchesApplied;
        console.log(`   ✅ Applied ${patchesApplied} patch(es)`);
      } else {
        // Regular file replacement
        // Check if target exists
        try {
          await fs.access(srcPath);
          // Backup existing file
          console.log(`   → Backing up existing file`);
          await copyFile(srcPath, backupPath);
        } catch {
          console.log(`   → Creating new file`);
        }

        // Copy override to target
        await copyFile(overridePath, srcPath);
        console.log(`   ✅ Applied successfully`);
        appliedCount++;
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      skippedCount++;
    }

    console.log();
  }

  // Print summary
  console.log("📊 Summary:");
  console.log(`   File overrides applied: ${appliedCount}`);
  console.log(`   JSON patches applied: ${patchAppliedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Total: ${overrideFiles.length}`);

  if (appliedCount > 0 || patchAppliedCount > 0) {
    console.log(`\n💾 Backups saved to: ${BACKUP_DIR}`);
  }

  console.log("\n✨ Override application complete!");
}

// Run main function
main().catch((error) => {
  console.error("Override application failed:", error);
  process.exit(1);
});
