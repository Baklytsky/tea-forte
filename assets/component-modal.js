import {
  LitElement,
  html,
  css,
  unsafeHTML,
  utils,
  paths,
  t,
  broadcastReceiver,
} from './-global.min.js'

class HHModal extends LitElement {
  static properties = {
    id: {},
    open: {
      reflect: true,
    },
  }

  constructor() {
    super()
  }

  requestUpdate(name, oldValue) {
    if (name === 'open' && !!this[name]) {
      utils.pauseAllMedia()
    }

    return super.requestUpdate(name, oldValue)
  }

  connectedCallback() {
    super.connectedCallback()

    this.receiver = broadcastReceiver('modal', (...args) => {
      this.openFromDocument(...args)
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.receiver.disconnect()
  }

  openFromDocument(data) {
    if (this.id === data.id) {
      this.open = true
    } else {
      this.open = false
      return
    }

    if (data.element) {
      setTimeout(() => {
        this.querySelector(`[id="${data.element}"]`)?.scrollIntoView()
      }, 0)
    }
  }

  close(event) {
    if (event.type === 'click') {
      this.open = false
      return
    }
    event.code.toUpperCase() === 'ESCAPE' && (this.open = false)
  }

  render() {
    return html`<div
      @keyup="${this.close}"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <button
        @click="${this.close}"
        class="button"
        type="button"
        aria-label="${t('accessibility.close')}"
      >
        ${unsafeHTML(paths.close)}
      </button>
      <div
        class="content"
        role="document"
        aria-label="${t('products.modal.label')}"
        tabindex="0"
      >
        <hh-focus-trap active="${this.open}">
          <slot></slot>
        </hh-focus-trap>
      </div>
    </div>`
  }

  static styles = css`
    :host {
      background-color: var(--hh-background);
      box-sizing: border-box;
      height: 100%;
      left: 0;
      opacity: 0;
      position: fixed;
      top: 0;
      width: 100%;
      visibility: hidden;
      z-index: -1;
    }

    :host([size='flyout']) {
      max-width: var(--hh-max-width, 400px);
      height: auto;
      top: var(--hh-flyout-offset, 30px);
      right: var(--hh-flyout-offset, 30px);
      left: revert;
      border: 0.1rem solid var(--hh-border-color);
    }

    :host([open='true']) {
      opacity: 1;
      visibility: visible;
      z-index: 1000;
    }

    .button {
      width: 4rem;
      position: fixed;
      top: 4rem;
      right: 4rem;
      display: flex;
      background-color: var(--hh-background);
      border: 0.1rem solid var(--hh-border-color);
      border-radius: 50%;
      color: var(--hh-color);
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 1.2rem;
      z-index: 2;
    }

    :host([size='flyout']) .button {
      position: absolute;
      top: var(--hh-close-top, 10px);
      right: var(--hh-close-right, 10px);
    }

    .content {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: auto;
      width: 100%;
      padding: var(--hh-padding);
    }

    :host([size='flyout']) .content {
      height: auto;
    }

    ::slotted(*) {
      width: var(--hh-slotted-width, auto);
      height: var(--hh-slotted-height, auto);
      margin: var(--hh-slotted-margin);
    }
  `
}

customElements.define('hh-modal', HHModal)
