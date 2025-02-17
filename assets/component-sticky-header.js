import { LitElement, html, css, styleMap, utils } from './-global.min.js'

class HHStickyHeader extends LitElement {
  static properties = {
    closeWhenHidden: {
      type: String,
      attribute: 'close-when-hidden',
    },
    _state: {
      type: Number,
      state: true,
    },
    _height: {
      type: Number,
      state: true,
    },
  }

  constructor() {
    super()

    this.headerBounds = {}
    this.currentScrollTop = 0
    this.closeWhenHidden = 'hh-details-modal'

    this._state = -1
  }

  connectedCallback() {
    super.connectedCallback()
    this.onScrollHandler = this.onScroll.bind(this)
    window.addEventListener('scroll', this.onScrollHandler)
    this.createObserver()
    setTimeout(() => {
      this.setSpacerHeight()
    }, 0)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('scroll', this.onScrollHandler)
  }

  createObserver() {
    let observer = new IntersectionObserver((entries, observer) => {
      this.headerBounds = entries[0].intersectionRect
      observer.disconnect()
    })

    observer.observe(this)
  }

  setSpacerHeight() {
    const { height } = this.getBoundingClientRect()
    this._height = height
    this._state = 0
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (
      scrollTop > this.currentScrollTop &&
      scrollTop > this.headerBounds.bottom
    ) {
      requestAnimationFrame(this.hide.bind(this))
    } else if (
      scrollTop < this.currentScrollTop &&
      scrollTop > this.headerBounds.bottom
    ) {
      requestAnimationFrame(this.reveal.bind(this))
    } else if (scrollTop <= this.headerBounds.top) {
      requestAnimationFrame(this.reset.bind(this))
    }

    this.currentScrollTop = scrollTop
  }

  hide() {
    if (this._state === 1) {
      return
    }
    this._state = 1

    utils.all(this.closeWhenHidden, this.header).map((element) => {
      element.setAttribute('open', false)
    })
  }

  reveal() {
    if (this._state === 2) {
      return
    }
    this._state = 2
  }

  reset() {
    if (this._state === 0) {
      return
    }
    this._state = 0
  }

  render() {
    return html`<div
        class="container"
        style="${styleMap({
          position: this._state === -1 ? 'relative' : 'fixed',
          transform: this._state === 1 ? `translateY(-100%)` : 'translateY(0)',
        })}"
      >
        <slot></slot>
      </div>
      <div
        class="spacer"
        style="${styleMap({
          height: `${this._height}px`,
        })}"
      ></div>`
  }

  static styles = css`
    .container {
      left: 0;
      width: 100%;
      z-index: var(--hh-z-index, 100);
      transform: translateY(0);
      transition: transform var(--hh-duration, 500ms);
      background-color: var(--hh-background, transparent);
    }

    .spacer {
      position: relative;
    }
  `
}

customElements.define('hh-sticky-header', HHStickyHeader)
