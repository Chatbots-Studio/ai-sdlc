# ai-sdlc

A Cursor plugin marketplace for a **Self-Healing AI-Driven SDLC**.

Install the plugin from a team marketplace or locally. Agents, skills, rules,
and commands become available in your projects without copying files into your
repository.

🇺🇦 [Читати українською](README.ua.md)

## What Is ai-sdlc?

`ai-sdlc` adds a repeatable AI engineering workflow on top of any repository.

The idea: the repository itself is the source of truth. Cursor agents review
changes against repository-owned specs, grow those specs over time, propose
tests for critical behavior, run the right tests, and escalate when confidence
is low instead of guessing.

## Install

### Team marketplace

1. Go to **Dashboard → Settings → Plugins → Team Marketplaces → Add Marketplace**.
2. Choose **Import from Repo** and point to `Chatbots-Studio/ai-sdlc`.
3. Add the `ai-sdlc` plugin to the marketplace and assign team access.
4. Developers install the plugin from **Customize** in Cursor.

See [Cursor team marketplaces docs](https://cursor.com/docs/plugins#team-marketplaces).

### Local test

```bash
ln -s /path/to/ai-sdlc/plugins/ai-sdlc ~/.cursor/plugins/local/ai-sdlc
```

Reload Cursor and verify components in **Customize**.

## How To Use It

1. Install the `ai-sdlc` plugin (see above).
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

## Agents vs Skills

**Agents** are autonomous workflows invoked with `@name`. They orchestrate
review, testing, and knowledge growth.

Located in `plugins/ai-sdlc/agents/`.

| Agent | When to use | What it does |
| --- | --- | --- |
| `@diff-analyzer` | Start of any review | Parses the diff, classifies changed files, maps them to affected specs and modules. Read-only. |
| `@spec-matcher` | After diff-analyzer | Checks the diff against known spec invariants and critical paths, flags violations. Read-only. |
| `@test-runner` | When tests are needed | Selects the narrowest useful tests and runs them only when the command and runtime are clear. Requires screenshot/video artifacts for UI/browser/e2e tests, or states why they are impossible. |
| `@self-healer` | When tests fail | Conservatively diagnoses failures and applies only high-confidence fixes. Max 3 attempts, escalates below 80% confidence, never auto-fixes risky business logic. |
| `@knowledge-grower` | After a PR is merged | The primary agent. Decides whether the change needs a new spec, a spec update, new regression coverage, or only coverage metadata — this is what makes the repo smarter over time. |

**Skills** are focused subtasks used by agents (or invoked with `/skill-name`).
Each skill lives in `plugins/ai-sdlc/skills/<name>/SKILL.md`.

| Skill | Use when |
| --- | --- |
| `spec-generator` | A new spec or spec update is needed for behavior that must stay stable. |
| `e2e-generator` | A critical path has no test coverage, or a bugfix should become a regression test. |
| `criticality-classifier` | Deciding whether a change needs specs, stronger tests, human review, or escalation. |
| `kb-indexer` | Specs, tests, ownership, criticality, or coverage metadata changed and `specs/_index.md` / `specs/_coverage.md` must be updated. |

## Rules

Always-on / scoped guidance in `plugins/ai-sdlc/rules/`:

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

## Releases

Each merge into `main` triggers an automatic release:

1. Patch version is bumped in `VERSION`, `plugin.json`, and `marketplace.json`.
2. `CHANGELOG.md` is updated from commits since the previous tag.
3. Git tag `vX.Y.Z` and a GitHub Release are created.

Current version: see [`VERSION`](VERSION). History: [`CHANGELOG.md`](CHANGELOG.md).

To cut a minor or major release manually, run the **Release on main** workflow
from GitHub Actions with the desired bump type.

## Repository Layout

```txt
.cursor-plugin/marketplace.json   Marketplace manifest
plugins/ai-sdlc/
  .cursor-plugin/plugin.json     Plugin manifest
  agents/                        diff-analyzer, spec-matcher, test-runner, self-healer, knowledge-grower
  skills/                        spec-generator, e2e-generator, criticality-classifier, kb-indexer
  rules/                         ai-sdlc-core, specs-conventions, test-conventions
  commands/                      bootstrap-ai-sdlc
VERSION                          Single source of truth for release version
CHANGELOG.md                     Release history
.github/workflows/               CI and release automation
AGENTS.md                        Agent operating instructions and confidence rules
specs/                           _index.md, _coverage.md knowledge-base scaffold
docs/                            setup and automation documentation
```

## Roadmap

- Cursor Cloud automation setup flow.
- GitHub automation templates.
- Multi-agent support for Claude Code, Codex, Windsurf, and other environments.

## Blueprint

Based on the broader
[Self-Healing AI-Driven SDLC blueprint](self-healing-sdlc-blueprint.md).
