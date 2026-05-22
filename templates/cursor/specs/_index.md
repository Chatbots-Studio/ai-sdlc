# Specs Index

This file is the registry for the AI SDLC knowledge base.

Agents must read this file before analyzing changes. Keep rows linked to real
source paths, specs, and tests as the repository knowledge base grows.

## Modules

| Module | Source Paths | Criticality | Spec | Owners | Tests | Last Verified | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| example-module | path/to/source.ext | medium | specs/example-module/spec.md | TBD | TBD | YYYY-MM-DD | example |

The example row is illustrative only. Replace it with real repository modules
or remove it during bootstrap.

## Status Values

- `draft`: generated or incomplete, needs review.
- `draft: path-accounting-warning`: generated with unresolved Source Paths or
  imported files that must be reconciled in the target spec.
- `reviewed`: accepted by a module owner.
- `static/test verified`: accepted for static and test evidence only; runtime
  behavior was not verified.
- `runtime verified`: accepted with runtime evidence from an app, database,
  service, or command run.
- `stale`: code changed and spec needs verification.
- `example`: illustrative placeholder.
