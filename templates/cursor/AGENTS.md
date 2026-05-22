# AI SDLC Agent Instructions

## Source Of Truth

This repository is the source of truth for product behavior: code, specs,
tests, and recorded decisions must stay aligned.

`specs/` is the living knowledge base. It describes critical modules,
invariants, critical paths, linked tests, owners, and decision history.

Always read `specs/_index.md` before analyzing a change. Use it to discover
known modules, source paths, spec locations, criticality, owners, and linked
tests.

Before trusting generated specs, verify that each affected module row maps to
real source paths in the repository. Treat draft specs as advisory until they
are reviewed by a module owner.

## Core Workflows

### PR Review

1. Run `@diff-analyzer` to classify changed files and affected modules.
2. Compare changed files against both the `Spec` and `Source Paths` columns in
   `specs/_index.md`.
3. Run `@spec-matcher` for all affected specs listed in `specs/_index.md`.
4. If source paths are missing, inspect repository structure before concluding
   that no spec applies.
5. Run relevant tests from the matched specs and local test conventions.
6. If tests fail, use `@self-healer` only for conservative fixes.
7. Escalate when confidence is low or business logic is risky.

### Knowledge Growth

Every merged PR should be reviewed by `@knowledge-grower`.

`@knowledge-grower` decides whether the PR requires a new spec, a spec update,
new regression coverage, or only coverage metadata updates. This workflow is
the main mechanism that makes the repository smarter over time.

## Confidence Rules

- Confidence `>= 90%`: proceed and summarize evidence.
- Confidence `80-89%`: proceed only when changes are low risk; request review.
- Confidence `< 80%`: stop and escalate with context.
- Never guess about business behavior. Prefer a clear escalation over a hidden
  assumption.

## Escalation

When escalating, include:

- What changed.
- Which spec, invariant, or critical path may be affected.
- What tests ran and their results.
- What was attempted.
- Why confidence is below threshold.
- The recommended next action.

Tag owners from spec frontmatter when available.

## Template Notes

This AI SDLC package is project-agnostic. Examples in specs or agent output are
examples only and must be replaced with real modules from the target repository.
