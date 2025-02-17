import {
  LitElement,
  html,
  css,
  unsafeHTML,
  ref,
  createRef,
  utils,
  paths,
  t,
  styles,
  classMap,
} from './-global.min.js'

class HHSlider extends LitElement {
  static properties = {
    active: {
      reflect: true,
    },
    breakpoint: {
      type: Number,
    },
    _current: {
      state: true,
    },
    _total: {
      state: true,
    },
    showCounter: {
      type: Boolean,
      attribute: 'show-counter',
    },
    showButtons: {
      type: Boolean,
      attribute: 'show-buttons',
    },
    showBullets: {
      type: Boolean,
      attribute: 'show-bullets',
    },
  }

  $container = createRef()
  $next = createRef()
  $prev = createRef()

  constructor() {
    super()

    this._total = 0
    this._current = 1

    this.updateUI = this.updateUI.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()

    this.items = Array.from(this.querySelectorAll('[slot="item"]'))
    this._total = this.items.length
    this._bulletCount = Math.max(this._total - 3, 0)
    this._showButtonDesktop = (this._total > 4);

    this.observer = new ResizeObserver((...args) => {
      this.activate(...args)
    })

    setTimeout(() => {
      this.$container?.value?.addEventListener('scroll', this.updateUI)
      if (this.breakpoint) {
        this.observer.observe(document.body)
      }
    }, 0)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.$container?.value?.removeEventListener('scroll', this.updateUI)
    this.observer.disconnect()
  }

  activate([first, ...all]) {
    const { contentRect: { width = 0 } = {} } = first || {}
    if (width < this.breakpoint && !this.active) {
      this.active = true
    } else if (width >= this.breakpoint && this.active) {
      this.active = false
    }
  }

  updateUI() {
    if (!this._total) {
      return
    }

    this._current =
      Math.round(
        this.$container?.value?.scrollLeft / this.items[0].clientWidth
      ) + 1
    this._current === 1
      ? this.$prev?.value?.setAttribute('disabled', true)
      : this.$prev?.value?.removeAttribute('disabled')

    this._current === this._total
      ? this.$next?.value?.setAttribute('disabled', true)
      : this.$next?.value?.removeAttribute('disabled')
  }

  move(event) {
    event.preventDefault()
    const slideScrollPosition =
      event.currentTarget.name === 'next'
        ? this.$container?.value?.scrollLeft + this.items[0].clientWidth
        : this.$container?.value?.scrollLeft - this.items[0].clientWidth
    this.$container?.value?.scrollTo({
      left: slideScrollPosition,
    })
  }

  bulletClickHandler(event) {
    const slideScrollPosition =
      this.items[0].clientWidth * event.target.dataset.slide
    this.$container?.value?.scrollTo({
      left: slideScrollPosition,
    })
  }

  render() {
    return html`
      <div
        class="${classMap({
          bullets: true,
          'bullets--desktop': true,
          'visually-hidden': !this.showBullets,
        })}"
      >
        ${[...Array(this._bulletCount)].map(
          (x, i) =>
            html`<button
              @click="${this.bulletClickHandler}"
              class="${classMap({
                bullet: true,
                active: this._current - 1 === i,
              })}"
              data-slide="${i}"
            ></button>`
        )}
      </div>
      <div class="container" ${ref(this.$container)}>
        <slot name="item"></slot>
      </div>
      <div
        class="${classMap({
          buttons: true,
          'visually-hidden': !this.showButtons,
          'visually-hidden-desktop': !this._showButtonDesktop,
        })}"
      >
        <div
          class="${classMap({
            counter: true,
            'visually-hidden': !this.showCounter,
          })}"
        >
          <span class="counter--current">${this._current}</span>
          <span aria-hidden="true"> / </span>
          <span class="visually-hidden">${t('accessibility.of', 'of')}</span>
          <span class="counter--total">${this._total ? this._total : ''}</span>
        </div>
        <button
          ${ref(this.$prev)}
          @click="${this.move}"
          type="button"
          class="button button--prev"
          name="previous"
          aria-label="${t('accessibility.previous_slide', 'Previous')}"
        ></button>
        <button
          ${ref(this.$next)}
          @click="${this.move}"
          type="button"
          class="button button--next"
          name="next"
          aria-label="${t('accessibility.next_slide', 'Next')}"
        ></button>
      </div>
      <div
        class="${classMap({
          bullets: true,
          'visually-hidden': !this.showBullets,
        })}"
      >
        ${[...Array(this._total)].map(
          (x, i) =>
            html`<button
              @click="${this.bulletClickHandler}"
              class="${classMap({
                bullet: true,
                active: this._current - 1 === i,
              })}"
              data-slide="${i}"
            ></button>`
        )}
      </div>
    `
  }

  static styles = [
    styles.visuallyHidden,
    css`
      :host([active='true']) {
        overflow: hidden;
        position: relative;
      }

      button {
        -webkit-appearance: none;
        border: none;
      }

      .container {
        width: var(--hh-container-width, 100%);
        display: var(--hh-container-flex);
        flex-wrap: var(--hh-container-flex-wrap);
        margin: var(--hh-container-margin);
        overflow: hidden;
      }

      :host([active='true']) .container {
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        background: var(--hh-background);
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        scroll-padding-left: 1rem;
        -webkit-overflow-scrolling: touch;
      }

      :host([active='true']) ::slotted(*) {
        width: var(--hh-cell-width) !important;
      }

      .buttons {
        background: transparent;
        display: flex;
        justify-content: space-evenly;
        border: none;
        display: none;
        width: 100%;
      }

      @media screen and (min-width: 990px) {
        .buttons {
          position: absolute;
          justify-content: space-between;
          left: -15%;
          right: -15%;
          top: 0;
          bottom: 0;
          width: unset;
        }
      }

      :host([active='true']) .buttons {
        display: flex;
      }

      .counter {
        margin: 0 2rem;
      }

      .button {
        width: var(--hh-button-width, 44px);
        height: var(--hh-button-height, 44px);
        cursor: pointer;
        color: var(--hh-color);
        border: none;
        background: var(--hh-button-background);
      }

      .button svg {
        height: 0.6rem;
      }

      .button--prev,
      .button--next {
        background: var(--hh-next-arrow);
        cursor: pointer;
        width: var(--hh-arrow-width, 20px);
        height: var(--hh-arrow-height, 20px);
        margin-top: calc(var(--hh-arrow-height) / -2);
      }

      @media screen and (min-width: 990px) {
        .button--prev,
        .button--next {
          position: absolute;
          top: 50%;
        }
      }

      .button--prev {
        transform: rotate(-180deg);
      }

      .button--next {
        right: 0;
      }

      .bullets {
        width: 100%;
        height: 67px;
        display: inline-flex;
        flex-wrap: wrap;
        gap: 17px;
        align-items: center;
        justify-content: center;
      }

      .bullets--desktop {
        display: none;
        justify-content: flex-end;
      }

      @media screen and (min-width: 990px) {
        .bullets {
          display: none;
        }

        .bullets--desktop {
          display: inline-flex;
        }

        .visually-hidden-desktop {
          position: absolute !important;
          overflow: hidden;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          border: 0;
          clip: rect(0 0 0 0);
          word-wrap: normal !important;
        }
      }

      .bullet {
        height: 13px;
        width: 13px;
        border-radius: 50%;
        background: var(--hh-bullet-background, #d9d9d9);
        cursor: pointer;
      }

      .bullet.active {
        background: var(--hh-bullet-active-background, black);
      }
    `,
  ]
}

customElements.define('hh-slider', HHSlider)
