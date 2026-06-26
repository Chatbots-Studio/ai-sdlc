#!/usr/bin/env bash
set -euo pipefail

BUMP_TYPE="${1:-patch}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VERSION_FILE="VERSION"
CHANGELOG="CHANGELOG.md"

current="$(tr -d '[:space:]' < "$VERSION_FILE")"
IFS='.' read -r major minor patch <<< "$current"

case "$BUMP_TYPE" in
  major)
    major=$((major + 1))
    minor=0
    patch=0
    ;;
  minor)
    minor=$((minor + 1))
    patch=0
    ;;
  patch)
    patch=$((patch + 1))
    ;;
  *)
    echo "Unknown bump type: $BUMP_TYPE (expected patch, minor, or major)" >&2
    exit 1
    ;;
esac

new_version="${major}.${minor}.${patch}"
echo "$new_version" > "$VERSION_FILE"

./scripts/sync-version.sh

DATE="$(date -u +%Y-%m-%d)"
LAST_TAG="$(git describe --tags --abbrev=0 2>/dev/null || true)"

if [[ -n "$LAST_TAG" ]]; then
  LOG_RANGE="${LAST_TAG}..HEAD"
else
  LOG_RANGE="HEAD"
fi

COMMITS="$(
  git log "$LOG_RANGE" \
    --pretty=format:"- %s (%h)" \
    --no-merges \
    --invert-grep \
    --grep="^chore(release):" \
    2>/dev/null || true
)"

{
  echo "# Changelog"
  echo
  echo "All notable changes to this project are documented here."
  echo
  echo "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),"
  echo "and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)."
  echo
  echo "## [${new_version}] - ${DATE}"
  echo
  if [[ -n "$COMMITS" ]]; then
    echo "$COMMITS"
  else
    echo "- Maintenance release."
  fi
  echo

  if [[ -f "$CHANGELOG" ]]; then
    awk 'found { print } /^## \[/ { if (!found) found=1 }' "$CHANGELOG"
  fi
} > "${CHANGELOG}.tmp"
mv "${CHANGELOG}.tmp" "$CHANGELOG"

echo "Bumped version: ${current} -> ${new_version}"
