# Knowledge Growth Automation

Manual Cursor Automation template for PR merged events.

This file is documentation only. ai-sdlc v0.1 installs it for copy-paste setup;
the CLI does not create Cursor Cloud automations or GitHub integrations.

## Workflow

1. Run `@knowledge-grower`.
2. Analyze the merged PR and affected modules.
3. Generate or update specs when behavior is critical or high impact.
4. Propose e2e or regression tests when coverage gaps are clear.
5. Update `specs/_index.md` and `specs/_coverage.md`.

## Copy-Paste Cursor Automation Instruction

```txt
For this merged PR, run @knowledge-grower.

Analyze the PR title, description, diff, review comments, and existing specs.
Classify the change as new feature, enhancement, bugfix, refactor, infra, or
docs.

For critical or high-impact behavior, generate or update specs with:
- business context
- invariants
- critical paths
- dependencies
- open questions

For bugfixes, decide whether the bug should become a new invariant and propose
a regression test when the test framework is clear.

Propose e2e tests only when the repository test framework and setup are clear.
For UI, browser, visual, or e2e tests, include screenshot or video artifact
requirements when the framework supports them. If setup is unclear, ask for
review before adding tests.

Update specs/_index.md and specs/_coverage.md.

Return a summary with:
- detected module
- generated or updated specs
- proposed e2e or regression tests
- screenshot/video artifact requirements for UI or e2e tests
- confidence score
- next recommended actions

Do not modify unrelated business code.
```

## Expected Output

- Spec changes created or proposed.
- Coverage metadata updates.
- Test proposals.
- Screenshot/video artifact requirements for UI or e2e tests.
- Confidence.
- Review requests for unclear test setup.
