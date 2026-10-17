# antoniocamacho.dev

Open-source personal portfolio and resume built with Astro. The current foundation is a
static WIP page; the final portfolio and delivery infrastructure are separate features.

## Fresh clone

Supported contributor environments: Linux, macOS and WSL2. Install Git and
[mise](https://mise.jdx.dev/getting-started.html) using their official OS instructions.
Review `mise.toml`, then run from the repository root:

```bash
mise trust
mise install
mise exec -- node --version
mise exec -- npm --version
mise exec -- npm ci
mise exec -- npm run check:runtime
mise exec -- npm run hooks:install
mise exec -- npm run dev
```

Expected runtime: Node **24.22.0**, bundled npm **11.19.1**. Open the local URL printed by
Astro. Stop with Ctrl+C. No Cloudflare account, credentials or environment variables are needed.
`npm ci` uses the committed lockfile and installs hooks through `prepare` in a Git checkout.
Use `mise exec --` before every command below unless you have activated mise in your shell.
Editor Git clients must inherit that same runtime PATH; see [development](docs/development.md).

## Commands

| Command                                                 | Purpose                                             |
| ------------------------------------------------------- | --------------------------------------------------- |
| `npm run dev`                                           | Local development with reload                       |
| `npm run check:runtime`                                 | Verify the exact pinned Node version                |
| `npm run lint`                                          | ESLint for source, tests, scripts and configuration |
| `npm run format`                                        | Explicitly rewrite formatting                       |
| `npm run format:check`                                  | Non-mutating formatting validation                  |
| `npm run spellcheck`                                    | CSpell for owned readable content                   |
| `npm run check:types`                                   | Astro and strict tooling TypeScript checks          |
| `npm test`                                              | Unit and integration tests once                     |
| `npm run test:watch`                                    | Watch tests; press q to exit                        |
| `npm run test:coverage`                                 | Tests with V8 coverage in ignored `coverage/`       |
| `npm run lint:branch`                                   | Current branch convention                           |
| `npm run lint:commits -- --from BASE_SHA --to HEAD_SHA` | All messages in the supplied real Git range         |
| `npm run hooks:install`                                 | Install or repair local Lefthook hooks              |
| `npm run quality`                                       | Non-E2E quality checks, without a build             |
| `npm run build`                                         | Generate static `dist/`                             |
| `npm run preview`                                       | Serve existing `dist/` on loopback port 4321        |
| `npm run test:e2e:install`                              | Install the Chromium test browser                   |
| `npm run test:e2e`                                      | Test existing build, starting preview automatically |
| `npm run quality:full`                                  | Quality checks, one build, then built-site E2E      |

Replace `BASE_SHA` and `HEAD_SHA` with actual revisions; range checks need complete history.
Install Chromium before the first full run. On supported Linux systems with missing browser
libraries, use `npm run test:e2e:install -- --with-deps` (system package installation may require
administrator permissions). Stop any preview occupying port 4321 before E2E; tests never reuse it.
Run either `build` then `test:e2e`, or `quality:full`; the aggregate already builds.

See [contributing](CONTRIBUTING.md), [architecture/tooling](docs/development.md),
[testing evidence](docs/testing.md) and the [feature plan](specs/001-project-foundations-wip/plan.md).
For forks, replace public identity in `src/content/site.ts` and visible text in
`src/content/wip.ts`; keep private CV material and secrets outside the repository.
The application uses the MIT license; the LinkedIn icon has separate attribution described
in the development guide.
