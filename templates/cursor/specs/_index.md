# Specs Index

This file is the registry for the AI SDLC knowledge base.

Agents must read this file before analyzing changes. Keep rows linked to real
source paths, specs, and tests as the repository knowledge base grows.

## Modules

| Module | Source Paths | Criticality | Spec | Owners | Tests | Last Checked | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| example-module | path/to/source.ext | medium | specs/example-module/spec.md | TBD | TBD | YYYY-MM-DD | example |

The example row is illustrative only. Replace it with real repository modules
or remove it during bootstrap.

## Status Values

- `draft`: generated or incomplete, needs review.
- `draft: path-accounting-warning`: generated with unresolved Source Paths or
  imported files that must be reconciled in the target spec.
- `reviewed`: accepted by a module owner.
- `static + linked-test evidence`: accepted for static facts and linked or
  inspected tests; test execution is not implied.
- `runtime verified`: accepted with runtime evidence from an app, database,
  service, or command run.
- `stale`: code changed and spec needs verification.
- `example`: illustrative placeholder.

Never use `verified` unless a test command, runtime check, or reviewer action
was actually executed and recorded.
