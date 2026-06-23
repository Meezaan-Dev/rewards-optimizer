# Git workflow reference

Supplement to [SKILL.md](SKILL.md). Generic patterns for any project; customize examples for your stack.

## Branch name → PR title mapping

| Branch | PR title |
|--------|----------|
| `feat/user-dashboard` | `feat: user dashboard` |
| `fix/login-redirect-loop` | `fix: login redirect loop on expired session` |
| `docs/agent-git-standards` | `docs: add agent git workflow skill` |
| `refactor/extract-auth-helpers` | `refactor: extract auth helpers into shared module` |
| `chore/upgrade-dependencies` | `chore: upgrade dependencies` |
| `test/checkout-e2e` | `test: add checkout end-to-end coverage` |

## Multi-commit PR example

Branch `feat/onboarding-flow` with commits:

1. `feat(onboarding): add step shell and routing`
2. `feat(onboarding): wire form validation`
3. `fix(onboarding): correct back navigation on mobile`

PR summary should mention **all three**, not only the latest commit. Use `git log <base>...HEAD` and `git diff <base>...HEAD` before writing the body.

## When to split branches

Split into separate PRs when:

- Changes are independently reviewable (e.g. `docs/` vs large `feat/`)
- One part is blocked, risky, or needs a different reviewer
- User explicitly asks to split

Keep together when:

- Changes are one feature or fix end-to-end
- Shared types, APIs, or components are required by the same deliverable

## Common mistakes

| Mistake | Correct approach |
|---------|------------------|
| `feature/new-ui` | Use `feat/new-ui` |
| `bugfix-login` | Use `fix/login-redirect` |
| `updates` | Use specific type + description |
| PR body lists only latest commit | Summarize full diff against `<base>` |
| Hardcoded `main` vs `master` | Detect default branch or read project config |
| Commit without user request | Ask or wait for explicit commit instruction |
| `git add .` blindly | Stage only files relevant to the change |
| Mixing feat + unrelated chore | Separate branches or separate commits with clear messages |

## Detecting project context

Run these when landing in an unfamiliar repo:

```bash
# Default branch
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'

# Package manager and scripts (pick what exists)
cat package.json 2>/dev/null | head -40
cat pyproject.toml 2>/dev/null | head -30
cat go.mod 2>/dev/null | head -5

# PR template
ls .github/PULL_REQUEST_TEMPLATE.md pull_request_template.md 2>/dev/null

# Monorepo hints
ls apps packages services 2>/dev/null
cat pnpm-workspace.yaml 2>/dev/null
```

## Test commands (examples by stack)

Replace with commands from the repo's `package.json`, `Makefile`, or CI config.

| Stack | Typical commands |
|-------|------------------|
| Node / npm | `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` |
| pnpm monorepo | `pnpm test`, `pnpm --filter <pkg> test`, `pnpm lint` |
| Python | `pytest`, `ruff check .`, `mypy .` |
| Go | `go test ./...`, `golangci-lint run` |
| Rust | `cargo test`, `cargo clippy` |

Always prefer the scripts defined in the project over guessing.

## PR creation sequence (full)

```bash
# 1. Understand scope (parallel where possible)
git status
git diff
git diff --staged
git log <base>...HEAD --oneline
git diff <base>...HEAD

# 2. Branch (if not already on one)
git checkout -b feat/short-description

# 3. Commit (only when user asks)
git add <paths>
git commit -m "$(cat <<'EOF'
feat(scope): subject

Optional body.
EOF
)"

# 4. Push and open PR
git push -u origin HEAD
gh pr create --base <base> --title "feat: subject" --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [ ] ...

EOF
)"
```

## Customizing this skill for a new project

1. Copy `agents/skills/git-workflow/` (or `.cursor/skills/git-workflow/`) into the target repo.
2. Update **Project configuration** in `SKILL.md` (default branch, test commands, key paths).
3. Optionally add repo-specific branch types or commit prefixes if the team uses them (e.g. `JIRA-123-feat/...` — only if already standard).
4. Point **Additional resources** at any internal docs (`CONTRIBUTING.md`, `docs/development.md`).
5. Remove or replace the "This repo" table in `SKILL.md` when using as a blank template.

## Optional extensions

Teams can add sibling files without bloating `SKILL.md`:

| File | Purpose |
|------|---------|
| `project.md` | Default branch, CI commands, monorepo map |
| `examples.md` | Real PR titles and bodies from the team |
| `scripts/pre-pr.sh` | Lint + test gate before `gh pr create` |

Keep `SKILL.md` under ~500 lines; put long tables and history in `reference.md`.
