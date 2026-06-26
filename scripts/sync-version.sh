#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VERSION_FILE="VERSION"
PLUGIN_JSON="plugins/ai-sdlc/.cursor-plugin/plugin.json"
MARKETPLACE_JSON=".cursor-plugin/marketplace.json"

version="$(tr -d '[:space:]' < "$VERSION_FILE")"

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid version in ${VERSION_FILE}: ${version}" >&2
  exit 1
fi

jq --arg v "$version" '.version = $v' "$PLUGIN_JSON" > "${PLUGIN_JSON}.tmp"
mv "${PLUGIN_JSON}.tmp" "$PLUGIN_JSON"

jq --arg v "$version" \
  '.metadata.version = $v | .plugins |= map(.version = $v)' \
  "$MARKETPLACE_JSON" > "${MARKETPLACE_JSON}.tmp"
mv "${MARKETPLACE_JSON}.tmp" "$MARKETPLACE_JSON"

echo "Synced version ${version} to plugin.json and marketplace.json"
