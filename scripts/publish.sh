#!/usr/bin/env bash
set -euo pipefail

LEVEL="${1:-patch}"

if [[ "$LEVEL" != "patch" && "$LEVEL" != "minor" && "$LEVEL" != "major" ]]; then
  echo "Usage: ./scripts/publish.sh [patch|minor|major]"
  echo "  Defaults to 'patch' if not specified."
  exit 1
fi

# Ensure clean working tree (untracked files are OK)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: uncommitted changes. Commit or stash before publishing."
  exit 1
fi

OLD_VERSION=$(node -p "require('./package.json').version")

# 1. Bump version
echo "Bumping version ($LEVEL)..."
npm version "$LEVEL" --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "  $OLD_VERSION → $NEW_VERSION"

# 2. Full build
echo ""
echo "Building..."
npm run build:fonts
npm run build

# 3. Run tests
echo ""
echo "Running tests..."
npm test

# 4. Dry run
echo ""
echo "Running publish dry run..."
if npm publish --dry-run; then
  echo ""
  echo "Dry run passed."
else
  echo ""
  echo "Dry run failed. Rolling back changes."
  git checkout -- .
  exit 1
fi

# 5. Confirm
echo ""
read -r -p "Publish ascii-flair@$NEW_VERSION to npm? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Aborted. Rolling back changes."
  git checkout -- .
  exit 0
fi

# 6. Publish
echo ""
echo "Publishing..."
npm publish --ignore-scripts

# 7. Commit and tag (include build artifacts)
git add package.json package-lock.json dist/ src/fonts/
git commit -m "$NEW_VERSION"
git tag "v$NEW_VERSION"

echo ""
echo "Published ascii-flair@$NEW_VERSION"
echo "Run 'git push origin main --tags' when ready."
