# Latam IB — da.live site

Home page of https://latamib.com/ migrated to Edge Delivery with Document Authoring
(`azouaoui-deloitte/eds-latamib-da`). Blocks, styles and fonts are shared with the xwalk site
[eds-latamib](https://github.com/azouaoui-deloitte/eds-latamib) (block map: `docs/migration/block-map.md`
there). Documents: `/index` (home, served at `/`), `/nav`, `/footer`, sheets `/metadata.json`
(nav / footer for `/**`) and `/redirects.json`. Edit: https://da.live/#/azouaoui-deloitte/eds-latamib-da

## Environments
- Preview: https://main--eds-latamib-da--azouaoui-deloitte.aem.page/
- Live: https://main--eds-latamib-da--azouaoui-deloitte.aem.live/

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `eds-latamib-da` directory in your favorite IDE and start coding :)
