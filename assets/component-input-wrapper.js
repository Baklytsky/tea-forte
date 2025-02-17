import { LitElement, html, css } from './-global.min.js'

class HHInputWrapper extends LitElement {
  static properties = {
    animation: {},
    focused: {
      reflect: true,
    },
    filled: {
      reflect: true,
    },
    label: {},
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()

    this.$select = this.querySelector(`select[slot='input']`)
    this.$select && this.preselectSelectValue()

    if (!!this.querySelector(`[slot='input']`).value && !this.$select) {
      this.filled = true
    }

    if (this.$select && this.label !== 'stacked') {
      this.filled = true
    }
  }

  preselectSelectValue() {
    if (this.$select?.dataset?.default) {
      this.$select.value = this.$select?.dataset?.default
    }
  }

  onChange(e) {
    if (this.animation === 'none' || this.label === 'stacked') {
      return
    }
    this.filled = !!e.target.value
  }

  onFocus(e) {
    if (this.animation === 'none') {
      return
    }
    this.focused = true
  }

  onFocusOut(e) {
    if (this.animation === 'none') {
      return
    }
    this.focused = false
  }

  render() {
    return html`
      <slot name="label"></slot>
      <slot name="icon"></slot>
      <slot
        name="input"
        @change="${this.onChange}"
        @keydown="${this.onChange}"
        @focusin="${this.onFocus}"
        @focusout="${this.onFocusOut}"
      ></slot>
    `
  }

  static styles = css`
    ::slotted(label) {
      font: var(--hh-label-font);
      opacity: var(--hh-label-opacity, 1);
      position: absolute;
      height: var(--hh-height, 45px);
      line-height: var(--hh-height, 45px);
      padding-left: var(--hh-left-indent-small, 10px);
      transform: translateY(0);
      transition: transform var(--hh-duration, 300ms),
        font-size var(--hh-duration, 300ms);
    }

    ::slotted(label),
    ::slotted(input),
    ::slotted(textarea),
    ::slotted(select) {
      width: 100%;
      height: var(--hh-height, 45px);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    ::slotted(input),
    ::slotted(textarea),
    ::slotted(select) {
      z-index: 2;
      text-indent: var(--hh-left-indent-small, 10px);
      font: var(--hh-font);
      color: currentColor;
      background: transparent;
      border: 0;
      padding: 0;
    }

    ::slotted(select) {
      appearance: none;
    }

    :host([focused='true']) ::slotted(label),
    :host([filled='true']) ::slotted(label) {
      font-size: var(--hh-minified-font-size, 9px);
      transform: translateY(-13px);
    }

    :host([animation='disappear'][focused='true']) ::slotted(label),
    :host([animation='disappear'][filled='true']) ::slotted(label) {
      visibility: hidden;
      transform: translateY(0);
      font-size: inherit;
    }

    :host {
      position: relative;
      display: block;
      height: calc(var(--hh-height, 45px) + 2px);
    }

    :host {
      background: transparent;
      border: var(--hh-border-size, 1px) solid var(--hh-border-color);
    }

    :host([theme='minimal']) {
      background: transparent;
      border: none;
      border-bottom: var(--hh-border-size, 1px) solid currentColor;
    }

    :host([label='stacked']) {
      border: none;
      height: auto;
    }

    :host([label='stacked']) ::slotted(label),
    :host([label='stacked']) ::slotted(input),
    :host([label='stacked']) ::slotted(textarea),
    :host([label='stacked']) ::slotted(select) {
      position: relative;
    }

    :host([label='stacked']) ::slotted(label) {
      height: auto;
      display: block;
      font: var(--hh-label-font);
      margin: var(--hh-label-margin);
      padding-left: 0;
    }

    :host([label='stacked']) ::slotted(input),
    :host([label='stacked']) ::slotted(textarea),
    :host([label='stacked']) ::slotted(select) {
      border: var(--hh-border-size, 1px) solid currentColor;
    }

    :host([icon='left']) ::slotted(label) {
      padding-left: var(--hh-left-indent, 32px);
    }

    :host([icon='left']) ::slotted(input) {
      text-indent: var(--hh-left-indent, 32px);
    }

    :host([icon='right']) ::slotted(label) {
      padding-right: var(--hh-right-indent, 32px);
    }

    ::slotted([slot='icon']) {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: var(--hh-icon-width, 23px);
      height: var(--hh-height, 45px);
      z-index: 3;
    }

    :host([icon='right']) ::slotted([slot='icon']) {
      right: var(--hh-icon-right, 10px);
    }

    :host([height='multiline']),
    :host([height='multiline']) ::slotted(textarea) {
      height: var(--hh-multiline-height, 100px);
    }

    :host([height='compact']),
    :host([height='compact']) ::slotted(input),
    :host([height='compact']) ::slotted(label),
    :host([height='compact']) ::slotted([slot='icon']) {
      height: var(--hh-compact-height, 35px);
    }

    :host([height='compact']) ::slotted(label) {
      line-height: var(--hh-compact-height, 35px);
    }
  `
}

customElements.define('hh-input-wrapper', HHInputWrapper)
