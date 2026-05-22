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
- Never use numeric zero for missing critical modules unless classifier scan
  scope is recorded.
- Coverage summaries must include `Repository scan scope`.
- Every `Source Paths` entry in `specs/_index.md` must reconcile with the
  target spec frontmatter: `source_paths` + `linked_tests` + `skipped_paths`.
- If a Source Paths entry is not reconciled, set Status to
  `draft: path-accounting-warning`.
- Coverage reports must distinguish source coverage, test evidence, and runtime
  evidence.
- Never mark a module `verified` when `runtime_verified` is `false` unless the
  status explicitly says `static/test verified only`.

## Process

1. Read all spec frontmatter under `specs/`.
2. Read `source_paths`, `linked_tests`, `skipped_paths`, `static_evidence`,
   `test_evidence`, `runtime_evidence`, and `runtime_verified`.
3. Read linked tests from spec frontmatter and test `spec-ref` comments.
4. Verify whether listed files exist.
5. Reconcile index Source Paths against spec `source_paths` + `linked_tests` +
   `skipped_paths`.
6. Update module rows, source paths, criticality, owners, linked tests, last
   verified date, and status.
7. Update coverage summary and gaps.
8. Keep tables sorted by module name unless the repository has another
   convention.

## Index Row Shape

```md
| Module | Source Paths | Criticality | Spec | Owners | Tests | Last Verified | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| example-module | path/to/source.ext | medium | specs/example-module/spec.md | TBD | TBD | YYYY-MM-DD | draft |
```

## Coverage Row Shape

```md
| Module | Source Coverage | Critical Paths | Test Coverage | Evidence | Gaps | Last Checked |
| --- | --- | --- | --- | --- | --- | --- |
| example-module | partial | unknown | static/test verified only | static: path/to/source.ext:line; test: path/to/test.ext:line; runtime: none | Needs review | YYYY-MM-DD |
```

Coverage values:

- `verified`
- `partial`
- `none`
- `unknown`

Status values include:

- `draft`
- `draft: path-accounting-warning`
- `reviewed`
- `static/test verified`
- `runtime verified`
