# ai-sdlc

A Cursor-first pack for a **Self-Healing AI-Driven SDLC**.

This repository is read-only. Attach it in Cursor and the agents, skills,
rules, and commands become available in your projects. There is **no install
step** — nothing is copied into your repository.

🇺🇦 [Читати українською](README.ua.md)

## What Is ai-sdlc?

`ai-sdlc` adds a repeatable AI engineering workflow on top of any repository.

The idea: the repository itself is the source of truth. Cursor agents review
changes against repository-owned specs, grow those specs over time, propose
tests for critical behavior, run the right tests, and escalate when confidence
is low instead of guessing.

## How To Use It

1. In Cursor, attach this repository (`Chatbots-Studio/ai-sdlc`).
2. Open your target project.
3. Run the bootstrap command once to seed specs (see below).
4. Invoke the agents (`@diff-analyzer`, `@spec-matcher`, `@test-runner`, …) on
   your changes.

Team / Background Agent setup is in
[docs/cursor-cloud-team-setup.md](docs/cursor-cloud-team-setup.md).

## Bootstrap

Run the bootstrap command in a new repository:

```txt
bootstrap-ai-sdlc
```

It asks Cursor to scan the repository, build a module map, pick 1-3 critical
seed modules, create initial specs, and update `specs/_index.md` and
`specs/_coverage.md` — without touching business code. It only proposes e2e
tests when the test framework and startup flow are clear; otherwise it records
TODO coverage notes.

## Agents

Located in `.cursor/agents/`. Invoke with `@name`.

| Agent | When to use | What it does |
| --- | --- | --- |
| `@diff-analyzer` | Start of any review | Parses the diff, classifies changed files, maps them to affected specs and modules. Read-only. |
| `@spec-matcher` | After diff-analyzer | Checks the diff against known spec invariants and critical paths, flags violations. Read-only. |
| `@test-runner` | When tests are needed | Selects the narrowest useful tests and runs them only when the command and runtime are clear. Requires screenshot/video artifacts for UI/browser/e2e tests, or states why they are impossible. |
| `@self-healer` | When tests fail | Conservatively diagnoses failures and applies only high-confidence fixes. Max 3 attempts, escalates below 80% confidence, never auto-fixes risky business logic. |
| `@knowledge-grower` | After a PR is merged | The primary agent. Decides whether the change needs a new spec, a spec update, new regression coverage, or only coverage metadata — this is what makes the repo smarter over time. |

## Skills

Located in `.cursor/skills/`. Used by the agents (or directly) for focused
subtasks.

| Skill | Use when |
| --- | --- |
| `spec-generator` | A new spec or spec update is needed for behavior that must stay stable. |
| `e2e-generator` | A critical path has no test coverage, or a bugfix should become a regression test. |
| `criticality-classifier` | Deciding whether a change needs specs, stronger tests, human review, or escalation. |
| `kb-indexer` | Specs, tests, ownership, criticality, or coverage metadata changed and `specs/_index.md` / `specs/_coverage.md` must be updated. |

## Rules

Always-on / scoped guidance in `.cursor/rules/`:

- `ai-sdlc-core.mdc` — core behavior; repo is the source of truth (always on).
- `specs-conventions.mdc` — how specs are written (applies under `specs/`).
- `test-conventions.mdc` — how generated tests are written (applies to test files).

## Core Concepts

- **Repo as source of truth** — code, specs, tests, and decisions live in the
  repository so an agent can reason about behavior.
- **Living specs** — `specs/` is a knowledge base, not static docs: critical
  modules, invariants, critical paths, owners, linked tests, open questions.
- **Spec-aware review** — `@diff-analyzer` → `@spec-matcher` → `@test-runner`.
- **Self-healing tests** — `@self-healer` proposes conservative fixes only.
- **Confidence-driven escalation** — agents proceed on strong evidence and
  escalate with context otherwise. See thresholds in [AGENTS.md](AGENTS.md).

## Repository Layout

```txt
AGENTS.md                 Agent operating instructions and confidence rules
.cursor/
  agents/                 diff-analyzer, spec-matcher, test-runner, self-healer, knowledge-grower
  skills/                 spec-generator, e2e-generator, criticality-classifier, kb-indexer
  rules/                  ai-sdlc-core, specs-conventions, test-conventions
  commands/               bootstrap-ai-sdlc
specs/                    _index.md, _coverage.md knowledge-base scaffold
docs/                     setup and automation documentation
```

## Roadmap

- Cursor Cloud automation setup flow.
- GitHub automation templates.
- Multi-agent support for Claude Code, Codex, Windsurf, and other environments.
- Marketplace-ready distribution.

## Blueprint

Based on the broader
[Self-Healing AI-Driven SDLC blueprint](self-healing-sdlc-blueprint.md).
