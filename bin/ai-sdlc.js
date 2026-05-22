#!/usr/bin/env node

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

function printHelp() {
  console.log(`ai-sdlc

Usage:
  ai-sdlc init       Initialize AI SDLC assets for a project
  ai-sdlc version    Print the ai-sdlc CLI version
  ai-sdlc --help     Show this help message
`);
}

function init() {
  console.log("ai-sdlc init: Cursor package initialization is not implemented yet.");
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
    init();
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error("Run ai-sdlc --help for usage.");
  process.exitCode = 1;
}

main(process.argv.slice(2));
