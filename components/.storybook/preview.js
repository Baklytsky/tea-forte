import { html } from 'lit'
import base from './../src/lib/styles/base'
import variables from './../src/lib/styles/variables'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (story) =>
    html`<style>
        ${base}${variables}</style
      >${story()}`,
]
