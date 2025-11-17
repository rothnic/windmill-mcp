# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Project structure and foundation
- Generator system for OpenAPI-based MCP server creation
- Override system for persistent customizations
- Testing infrastructure framework
- Comprehensive documentation (README, CONTRIBUTING, agent files)
- npm package configuration for `npx` execution
- Project planning and sprint tracking in `.github/agents/`

### Changed

- Reorganized project structure: moved source files into `src/` directory
  - `generator/` → `src/generator/` - Generation scripts
  - `overrides/` → `src/overrides/` - Override patches and validation
  - `scripts/` → `src/runtime/` - Runtime loader with version management
  - Generated code now goes to `build/` (gitignored) instead of `src/`
  - Updated all documentation to reflect new paths

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A

## [0.1.0] - 2025-11-11

### Added

- Initial project setup
- Basic MCP server structure
- Generator configuration
- Override system design
- Test directory structure
- Documentation framework
- License (MIT)

---

## Template for Future Releases

## [X.Y.Z] - YYYY-MM-DD

### Added

- New features

### Changed

- Changes in existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Removed features

### Fixed

- Bug fixes

### Security

- Security fixes

---

## Versioning Guide

- **Major (X.0.0)**: Breaking changes, major new features
- **Minor (x.Y.0)**: New features, backward compatible
- **Patch (x.y.Z)**: Bug fixes, minor improvements

## Release Process

1. Update version in `package.json`
2. Update this CHANGELOG
3. Commit changes: `git commit -am "Release vX.Y.Z"`
4. Tag release: `git tag -a vX.Y.Z -m "Version X.Y.Z"`
5. Push: `git push && git push --tags`
6. Publish: `npm publish`

## Links

- [Repository](https://github.com/rothnic/windmill-mcp)
- [Issues](https://github.com/rothnic/windmill-mcp/issues)
- [Releases](https://github.com/rothnic/windmill-mcp/releases)
