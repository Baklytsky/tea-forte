import { LitElement, html, css } from 'lit'

class HHCartItem extends LitElement {
  static properties = {
    index: {
      type: Number,
    },
    item: {
      converter(value) {
        return JSON.parse(value.replaceAll('~~~', '"'))
      },
    },
    _isLoading: {
      state: true,
    },
    _errorMessage: {
      state: true,
    },
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    const { line, message } =
      window?.Shopify?.pendingCartUpdateErrorMessage || {}
    if (line === this.index) {
      this._errorMessage = message
    }
  }

  onChange(event) {
    this._isLoading = true
    event.detail.index = this.index
  }

  remove(event) {
    event.preventDefault()
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          value: 0,
          index: this.index,
        },
      })
    )
  }

  render() {
    return html` <div
      class="wrapper"
      style="${this._isLoading ? 'pointer-events: none; opacity: 0.5' : ''}"
    >
      <span class="media">
        ${this.item.image
          ? html`
              <img
                src="${this.item.featured_image.url}"
                alt="${this.item.featured_image.alt}"
                loading="lazy"
                width="120"
                height="${160 / this.item.featured_image.ratio}"
              />
            `
          : ``}
      </span>
      <span class="details">
        <a href="${this.item.url}" class="name">${this.item.product_title}</a>
        ${this._errorMessage
          ? html`
              <p class="error">
                <span class="error-text">${this._errorMessage}</span>
                <span @click="${() => (this._errorMessage = false)}">X</span>
              </p>
            `
          : ''}
      </span>
      <span class="prices">
        <div class="price-wrapper">
          <span>${formatPrice(this.item.original_price)}</span>
        </div>
      </span>
      <span class="remove">
        <custom-link
          @click="${this.remove}"
          aria-label="${this.$t('sections.cart.remove_title', 'Remove', {
            title: this.item.title,
          })}"
        >
          ${this.$t('sections.cart.remove', 'remove')}
        </custom-link>
      </span>
      <quantity-input
        class="quantity"
        @change="${this.onChange}"
        line="${this.index}"
        title="${this.item.product_title}"
        initial="${this.item.quantity}"
      ></quantity-input>
    </div>`
  }

  static styles = css`
    .wrapper {
      padding-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
    .media {
      grid-row: 1 / 3;
      justify-self: stretch;
      align-self: center;
    }
    .name {
      color: var(--hh-color-foreground);
      text-decoration: none;
      display: block;
      font-size: 1.8rem;
      line-height: 1.2;
      font-weight: 600;
      word-break: break-word;
    }
    .name:hover {
      text-decoration: underline;
      text-underline-offset: 0.3rem;
      text-decoration-thickness: 0.2rem;
    }
    .remove {
      grid-column: 2;
      align-self: flex-end;
    }
    .quantity {
      grid-column: 3;
      align-self: flex-end;
    }
    .price-wrapper {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      margin: 0;
    }
  `
}

customElements.define('hh-cart-item', HHCartItem)
