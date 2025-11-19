#!/usr/bin/env node

/**
 * Cache Manager for Windmill MCP Server
 *
 * Manages cached generated MCP server code for different Windmill versions.
 */

import fs from "fs/promises";
import path from "path";
import os from "os";
import * as tar from "tar";

/**
 * Get cache directory for a specific Windmill version
 * @param {string} windmillVersion - Windmill version (e.g., "1.520.1" or "latest")
 * @returns {string} Cache directory path
 */
export function getCacheDir(windmillVersion) {
  const baseDir =
    process.env.WINDMILL_MCP_CACHE_DIR ||
    path.join(os.homedir(), ".cache", "windmill-mcp");
  return path.join(baseDir, windmillVersion);
}

/**
 * Check if cached version exists
 * @param {string} windmillVersion - Windmill version
 * @returns {Promise<boolean>} Whether cache exists
 */
export async function isCached(windmillVersion) {
  const cacheDir = getCacheDir(windmillVersion);
  const indexPath = path.join(cacheDir, "index.js");

  try {
    await fs.access(indexPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract tarball to cache directory
 * @param {Buffer} tarballBuffer - Tarball content
 * @param {string} windmillVersion - Windmill version
 * @returns {Promise<void>}
 */
export async function extractToCache(tarballBuffer, windmillVersion) {
  const cacheDir = getCacheDir(windmillVersion);

  // Ensure cache directory exists
  await fs.mkdir(cacheDir, { recursive: true });

  // Write tarball to temp file
  const tempTarball = path.join(cacheDir, "temp.tar.gz");
  await fs.writeFile(tempTarball, tarballBuffer);

  try {
    // Extract tarball
    await tar.extract({
      file: tempTarball,
      cwd: cacheDir,
      strip: 1, // Remove top-level directory from tarball
    });

    console.log(`✅ Extracted to cache: ${cacheDir}`);
  } finally {
    // Clean up temp file
    try {
      await fs.unlink(tempTarball);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Save generated code to cache
 * @param {string} sourceDir - Source directory with generated code
 * @param {string} windmillVersion - Windmill version
 * @returns {Promise<void>}
 */
export async function saveToCache(sourceDir, windmillVersion) {
  const cacheDir = getCacheDir(windmillVersion);

  // Ensure cache directory exists
  await fs.mkdir(cacheDir, { recursive: true });

  // Copy generated code to cache
  await copyDirectory(sourceDir, cacheDir);

  console.log(`✅ Saved to cache: ${cacheDir}`);
}

/**
 * Get cached code directory
 * @param {string} windmillVersion - Windmill version
 * @returns {string} Path to cached code
 */
export function getCachedCodePath(windmillVersion) {
  return path.join(getCacheDir(windmillVersion), "index.js");
}

/**
 * Clear cache for a specific version or all versions
 * @param {string} [windmillVersion] - Windmill version to clear, or undefined for all
 * @returns {Promise<void>}
 */
export async function clearCache(windmillVersion) {
  if (windmillVersion) {
    const cacheDir = getCacheDir(windmillVersion);
    await fs.rm(cacheDir, { recursive: true, force: true });
    console.log(`🗑️  Cleared cache for version: ${windmillVersion}`);
  } else {
    const baseDir = path.join(os.homedir(), ".cache", "windmill-mcp");
    await fs.rm(baseDir, { recursive: true, force: true });
    console.log(`🗑️  Cleared all cache`);
  }
}

/**
 * List cached versions
 * @returns {Promise<string[]>} List of cached version strings
 */
export async function listCachedVersions() {
  const baseDir = path.join(os.homedir(), ".cache", "windmill-mcp");

  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Recursively copy directory
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @returns {Promise<void>}
 */
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
