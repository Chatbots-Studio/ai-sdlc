# Specs Coverage

This file tracks how much of the repository has AI SDLC knowledge coverage.

Use `unknown` until coverage has been verified. Do not report guessed coverage
as fact.

## Repository scan scope

Document the directories, file patterns, and test locations inspected during
the latest classifier or bootstrap run. If the scan scope is unknown, do not
report numeric zero for missing critical modules.

## Summary

| Metric | Value | Notes |
| --- | --- | --- |
| Modules with specs | 0 | Update after bootstrap. |
| Critical modules without specs | unknown | Requires documented repository scan scope. |
| Specs with linked tests | 0 | Update after tests are linked. |
| Open coverage gaps | unknown | Requires repository scan. |

## Module Coverage

| Module | Source Coverage | Critical Paths | Test Coverage | Evidence | Gaps | Last Checked |
| --- | --- | --- | --- | --- | --- | --- |
| example-module | unknown | unknown | unknown | static: path/to/source.ext:line; test: path/to/test.ext:line; runtime: none | Replace example during bootstrap. | YYYY-MM-DD |

The example row is illustrative only. Replace it with real repository modules
or remove it during bootstrap.

Coverage values: `verified`, `partial`, `none`, `unknown`.

Status values: `draft`, `draft: path-accounting-warning`, `reviewed`,
`static/test verified`, `runtime verified`.

Do not use `verified` without qualification when `runtime_verified` is false.
Use `static/test verified` or describe the module as static/test verified only.
