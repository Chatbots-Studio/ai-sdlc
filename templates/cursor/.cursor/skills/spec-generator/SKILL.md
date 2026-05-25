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

## Spec Template

```md
---
module: example-module
criticality: medium
last_verified: YYYY-MM-DD
owners: []
source_pr: ""
e2e_tests: []
auto_generated: true
---

# Example Module

## Business Context

Describe the behavior this module owns.

## Invariants

- Invariant that must always hold.
- Another invariant that must always hold.

## Critical Paths

1. Main success path.
2. Important failure or recovery path.

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
