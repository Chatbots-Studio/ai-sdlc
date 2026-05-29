# Specs Coverage

This file tracks how much of the repository has AI SDLC knowledge coverage.

Use `unknown` until coverage has evidence. Do not report guessed coverage as
fact.

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
| example-module | unknown | unknown | unknown | static: path/to/source.ext:line; test: path/to/test.ext:line; test execution: none; visual artifacts: none; runtime: none | Replace example during bootstrap. | YYYY-MM-DD |

The example row is illustrative only. Replace it with real repository modules
or remove it during bootstrap.

Coverage values: `checked`, `partial`, `none`, `unknown`.

Status values: `draft`, `draft: path-accounting-warning`, `reviewed`,
`static + linked-test evidence`, `runtime verified`.

Never use `verified` unless a test command, runtime check, or reviewer action
was actually executed and recorded. Linked or inspected test files are
`test evidence` or `linked-test evidence`, not verified behavior. UI, browser,
visual, and e2e runtime evidence must include screenshot or video artifact paths
when the framework supports them.
