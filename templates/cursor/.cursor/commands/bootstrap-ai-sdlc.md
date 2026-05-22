# Bootstrap AI SDLC

Analyze this repository and create the first AI SDLC knowledge base seed.

## Goals

1. Detect the repository structure, application boundaries, test framework, and
   critical modules.
2. Build a proof-backed module map before creating specs.
3. Create 1-3 seed specs for the most critical modules only.
4. Update `specs/_index.md`.
5. Update `specs/_coverage.md`.
6. Do not modify business code.

## Priority Order

Prioritize modules in this order when evidence exists in the repository:

1. Auth and security.
2. Payments and billing.
3. Core business logic.
4. User data lifecycle.
5. External integrations.

These are priority categories, not required domains. If the repository does
not contain one of them, skip it.

## Constraints

- Do not generate many low-confidence files.
- Do not create more than 3 seed specs in one run.
- Prefer 1 high-confidence seed spec over several weak specs.
- Do not invent business rules.
- Use existing code, tests, README files, schemas, route definitions, and
  configuration as evidence.
- Do not create e2e tests unless the test framework and startup flow are clear.
- Prefer TODO coverage notes over speculative tests.
- Do not write `Critical modules without specs = 0` unless repository scan
  scope is documented.
- If the repository is not under git, state that business-code modification
  cannot be diff-verified.
- If app, database, or required services were not started, set
  `runtime_verified: false` in generated specs and report runtime verification
  as static/test only.
- If confidence is below 80%, document open questions instead of creating a
  speculative spec.

## Process

1. Read `AGENTS.md`, `README.md`, package manifests, application entrypoints,
   routes, schemas, data models, and test directories.
2. Document repository scan scope, including directories inspected, directories
   skipped, test locations found, and whether git diff/status is available.
3. Build a mandatory module map before creating specs. Each module row must
   include:
   - module name
   - source paths
   - test paths
   - detected responsibilities
   - criticality candidate
   - evidence
   - selected? why / why not
4. Verify each selected module has real source paths. If source paths are
   missing, inspect repository structure again before deciding no spec applies.
5. Use the AI SDLC criticality rules to choose 1-3 seed spec candidates.
6. For each chosen module, create or update a spec with:
   - business context
   - source paths
   - linked tests
   - skipped paths for imported or discovered files that are out of scope
   - evidence references
   - separate static evidence, test evidence, and runtime evidence
   - runtime verification status
   - path accounting section
   - invariants
   - critical paths
   - dependencies
   - open questions
7. Before finalizing specs, compare index `Source Paths` against each spec's
   `source_paths` + `linked_tests` + `skipped_paths`.
8. If any path is unaccounted, update the spec or add a path accounting warning
   that names the path and why it remains unresolved.
9. Update `specs/_index.md` with the chosen modules and source paths.
10. Update `specs/_coverage.md` with repository scan scope, known coverage, and
   gaps.
11. Check whether business code changed:
   - tracked diff for `src`, `test`, and config files
   - untracked generated AI-SDLC artifacts
   - if the repository is not under git, say diff verification is unavailable
12. Recommend e2e tests only when the framework and setup are clear; otherwise
   record TODO coverage notes.

## Output Summary

Return a concise summary with:

- Module map
- Selected seed specs
- Skipped candidate modules
- Business-code mutation check
- Runtime verification status
- Path accounting warnings
- repository scan scope
- confidence per seed spec
- files created or updated
- test framework confidence
- next recommended actions
