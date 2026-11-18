# demo-todo-app

A small todo app used to rehearse a release process end to end: pull requests, release branches,
automated Playwright runs reported to Testomat.io, manual QA runs, and sign-off.

## Branches

| Branch          | Role                                                      |
| --------------- | --------------------------------------------------------- |
| `development`   | integration branch; feature PRs merge here                |
| `release-1.0.N` | cut from `development`; QA and fixes happen here          |
| `main`          | what is released; a tag `v1.0.N` marks each release       |

## Running locally

```bash
pnpm install
pnpm dev                 # http://localhost:5173
pnpm test:e2e            # builds, serves on :4173 and runs Playwright
```

Set `TESTOMATIO=<project key>` to send a local run to Testomat.io.

## CI

`.github/workflows/e2e.yml` runs the suite on pull requests into `development`, `release-*` and `main`,
on pushes to `release-*`, and on demand. Results go to Testomat.io (secret `TESTOMATIO`); runs on or into
a release branch are grouped under that release.

## Release process

1. Feature PRs merge into `development` once the `playwright` check passes.
2. At release cut, `release-1.0.N` is branched from `development`; the regression run is grouped under that release in Testomat.io.
3. QA runs the manual cases against the release build in the same release group; fixes go to the release branch via PR.
4. After sign-off, the release branch merges into `main`, gets the tag `v1.0.N`, and merges back into `development`.
