import { LitElement, html, css } from 'lit'
import { getChildSlot } from './lib/utils'

class HHProductGallery extends LitElement {
  static properties = {
    variant: {
      type: String,
    },
    _current: {
      state: true,
    },
    _children: {
      state: true,
    },
  }

  constructor() {
    super()
  }

  firstUpdated() {
    this._children = getChildSlot(this.shadowRoot, 'img, div')
  }

  requestUpdate(name, oldValue) {
    name === 'variant' && this.updateActiveImage()
    return super.requestUpdate(name, oldValue)
  }

  updateActiveImage() {
    this._children.forEach((child) => {
      child.matches(`[data-id="${this.variant}"]`)
        ? this.showChild(child)
        : this.hideChild(child)
    })
  }

  showChild(child) {
    const SRC = child.getAttribute('data-src')
    if (!!SRC) {
      child.setAttribute('src', SRC)
      child.removeAttribute('data-src')
    }
    child.classList.remove('hidden')
  }

  hideChild(child) {
    child.classList.add('hidden')
  }

  render() {
    return html`<slot></slot>`
  }

  static styles = css`
    ::slotted(img) {
      width: var(--image-width, 300px);
      height: var(--image-height, 300px);
      object-fit: cover;
    }
    ::slotted(.hidden),
    ::slotted([data-src]) {
      display: none;
    }
  `
}

customElements.define('hh-product-gallery', HHProductGallery)
