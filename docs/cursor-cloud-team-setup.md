# Cursor Cloud Team Setup

This repository is a Cursor plugin marketplace. Install the `ai-sdlc` plugin
from a team marketplace or locally. There is no copy step into your project.

## What Is Already In This Repository

- `plugins/ai-sdlc/agents/` — the AI SDLC agents (diff-analyzer, spec-matcher,
  test-runner, self-healer, knowledge-grower).
- `plugins/ai-sdlc/skills/` — supporting skills (spec-generator, e2e-generator,
  kb-indexer, criticality-classifier).
- `plugins/ai-sdlc/rules/` — always-on rules for the AI SDLC workflow.
- `plugins/ai-sdlc/commands/bootstrap-ai-sdlc.md` — bootstrap command for a new repo.
- `.cursor-plugin/marketplace.json` — marketplace manifest for team distribution.
- `AGENTS.md` — agent operating instructions and confidence rules.
- `specs/` — living knowledge base scaffold (`_index.md`, `_coverage.md`).
- `docs/cursor-automations.md` — copy-paste prompts for PR review and
  knowledge-growth automations.

## How To Use It

1. Add this repository as a team marketplace (Dashboard → Settings → Plugins →
   Import from Repo).
2. Install the `ai-sdlc` plugin from **Customize** in Cursor.
3. Open your target project and invoke agents or run `bootstrap-ai-sdlc`.

The pack is project-agnostic; the examples in the specs and agent output must be
replaced with the real modules of the target repository.

## What A Cursor Team Admin Must Do

1. Open the Cursor Team dashboard.
2. Confirm team privacy settings and usage-based pricing.
3. Connect GitHub in Cursor integrations.
4. Add a team marketplace from `Chatbots-Studio/ai-sdlc` (Import from Repo).
5. Assign the `ai-sdlc` plugin to the appropriate distribution groups.
6. If the GitHub organization uses an IP allowlist, add Cursor Background Agent
   access according to Cursor's GitHub integration instructions.
7. Optional: install the Cursor Slack app to launch Background Agents from Slack.

## Smoke Test Prompt

Run this in a target project after installing the plugin:

```txt
Use the ai-sdlc plugin on this repository.

Do not change business logic.

Steps:
- run @diff-analyzer on the current diff
- run @spec-matcher for any affected specs
- run @test-runner for relevant tests

Then create a short report that includes:
- which agents and skills were available
- commands run and exit codes
- whether UI/e2e tests produced screenshot or video artifacts
- any blockers for Cursor Team usage
```

Expected result:

- The ai-sdlc agents and skills are discoverable from the installed plugin.
- The agent summary mentions that UI/e2e tests require screenshot or video
  artifacts when the existing framework supports them.

## Current Limitations

- The pack does not create Cursor Team settings, GitHub webhooks, Slack
  integrations, or Cursor automations.
- Cursor Team connection must be done by a user with Team and GitHub
  integration permissions.
- Slack integration is optional. It is useful only if the team wants to launch
  Background Agents from Slack with `@Cursor`.
