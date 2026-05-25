---
name: kb-indexer
description: Maintain specs/_index.md and specs/_coverage.md.
---

# Knowledge Base Indexer

## Use When

Specs, tests, module ownership, criticality, or coverage metadata changed.

## Responsibilities

- Keep `specs/_index.md` as the registry of known specs.
- Keep `specs/_coverage.md` as the coverage and gap report.
- Ensure links point to real files.
- Preserve manual owner notes and open questions.
- Mark unknown coverage as unknown, not zero, unless verified.

## Process

1. Read all spec frontmatter under `specs/`.
2. Read linked tests from spec frontmatter and test `spec-ref` comments.
3. Verify whether listed files exist.
4. Update module rows, criticality, owners, linked tests, last verified date,
   and status.
5. Update coverage summary and gaps.
6. Keep tables sorted by module name unless the repository has another
   convention.

## Index Row Shape

```md
| Module | Criticality | Spec | Owners | Tests | Last Verified | Status |
| --- | --- | --- | --- | --- | --- | --- |
| example-module | medium | specs/example-module/spec.md | TBD | TBD | YYYY-MM-DD | draft |
```

## Coverage Row Shape

```md
| Module | Spec Status | Critical Paths | Test Coverage | Gaps | Last Checked |
| --- | --- | --- | --- | --- | --- |
| example-module | draft | unknown | unknown | Needs review | YYYY-MM-DD |
```
