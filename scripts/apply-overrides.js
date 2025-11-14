#!/usr/bin/env node

/**
 * Apply Custom Overrides
 * 
 * This script applies custom overrides from the overrides/ directory
 * to the generated code in src/, preserving customizations across regenerations.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OVERRIDES_DIR = path.resolve(__dirname, '..', 'overrides');
const SRC_DIR = path.resolve(__dirname, '..', 'src');
const BACKUP_DIR = path.resolve(__dirname, '..', 'generator', 'temp', 'backup');

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
        files.push(...await getAllFiles(fullPath, baseDir));
      } else {
        files.push({
          absolute: fullPath,
          relative: path.relative(baseDir, fullPath)
        });
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
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
 * Main function
 */
async function main() {
  console.log('🔄 Applying custom overrides...\n');
  
  // Check if overrides directory exists
  try {
    await fs.access(OVERRIDES_DIR);
  } catch {
    console.log('ℹ️  No overrides directory found');
    console.log(`   Create ${OVERRIDES_DIR} to add custom overrides`);
    return;
  }
  
  // Get all override files
  console.log(`📂 Scanning overrides directory: ${OVERRIDES_DIR}`);
  const overrideFiles = await getAllFiles(OVERRIDES_DIR);
  
  if (overrideFiles.length === 0) {
    console.log('ℹ️  No override files found');
    return;
  }
  
  console.log(`   Found ${overrideFiles.length} override file(s)\n`);
  
  // Create backup directory
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  
  let appliedCount = 0;
  let skippedCount = 0;
  
  // Apply each override
  for (const file of overrideFiles) {
    const srcPath = path.join(SRC_DIR, file.relative);
    const overridePath = file.absolute;
    const backupPath = path.join(BACKUP_DIR, file.relative);
    
    console.log(`📝 Processing: ${file.relative}`);
    
    try {
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
      
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      skippedCount++;
    }
    
    console.log();
  }
  
  // Print summary
  console.log('📊 Summary:');
  console.log(`   Applied: ${appliedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Total: ${overrideFiles.length}`);
  
  if (appliedCount > 0) {
    console.log(`\n💾 Backups saved to: ${BACKUP_DIR}`);
  }
  
  console.log('\n✨ Override application complete!');
}

// Run main function
main().catch((error) => {
  console.error('Override application failed:', error);
  process.exit(1);
});
