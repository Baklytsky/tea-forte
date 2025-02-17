import { LitElement, html, css } from 'lit'
import { toggle, updateQuantity, reRenderShopifySections } from './lib/utils'
import { visuallyHidden } from './lib/styles/mixins'

class HHMiniCart extends LitElement {
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

    this.handleBodyClick = this.handleBodyClick.bind(this)

    this.addEventListener(
      'transitionend',
      () => {
        this._trapFocus = true
      },
      { once: true }
    )
  }

  connectedCallback() {
    super.connectedCallback()
    document.body.addEventListener('click', this.handleBodyClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.body.addEventListener('click', this.handleBodyClick)
  }

  handleBodyClick(e) {
    if (
      e.path?.some((node) => {
        return node.matches && node.matches('hh-mini-cart')
      })
    ) {
      return true
    }

    if (!e.defaultPrevented && this.isOpen()) {
      this.toggle()
    }
  }

  isOpen() {
    return !!document.body.classList.contains('mini-cart-is-active')
  }

  toggle() {
    toggle(document.body, ['mini-cart-is-active'])
  }

  async onChange(event) {
    this.loading = true

    document.activeElement.blur()

    reRenderShopifySections(
      await updateQuantity(event.detail.key, event.detail.value || 0)
    )

    this.loading = false
  }

  async onRemove(event) {
    event?.detail?.event?.preventDefault()
    await this.onChange(event)
  }

  render() {
    return html`<div>
      <hh-focus-trap active="${this._trapFocus}">
        <slot name="close" @click="${this.toggle}"></slot>
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
      </hh-focus-trap>
    </div> `
  }

  static styles = [visuallyHidden, css``]
}

customElements.define('hh-mini-cart', HHMiniCart)
