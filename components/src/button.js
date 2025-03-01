import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

class HHButton extends LitElement {
  static properties = {
    key: {},
    href: { type: String },
    decoration: { type: String },
    spacing: { type: String },
    type: { type: String },
    underline: {
      converter(value) {
        return value === 'true' ? true : false
      },
    },
    onclick: {
      type: String,
      attribute: 'custom:click',
    },
  }

  constructor() {
    super()

    this.underline = true
  }

  onClick(e) {
    if (!this.onclick) {
      return
    }

    this.dispatchEvent(
      new CustomEvent(this.onclick, {
        bubbles: true,
        composed: true,
        detail: {
          key: this.key,
          event: e,
        },
      })
    )
  }

  render() {
    return html`${!this.href
      ? html`<button
          class="${classMap({
            underline: this.underline,
          })}"
          @click="${this.onClick}"
          type="${this.type || 'button'}"
          value="Submit"
        >
          <slot></slot>
        </button>`
      : html`<a
          class="${classMap({
            underline: this.underline,
          })}"
          href="${this.href}"
          @click="${this.onClick}"
        >
          <slot></slot>
        </a>`}`
  }

  static styles = css`
    button {
      max-width: var(--hh-max-width, 160px);
    }

    :host {
      align-items: center;
      display: flex;
    }

    :host([width='full']) button {
      width: 100%;
      max-width: none;
    }

    :host([theme='tertiary']) button {
      max-width: none;
    }

    button,
    a {
      cursor: pointer;
      background-color: var(--hh-background, #000);
      color: var(--hh-color, #fff);
      transition: all var(--hh-transition, 300ms);
      border: 0;
      appearance: none;
      font: var(--hh-font);
      text-transform: var(--hh-text-transform);
      letter-spacing: var(--hh-letter-spacing);
      padding: var(--hh-padding);
      text-decoration: none;
      white-space: nowrap;
      display: block;
    }

    button.large,
    a.large {
      font: var(--hh-font-large);
      padding: 11px 20px;
    }

    button:focus,
    a:focus {
      transition: none;
      outline: 0.2rem solid var(--hh-color-focus);
      outline-offset: var(--hh-focus-outline-offset);
    }

    :host([theme='secondary']) button,
    :host([theme='secondary']) a {
      background: var(--hh-background, transparent);
      border: var(--hh-border-width, 1px) solid var(--hh-border-color, #000);
      color: var(--hh-color, #000);
    }

    :host([theme='tertiary']) button,
    :host([theme='tertiary']) a {
      position: relative;
      background: var(--hh-background, transparent);
      color: var(--hh-color, #000);
      padding: var(--hh-padding, 0);
    }

    :host([theme='tertiary']) button.underline:after,
    :host([theme='tertiary']) a.underline:after {
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

    :host([decoration~='rounded']) button,
    :host([decoration~='rounded']) a {
      border-radius: var(--hh-border-radius, 4px);
    }
  `
}

customElements.define('hh-button', HHButton)
