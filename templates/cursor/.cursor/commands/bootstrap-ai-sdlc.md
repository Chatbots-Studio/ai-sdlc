# Bootstrap AI SDLC

Analyze this repository and create the first AI SDLC knowledge base seed.

## Goals

1. Detect the repository structure, application boundaries, test framework, and
   critical modules.
2. Create 1-3 seed specs for the most critical modules only.
3. Update `specs/_index.md`.
4. Update `specs/_coverage.md`.
5. Do not modify business code.

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
- Prefer 1 high-confidence seed spec over several weak specs.
- Do not invent business rules.
- Use existing code, tests, README files, schemas, route definitions, and
  configuration as evidence.
- If the test framework or test setup is unclear, ask for review before adding
  e2e tests. Do not create those tests until the reviewer confirms the setup.
- If confidence is below 80%, document open questions instead of creating a
  speculative spec.

## Process

1. Read `AGENTS.md`, `README.md`, package manifests, application entrypoints,
   routes, schemas, data models, and test directories.
2. Build a short module map.
3. Use the AI SDLC criticality rules to choose 1-3 seed spec candidates.
4. For each chosen module, create or update a spec with:
   - business context
   - invariants
   - critical paths
   - dependencies
   - open questions
5. Update `specs/_index.md` with the chosen modules.
6. Update `specs/_coverage.md` with known coverage and gaps.
7. Recommend e2e tests only when the framework and setup are clear; otherwise
   ask for review first.

## Output Summary

Return a concise summary with:

- detected modules
- chosen seed specs
- confidence per seed spec
- files created or updated
- test framework confidence
- next recommended actions
