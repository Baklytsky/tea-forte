import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { visuallyHidden } from './lib/styles/mixins'

class HHQuantityInput extends LitElement {
  static properties = {
    key: {},
    label: {},
    showLabel: {
      type: Boolean,
      attribute: 'show-label',
    },
    initial: {
      type: Number,
    },
    step: {
      type: Number,
      attribute: 'step',
    },
    _value: {
      state: true,
    },
  }

  constructor() {
    super()

    this.step = parseInt(this.step) || 1
    this.broadcast = this.broadcast.bind(this)
    this.id = Math.random() * 100000
  }

  connectedCallback() {
    super.connectedCallback()
    this._value = this.initial
    setTimeout(() => this.broadcast(), 0)
  }

  broadcast() {
    const $input = this.querySelector('[slot="input"]')
    $input && ($input.value = this._value)

    this.dispatchEvent(
      new CustomEvent('changeQuantity', {
        bubbles: true,
        composed: true,
        detail: {
          key: this.key,
          value: this._value,
        },
      })
    )
  }

  increment() {
    this._value += this.step
    this.broadcast()
  }

  decrement() {
    if (!this._value) {
      return
    }

    if (this._value - this.step < 0) {
      this._value = 0
    } else {
      this._value -= this.step
    }

    this.broadcast()
  }

  override(e) {
    this._value = Math.max(0, e.target.value)
    this.broadcast()
  }

  getTooltip() {
    if (this.step > 1) {
      return html`
        <div class="tooltip">
          <span class="tooltip__icon">i</span>
          <span class="tooltip__text">Minimum: ${this.step}</span>
        </div>
      `
    } else {
      return html``
    }
  }

  render() {
    return html`
      <span>
        <label
          class="${classMap({
            'visually-hidden': !this.showLabel,
          })}"
          for="Quantity-${this.id}"
        >
          ${this.label} ${this.getTooltip()}
        </label>
        <div class="wrapper">
          <slot @click="${this.decrement}" name="decrease"></slot>
          <slot name="input"></slot>
          <input
            id="Quantity-${this.id}"
            class="input"
            type="number"
            name="updates[]"
            value="${this._value}"
            @change="${this.override}"
            min="0"
          />
          <slot @click="${this.increment}" name="increase"></slot>
        </div>
      </span>
    `
  }

  static styles = [
    visuallyHidden,
    css`
      :host {
        display: inline-block;
        max-width: var(--hh-max-width, 10rem);
      }

      label {
        border-bottom: solid 2px;
        display: inline-block;
        font: var(--hh-label-font, 400 14px/30px sans-serif);
        margin-bottom: 10px;
        text-align: center;
        width: 100%;
      }

      .tooltip {
        position: relative;
        display: inline-block;
      }

      .tooltip__icon {
        background-color: #bfbfbf;
        border-radius: 50%;
        color: white;
        display: block;
        font-family: serif;
        width: 1.1em;
        height: 1.1em;
        line-height: 1.1em;
      }

      .tooltip__text {
        background-color: #535353;
        border-radius: 6px;
        color: white;
        font: var(--hh-tooltip-font, 400 14px/30px sans-serif);
        padding: 0;
        position: absolute;
        bottom: 150%;
        left: -53px;
        text-align: center;
        visibility: hidden;
        width: 120px;
        z-index: 1;
      }

      .tooltip__text::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #535353 transparent transparent transparent;
      }

      .tooltip:hover .tooltip__text {
        visibility: visible;
      }

      .wrapper {
        color: var(--hh-color, #000);
        background-color: var(--hh-background, transparent);
        position: relative;
        display: flex;
        width: 100%;
      }

      .input {
        color: currentColor;
        background-color: var(--hh-background, transparent);
        font: var(--hh-input-font, 400 14px/30px sans-serif);
        text-align: center;
        background-color: transparent;
        border: 0.1rem solid var(--hh-color, #000);
        padding: var(--hh-input-padding, 0 0.5rem);
        height: var(--hh-height, 2rem);
        width: 100%;
        flex-grow: 1;
        -webkit-appearance: none;
        appearance: none;
        -moz-appearance: textfield;
      }

      ::slotted(button) {
        align-items: center;
        background-color: transparent;
        border: 0;
        color: #147bbd;
        cursor: pointer;
        display: flex;
        flex-shrink: 0;
        font: var(--hh-button-font, 400 14px/30px sans-serif);
        justify-content: center;
        padding: var(--hh-button-padding, 0.5rem);
        width: var(--hh-button-width, 2.5rem);
      }

      .input:-webkit-autofill,
      .input:-webkit-autofill:hover,
      .input:-webkit-autofill:active {
        box-shadow: 0 0 0 10rem var(--hh-color-background) inset !important;
        -webkit-box-shadow: 0 0 0 10rem var(--hh-color-background) inset !important;
      }

      .input::-webkit-outer-spin-button,
      .input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ]
}

customElements.define('hh-quantity-input', HHQuantityInput)
