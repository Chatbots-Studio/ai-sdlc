#!/usr/bin/env node

const {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} = require("node:fs");
const { dirname, join, relative } = require("node:path");

const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const managedBlockStart = "<!-- ai-sdlc:start -->";
const managedBlockEnd = "<!-- ai-sdlc:end -->";

function printHelp() {
  console.log(`ai-sdlc

Usage:
  ai-sdlc init [options]     Initialize AI SDLC assets for a project
  ai-sdlc doctor             Check whether AI SDLC is installed
  ai-sdlc uninstall [options] Remove installed AI SDLC template files
  ai-sdlc version            Print the ai-sdlc CLI version
  ai-sdlc --help             Show this help message

Options:
  --target cursor            Install templates for Cursor (default)
  --force                    Overwrite existing files
  --include-specs            Also remove placeholder specs index files
`);
}

const managedTemplateFiles = [
  ".cursor/commands/bootstrap-ai-sdlc.md",
  ".cursor/agents/diff-analyzer.md",
  ".cursor/agents/spec-matcher.md",
  ".cursor/agents/self-healer.md",
  ".cursor/agents/knowledge-grower.md",
  ".cursor/skills/spec-generator/SKILL.md",
  ".cursor/skills/e2e-generator/SKILL.md",
  ".cursor/skills/criticality-classifier/SKILL.md",
  ".cursor/skills/kb-indexer/SKILL.md",
  ".cursor/rules/ai-sdlc-core.mdc",
  ".cursor/rules/specs-conventions.mdc",
  ".cursor/rules/test-conventions.mdc",
];

const placeholderSpecFiles = [
  "specs/_index.md",
  "specs/_coverage.md",
];

function parseInitArgs(args) {
  const options = {
    force: false,
    target: "cursor",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--target") {
      const target = args[index + 1];
      if (!target || target.startsWith("-")) {
        throw new Error("Missing value for --target. Supported target: cursor.");
      }

      options.target = target;
      index += 1;
      continue;
    }

    if (arg.startsWith("--target=")) {
      options.target = arg.slice("--target=".length);
      continue;
    }

    throw new Error(`Unknown init option: ${arg}`);
  }

  return options;
}

