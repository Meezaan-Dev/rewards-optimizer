---
name: git-workflow
description: >-
  Branch naming, commit messages, and pull request creation for git repositories.
  Use when creating branches, commits, or PRs; when the user asks to open a pull
  request; or when an agent needs git conventions for the current project.
---

# Git Workflow

Portable git conventions for agents. **Customize the [Project configuration](#project-configuration) section** when copying this skill into a new repo.

## Git safety (always)

- Only create commits when the user explicitly asks
- Never update git config
- Never run destructive commands (`push --force`, `reset --hard`) unless the user explicitly requests them
- Never force-push to the default/base branch
- Never skip hooks (`--no-verify`) unless the user explicitly requests it
- Avoid `git commit --amend` unless all amend conditions in user rules are met
- Do not commit secrets (`.env`, credentials, keys)
- Do not use interactive git flags (`-i`) in automation

## Base branch

Before branching or opening a PR, detect the default branch:

```bash
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
# or: gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'
```

Common values: `main` or `master`. Use whatever the repo uses unless the user specifies otherwise.

In the examples below, `<base>` means the detected default branch.

## Branch naming

Format:

```text
<type>/<short-kebab-description>
```

### Allowed types

| Type | Use when |
|------|----------|
| `feat` | New user-facing capability or meaningful behavior addition |
| `fix` | Bug fix or regression repair |
| `chore` | Tooling, deps, CI, config, housekeeping (no user-facing change) |
| `docs` | Documentation-only changes |
| `refactor` | Internal restructure with no intended behavior change |
| `test` | Tests only (optional; use if the team separates test work) |

### Rules

- Lowercase, kebab-case after the slash
- Short but specific (2–5 words)
- No ticket IDs unless the team already uses them consistently
- One logical change per branch

### Examples

```text
feat/user-dashboard
feat/oauth-callback
fix/login-redirect-loop
fix/mobile-nav-overlap
chore/upgrade-dependencies
docs/api-reference
refactor/extract-auth-helpers
test/add-checkout-flow
```

### Choosing a type

- User-visible new behavior → `feat`
- Something broken → `fix`
- README, docs, skill files, comments only → `docs`
- Move/rename/simplify code, same behavior → `refactor`
- `package.json`, lint/CI config, `.github/` → `chore`

## Commit messages

Prefer imperative, concise subject lines. Optional scope in parentheses.

```text
<type>(<scope>): <subject>

<optional body — why, not a file list>
```

Examples:

```text
feat(auth): add session refresh middleware

fix(ui): prevent modal focus trap on mobile

docs: add git-workflow agent skill

refactor(api): extract validation into shared helpers

chore: bump eslint to latest minor
```

Pass the message via HEREDOC when committing:

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add session refresh middleware

Refresh tokens before expiry to avoid silent logouts.
EOF
)"
```

## Pull request workflow

Use `gh` for GitHub tasks (issues, PRs, checks). Before opening a PR, run in parallel:

1. `git status` — untracked and modified files
2. `git diff` and `git diff --staged` — review changes
3. Confirm branch tracks remote and relationship to `<base>`
4. `git log <base>...HEAD` and `git diff <base>...HEAD` — full PR scope (all commits, not only the latest)

Then run project tests if code changed (see [Project configuration](#project-configuration)).

### Create branch and push

```bash
git checkout -b feat/short-description
# ... work; commit only when user asks ...
git push -u origin HEAD
```

### PR title

Match the primary change type:

```text
feat: add user dashboard
fix: login redirect loop on expired session
docs: agent git workflow standards
chore: align CI with monorepo packages
```

Sentence case is fine; stay consistent within the PR.

### PR body template

```markdown
## Summary
- What changed and why (group related changes)
- Another logical group if needed

## Test plan
- [ ] <project test command>
- [ ] Manual check: <specific flow or route>
- [ ] <any project-specific checks, e.g. accessibility, migrations>
```

Create with HEREDOC:

```bash
gh pr create --base <base> --title "feat: short title" --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [ ] ...

EOF
)"
```

Return the PR URL when done.

If the repo has `pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE.md`, follow that template instead of the generic one above.

## Pre-PR checklist

- [ ] Branch name uses an allowed `type/` prefix
- [ ] Commits match the change (don't mix unrelated feat + fix on one branch)
- [ ] No secrets staged
- [ ] Relevant tests/checks pass for touched areas
- [ ] PR summary covers **all** commits on the branch, not only the latest
- [ ] PR targets `<base>` unless the user specifies otherwise

## Project configuration

**Edit this section per repo** (or add a short `project.md` beside this skill).

| Setting | Value (fill in) |
|---------|-----------------|
| Default branch | e.g. `main` or `master` |
| PR base (if not default) | e.g. `develop` for release flow |
| Test command | e.g. `npm test`, `pnpm test`, `pytest` |
| Typecheck / lint | e.g. `npm run typecheck && npm run lint` |
| Monorepo? | yes/no; package paths if yes |
| PR template path | e.g. `.github/pull_request_template.md` |
| Commit style override | conventional / team ticket prefix / other |

### This repo (Prototype Starter)

| Setting | Value |
|---------|-------|
| Default branch | `master` |
| Test command | `npm run test:rules` (Firestore rules); run `npm test` if added |
| Typecheck / lint | `npm run typecheck && npm run lint` |
| Monorepo? | No — single Next.js app at repo root |
| Key paths | `app/`, `components/`, `features/`, `services/` |

## Additional resources

- Extended examples and pitfalls: [reference.md](reference.md)
