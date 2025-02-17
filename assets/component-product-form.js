import { utils, LitElement, html, broadcastReceiver } from './-global.min.js'

const { serializeForm, addToCart, reRenderShopifySections } = utils

class HHProductForm extends LitElement {
  constructor() {
    super()

    this.form = this.querySelector('form')
    this.quantityInput = this.querySelector('[name="quantity"]')
    this.submitButton = this.querySelector('[type="submit"]')

    this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
  }

  connectedCallback() {
    super.connectedCallback()

    this.submitButton.disabled = true

    this.receiver = broadcastReceiver('quantity', (...args) => {
      this.getQuantityFromDocument(...args)
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.receiver.disconnect()
  }

  getQuantityFromDocument(data) {
    if (this.quantityInput) {
      if (typeof data.value === 'undefined') {
        this.quantityInput.value = 1
        return
      }
      this.quantityInput.value = data.value
    }

    if (data.value === 0) {
      this.submitButton.disabled = true
    } else {
      this.submitButton.disabled = false
    }
  }

  async onSubmitHandler(event) {
    event.preventDefault()

    if (this.quantityInput.value === 0) return

    this.submitButton.setAttribute('disabled', true)
    this.submitButton.classList.add('loading')

    reRenderShopifySections(
      await addToCart(JSON.parse(serializeForm(this.form)))
    )

    this.dispatchEvent(
      new CustomEvent('productAdded', {
        bubbles: true,
        composed: true,
        detail: {
          id: 'cart-notification',
        },
      })
    )

    this.submitButton.removeAttribute('disabled')
    this.submitButton.classList.remove('loading')
  }

  render() {
    return html`<slot></slot>`
  }
}

customElements.define('hh-product-form', HHProductForm)
