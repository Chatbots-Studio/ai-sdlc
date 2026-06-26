# AI SDLC (Self-Healing)

Cursor plugin for a **Self-Healing AI-Driven SDLC**. The repository is the
source of truth: agents review changes against specs, grow the knowledge base,
run the right tests, and escalate when confidence is low.

## Install

Install from the team marketplace or locally:

1. **Team marketplace**: Dashboard → Settings → Plugins → Add Marketplace →
   Import from Repo → point to this repository.
2. **Local test**: symlink to `~/.cursor/plugins/local/ai-sdlc` and reload
   Cursor.

## Agents vs Skills

**Agents** are autonomous workflows you invoke with `@name`. They orchestrate
review, testing, and knowledge growth.

| Agent | Purpose |
| --- | --- |
| `@diff-analyzer` | Parse the diff, classify files, map to specs (read-only) |
| `@spec-matcher` | Check diff against spec invariants and critical paths |
| `@test-runner` | Select and run the narrowest relevant tests |
| `@self-healer` | Conservatively fix failing tests (max 3 attempts) |
| `@knowledge-grower` | Grow specs and coverage after merged changes |

**Skills** are focused subtasks used by agents (or invoked with `/skill-name`).
Each skill lives in `skills/<name>/SKILL.md`.

| Skill | Purpose |
| --- | --- |
| `spec-generator` | Generate or update behavior specs from code |
| `e2e-generator` | Propose e2e or integration tests from specs |
| `criticality-classifier` | Classify module/change criticality |
| `kb-indexer` | Maintain `specs/_index.md` and `specs/_coverage.md` |

## Rules

| Rule | Scope |
| --- | --- |
| `ai-sdlc-core` | Always on — repo as source of truth |
| `specs-conventions` | Applies under `specs/` |
| `test-conventions` | Applies to test files |

## Commands

| Command | Purpose |
| --- | --- |
| `bootstrap-ai-sdlc` | Seed the specs knowledge base in a new repo |

## Bootstrap

Run once in a target project:

```txt
bootstrap-ai-sdlc
```

Creates 1–3 seed specs, updates `specs/_index.md` and `specs/_coverage.md`,
without modifying business code.

## Component Layout

```txt
agents/       diff-analyzer, spec-matcher, test-runner, self-healer, knowledge-grower
skills/       spec-generator, e2e-generator, criticality-classifier, kb-indexer
rules/        ai-sdlc-core, specs-conventions, test-conventions
commands/     bootstrap-ai-sdlc
```
