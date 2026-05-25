# Cursor Automation Setup

ai-sdlc v0.1 is a local Cursor-first toolkit. This document describes optional
manual setup ideas for Cursor Cloud or GitHub-connected Cursor Automations.

The CLI does not create automations, GitHub webhooks, GitHub Actions, or Cursor
Cloud configuration. Copy these instructions into Cursor Automation settings
only when your workspace already supports that workflow.

For Cursor Team onboarding, repository environment setup, and smoke-test
prompts, see [cursor-cloud-team-setup.md](cursor-cloud-team-setup.md).

## PR Opened Or Updated

Use this workflow when a pull request is opened, reopened, synchronized, or
updated.

Expected behavior:

1. Run `@diff-analyzer` to classify changed files and identify affected specs.
2. Run `@spec-matcher` to compare changes against known invariants.
3. Run `@test-runner` to select and execute relevant tests if the repository
   has a clear test command and the automation environment can execute it. For
   UI, browser, visual, or e2e tests, require screenshot or video artifacts when
   the framework supports them.
4. Escalate when confidence is below 80%, tests cannot run, or an invariant may
   be violated.

Copy-paste Cursor Automation instruction:

```txt
For this PR, run @diff-analyzer first.

Then run @spec-matcher for every affected spec listed by @diff-analyzer.

Then run @test-runner. If the repository has a clear test command and this
automation environment can run it, run the narrowest relevant tests for the
affected modules. For UI, browser, visual, or e2e tests, capture screenshot or
video artifacts using existing framework support. If artifacts cannot be
captured, report why and do not claim visual verification. If test setup is
unclear, do not guess; report that tests were not run.

Post a concise PR review summary with:
- changed modules
- affected specs
- invariant risks
- tests run and results
- screenshot/video artifact paths for UI or e2e tests
- confidence score
- escalation notes when confidence is below 80%

Do not modify business code in this automation. Escalate instead of guessing.
```

## PR Merged

Use this workflow after a PR has been merged.

Expected behavior:

1. Run `@knowledge-grower`.
2. Analyze the merged PR, diff, comments, and related specs.
3. Generate or update specs when the change affects critical behavior.
4. Propose e2e or regression tests when coverage gaps are clear.
5. Update `specs/_index.md` and `specs/_coverage.md`.

Copy-paste Cursor Automation instruction:

```txt
For this merged PR, run @knowledge-grower.

Analyze the PR title, description, diff, review comments, and existing specs.
Decide whether this change should create a new spec, update an existing spec,
record a decision, or only update coverage metadata.

When behavior is critical or high impact, generate or update specs with
invariants, critical paths, dependencies, and open questions.

Propose e2e or regression tests only when the repository test framework and
setup are clear. For UI, browser, visual, or e2e tests, include screenshot or
video artifact requirements when the framework supports them. If setup is
unclear, ask for review before adding tests.

Update specs/_index.md and specs/_coverage.md.

Post a summary with:
- detected module
- spec changes made or proposed
- test changes proposed
- screenshot/video artifact requirements for UI or e2e tests
- confidence score
- next recommended actions

Do not modify unrelated business code.
```

## Notes

- These are documentation templates, not implemented automation APIs.
- Do not add fake GitHub Actions for this flow unless they call real Cursor
  automation infrastructure available in your environment.
- Keep automation conservative until specs and tests are mature.
