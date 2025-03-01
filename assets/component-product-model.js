import { utils } from './-global.min.js'

class ProductModel extends HTMLElement {
  constructor() {
    super()

    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
      'click',
      this.loadContent.bind(this)
    )
  }

  loadContent() {
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div')
      content.appendChild(
        this.querySelector('template').content.firstElementChild.cloneNode(true)
      )

      this.setAttribute('loaded', true)

      utils.pauseAllMedia()

      this.appendChild(
        content.querySelector('video, model-viewer, iframe')
      ).focus()
    }

    Shopify.loadFeatures([
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this.setupModelViewerUI.bind(this),
      },
    ])
  }

  setupModelViewerUI(errors) {
    if (errors) return

    this.modelViewerUI = new Shopify.ModelViewerUI(
      this.querySelector('model-viewer')
    )
  }
}
customElements.define('product-model', ProductModel)

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ])
  },

  setupShopifyXR(errors) {
    if (errors) return

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      )
      return
    }

    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent))
      modelJSON.remove()
    })
    window.ShopifyXR.setupXRElements()
  },
}

window.addEventListener('DOMContentLoaded', () => {
  window.ProductModel?.loadShopifyXR()
})
