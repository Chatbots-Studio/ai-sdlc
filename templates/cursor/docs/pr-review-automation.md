# PR Review Automation

Manual Cursor Automation template for PR opened or updated events.

This file is documentation only. ai-sdlc v0.1 installs it for copy-paste setup;
the CLI does not create Cursor Cloud automations or GitHub integrations.

## Workflow

1. Run `@diff-analyzer`.
2. Run `@spec-matcher` for affected specs.
3. Run `@test-runner` to select and run tests if a clear test command is
   configured and available.
4. Escalate when confidence is low or behavior is unclear.

## Copy-Paste Cursor Automation Instruction

```txt
For this PR, run @diff-analyzer first.

Use its output to identify affected modules, changed files, risk level, and
affected specs.

Then run @spec-matcher for every affected spec. Check whether the diff violates
or weakens any invariant, critical path, or documented decision.

Then run @test-runner. If this repository has a clear test command and the
automation environment can run it, run the narrowest relevant tests for affected
modules. If test setup is unclear, do not guess and do not invent commands.

Return a PR review summary with:
- changed modules
- affected specs
- invariant checks
- tests run and results
- confidence score
- escalation notes

Escalate when confidence is below 80%, when tests cannot run, or when an
invariant may be violated.

Do not modify business code in this automation.
```

## Expected Output

- Risk level.
- Affected specs.
- Invariant status.
- Test status.
- Confidence.
- Clear escalation when needed.
