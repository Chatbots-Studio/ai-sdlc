---
name: spec-generator
description: Generate or update concise behavior specs from code and change context.
---

# Spec Generator

## Use When

`@knowledge-grower` needs a new spec or a spec update for behavior that should
remain stable over time.

## Inputs

- Module path or changed files.
- PR description, diff, comments, and commits when available.
- Existing spec files when updating.
- Local README, tests, API contracts, schemas, and validation rules.

## Process

1. Identify the module boundary and public behavior.
2. Extract invariants from validations, guards, state transitions, permissions,
   persistence, idempotency, retries, and error handling.
3. Extract critical paths: main success path, failure paths, edge cases, and
   recovery paths.
4. Record dependencies and external contracts.
5. Record decisions only when supported by source context.
6. Mark uncertain areas as questions instead of guessing.
7. Account for every source file under the selected module's Source Paths.

## Invariant Rules

- Each invariant must be concrete and source-backed.
- Each invariant must label its evidence type: `Static evidence`, `Test
  evidence`, or `Runtime evidence`.
- Prefer values, state transitions, permissions, IO contracts, error behavior,
  persistence effects, or external calls.
- Avoid generic statements unless paired with evidence and review impact.

## Evidence And Path Accounting Rules

- Every source file under a selected module's Source Paths must be accounted
  for in exactly one of `source_paths`, `linked_tests`, or `skipped_paths`.
- If a file is imported by a selected module but not included in
  `source_paths`, add it to `skipped_paths` with a reason and evidence.
- Separate static facts, test-derived facts, and runtime-checked facts.
- When `runtime_verified` is `false`, do not claim runtime behavior. Use
  wording like `statically indicated by`, `covered by existing test`, or `not
  runtime-checked`.
- Use `runtime_evidence: ["none"]` when no app, database, service, or command
  was run to verify behavior.
- Never use `verified` unless a test command, runtime check, or reviewer action
  was actually executed and recorded.
- Linked or inspected test files are `test evidence` or `linked-test evidence`,
  not verified behavior.

## Spec Template

```md
---
module: example-module
criticality: medium
last_checked: YYYY-MM-DD
owners: []
source_paths:
  - path/to/source.ext
linked_tests:
  - path/to/test.ext
tests_discovered:
  - path/to/test.ext
tests_executed: []
test_execution_evidence:
  - "none"
skipped_paths:
  - path: path/to/file
    reason: "why it is out of scope"
    evidence: "path:line"
evidence:
  - path/to/source.ext:line
static_evidence:
  - path/to/source.ext:line
test_evidence:
  - path/to/test.ext:line
runtime_evidence:
  - "none"
runtime_verified: false
source_pr: ""
e2e_tests: []
auto_generated: true
---

# Example Module

## Business Context

Describe the behavior this module owns. Use static/test/runtime wording that
matches the evidence actually collected.

## Path Accounting

| Path | Accounted As | Reason | Evidence |
| --- | --- | --- | --- |
| path/to/source.ext | source_paths | In module scope. | path/to/source.ext:line |
| path/to/test.ext | linked_tests | Linked-test evidence; not executed unless listed in tests_executed. | path/to/test.ext:line |
| path/to/imported-file.ext | skipped_paths | Out of scope because ... | path/to/source.ext:line |

## Invariants

- Concrete invariant. Static evidence: `path/to/source.ext:line`.
- Test-covered invariant. Test evidence: `path/to/test.ext:line`.
- Runtime-checked invariant, only when a runtime check was executed. Runtime evidence:
  `command/result`.

## Critical Paths

1. **Path name** — trigger -> key code path -> observable result.
   Static evidence: `path:line`.
   PR review: changes to `files/functions/config` must re-check this path.
2. **Failure or recovery path** — trigger -> key code path -> observable result.
   Test evidence: `path:line`.
   PR review: changes to `files/functions/config` must re-check this path.

## Dependencies

- Internal or external dependency.

## Decisions

| Date | Source | Decision |
| --- | --- | --- |
| YYYY-MM-DD | PR or commit | Initial spec. |

## Open Questions

- Unknown behavior that needs owner confirmation.
```

Examples are illustrative only. Replace them with real repository modules.
