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

Use `low` for demos, generated archetype code, isolated CLI samples, comments,
or tooling with no durable product contract.

Use `medium` only when behavior is user-visible or expected to remain stable.

Use `high` or `critical` only for auth, money, user data, security, critical
business rules, external side effects, or production-impacting flows.

## Process

1. Check whether the module is already listed in `specs/_index.md`.
2. Identify user impact and failure cost.
3. Identify reversibility and blast radius.
4. Identify security, data integrity, and compliance implications.
5. Return the level with evidence and confidence.

## NestJS Auth/Security Checklist

For NestJS auth/security modules, inspect these paths when present:

- controllers
- services
- modules
- strategies
- guards
- interceptors
- serializers
- DTOs
- decorators
- entities
- migrations
- factories
- seeders
- e2e tests

Imported entities or providers should either be included in `source_paths` or
explicitly listed in `skipped_paths` / `out_of_scope_paths` by the
spec-generator.

## Output

```json
{
  "module": "name",
  "source_paths": ["path"],
  "criticality": "critical|high|medium|low",
  "reasons": ["Evidence-backed reason."],
  "negative_evidence": ["Why higher levels do not apply."],
  "confidence": 0.9,
  "recommended_action": "create_spec|update_spec|run_tests|metadata_only|escalate"
}
```

When confidence is below `0.8`, recommend `escalate`.
