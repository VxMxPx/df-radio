---
name: commit
description: Use this skill when the user asks to commit changes, create logical commits, or use this repository's README commit notation.
---

# Commit With README

When committing changes in this repository:

1. Read `README.md` and use the prefixes listed in "Commit Notation".
2. Check the current state with `git status --short`.
3. Review the changed files with `git diff` and focused per-file diffs as needed.
4. Group changes into small logical commits.
5. Stage only the files for each logical commit.
6. Use short commit messages in the README style, for example `add: player transition`.
7. Do not revert or overwrite unrelated user changes.
8. Prefer non-interactive git commands.
9. After committing, report the commit hashes and messages.

If git writes require approval, request it before staging or committing.
