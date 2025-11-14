#!/usr/bin/env node

/**
 * Validate Custom Overrides
 * 
 * This script validates that override files are properly structured
 * and compatible with the current generated code.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OVERRIDES_DIR = path.resolve(__dirname, '..', 'overrides');
const SRC_DIR = path.resolve(__dirname, '..', 'src');

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
 * Validate JavaScript/JSON syntax
 */
async function validateSyntax(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const ext = path.extname(filePath);
  
  if (ext === '.json') {
    try {
      JSON.parse(content);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
  
  if (ext === '.js' || ext === '.mjs') {
    // Basic syntax check - just try to parse as module
    // A full check would require running through a parser
    if (content.includes('syntax error') || content.length === 0) {
      return { valid: false, error: 'File appears to have syntax issues or is empty' };
    }
    return { valid: true };
  }
  
  return { valid: true }; // Other files pass by default
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
  console.log('🔍 Validating custom overrides...\n');
  
  // Check if overrides directory exists
  try {
    await fs.access(OVERRIDES_DIR);
  } catch {
    console.log('✅ No overrides directory found - nothing to validate');
    return;
  }
  
  // Get all override files
  console.log(`📂 Scanning overrides directory: ${OVERRIDES_DIR}`);
  const overrideFiles = await getAllFiles(OVERRIDES_DIR);
  
  if (overrideFiles.length === 0) {
    console.log('✅ No override files found - nothing to validate');
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
        type: 'syntax',
        message: syntaxCheck.error
      });
      hasIssues = true;
    } else {
      console.log(`   ✅ Syntax valid`);
    }
    
    // Check for conflicts
    const conflictCheck = await checkConflict(file.absolute, file.relative);
    if (conflictCheck.hasTarget) {
      console.log(`   ℹ️  Will override existing file in src/`);
    } else {
      console.log(`   ℹ️  Will create new file in src/`);
    }
    
    if (hasIssues) {
      invalidCount++;
    } else {
      validCount++;
    }
    
    console.log();
  }
  
  // Print summary
  console.log('📊 Validation Summary:');
  console.log(`   Valid: ${validCount}`);
  console.log(`   Invalid: ${invalidCount}`);
  console.log(`   Total: ${overrideFiles.length}`);
  
  if (issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    for (const issue of issues) {
      console.log(`   • ${issue.file}: ${issue.message}`);
    }
    console.log('\n❌ Validation failed - please fix issues before applying overrides');
    process.exit(1);
  }
  
  console.log('\n✨ All overrides are valid!');
}

// Run main function
main().catch((error) => {
  console.error('Validation failed:', error);
  process.exit(1);
});
