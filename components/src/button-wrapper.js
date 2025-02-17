import { LitElement, html, css } from 'lit'

class HHButtonWrapper extends LitElement {
  static properties = {}

  constructor() {
    super()
  }

  render() {
    return html`<slot></slot>`
  }

  static styles = css`
    ::slotted(button) {
      cursor: pointer;
      background-color: var(--hh-background, #000);
      color: var(--hh-color, #fff);
      transition: all var(--hh-transition, 300ms);
      border: var(--hh-border-width, 1px) solid var(--hh-background, #000);
      font: var(--hh-font);
      text-transform: var(--hh-text-transform);
      letter-spacing: var(--hh-letter-spacing);
      padding: var(--hh-padding, 1em 2em);
    }

    ::slotted(button:disabled) {
      opacity: 0.5;
      pointer-events: none;
    }

    :host([size='large']) ::slotted(button) {
      font: var(--hh-font-large);
    }

    :host([width='full']) ::slotted(button) {
      width: 100%;
      max-width: none;
      box-sizing: border-box !important;
    }

    :host([theme='secondary']) ::slotted(button) {
      background-color: var(--hh-background, transparent);
      border: var(--hh-border-width, 1px) solid var(--hh-border-color, #000);
      color: var(--hh-color, #000);
    }

    :host([theme='tertiary']) ::slotted(button) {
      position: relative;
      background: var(--hh-background, transparent);
      color: var(--hh-color, #000);
      padding: var(--hh-padding, 0);
      border: none;
    }

    :host([theme='tertiary']) ::slotted(button):after {
      content: '';
      position: absolute;
      left: 0;
      bottom: var(--hh-border-bottom-offset, 0);
      background-color: currentColor;
      width: calc(100% - var(--hh-letter-spacing, 0px));
      height: var(--hh-underline-width, 1px);
    }

    :slotted() {
      font: var(--hh-font);
    }

    :host([decoration~='rounded']) ::slotted(button) {
      border-radius: var(--hh-border-radius, 4px);
    }
  `
}

customElements.define('hh-button-wrapper', HHButtonWrapper)
