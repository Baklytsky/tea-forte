import { LitElement, html, css } from 'lit'
import { getChildSlot } from './lib/utils'

class HHProductWrapper extends LitElement {
  static properties = {
    _variant: {
      state: true,
    },
    _quantity: {
      state: true,
    },
    _gallery: {
      state: true,
    },
    _price: {
      state: true,
    },
  }

  constructor() {
    super()
  }

  connectedCallback() {
    this._price = 100
    super.connectedCallback()
  }

  firstUpdated() {
    this._gallery = getChildSlot(this.shadowRoot, 'hh-product-gallery', true)
  }

  requestUpdate(name, oldValue) {
    if (name === '_variant') {
      this.updateGallery()
    }
    return super.requestUpdate(name, oldValue)
  }

  updateGallery() {
    this._gallery?.setAttribute('variant', this._variant)
  }

  async addToCart(e) {
    e.preventDefault()
    // await fetch( ... )
    console.log(e)
  }

  render() {
    return html`<div
      @submit="${this.addToCart}"
      @changeVariant="${({ detail }) => {
        this._variant = detail.value
      }}"
      @changeQuantity="${({ detail }) => {
        this._quantity = detail.value
      }}"
    >
      <slot name="gallery"></slot>
      <span>$${this._price * (this._quantity || 1)}</span>
      <slot name="form"></slot>
    </div>`
  }
}

customElements.define('hh-product-wrapper', HHProductWrapper)
