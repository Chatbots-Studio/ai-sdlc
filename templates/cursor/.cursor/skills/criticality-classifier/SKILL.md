---
name: criticality-classifier
description: Classify module or change criticality from repository evidence.
---

# Criticality Classifier

## Use When

An agent needs to decide whether a change requires specs, stronger tests, human
review, or escalation.

## Inputs

- Changed files and diff.
- `specs/_index.md`.
- Existing specs and tests.
- Repository docs, package scripts, schemas, routes, permissions, and data
  models.

## Levels

- `critical`: security, authentication, authorization, money movement,
  irreversible state, legal/compliance behavior, data loss risk, or core
  revenue/user-blocking flows.
- `high`: important business rules, user data lifecycle, public APIs,
  integrations, billing-adjacent behavior, or cross-module contracts.
- `medium`: standard product behavior with limited blast radius.
- `low`: cosmetic UI, docs, comments, local developer tooling, isolated tests,
  or low-risk refactors.

## Process

1. Check whether the module is already listed in `specs/_index.md`.
2. Identify user impact and failure cost.
3. Identify reversibility and blast radius.
4. Identify security, data integrity, and compliance implications.
5. Return the level with evidence and confidence.

## Output

```json
{
  "criticality": "critical|high|medium|low",
  "reasons": ["Evidence-backed reason."],
  "recommended_action": "create_spec|update_spec|run_tests|metadata_only|escalate",
  "confidence": 0.9
}
```

When confidence is below `0.8`, recommend `escalate`.
