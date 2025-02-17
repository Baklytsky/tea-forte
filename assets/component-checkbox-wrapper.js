import { LitElement, html, css } from './-global.min.js'

class HHCheckboxWrapper extends LitElement {
  static properties = {
    checked: {
      reflect: true,
    },
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()

    this.checked = this.querySelector('input')?.checked
  }

  onChange(e) {
    this.checked = e?.target?.checked
  }

  render() {
    return html`
      <div>
        <slot @change="${this.onChange}" name="input"></slot>
        <slot name="label"></slot>
      </div>
    `
  }

  static styles = css`
    ::slotted(input) {
      width: var(--hh-width, 16px);
      height: var(--hh-height, 16px);
      position: absolute;
      top: 0;
      left: 0;
      border: none;
      appearance: none;
      padding: 0;
      margin: 0;
    }

    ::slotted(label) {
      position: relative;
      cursor: pointer;
    }

    ::slotted(label):before {
      content: '';
      -webkit-appearance: none;
      background-color: transparent;
      border: 1px solid var(--hh-color, #000);
      width: var(--hh-width, 16px);
      height: var(--hh-height, 16px);
      display: inline-block;
      position: relative;
      vertical-align: middle;
      cursor: pointer;
      margin-right: 5px;
      box-sizing: border-box !important;
    }

    :host {
      position: relative;
      display: block;
    }

    :host([checked='true']) ::slotted(label):after {
      content: '';
      display: block;
      position: absolute;
      top: var(--hh-check-top, 2px);
      left: var(--hh-check-left, 6px);
      width: var(--hh-check-width, 3px);
      height: var(--hh-check-height, 8px);
      border: solid var(--hh-color, #000);
      border-width: 0 var(--hh-check-border-width, 1px)
        var(--hh-check-border-width, 1px) 0;
      transform: rotate(45deg);
    }
  `
}

customElements.define('hh-checkbox-wrapper', HHCheckboxWrapper)
