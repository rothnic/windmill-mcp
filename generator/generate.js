#!/usr/bin/env node

/**
 * Generate Windmill MCP Server
 * 
 * This script generates the MCP server from the cached OpenAPI specification
 * using openapi-mcp-generator.
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, 'config.json');
let config;
try {
  const configData = await fs.readFile(configPath, 'utf-8');
  config = JSON.parse(configData);
} catch (error) {
  console.error('Error loading config:', error.message);
  process.exit(1);
}

const CACHE_PATH = path.resolve(__dirname, '..', config.openapi.localCache);
const OUTPUT_DIR = path.resolve(__dirname, '..', config.generator.outputDir);

/**
 * Run command and return promise
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    proc.on('error', reject);
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Windmill MCP Server generation...\n');
  
  // Check if spec exists
  console.log('📋 Checking for OpenAPI specification...');
  try {
    await fs.access(CACHE_PATH);
    console.log(`✅ Found specification at ${CACHE_PATH}`);
  } catch {
    console.error('❌ OpenAPI specification not found!');
    console.error('   Run "npm run fetch-spec" first');
    process.exit(1);
  }
  
  // Read the OpenAPI spec to get info
  const specContent = await fs.readFile(CACHE_PATH, 'utf-8');
  const spec = JSON.parse(specContent);
  
  console.log(`\n📊 OpenAPI Spec Info:`);
  console.log(`   Version: ${spec.info.version || 'unknown'}`);
  console.log(`   Title: ${spec.info.title || 'unknown'}`);
  console.log(`   Endpoints: ${Object.keys(spec.paths || {}).length}`);
  
  // Remove existing output directory
  console.log(`\n🗑️  Cleaning output directory: ${OUTPUT_DIR}`);
  try {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, that's ok
  }
  
  // Run openapi-mcp-generator
  console.log('\n🔧 Running openapi-mcp-generator...');
  console.log('   This will generate MCP tools for all Windmill API endpoints');
  
  try {
    await runCommand('npx', [
      'openapi-mcp-generator@3.2.0',  // Pin to version that supports --transport
      '--input', CACHE_PATH,
      '--output', OUTPUT_DIR,
      '--server-name', 'windmill-mcp',
      '--server-version', spec.info.version || '0.1.0',
      '--transport', 'stdio',
      '--force'
    ]);
    
    console.log('✅ MCP server generated successfully');
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure you have Node.js 18+ installed');
    console.error('2. Try: npm install -g openapi-mcp-generator');
    console.error('3. Check the OpenAPI spec is valid');
    process.exit(1);
  }
  
  // Apply overrides if configured
  if (config.postGeneration.applyOverrides) {
    console.log('\n🔄 Post-generation: Applying overrides...');
    try {
      await runCommand('npm', ['run', 'apply-overrides']);
    } catch (error) {
      console.warn('⚠️  Override application failed (may not exist yet)');
    }
  }
  
  console.log('\n✨ Generation complete!');
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`\n📝 Generated ${Object.keys(spec.paths || {}).length} API endpoints as MCP tools`);
  console.log('\n📝 Next steps:');
  console.log('   1. Review generated files in src/');
  console.log('   2. Add customizations in overrides/');
  console.log('   3. Run tests: npm test');
}

// Run main function
main().catch((error) => {
  console.error('Generation failed:', error);
  process.exit(1);
});
