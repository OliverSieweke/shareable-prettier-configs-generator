

<p align="center">
  <img alt="Prettier" src="assets/README/prettier-wide-dark.svg" width="400">
</p>
<h1 align="center">
    Shareable Prettier Configs Generator
</h1>
<p align="center">
  <img alt="Build" src="https://github.com/OliverSieweke/shareable-prettier-configs-generator/workflows/Build/badge.svg">
</p>






# Quick Start

npm i
package.json


Personal shareable prettier configurations.

------


NB: save exact needed!

Available options:

- preferred
- preferred-editorconfig (default)
- spiced-teaching
- spiced-teaching-editorconfig
- spiced-internal
- spiced-internal-editorconfig


## Details

editorconfig ignores the


Usage
Install:

$ yarn add --dev @azz/prettier-config
Edit package.json:

{
// ...
"prettier": "@azz/prettier-config"
}n


https://prettier.io/docs/en/options.html





# Additional options:

Or export a string:



With overrides:

module.exports = {
...require("@company/prettier-config"),
semi: false,
};

To exclude files from formatting, create a .prettierignore file in the root of your project. .prettierignore uses gitignore syntax.


## Reuse

This is geared towards my personal use.
Fork the repo and adapt the the content of the templates  to your liking.



Temporary dir is used to build -editorconfig versions of the packages



## Add configs

- add directory
- templates handlebars sytle ({{}})
