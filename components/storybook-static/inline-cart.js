import { LitElement, html, css } from 'lit'
import { updateQuantity, reRenderShopifySections } from './lib/utils'
import { visuallyHidden } from './lib/styles/mixins'

class HHInlineCart extends LitElement {
  static properties = {
    loading: {
      reflect: true,
    },
    _trapFocus: {
      state: true,
    },
  }

  constructor() {
    super()

    this.locales = {
      isLoading() {
        return window?.HH?.i18n?.isLoading || 'Is Loading'
      },
    }
  }

  async onChange(event) {
    this.loading = true

    document.activeElement.blur()

    reRenderShopifySections(
      await updateQuantity(
        event.detail.key,
        event.detail.value || 0,
        'inline-cart,header'
      )
    )

    this.loading = false
  }

  async onRemove(event) {
    event?.detail?.event?.preventDefault()
    await this.onChange(event)
  }

  render() {
    return html`<div>
      <slot name="error"></slot>
      <slot
        name="body"
        @changeQuantity="${this.onChange}"
        @removeItem="${this.onRemove}"
      ></slot>
      <div>
        <p
          class="visually-hidden"
          aria-live="polite"
          aria-hidden="${this.loading ? false : true}"
          role="status"
        >
          ${this.locales.isLoading()}
        </p>
      </div>
    </div> `
  }

  static styles = [visuallyHidden, css``]
}

customElements.define('hh-inline-cart', HHInlineCart)
