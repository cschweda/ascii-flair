# Changelog

## 0.1.8 — 2026-02-27

- Add .nvmrc (Node 22) and MIT LICENSE
- Make README a static file, remove auto-generation
- Add publish script (`scripts/publish.sh`)
- Add yarn.lock for deterministic dependency resolution

## 0.1.7 — 2026-02-18

- Add `registerFont()` API for runtime font registration
- Security hardening: font name validation, CSS color allowlisting
- Add custom fonts documentation

## 0.1.6 — 2026-02-18

- Add figlet and FIGlet credits to README

## 0.1.5 — 2026-02-18

- Remove publish workflow (publish locally with OTP)

## 0.1.4 — 2026-02-18

- Add dependencies & size section to README

## 0.1.3 — 2026-02-18

- Add await explanation, zero-impact statement, and framework usage docs to README

## 0.1.2 — 2026-02-18

- Add console.warn when text is truncated
- Add auto-truncation at 80 chars with configurable `maxWidth`
- Add GitHub Actions CI/publish workflows and dev docs

## 0.1.1 — 2026-02-18

- Initial release
- ASCII art rendering with 18 pre-compiled FIGlet fonts
- Styled plain text mode with ANSI colors, borders, and padding
- Browser and terminal environment detection
- Lazy-loaded fonts via dynamic `import()`
- Vite library build (ES + CJS)
