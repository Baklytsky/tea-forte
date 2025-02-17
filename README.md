# Tea Forte B2B Theme

## Project Description

This project represents a theme for a B2B store on the Shopify platform. The theme is developed using modern web technologies and provides a user-friendly interface for the end-user.

## Technologies Used

### Shopify CLI

- **Shopify CLI**: Used for theme development and deployment. The command `shopify theme dev -e dev` is used to start the local development server from the root directory of the project.

### JavaScript

- **LitElement**: Used for creating web components.
- **Esbuild**: A fast build tool for bundling JavaScript and CSS. It is used for building and minifying files.

### Node.js

- **Node.js 16**: The project requires Node.js version 16 for building and running. Make sure you have this version installed or install it using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm).

## Project Setup

- **Install dependencies**:
    ```bash
    npm install
    ```

## Development Commands

- **Start Shopify local development server**:
    ```bash
    npm run start:shopify
    ```

- **Start esbuild in watch mode**:
    ```bash
    npm run watch:esbuild
    ```

- **Start both commands simultaneously**:
    ```bash
    npm run watch
    ```

- **Start deploy**:
    ```bash
    npm run deploy
    ```

- **Download JSON theme settings**:
    ```bash
    npm run pull:settings
    ```

- **Download all theme updates**:
    ```bash
    npm run pull:updates
    ```

## How the Build Works

The `esbuild.js` script located in the `components/scripts` directory is responsible for building and minifying JavaScript and CSS files. It works in parallel with the Shopify CLI to ensure a smooth development experience.

1. **Determine the Mode**:
  - The script checks if the `--watch` argument was passed to start in watch mode.

2. **Function `build(entry)`**:
  - Performs the build for a specific file (entry).
  - Uses `esbuild` to bundle the file with options:
    - `bundle`: Combines all imported modules into one file.
    - `outfile`: Specifies the output file.
    - `format`: Sets the module format to `esm` (ECMAScript Module).
    - `minify`: Minifies the file if not in watch mode.
    - `sourcemap`: Generates a sourcemap if in watch mode.
    - `plugins`: Configures plugins for handling imports and reporting errors.

3. **Main Process**:
  - If in watch mode, it monitors file changes and calls `build` for the changed files.
  - If not in watch mode, it finds all `.js` and `.css` files in the `components/src` directory and builds them.

By running `npm run watch`, both the Shopify CLI development server and the esbuild watch mode will be started, allowing you to see changes in real-time as you develop your theme.

## Requirements

- **Node.js**: 16.x
- **npm**: 7.x or higher