function listFiles(rootDir) {
  const entries = readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function copyTemplateFile(sourceFile, sourceRoot, targetRoot, force) {
  const relativePath = relative(sourceRoot, sourceFile);
  const targetFile = join(targetRoot, relativePath);

  if (relativePath === "AGENTS.md") {
    return installAgentsFile(sourceFile, targetFile);
  }

  if (existsSync(targetFile) && !force) {
    console.warn(`Warning: skipped existing file ${relativePath}`);
    return "skipped";
  }

  mkdirSync(dirname(targetFile), { recursive: true });
  cpSync(sourceFile, targetFile, { force: true });
  return "created";
}

function upsertManagedBlock(existingContent, blockContent) {
  const managedBlock = `${managedBlockStart}\n${blockContent.trim()}\n${managedBlockEnd}`;
  const blockPattern = new RegExp(
    `${escapeRegExp(managedBlockStart)}[\\s\\S]*?${escapeRegExp(managedBlockEnd)}`,
    "m",
  );

  if (blockPattern.test(existingContent)) {
    const existingBlock = existingContent.match(blockPattern)[0];
    return existingBlock === managedBlock
      ? existingContent
      : existingContent.replace(blockPattern, managedBlock);
  }

  if (existingContent.length === 0) {
    return `${managedBlock}\n`;
  }

  const separator = existingContent.endsWith("\n") ? "\n" : "\n\n";
  return `${existingContent}${separator}${managedBlock}\n`;
}

function removeManagedBlock(existingContent) {
  const blockPattern = new RegExp(
    `\\n*${escapeRegExp(managedBlockStart)}[\\s\\S]*?${escapeRegExp(managedBlockEnd)}\\n*`,
    "m",
  );

  return existingContent.replace(blockPattern, (match) => {
    const startsWithNewline = match.startsWith("\n");
    const endsWithNewline = match.endsWith("\n");
    return startsWithNewline && endsWithNewline ? "\n" : "";
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function installAgentsFile(sourceFile, targetFile) {
  const blockContent = readFileSync(sourceFile, "utf8");
  mkdirSync(dirname(targetFile), { recursive: true });

  if (!existsSync(targetFile)) {
    writeFileSync(targetFile, upsertManagedBlock("", blockContent));
    return "created";
  }

  const existingContent = readFileSync(targetFile, "utf8");
  const nextContent = upsertManagedBlock(existingContent, blockContent);

  if (nextContent === existingContent) {
    return "skipped";
  }

  writeFileSync(targetFile, nextContent);
  return "updated";
}

function hasAiSdlcAgentsInstructions(content) {
  return (
    content.includes(managedBlockStart) &&
    content.includes(managedBlockEnd)
  ) || content.includes("# AI SDLC Agent Instructions");
}

function doctor() {
  const checks = [
    {
      label: "AGENTS.md exists",
      path: "AGENTS.md",
      check: (root) => existsSync(join(root, "AGENTS.md")),
    },
    {
      label: "AGENTS.md contains ai-sdlc instructions",
      check: (root) => {
        const agentsPath = join(root, "AGENTS.md");
        return existsSync(agentsPath) && hasAiSdlcAgentsInstructions(readFileSync(agentsPath, "utf8"));
      },
    },
    {
      label: ".cursor/agents exists",
      path: ".cursor/agents",
      type: "directory",
    },
    {
      label: "command: bootstrap-ai-sdlc.md",
      path: ".cursor/commands/bootstrap-ai-sdlc.md",
    },
    {
      label: "agent: diff-analyzer.md",
      path: ".cursor/agents/diff-analyzer.md",
    },
    {
      label: "agent: spec-matcher.md",
      path: ".cursor/agents/spec-matcher.md",
    },
    {
      label: "agent: self-healer.md",
      path: ".cursor/agents/self-healer.md",
    },
    {
      label: "agent: knowledge-grower.md",
      path: ".cursor/agents/knowledge-grower.md",
    },
    {
      label: "skill: spec-generator",
      path: ".cursor/skills/spec-generator/SKILL.md",
    },
    {
      label: "skill: e2e-generator",
      path: ".cursor/skills/e2e-generator/SKILL.md",
    },
    {
      label: "skill: criticality-classifier",
      path: ".cursor/skills/criticality-classifier/SKILL.md",
    },
    {
      label: "skill: kb-indexer",
      path: ".cursor/skills/kb-indexer/SKILL.md",
    },
    {
      label: ".cursor/rules exists",
      path: ".cursor/rules",
      type: "directory",
    },
    {
      label: "specs/_index.md exists",
      path: "specs/_index.md",
    },
    {
      label: "specs/_coverage.md exists",
      path: "specs/_coverage.md",
    },
  ];
  const root = process.cwd();
  let missing = 0;

  console.log("ai-sdlc doctor");
  console.log("");

  for (const item of checks) {
    const ok = typeof item.check === "function" ? item.check(root) : checkPath(root, item.path, item.type);
    console.log(`${ok ? "[ok]" : "[missing]"} ${item.label}`);

    if (!ok) {
      missing += 1;
    }
  }

  console.log("");

  if (missing === 0) {
    console.log("AI SDLC installation looks complete.");
    return;
  }

  console.log(`AI SDLC installation is incomplete: ${missing} check(s) failed.`);
  console.log("Run: ai-sdlc init");
  process.exitCode = 1;
}

function parseUninstallArgs(args) {
  const options = {
    includeSpecs: false,
  };

  for (const arg of args) {
    if (arg === "--include-specs") {
      options.includeSpecs = true;
      continue;
    }

    throw new Error(`Unknown uninstall option: ${arg}`);
  }

  return options;
}

function uninstall(args) {
  let options;

  try {
    options = parseUninstallArgs(args);
  } catch (error) {
    console.error(error.message);
    console.error("Run ai-sdlc uninstall or ai-sdlc uninstall --include-specs.");
    process.exitCode = 1;
    return;
  }

  const root = process.cwd();
  let removed = 0;
  let updated = 0;
  let skipped = 0;

  const agentsResult = uninstallAgentsFile(join(root, "AGENTS.md"));
  if (agentsResult === "updated") {
    updated += 1;
  } else {
    skipped += 1;
  }

  for (const targetPath of managedTemplateFiles) {
    if (removeFileIfExists(join(root, targetPath))) {
      console.log(`Removed ${targetPath}`);
      removed += 1;
    } else {
      console.log(`Skipped missing ${targetPath}`);
      skipped += 1;
    }
  }

  if (options.includeSpecs) {
    for (const targetPath of placeholderSpecFiles) {
      const result = removePlaceholderSpec(root, targetPath);
      if (result === "removed") {
        removed += 1;
      } else {
        skipped += 1;
      }
    }
  } else {
    for (const targetPath of placeholderSpecFiles) {
      console.log(`Skipped ${targetPath} (specs are preserved by default)`);
      skipped += 1;
    }
  }

  console.log("");
  console.log("ai-sdlc uninstall complete.");
  console.log(`Removed files: ${removed}`);
  console.log(`Updated files: ${updated}`);
  console.log(`Skipped files: ${skipped}`);
}

function uninstallAgentsFile(agentsPath) {
  if (!existsSync(agentsPath)) {
    console.log("Skipped missing AGENTS.md");
    return "skipped";
  }

  const existingContent = readFileSync(agentsPath, "utf8");
  const nextContent = removeManagedBlock(existingContent);

  if (nextContent === existingContent) {
    console.log("Skipped AGENTS.md (no ai-sdlc managed block)");
    return "skipped";
  }

  if (nextContent.trim().length === 0) {
    rmSync(agentsPath);
    console.log("Removed AGENTS.md");
    return "updated";
  }

  writeFileSync(agentsPath, nextContent);
  console.log("Updated AGENTS.md (removed ai-sdlc managed block)");
  return "updated";
}

function removeFileIfExists(targetPath) {
  if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
    return false;
  }

  rmSync(targetPath);
  return true;
}

function removePlaceholderSpec(root, targetPath) {
  const targetFile = join(root, targetPath);

  if (!existsSync(targetFile) || !statSync(targetFile).isFile()) {
    console.log(`Skipped missing ${targetPath}`);
    return "skipped";
  }

  if (!isPlaceholderSpecFile(targetFile, targetPath)) {
    console.log(`Skipped ${targetPath} (not a template placeholder)`);
    return "skipped";
  }

  rmSync(targetFile);
  console.log(`Removed ${targetPath}`);
  return "removed";
}

function isPlaceholderSpecFile(targetFile, targetPath) {
  const templateFile = join(__dirname, "..", "templates", "cursor", targetPath);

  if (!existsSync(templateFile)) {
    return false;
  }

  return readFileSync(targetFile, "utf8") === readFileSync(templateFile, "utf8");
}

function checkPath(root, targetPath, type = "file") {
  const fullPath = join(root, targetPath);

  if (!existsSync(fullPath)) {
    return false;
  }

  const stats = statSync(fullPath);
  return type === "directory" ? stats.isDirectory() : stats.isFile();
}

function init(args) {
  let options;

  try {
    options = parseInitArgs(args);
  } catch (error) {
    console.error(error.message);
    console.error("Run ai-sdlc init --target cursor or ai-sdlc --help for usage.");
    process.exitCode = 1;
    return;
  }

  if (options.target !== "cursor") {
    console.error(`Unsupported target: ${options.target}`);
    console.error("Only the 'cursor' target is supported for now.");
    process.exitCode = 1;
    return;
  }

  const templateRoot = join(__dirname, "..", "templates", options.target);

  if (!existsSync(templateRoot) || !statSync(templateRoot).isDirectory()) {
    console.error(`Template directory not found: ${templateRoot}`);
    process.exitCode = 1;
    return;
  }

  const targetRoot = process.cwd();
  const templateFiles = listFiles(templateRoot);
  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const sourceFile of templateFiles) {
    const result = copyTemplateFile(sourceFile, templateRoot, targetRoot, options.force);

    if (result === "created") {
      created += 1;
    } else if (result === "updated") {
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  console.log("ai-sdlc init complete.");
  console.log(`Target: ${options.target}`);
  console.log(`Created files: ${created}`);
  console.log(`Updated files: ${updated}`);
  console.log(`Skipped files: ${skipped}`);
  console.log("");
  console.log("Next steps:");
  console.log("1. Review AGENTS.md and Cursor rules for project-specific context.");
  console.log("2. Open Cursor and ask @knowledge-grower to bootstrap this repository.");
  console.log("3. Replace example specs rows with real modules as knowledge grows.");
}

function main(argv) {
  const [command] = argv;

  if (!command || command === "--help" || command === "-h" || command === "help") {
    printHelp();
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    console.log(packageJson.version);
    return;
  }

  if (command === "init") {
    init(argv.slice(1));
    return;
  }

  if (command === "doctor") {
    doctor();
    return;
  }

  if (command === "uninstall") {
    uninstall(argv.slice(1));
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error("Run ai-sdlc --help for usage.");
  process.exitCode = 1;
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = {
  hasAiSdlcAgentsInstructions,
  removeManagedBlock,
  upsertManagedBlock,
};
