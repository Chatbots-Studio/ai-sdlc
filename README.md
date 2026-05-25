# ai-sdlc

Installable Cursor-first toolkit for Self-Healing AI-Driven SDLC.

v0.1 installs local Cursor assets into a repository: agents, skills, rules,
commands, and specs templates. It does not provide automatic Cursor Cloud,
GitHub, or marketplace integration yet.

## What Is ai-sdlc?

`ai-sdlc` adds a repeatable AI engineering workflow to any repository.

The goal is to help Cursor agents review changes against repository-owned
specs, grow those specs over time, propose tests for critical behavior, and
escalate when confidence is low.

In v0.1, the product is a local Cursor toolkit and bootstrap workflow:

```bash
ai-sdlc init
```

After installation, Cursor has project instructions, specialized agents,
reusable skills, rules, a bootstrap command, and a `specs/` scaffold.

## What It Installs

- `AGENTS.md` instructions for AI SDLC behavior.
- Cursor agents for diff analysis, spec matching, self-healing, and knowledge
  growth.
- Cursor skills for spec generation, e2e test generation, criticality
  classification, and knowledge base indexing.
- Cursor rules for core behavior, specs conventions, and test conventions.
- A Cursor command for bootstrapping the first repository specs.
- `specs/_index.md` and `specs/_coverage.md` starter files.
- Optional manual Cursor/GitHub automation documentation templates.

## Quick Start

From this package repository:

```bash
npm install
node bin/ai-sdlc.js --help
node bin/ai-sdlc.js init
node bin/ai-sdlc.js doctor
```

From an installed package later:

```bash
npx ai-sdlc init
npx ai-sdlc doctor
```

By default, `init` installs Cursor templates into the current working
directory and does not overwrite existing user files.

## Cursor Usage

After running `ai-sdlc init`, open the target repository in Cursor.

Run the installed bootstrap command:

```txt
bootstrap-ai-sdlc
```

The prompt lives at:

```txt
.cursor/commands/bootstrap-ai-sdlc.md
```

It asks Cursor to analyze the repository, choose 1-3 critical seed modules,
create initial specs, update `specs/_index.md`, update `specs/_coverage.md`,
and avoid business-code changes.

If the test framework is unclear, the bootstrap prompt asks for review before
adding e2e tests.

Optional manual Cursor Cloud and GitHub-connected automation setup is described
in [docs/cursor-automations.md](docs/cursor-automations.md). v0.1 does not
create automations through the CLI.

## Commands

### `ai-sdlc init`

Installs the Cursor toolkit into the current directory.

```bash
node bin/ai-sdlc.js init
node bin/ai-sdlc.js init --target cursor
node bin/ai-sdlc.js init --force
```

Only `cursor` is supported in v0.1. Other targets fail with a clean error.

`--force` overwrites regular managed template files, but `AGENTS.md` is still
handled safely through a managed block.

### `ai-sdlc doctor`

Checks whether ai-sdlc appears to be installed correctly.

```bash
node bin/ai-sdlc.js doctor
```

It verifies `AGENTS.md`, Cursor agents, skills, rules, the bootstrap command,
and specs scaffold. It exits with code `0` when complete and code `1` when
something is missing.

### `ai-sdlc uninstall`

Removes managed ai-sdlc Cursor files.

```bash
node bin/ai-sdlc.js uninstall
node bin/ai-sdlc.js uninstall --include-specs
```

Default uninstall removes installed commands, agents, skills, and rules. It
removes only the managed ai-sdlc block from `AGENTS.md`.

`specs/` is preserved by default. `--include-specs` removes only
`specs/_index.md` and `specs/_coverage.md` when they still match the original
placeholder templates.

## Installed File Structure

```txt
AGENTS.md
.cursor/
  commands/
    bootstrap-ai-sdlc.md
  agents/
    diff-analyzer.md
    spec-matcher.md
    self-healer.md
    knowledge-grower.md
  skills/
    spec-generator/SKILL.md
    e2e-generator/SKILL.md
    criticality-classifier/SKILL.md
    kb-indexer/SKILL.md
  rules/
    ai-sdlc-core.mdc
    specs-conventions.mdc
    test-conventions.mdc
docs/
  pr-review-automation.md
  knowledge-growth-automation.md
specs/
  _index.md
  _coverage.md
```

## Core Concepts

### Repo As Source Of Truth

The repository should contain the code, specs, tests, and decisions needed for
an AI agent to reason about behavior.

### Living Specs

`specs/` is a knowledge base, not static documentation. Specs should describe
critical modules, invariants, critical paths, owners, linked tests, and open
questions.

### Knowledge Grower

`@knowledge-grower` is the main agent. It analyzes merged or reviewed work and
decides whether to create specs, update specs, record decisions, or flag test
coverage gaps.

### Spec-Aware PR Review

`@diff-analyzer` identifies affected modules. `@spec-matcher` checks changes
against known specs and invariants. In v0.1 this is installed as local Cursor
agent guidance, not as an automatic PR trigger.

### Self-Healing Tests

`@self-healer` is conservative. It can diagnose failing tests and propose small
fixes, but it should not auto-change risky business logic or weaken assertions.

### Confidence-Driven Escalation

Agents should proceed only when evidence is strong. Low-confidence behavior,
unclear business rules, and risky fixes should be escalated with context.

## Safety Model

- No overwrite by default for regular files.
- Existing `AGENTS.md` content is preserved.
- ai-sdlc instructions are inserted between:

```md
<!-- ai-sdlc:start -->
...
<!-- ai-sdlc:end -->
```

- Re-running `init` updates the managed block instead of duplicating it.
- `--force` still updates only the managed block in `AGENTS.md`.
- `@self-healer` is instructed to avoid risky business-logic auto-fixes.
- `specs/` is preserved on uninstall by default.

## Roadmap

- Cursor local toolkit and bootstrap workflow.
- Cursor Cloud automation documentation and setup flow.
- GitHub automation templates.
- Multi-agent support for Claude Code, Codex, Windsurf, and other environments.
- Marketplace-ready distribution.

## Blueprint

The implementation is based on the broader
[Self-Healing AI-Driven SDLC blueprint](self-healing-sdlc-blueprint.md).
