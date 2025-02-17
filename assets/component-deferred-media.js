import { utils } from './-global.min.js'

class DeferredMedia extends HTMLElement {
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
  }
}

customElements.define('deferred-media', DeferredMedia)
