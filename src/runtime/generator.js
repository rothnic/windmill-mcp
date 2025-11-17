#!/usr/bin/env node

/**
 * Local Generator for Windmill MCP Server
 *
 * Generates MCP server code locally when artifacts are not available.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { saveToCache, getCacheDir } from './cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate MCP server locally
 * @param {string} windmillVersion - Windmill version (e.g., "1.520.1" or "latest")
 * @returns {Promise<void>}
 */
export async function generateLocally(windmillVersion) {
  console.log(`🔧 Generating MCP server locally for Windmill ${windmillVersion}...`);

  const projectRoot = path.resolve(__dirname, '..', '..');
  const generatorDir = path.join(projectRoot, 'generator');
  const tempOutputDir = path.join(projectRoot, 'src', 'generated-temp');

  try {
    // Fetch OpenAPI spec
    console.log(`📥 Fetching OpenAPI spec for Windmill ${windmillVersion}...`);
    await fetchOpenAPISpec(windmillVersion, generatorDir);

    // Run generator
    console.log(`⚙️  Running generator...`);
    execSync('npm run generate', {
      cwd: projectRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        WINDMILL_VERSION: windmillVersion,
      },
    });

    // The generated code should be in src/ directory
    const generatedDir = path.join(projectRoot, 'src');

    // Save to cache
    await saveToCache(generatedDir, windmillVersion);

    console.log(`✅ Generated MCP server for Windmill ${windmillVersion}`);
  } catch (error) {
    console.error(`❌ Failed to generate locally: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch OpenAPI spec for a specific Windmill version
 * @param {string} windmillVersion - Windmill version
 * @param {string} generatorDir - Generator directory
 * @returns {Promise<void>}
 */
async function fetchOpenAPISpec(windmillVersion, generatorDir) {
  // Determine spec URL based on version
  let specUrl;

  if (windmillVersion === 'latest') {
    specUrl = 'https://app.windmill.dev/api/openapi.json';
  } else {
    // For specific versions, try to get from Windmill's GitHub releases
    // This is a fallback approach - ideally we'd have a way to get specific version specs
    specUrl = `https://raw.githubusercontent.com/windmill-labs/windmill/v${windmillVersion}/openapi.json`;
  }

  console.log(`   Spec URL: ${specUrl}`);

  // Run fetch-spec with custom URL
  const { execSync } = await import('child_process');
  execSync('npm run fetch-spec', {
    cwd: path.dirname(generatorDir),
    stdio: 'inherit',
    env: {
      ...process.env,
      OPENAPI_SPEC_URL: specUrl,
    },
  });
}

/**
 * Check if generator is available
 * @returns {Promise<boolean>} Whether generator is available
 */
export async function isGeneratorAvailable() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const generatorPath = path.join(projectRoot, 'generator', 'generate.js');

  try {
    await fs.access(generatorPath);
    return true;
  } catch {
    return false;
  }
}
