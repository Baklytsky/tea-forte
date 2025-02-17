import { LitElement, html } from './-global.min.js'

class HHBroadcast extends LitElement {
  static properties = {
    on: {},
    event: {},
    data: {},
  }

  constructor() {
    super()

    this.method = 'document'
    this.on = 'click'
  }

  connectedCallback() {
    super.connectedCallback()

    if (this.on === 'click') {
      return true
    }

    this.addEventListener(this.on, (event) => {
      document.body.setAttribute(this.event, JSON.stringify(event.detail))
    })
  }

  onClick(event) {
    if (this.on !== 'click') {
      return true
    }

    if (this.method === 'document') {
      document.body.setAttribute(this.event, this.data)
    }
  }

  render() {
    return html`<slot @click="${this.onClick}"></slot>`
  }
}

customElements.define('hh-broadcast', HHBroadcast)
