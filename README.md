# RillJS

Welcome to the RillJS project!

[![Demo](https://img.shields.io/badge/Live_Demo-Play_Now-brightgreen?style=for-the-badge&logo=github)](https://oneznamov.github.io/rilljs/)
![Coverage](.github/badges/coverage.svg)
[![CI](https://img.shields.io/github/actions/workflow/status/oneznamov/rilljs/ci.yml?branch=master&style=for-the-badge&logo=github&label=CI)](https://github.com/oneznamov/rilljs/actions/workflows/ci.yml)

## Features

- **Visual Node Editor:** Create and connect nodes logically.
- **Fast Refresh:** Built on top of Vite and React SWC/Babel.
- **Strictly Typed:** Deeply integrated with modern TypeScript and ESLint type-aware rules.

## Local Development

To start the development server with hot module replacement, run:

```bash
pnpm dev
```

This will launch the app in your default browser at [localhost](http://localhost:5173/). Any changes you make to the
source code
will be reflected in real-time without needing to refresh the page.

## Building as an NPM Package

To compile the project and generate the output bundle along with TypeScript definitions `(.d.ts)`, run:

```bash
pnpm build
```

This generates the unified bundle inside the `dist/` directory, optimized for usage in other codebases as both an ES
Module (`dist/rilljs.es.js`) and a UMD module (`dist/rilljs.umd.js`).

## Using RillJS locally in another project

If you want to consume this package inside a local application without publishing it to NPM, you can link it or install
it using a local file path.

**Option 1: Simplest**
Inside `rilljs`:

```bash
pnpm build
```

Inside `youProject`:

```json
{
  "dependencies": {
    "@user/rilljs": "file:../path/to/local/rilljs/dist"
  }
}
```

Then run `pnpm install` in your target project. This will install the built version of RillJS directly from the local
pnpm build

---

**Option 2: Using `pnpm link` (Recommended for active dev)**
Inside `rilljs`:

```bash
pnpm build
pnpm link --global
```

Inside your target project:

```bash
pnpm link --global rilljs
```

---

**Option 3: Overriding an existing remote package version**
If your target project currently installs RillJS from the NPM registry (e.g., `"@dandriushchenko/rilljs": "^1.1.4"`) and
you want to force it to use your newly-built local folder instead, you can use `pnpm` overrides.

In your target project's `package.json`, add the following:

```json
{
  "pnpm": {
    "overrides": {
      "@user/rilljs": "link:../path/to/local/rilljs"
    }
  }
}
```

> [!NOTE]
> **Working in a Monorepo?**
> If your target project is a `pnpm` workspace (using `pnpm-workspace.yaml`), you should place the `pnpm.overrides`
> block inside the **root** `package.json` of the monorepo, _not_ the individual app `package.json`. If you already have
> existing overrides, just add your local override there so it resolves correctly across the entire workspace! For
> example:
>
> ```json
> {
>   "pnpm": {
>     "overrides": {
>       "@dyssent/rilljs": "npm:@user/rilljs@^1.1.4",
>       "@user/rilljs": "link:../path/to/local/rilljs"
>     }
>   }
> }
> ```

Then run `pnpm install` in your target project. This tells `pnpm` to intercept any requests for the published package
and resolve them straight to your local `dist` build! Just make sure you run `pnpm build` in your local `rilljs` repo
first.
