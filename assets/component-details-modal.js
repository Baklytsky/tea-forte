import {
  LitElement,
  css,
  html,
  classMap,
  styleMap,
  ref,
  createRef,
  enableBodyScroll,
  disableBodyScroll,
} from './-global.min.js'

class HHDetailsModal extends LitElement {
  static properties = {
    breakpoint: {
      type: String,
    },
    label: {
      type: String,
    },
    selector: {
      type: String,
    },
    open: {
      type: Boolean,
      attribute: 'is-open',
      reflect: true,
    },
    forcedOpen: {
      attribute: 'open',
    },
    lockHeight: {
      type: Boolean,
      attribute: 'lock-height',
    },
    animation: {
      type: Number,
      attribute: 'animation',
    },
    heightOffset: {
      type: Number,
      attribute: 'heigh-offset',
    },
    _height: {
      state: true,
    },
  }

  $container = createRef()
  $details = createRef()

  constructor() {
    super()

    this.open = false
    this.closing = false
    this.lockHeight = false
    this.heightOffset = 3
    this.breakpoint = '(min-width: 768px)'
    this.bodyListener = this.bodyListener.bind(this)
  }

  requestUpdate(name, value) {
    // Allows parents to close open modals
    // if (name === 'forcedOpen') {
    //   this.toggle(false, !this.forcedOpen)
    // }
    return super.requestUpdate(name, value)
  }

  interceptEvent(e) {
    e._intercepted = true
  }

  toggle(e = false, value = undefined) {
    if (e.type === 'keyup' && e.code.toUpperCase() !== 'ENTER') {
      return true
    }

    e && e.preventDefault()

    if (this.animation && this.open) {
      this.closing = true
      this.setHeight()
      this.classList.add('closing')
      setTimeout(() => this.toggleAction(), this.animation)
    } else {
      this.toggleAction()
    }
  }

  toggleAction () {
    this.open = typeof value === 'undefined' ? !this.open : value
    this[`${this.open ? 'add' : 'remove'}BodyListener`]()
    this.open && this.lockHeight && this.setHeight()
    this.closing = false
    this.open && this.broadcast()
    this.classList.remove('closing')
    this.querySelectorAll('details').forEach(element => {
      element.removeAttribute('open')
    })
  }

  closeFromDetails(e) {
    if (
      e && e.path &&
      e.path.some((element) => {
        return element.matches && element.matches('[data-close]')
      })
    ) {
      this.toggle()
    }
  }

  closeWithEscape(e) {
    if (e.code.toUpperCase() === 'ESCAPE') {
      this.toggle()
    }
  }

  isMobile() {
    return !window.matchMedia(this.breakpoint).matches
  }

  addBodyListener() {
    this.isMobile() && disableBodyScroll(this.$container?.value)
    document.body.addEventListener('click', this.bodyListener)
  }

  removeBodyListener() {
    enableBodyScroll(this.$container?.value)
    document.body.removeEventListener('click', this.bodyListener)
  }

  bodyListener(e) {
    !e._intercepted && this.toggle()
  }

  setHeight() {
    const { top: parentTop = 0 } = this.parentNode.getBoundingClientRect() || {}
    const { top: detailsTop = 0 } =
      this.$details?.value.getBoundingClientRect() || {}

    this._height = this.isMobile()
      ? `calc(100vh - ${Math.floor(
          parentTop + detailsTop - this.heightOffset
        )}px)`
      : ''
  }

  broadcast() {
    this.dispatchEvent(
      new CustomEvent('modalOpened', {
        bubbles: true,
        composed: true,
        detail: {
          value: this,
        },
      })
    )
  }

  render() {
    return html` <!-- @ts-ignore no-incompatible-type-binding -->
      <details
        ?open="${this.open}"
        ?closing="${this.closing}"
        ?animation="${this.animation}"
        @click="${this.interceptEvent}"
        ${ref(this.$container)}
      >
        <summary
          @keyup="${this.toggle}"
          aria-expanded="${this.open}"
          aria-haspopup="dialog"
          role="button"
          ${ref(this.$container)}
        >
          <slot
            @click="${this.toggle}"
            class="${classMap({ 'is-open': this.open })}"
            name="summary"
            tabindex="-1"
          ></slot>
        </summary>
        <div
          class="content"
          role="dialog"
          aria-modal="true"
          aria-label="${this.label}"
          style="${styleMap({ height: this._height })}"
          ${ref(this.$details)}
        >
          <hh-focus-trap active="${this.open}">
            <slot
              name="details"
              @keyup="${this.closeWithEscape}"
              @click="${this.closeFromDetails}"
            ></slot>
          </hh-focus-trap>
        </div>
      </details>`
  }

  static styles = css`
    summary {
      list-style-type: none;
    }

    summary:focus {
      outline: 0.2rem solid var(--hh-color-focus);
      outline-offset: var(--hh-focus-outline-offset);
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .content {
      position: var(--hh-position, absolute);
      top: var(--hh-top);
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--hh-modal-background);
      height: var(--hh-modal-height);
      z-index: var(--hh-z-index-inner, 1);
    }

    details[animation] .content,
    details[open][closing] .content {
      opacity: 0;
      visibility: hidden;
      transition: 300ms opacity, 300ms visibility;
    }

    details[open] .content {
      opacity: 1;
      visibility: visible;
      transition: 300ms opacity, 300ms visibility;
    }

    ::slotted([slot='details']) {
      width: 100%;
      display: flex;
    }

    :host {
      z-index: var(--hh-z-index, 100);
    }
  `
}

customElements.define('hh-details-modal', HHDetailsModal)
