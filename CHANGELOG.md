# Changelog

#### v2.0.0

**`components/` folder**

This build process-backed folder has been introduced into the repo. Notes:

- Storybook is added to help develop and describe components agnostic to Liquid.
- NPM is used to manage any needed dependencies.
- Esbuild is used for the build process and is wildly fast.
- The base style system is codified here, broken into dedicated CSS files for easy management.
- A library of JS helper functions are added here.
- A process of writing Lit-backed Web Components is now available, sharing the dependency with the Shopify theme.

**`snippets/icon.liquid`**

Icons have been moved into a dedicated file rather than a per-file per-icon approach to help manage verbosity.

Usage:

```
{%- render 'icon' with 'caret' -%}
```

**`snippets/css-variables.liquid`**

- CSS Variables that allow theming per project have been re-written to comply with the design team's nomenclature (e.g. colors).
- Font variables use the `font:` short-hand to encourage a greater degree of typography system re-use.

**Cart**

The Mini Cart has been simplified to help provide a more intuitive baseline, attempting to not take away any current functionality.

**Header**

The Header has been simplified to make better use of the global system and use a now more robust Details Modal Web Component.

**Footer**

The footer has been simplified to act as a better baseline and to comply better with the design team's Figma files.

**Focus Trap**

Focus trap functionality has now been encapsulated inside a `<hh-focus-trap>` component that can easily be used through the changing of an `active` attribute.

**Forms**

A `<hh-input-wrapper>` component has been introduced to control the display of a variety of input types, while also encouraging input form-based events and browser autocomplete functionality to not be impacted through the use of web components.

This is backed with a new `input` snippet to further speed up the process of developing forms.

**Buttons**

`<hh-button-wrapper>` and `<hh-button>` components have been introduced to allow all buttons to comply to a standard design system. The `<hh-button-wrapper>` component can be used particularly with submit buttons where submit events do not penetrate the shadow DOM of web components unless that are adding (and styled) through a slot.

**Overall Asset File Cleanliness**

Files are prefixed with the type of files that they are. The following file naming conventions are in play:

- `-component-{name}.min.js` (Components from `components/`)
- `-global.min.js` (Helper functions and lightweight dependencies from `components/`)
- `-base.min.css` (Base CSS system from `components/`)
- `section-{name}.css`
- `section-{name}.js` (\*Not intended to hold a Web Component)
- `snippet-{name}.css`
- `snippet-{name}.js` (\*Not intended to hold a Web Component)
- `component-{name}.js` (Any corresponding CSS should be encapsulated within the Web Component)
- `helper-{name}.js` (TBD if this convention should be kept).
- `template-{name}.css`
- `template-{name}.js`
