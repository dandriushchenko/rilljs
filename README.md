# RillJS

Welcome to the RillJS project!

[![Demo](https://img.shields.io/badge/Live_Demo-Play_Now-brightgreen?style=for-the-badge&logo=github)](https://oneznamov.github.io/rilljs/)

This is a React node-based editor designed for high performance and extensibility.

## Features

- **Visual Node Editor:** Create and connect nodes logically.
- **Fast Refresh:** Built on top of Vite and React SWC/Babel.
- **Strictly Typed:** Deeply integrated with modern TypeScript and ESLint type-aware rules.

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

**Option 1: Using `pnpm link` (Recommended for active dev)**
Inside `rilljs`:

```bash
pnpm build
pnpm link --global
```

Inside your target project:

```bash
pnpm link --global rilljs
```

**Option 2: Using a local file path dependency**
Inside your target project's directory, simply point it to the local folder:

```bash
pnpm add ../path/to/rilljs
```

Make sure you run `pnpm build` in `rilljs` before starting your target project or after making changes to RillJS!

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
