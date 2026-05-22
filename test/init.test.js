const assert = require("node:assert/strict");
const {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  hasAiSdlcAgentsInstructions,
  removeManagedBlock,
  upsertManagedBlock,
} = require("../bin/ai-sdlc.js");

const cli = resolve(__dirname, "..", "bin", "ai-sdlc.js");
const templateAgents = resolve(__dirname, "..", "templates", "cursor", "AGENTS.md");
const templateDiffAnalyzer = resolve(
  __dirname,
  "..",
  "templates",
  "cursor",
  ".cursor",
  "agents",
  "diff-analyzer.md",
);
const startMarker = "<!-- ai-sdlc:start -->";
const endMarker = "<!-- ai-sdlc:end -->";

function run(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
  });
}

function countMarkers(content) {
  return (content.match(/<!-- ai-sdlc:start -->/g) || []).length;
}

assert.equal(
  upsertManagedBlock("", "AI block"),
  `${startMarker}\nAI block\n${endMarker}\n`,
);

assert.equal(
  upsertManagedBlock("User notes\n", "AI block"),
  `User notes\n\n${startMarker}\nAI block\n${endMarker}\n`,
);

assert.equal(
  upsertManagedBlock(`User\n\n${startMarker}\nOld\n${endMarker}\n`, "New"),
  `User\n\n${startMarker}\nNew\n${endMarker}\n`,
);

assert.equal(hasAiSdlcAgentsInstructions(`${startMarker}\nBlock\n${endMarker}`), true);
assert.equal(hasAiSdlcAgentsInstructions(readFileSync(templateAgents, "utf8")), true);
assert.equal(hasAiSdlcAgentsInstructions("Project-only guidance"), false);
assert.equal(
  removeManagedBlock(`Keep\n\n${startMarker}\nBlock\n${endMarker}\n`),
  "Keep\n",
);

const dir = mkdtempSync(join(tmpdir(), "ai-sdlc-test-"));

try {
  let result = run(["doctor"], dir);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /AGENTS.md exists/);
  assert.match(result.stdout, /Run: ai-sdlc init/);

  result = run(["init"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(existsSync(join(dir, "AGENTS.md")), true);
  assert.equal(existsSync(join(dir, ".cursor", "commands", "bootstrap-ai-sdlc.md")), true);
  assert.equal(existsSync(join(dir, "docs", "pr-review-automation.md")), true);
  assert.equal(existsSync(join(dir, "docs", "knowledge-growth-automation.md")), true);
  assert.equal(existsSync(join(dir, ".cursor", "agents", "knowledge-grower.md")), true);

  let agentsContent = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.equal(countMarkers(agentsContent), 1);
  assert.match(result.stdout, /Created files: 17/);
  assert.match(result.stdout, /Updated files: 0/);
  assert.match(result.stdout, /Skipped files: 0/);

  result = run(["doctor"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /AI SDLC installation looks complete/);

  const installedDiffAnalyzer = join(dir, ".cursor", "agents", "diff-analyzer.md");
  writeFileSync(installedDiffAnalyzer, "custom agent content\n");

  result = run(["init"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  agentsContent = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.equal(countMarkers(agentsContent), 1);
  assert.equal(readFileSync(installedDiffAnalyzer, "utf8"), "custom agent content\n");
  assert.match(result.stdout, /Updated files: 1/);
  assert.match(result.stdout, /Skipped files: 16/);

  writeFileSync(join(dir, "AGENTS.md"), "Existing project guidance\n");
  result = run(["init"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  agentsContent = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.match(agentsContent, /^Existing project guidance/);
  assert.equal(countMarkers(agentsContent), 1);

  result = run(["init", "--force"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  agentsContent = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.match(agentsContent, /^Existing project guidance/);
  assert.equal(countMarkers(agentsContent), 1);
  assert.equal(
    readFileSync(installedDiffAnalyzer, "utf8"),
    readFileSync(templateDiffAnalyzer, "utf8"),
  );

  result = run(["init", "--target", "claude-code"], dir);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unsupported target/);

  result = run(["uninstall"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  agentsContent = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.equal(agentsContent, "Existing project guidance\n");
  assert.equal(existsSync(join(dir, ".cursor", "commands", "bootstrap-ai-sdlc.md")), false);
  assert.equal(existsSync(join(dir, ".cursor", "agents", "knowledge-grower.md")), false);
  assert.equal(existsSync(join(dir, "specs", "_index.md")), true);
  assert.match(result.stdout, /Removed files: 12/);

  result = run(["init"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  writeFileSync(join(dir, "specs", "_index.md"), "# Real knowledge\n");
  result = run(["uninstall", "--include-specs"], dir);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(existsSync(join(dir, "specs", "_index.md")), true);
  assert.equal(existsSync(join(dir, "specs", "_coverage.md")), false);
  assert.match(result.stdout, /Skipped specs\/_index.md \(not a template placeholder\)/);
  assert.match(result.stdout, /Removed specs\/_coverage.md/);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
