# GitHub Copilot Custom Instructions

This file provides custom instructions for GitHub Copilot when working in this repository.

## Documentation Management

When working with **any markdown files** (`.md`) in this repository, follow the comprehensive documentation management guidelines in the **[Documentation Management section of AGENTS.md](../AGENTS.md#documentation-management)**.

### Quick Reference

**All markdown file changes must follow these standards**:

1. **File Naming**: Use lowercase-with-hyphens (e.g., `my-document.md`)
2. **File Organization**: Place in appropriate category (`docs/guides/`, `docs/development/`, `docs/reference/`, `docs/planning/`)
3. **Folder Limits**: No folder should contain >10 markdown files
4. **Document Length**: Target 200-400 lines, maximum 500 lines
5. **Cross-References**: Always link to related documents
6. **Auto-Generated Files**: Never manually edit files marked as auto-generated (e.g., `docs/reference/generated-tools.md`)

### Documentation Structure

```
docs/
├── guides/          # End-user documentation
├── development/     # Contributor documentation
├── reference/       # Technical references
└── planning/        # Project management
```

### Before Committing Documentation

Always:
- [ ] Check file naming follows conventions
- [ ] Verify no folder has >10 markdown files
- [ ] Test all code examples
- [ ] Update `docs/index.md` if adding/removing files
- [ ] Add cross-references to related documents
- [ ] Run `npm run lint:structure`

### Complete Guidelines

For complete documentation standards, guidelines, and best practices, see:

**[AGENTS.md - Documentation Management](../AGENTS.md#documentation-management)**

This section covers:
- Documentation structure and organization
- File naming conventions
- Writing guidelines
- When and what to update
- Validation procedures
- Common tasks and workflows
- Review checklist
- Tools and resources

## Other Instructions

For general agent responsibilities and workflows, see the main [AGENTS.md](../AGENTS.md) file.
