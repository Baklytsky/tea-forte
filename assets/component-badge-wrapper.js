import { LitElement, html, css } from './-global.min.js'

class HHBadgeWrapper extends LitElement {
  static properties = {}

  constructor() {
    super()
  }

  render() {
    return html`<slot></slot>`
  }

  static styles = css`
    ::slotted(span) {
      font: var(--hh-font);
      border: 1px solid transparent;
      border-radius: 4rem;
      display: inline-block;
      padding: 0.6rem 1.3rem;
      text-align: center;
      background-color: var(--hh-background);
      color: var(--hh-color);
      word-break: break-word;
    }

    ::slotted(span[theme='primary']) {
      color: var(--hh-color-primary);
      background-color: var(--hh-background-primary);
    }

    ::slotted(span[theme='secondary']) {
      color: var(--hh-color-secondary);
      background-color: var(--hh-background-secondary);
    }
  `
}

customElements.define('hh-badge-wrapper', HHBadgeWrapper)
