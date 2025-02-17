import { LitElement, html, css, ifDefined, classMap } from './-global.min.js'

class HHCustomSelect extends LitElement {
  static properties = {
    options: {
      type: Object,
    },
    name: {
      type: String,
    },
    active: {
      type: String,
    },
    lang: {
      type: Boolean,
    },
    _selected: {
      state: true,
    },
    _active: {
      state: true,
    },
  }

  constructor() {
    super()

    this.handleBodyClick = this.handleBodyClick.bind(this)

    this.uuid = Math.random() * (1000000 - 1) + 1
  }

  connectedCallback() {
    super.connectedCallback()
    this._selected = this.active
    document.body.addEventListener('click', this.handleBodyClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.body.addEventListener('click', this.handleBodyClick)
  }

  handleBodyClick(e) {
    if (
      e.path?.some((node) => {
        return node === this
      })
    ) {
      return true
    }

    this._active && this.toggle()
  }

  toggle(e = false) {
    if (e && e.type === 'keyup' && !~['ESCAPE'].indexOf(e.code.toUpperCase())) {
      return true
    }

    this._active = !this._active
  }

  selectValue(e, value) {
    e.preventDefault()
    this._selected = value
    ;(this.querySelector('[slot="input"]') || {}).value = value
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          value,
        },
      })
    )
    this.toggle()
  }

  sanitize(value) {
    return value.replace('&amp;', '&')
  }

  render() {
    return html`<div>
      <div id="${this.uuid}-label">
        <slot name="title"></slot>
      </div>
      <div class="container">
        <button
          @click=${this.toggle}
          type="button"
          class="button"
          aria-expanded="${this._active}"
          aria-controls="${this.uuid}-list"
          aria-describedby="${this.uuid}-label"
        >
          <slot name="button"></slot>
          <slot name="icon"></slot>
        </button>
        <slot name="input"></slot>
        <hh-focus-trap active="${this._active}">
          <ul
            id="${this.uuid}-list"
            class="${classMap({
              list: true,
              'is-active': this._active,
            })}"
            @keyup="${this.toggle}"
            aria-hidden="${!this._active}"
            role="list"
          >
            ${this.options.map((option) => {
              this.lang && (option.lang = option.value)
              return html`<li
                class="${classMap({
                  option: true,
                  'is-active': option.value === this._selected,
                })}"
              >
                <a
                  @click="${(e) => this.selectValue(e, option.value)}"
                  class="link"
                  href="#"
                  hreflang="${ifDefined(option.lang)}"
                  lang="${ifDefined(option.lang)}"
                >
                  ${this.sanitize(option.label)}
                </a>
              </li>`
            })}
          </ul>
        </hh-focus-trap>
      </div>
    </div>`
  }

  static styles = css`
    .container {
      position: relative;
    }

    .button {
      display: flex;
      height: var(--hh-height, 35px);
      background: transparent;
      padding: 0;
      border: var(--hh-border-width, 1px) solid currentColor;
      padding: var(--hh-button-padding, 2em);
      cursor: pointer;
    }

    ::slotted([slot='button']),
    ::slotted([slot='icon']) {
      display: flex;
      height: 100%;
      align-items: center;
    }

    ::slotted([slot='icon']) {
      width: 10px;
      margin-left: 30px;
    }

    .list {
      width: max-content;
      min-height: var(--hh-options-min-height, 8.2rem);
      max-height: var(--hh-options-max-height, 19rem);
      min-width: var(--hh-options-min-width, 12rem);
      max-width: var(--hh-options-max-width, 22rem);
      display: block;
      overflow-y: auto;
      position: absolute;
      bottom: 100%;
      background-color: var(--hh-background, white);
      border: var(--hh-border-width, 1px) solid currentColor;
      padding-left: 0;
      z-index: 1;
      visibility: hidden;
      opacity: 0;
      transform: translateY(0);
      transition: visibility var(--hh-duration, 300ms) var(--hh-duration, 300ms),
        opacity var(--hh-duration, 300ms), transform var(--hh-duration, 300ms);
    }

    .list.is-active {
      transition: transform var(--hh-duration, 300ms) 1ms,
        opacity var(--hh-duration, 300ms) 1ms, visibility 1ms;
      visibility: visible;
      opacity: 1;
      transform: translateY(5px);
    }

    .option {
      list-style: none;
    }

    .option.is-active {
      opacity: 0.5;
    }

    .link {
      display: block;
      text-decoration: none;
      padding: var(--hh-link-padding, 1em);
      color: inherit;
    }
  `
}

customElements.define('hh-custom-select', HHCustomSelect)
