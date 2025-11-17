# Sprint Planning and Tracking

## Current Sprint: Sprint 1 - Foundation

**Duration**: Week 1
**Goal**: Establish project structure, documentation, and basic configuration

### Sprint 1 Backlog

#### High Priority

- [x] Create project directory structure
- [x] Write comprehensive README.md
- [x] Create `docs/project-plan.md`
- [x] Create `docs/sprints.md`
- [x] Create AGENTS.md with agent configurations
- [x] Set up package.json with dependencies and scripts
- [x] Create .env.example for configuration
- [x] Create generator configuration file
- [x] Document generator workflow
- [x] Set up .gitignore for generated files
- [x] Configure package for npx execution (bin entry)
- [x] Add .npmignore for clean npm publishing
- [x] Create LICENSE file
- [x] Create CONTRIBUTING.md
- [x] Set up Vitest testing framework
- [x] Create mock utilities for unit testing
- [x] Create Docker Compose for E2E testing
- [x] Document testing strategy in TESTING.md

#### Medium Priority

- [x] Create initial test directory structure
- [x] Add contributing guidelines
- [x] Create changelog template
- [x] Add license file
- [x] Create sample unit tests
- [x] Create sample E2E tests
- [x] Add wait-for-windmill helper script

#### Low Priority

- [ ] Add badges to README
- [ ] Create issue templates
- [ ] Set up GitHub Actions workflow

### Sprint 1 Notes

- Focus on establishing clear structure for long-term maintainability
- Ensure documentation is comprehensive enough for external contributors
- Set up infrastructure before implementation

---

## Sprint 2 - Generator Implementation (Planned)

**Duration**: Week 2
**Goal**: Implement core generation functionality

### Sprint 2 Backlog (Draft)

#### High Priority

- [ ] Install openapi-mcp-generator as dependency
- [ ] Create script to fetch Windmill OpenAPI spec
- [ ] Create generate.js script for main generation flow
- [ ] Implement basic post-generation processing
- [ ] Test generation with actual Windmill spec
- [ ] Document generation process

#### Medium Priority

- [ ] Add error handling for generation failures
- [ ] Create dry-run option for generation
- [ ] Add logging for generation process
- [ ] Version tracking for generated code

#### Low Priority

- [ ] Optimize generation performance
- [ ] Add progress indicators
- [ ] Create diff view for changes

---

## Sprint 3 - Override System (Planned)

**Duration**: Week 3
**Goal**: Enable customization preservation across regenerations

### Sprint 3 Backlog (Draft)

#### High Priority

- [ ] Design override directory structure
- [ ] Create apply-overrides.js script
- [ ] Implement file merge strategy
- [ ] Test override persistence
- [ ] Document override workflow

#### Medium Priority

- [ ] Add conflict detection
- [ ] Create manual merge option
- [ ] Add override validation
- [ ] Create example overrides

#### Low Priority

- [ ] Create override templates
- [ ] Add override diff tool
- [ ] Implement selective overrides

---

## Sprint 4 - Testing Infrastructure (Planned)

**Duration**: Week 4
**Goal**: Establish comprehensive testing capabilities

### Sprint 4 Backlog (Draft)

#### High Priority

- [ ] Install test framework (Jest)
- [ ] Create test utilities for Windmill connection
- [ ] Implement basic endpoint tests
- [ ] Set up test configuration
- [ ] Document testing approach

#### Medium Priority

- [ ] Add integration test suite
- [ ] Create test data fixtures
- [ ] Implement mock server for offline tests
- [ ] Add CI/CD pipeline

#### Low Priority

- [ ] Performance benchmarks
- [ ] Load testing
- [ ] Security testing

---

## Sprint 5 - Polish & Release (Planned)

**Duration**: Week 5-6
**Goal**: Finalize for v1.0.0 release

### Sprint 5 Backlog (Draft)

#### High Priority

- [ ] Comprehensive documentation review
- [ ] Fix all known bugs
- [ ] Complete test coverage
- [ ] Create release checklist
- [ ] Version 1.0.0 release

#### Medium Priority

- [ ] Create tutorial/getting started guide
- [ ] Add examples directory
- [ ] Performance optimization
- [ ] Security audit

#### Low Priority

- [ ] Create demo video
- [ ] Set up documentation site
- [ ] Create logo/branding

---

## Sprint Retrospective Template

After each sprint, capture learnings:

### Sprint X Retrospective

**What went well:**

- **What could be improved:**

- **Action items:**

- **Metrics:**

- Tasks completed: X/Y
- Bugs found: X
- Test coverage: X%

---

## Definition of Done

For a task to be considered complete:

1. **Code**: Implementation complete and reviewed
2. **Tests**: Unit tests written and passing
3. **Documentation**: Feature documented in appropriate files
4. **Review**: Code reviewed (if applicable)
5. **Integration**: Works with existing components
6. **Clean**: No lint errors, follows code style

---

## Sprint Planning Process

### Before Sprint

1. Review `docs/project-plan.md` for next phase
2. Prioritize backlog items
3. Estimate effort for each item
4. Identify dependencies
5. Set sprint goal

### During Sprint

1. Update task status regularly
2. Document blockers and decisions
3. Communicate progress
4. Adjust as needed

### After Sprint

1. Complete retrospective
2. Update `docs/project-plan.md` if needed
3. Plan next sprint
4. Archive completed work

---

## Quick Reference

### Task Status Legend

- [ ] Not started
- [⏳] In progress
- [x] Complete
- [🚫] Blocked
- [⏸️] Paused

### Priority Levels

- **High**: Critical path, blocks other work
- **Medium**: Important but not blocking
- **Low**: Nice to have, can be deferred

---

## Notes & Decisions

### Decision Log

**Date**: 2025-11-11
**Decision**: Use openapi-mcp-generator as base tool
**Rationale**: Proven solution, actively maintained, fits requirements
**Impact**: Reduces custom code, faster implementation

**Date**: 2025-11-11
**Decision**: Separate overrides directory structure
**Rationale**: Clear separation of generated vs custom code
**Impact**: Easier to maintain and reason about customizations

**Date**: 2025-11-11
**Decision**: Test against live Windmill instance
**Rationale**: Ensures real-world compatibility
**Impact**: Requires test instance setup, more reliable tests

**Date**: 2025-11-11
**Decision**: Use Vitest instead of Jest for testing
**Rationale**: Faster, better ESM support, modern API, built-in coverage
**Impact**: Better developer experience, faster test execution

**Date**: 2025-11-11
**Decision**: Three-tier testing strategy (unit/integration/e2e)
**Rationale**: Balance speed, reliability, and coverage
**Impact**: Unit tests with mocks (fast), E2E with Docker (comprehensive)

**Date**: 2025-11-11
**Decision**: Minimal Docker setup for E2E testing
**Rationale**: Easy setup for contributors, no complex service dependencies
**Impact**: Single-container Windmill with embedded worker, simpler than full production setup

---

## Resources

- [project-plan.md](./project-plan.md) - Overall project plan
- [AGENTS.md](../.github/agents/AGENTS.md) - Agent configurations
- [Main README](../README.md) - User documentation
