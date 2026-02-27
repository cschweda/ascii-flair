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

# 6. Update CHANGELOG
echo ""
echo "Updating CHANGELOG.md..."
TODAY=$(date +%Y-%m-%d)
PREV_TAG="v$OLD_VERSION"

# Gather commit subjects since the last tag
CHANGES=""
while IFS= read -r line; do
  # Strip the leading hash and format as a list item
  MSG=$(echo "$line" | sed 's/^[a-f0-9]* //')
  CHANGES="$CHANGES\n- $MSG"
done < <(git log --oneline "$PREV_TAG..HEAD" -- . ':!package.json' ':!package-lock.json' | grep -v "^.* [0-9]\+\.[0-9]\+\.[0-9]\+$")

if [ -z "$CHANGES" ]; then
  CHANGES="\n- Maintenance release"
fi

# Build the new entry
ENTRY="## $NEW_VERSION — $TODAY\n$CHANGES"

# Prepend the new entry after the "# Changelog" header
if [ -f CHANGELOG.md ]; then
  sed -i '' "s/^# Changelog$/# Changelog\n\n$ENTRY/" CHANGELOG.md
else
  printf "# Changelog\n\n$ENTRY\n" > CHANGELOG.md
fi

echo "  Added $NEW_VERSION entry to CHANGELOG.md"

# 7. Publish
echo ""
echo "Publishing..."
npm publish --ignore-scripts

# 8. Commit and tag (include build artifacts + changelog)
git add package.json package-lock.json src/fonts/ CHANGELOG.md
git commit -m "$NEW_VERSION"
git tag "v$NEW_VERSION"

echo ""
echo "Published ascii-flair@$NEW_VERSION"
echo "Run 'git push origin main --tags' when ready."
