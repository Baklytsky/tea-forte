import { LitElement, html, css } from 'lit'
import { visuallyHidden } from './lib/styles/mixins'

class HHQuantityInput extends LitElement {
  static properties = {
    key: {},
    label: {},
    initial: {
      type: Number,
    },
    _value: {
      state: true,
    },
  }

  constructor() {
    super()

    this.broadcast = this.broadcast.bind(this)
    this.id = Math.random() * 100000
  }

  connectedCallback() {
    super.connectedCallback()
    this._value = this.initial
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
    this._value += 1
    this.broadcast()
  }

  decrement() {
    if (!this._value) {
      return
    }

    this._value -= 1
    this.broadcast()
  }

  override(e) {
    this._value = Math.max(0, e.target.value)
    this.broadcast()
  }

  render() {
    return html`
      <span>
        <div class="wrapper">
          <slot @click="${this.decrement}" name="decrease"></slot>
          <label class="visually-hidden" for="Quantity-${this.id}">
            ${this.label | 'Quantity'}
          </label>
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
      .wrapper {
        border: 0.1rem solid var(--hh-color, #000);
        color: var(--hh-color, #000);
        background-color: var(--hh-background, transparent);
        max-width: var(--hh-max-width, 10rem);
        position: relative;
        display: flex;
        padding: var(--hh-padding, 0 0.5rem);
      }

      .input {
        color: currentColor;
        background-color: var(--hh-background, transparent);
        font: var(--hh-font);
        text-align: center;
        background-color: transparent;
        border: 0;
        padding: var(--hh-input-padding, 0 0.5rem);
        height: var(--hh-height, 2rem);
        width: 100%;
        flex-grow: 1;
        -webkit-appearance: none;
        appearance: none;
        -moz-appearance: textfield;
      }

      ::slotted(button) {
        width: var(--hh-button-width, 2.5rem);
        flex-shrink: 0;
        border: 0;
        background-color: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--hh-color, #000);
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
