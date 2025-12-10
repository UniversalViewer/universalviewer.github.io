# Universal Viewer Main Website

## Current State

The site has been rebuilt using Astro, however all frontend assets remain the same, meaning that the website is visually and functionally the same despite the underlying systems having changed.

## Making Changes

Edit `/src/pages/index.astro` as if it were `index.html`

Making changes to the JS is not recommended as this was copied from the old site in its minified form. If new functionality is needed please either add a new script block or edit the JS using the legacy branch and re-copy to dev.

## Publishing Changes

Changes are built and deployed automatically when updates are made to the `main` branch via a GitHub Pages workflow which can be found in the .github/workflows directory. This is the standard Astro workflow for Pages so shouldn't need alterning apart from changes to which branches trigger it.

### Environment protection

In the Environment settings of the repo there is a list of branches from which deployments are allowed. This currently only contains the `main` branch to prevent any other branches being a source of deployment.

When developing the site in a fork you may need to add the dev branch to this list in ***your own*** Github account.

# Astro Basics

## Project Structure

TODO: Pending recode

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Astro docs

Check [Astro documentation](https://docs.astro.build).
