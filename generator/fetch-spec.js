#!/usr/bin/env node

/**
 * Fetch Windmill OpenAPI Specification
 * 
 * This script fetches the latest OpenAPI specification from Windmill
 * and saves it to the local cache for use by the generator.
 */

import https from 'https';
import http from 'http';
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

const SPEC_URL = process.env.OPENAPI_SPEC_URL || config.openapi.specUrl;
const BACKUP_URL = config.openapi.backupUrl;
const CACHE_PATH = path.resolve(__dirname, '..', config.openapi.localCache);

/**
 * Fetch URL content
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} Response body
 */
async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Validate OpenAPI spec
 * @param {string} spec - OpenAPI spec JSON string
 * @returns {boolean} Whether spec is valid
 */
function validateSpec(spec) {
  try {
    const parsed = JSON.parse(spec);
    return parsed.openapi && parsed.info && parsed.paths;
  } catch {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Fetching Windmill OpenAPI specification...');
  console.log(`   Source: ${SPEC_URL}`);
  
  let spec;
  let source = 'primary';
  
  try {
    // Try primary URL
    spec = await fetchUrl(SPEC_URL);
    console.log('✅ Successfully fetched from primary source');
  } catch (error) {
    console.warn(`⚠️  Primary source failed: ${error.message}`);
    console.log(`   Trying backup: ${BACKUP_URL}`);
    
    try {
      // Try backup URL
      spec = await fetchUrl(BACKUP_URL);
      source = 'backup';
      console.log('✅ Successfully fetched from backup source');
    } catch (backupError) {
      console.error('❌ Backup source also failed:', backupError.message);
      console.error('   Cannot proceed without OpenAPI specification');
      process.exit(1);
    }
  }
  
  // Validate spec
  console.log('🔍 Validating OpenAPI specification...');
  if (!validateSpec(spec)) {
    console.error('❌ Invalid OpenAPI specification format');
    process.exit(1);
  }
  console.log('✅ Specification is valid');
  
  // Save to cache
  console.log(`💾 Saving to cache: ${CACHE_PATH}`);
  try {
    await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await fs.writeFile(CACHE_PATH, spec, 'utf-8');
    console.log('✅ Specification cached successfully');
  } catch (error) {
    console.error('❌ Failed to save specification:', error.message);
    process.exit(1);
  }
  
  // Print summary
  const parsed = JSON.parse(spec);
  console.log('\n📊 Specification Summary:');
  console.log(`   Version: ${parsed.info.version || 'unknown'}`);
  console.log(`   Title: ${parsed.info.title || 'unknown'}`);
  console.log(`   Endpoints: ${Object.keys(parsed.paths || {}).length}`);
  console.log(`   Source: ${source}`);
  console.log('\n✨ Ready for generation!');
}

// Run main function
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
