#!/usr/bin/env node

const {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} = require("node:fs");
const { dirname, join, relative } = require("node:path");

const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

function printHelp() {
  console.log(`ai-sdlc

Usage:
  ai-sdlc init [options]     Initialize AI SDLC assets for a project
  ai-sdlc version            Print the ai-sdlc CLI version
  ai-sdlc --help             Show this help message

Options:
  --target cursor            Install templates for Cursor (default)
  --force                    Overwrite existing files
`);
}

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

  if (existsSync(targetFile) && !force) {
    console.warn(`Warning: skipped existing file ${relativePath}`);
    return "skipped";
  }

  mkdirSync(dirname(targetFile), { recursive: true });
  cpSync(sourceFile, targetFile, { force: true });
  return "created";
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

  for (const sourceFile of templateFiles) {
    const result = copyTemplateFile(sourceFile, templateRoot, targetRoot, options.force);

    if (result === "created") {
      created += 1;
    } else {
      skipped += 1;
    }
  }

  console.log("ai-sdlc init complete.");
  console.log(`Target: ${options.target}`);
  console.log(`Created files: ${created}`);
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

  console.error(`Unknown command: ${command}`);
  console.error("Run ai-sdlc --help for usage.");
  process.exitCode = 1;
}

main(process.argv.slice(2));
