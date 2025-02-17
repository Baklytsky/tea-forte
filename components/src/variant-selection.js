import { LitElement, html, css } from 'lit'

class HHVariantSelection extends LitElement {
  static properties = {
    id: {
      type: String,
    },
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  broadcast(e) {
    this.dispatchEvent(
      new CustomEvent('changeVariant', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.id,
        },
      })
    )
  }

  render() {
    return html`<slot @click="${this.broadcast}"></slot>`
  }
}

customElements.define('hh-variant-selection', HHVariantSelection)
