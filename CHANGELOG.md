# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-06-26

- refactor: restructure plugin directory and update ownership details (9a65ab9)


- docs: add release process and versioning details to README (55c7dde)
- docs: update README and add plugin marketplace structure (7bb2e24)
- docs: add Ukrainian README mirror (d86aebd)
- docs: rewrite README for direct-pull pack (edf6378)
- refactor: remove install CLI and package machinery (f07e3d3)
- refactor: move cursor assets to repo root for direct pull (570d6d1)
- docs(cursor): add cloud readiness setup (81446ea)
- feat(test-runner): require visual artifacts (fbc072e)
- feat: introduce test-runner agent for automated test selection and execution (d107384)
- fix: clarify linked test evidence (4e22678)
- fix: harden spec path accounting (4c75c54)
- test(cli): guard repeated init reporting (cc5e649)
- fix(cli): keep AGENTS init idempotent (1426667)
- test(cli): cover init overwrite behavior (b991d21)
- docs: add automation templates (6b785ae)
- docs: rewrite product README (1297ed6)
- feat(cursor): add bootstrap command (c93bffb)
- feat(cli): add uninstall command (0aa754f)
- feat(cli): add doctor command (0368da3)
- feat(cli): merge AGENTS instructions (4074ef3)
- feat(cli): install cursor templates (12723bc)
- feat(cursor): add install templates (b3b26c0)
- feat(cli): add npm package skeleton (606c70a)
- Update README.md to include detailed repository meta, installation process, and blueprint coverage for Self-Healing AI-Driven SDLC. (0d44b12)
- Add files via upload (a2f42d6)
- Initial commit (30f8e36)


### Added

- Initial Cursor plugin marketplace structure (`plugins/ai-sdlc/`).
- Marketplace manifest and plugin manifest.
- Agents, skills, rules, and bootstrap command for self-healing AI SDLC.
