# Cursor Cloud Team Setup

This repository is ready for Cursor Background Agents after a Cursor Team admin
connects the GitHub repository in Cursor.

## What Is Already In This Repository

- `.cursor/environment.json` defines the remote agent install command.
- `package.json` exposes `npm test`, `ai-sdlc init`, `ai-sdlc doctor`, and
  `ai-sdlc uninstall` checks.
- `templates/cursor/` contains the Cursor agents, rules, skills, docs, and
  specs scaffold installed by `ai-sdlc init`.
- `docs/cursor-automations.md` contains copy-paste prompts for PR review and
  knowledge-growth automations.

## What A Cursor Team Admin Must Do

1. Open the Cursor Team dashboard.
2. Confirm team privacy settings and usage-based pricing.
3. Connect GitHub in Cursor integrations.
4. Grant Cursor read/write access to `Chatbots-Studio/ai-sdlc`.
5. If the GitHub organization uses an IP allowlist, add Cursor Background Agent
   access according to Cursor's GitHub integration instructions.
6. In Cursor Background Agents settings, use:
   - repository: `Chatbots-Studio/ai-sdlc`
   - base branch: `main`
   - environment: repository `.cursor/environment.json`
7. Optional: install the Cursor Slack app and set the default repository to
   `Chatbots-Studio/ai-sdlc`.

## Smoke Test Prompt

Run this as the first Cursor Background Agent task:

```txt
Check whether this repository is ready for ai-sdlc package testing.

Do not change business logic.

Run:
- npm install
- npm test
- node bin/ai-sdlc.js doctor

Then create a short report that includes:
- commands run
- exit codes
- whether .cursor/environment.json was used
- whether ai-sdlc templates include test-runner visual artifact requirements
- any blockers for Cursor Team usage
```

Expected result:

- Agent starts from `main`.
- Dependencies install with `npm install`.
- `npm test` passes.
- `doctor` may report missing installed project assets when run directly in this
  package repository. That is acceptable unless the agent first runs
  `node bin/ai-sdlc.js init` in a temporary target repository.
- Agent summary mentions that UI/e2e tests require screenshot or video
  artifacts when the existing framework supports them.

## Optional End-To-End Package Test Prompt

Use this after the smoke test succeeds:

```txt
Test ai-sdlc installation in a temporary target repository.

Do not modify source package files unless a real bug is found.

Steps:
- create a temp directory outside this repo
- run node /path/to/this/repo/bin/ai-sdlc.js init in that temp directory
- run node /path/to/this/repo/bin/ai-sdlc.js doctor in that temp directory
- run init again and confirm it is idempotent
- run uninstall and confirm managed files are removed

Report commands, exit codes, files created, files skipped, and any blockers.
```

## Current Limitations

- The CLI does not create Cursor Team settings, GitHub webhooks, Slack
  integrations, or Cursor automations.
- Cursor Team connection must be done by a user with Team and GitHub
  integration permissions.
- Slack integration is optional. It is useful only if the team wants to launch
  Background Agents from Slack with `@Cursor`.
