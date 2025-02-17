import { LitElement, css, html, noChange } from 'lit'
import { animate } from '@lit-labs/motion'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { visuallyHidden } from './lib/styles/mixins'
import { gestures } from '@composi/gestures'

export class HHCarousel extends LitElement {
  static properties = {
    selected: { type: Number },
    showBullets: { type: Boolean, attribute: 'show-bullets' },
    showArrows: { type: Boolean, attribute: 'show-arrows' },
  }
  static styles = [
    visuallyHidden,
    css`
      :host {
        display: inline-block;
        position: relative;
        margin: auto;
        width: 100%;
        /* Defaults */
        height: var(--hh-height, 200px);
        border-radius: var(--hh-border-radius, 0);
        background: var(--hh-background, transparent);
      }

      .viewport {
        width: var(--hh-width, 100%);
        height: var(--hh-height, 200px);
        margin: auto;
        overflow: hidden;
      }

      button {
        -webkit-appearance: none;
        border: none;
      }

      .fit {
        position: relative;
        height: 100%;
        width: 100%;
      }

      .selected {
        top: -100%;
      }

      ::slotted(*) {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }

      .bullets {
        width: calc(100% - 16px);
        height: 67px;
        display: inline-flex;
        flex-wrap: wrap;
        gap: 17px;
        align-items: center;
        justify-content: flex-end;
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

      .arrows {
        position: absolute;
        z-index: 999;
        height: 100%;
        width: 100%;
      }

      .previous,
      .next {
        background: var(--hh-next-arrow);
        cursor: pointer;
        width: var(--hh-arrow-width, 20px);
        height: var(--hh-arrow-height, 20px);
        position: absolute;
        top: 50%;
        margin-top: calc(var(--hh-arrow-height) / -2);
      }

      .previous {
        transform: rotate(180deg);
        left: 0;
      }

      .next {
        right: 0;
      }
    `,
  ]

  constructor() {
    super()
    gestures()
    this.selected = 0
  }

  get selectedSlot() {
    return (this.__selectedSlot ??=
      this.renderRoot?.querySelector('slot[name="selected"]') ?? null)
  }

  get previousSlot() {
    return (this.__previousSlot ??=
      this.renderRoot?.querySelector('slot[name="previous"]') ?? null)
  }

  left = 0
  selectedInternal = 0

  get maxSelected() {
    return this.childElementCount - 1
  }

  hasValidSelected() {
    return this.selected >= 0 && this.selected <= this.maxSelected
  }

  render() {
    const p = this.selectedInternal
    const s = (this.selectedInternal = this.hasValidSelected()
      ? this.selected
      : this.selectedInternal)
    const shouldMove = this.hasUpdated && s !== p
    const atStart = p === 0
    const toStart = s === 0
    const atEnd = p === this.maxSelected
    const toEnd = s === this.maxSelected
    const shouldAdvance =
      shouldMove && (atEnd ? toStart : atStart ? !toEnd : s > p)
    const delta = (shouldMove ? Number(shouldAdvance) || -1 : 0) * 100
    this.left -= delta
    const animateLeft = `${this.left}%`
    const selectedLeft = `${-this.left}%`
    const previousLeft = `${-this.left - delta}%`

    return html`
      <div
        class="${classMap({
          bullets: true,
          'visually-hidden': !this.showBullets,
        })}"
      >
        ${[...Array(this.childElementCount)].map(
          (x, i) =>
            html`<button
              @click="${this.bulletClickHandler}"
              class="${classMap({
                bullet: true,
                active: s === i,
              })}"
              data-slide="${i}"
            ></button>`
        )}
      </div>
      <div
        class="${classMap({
          arrows: true,
          'visually-hidden': !this.showArrows,
        })}"
      >
        <button
          class="previous"
          @click="${this.previousArrowClickHandler}"
        ></button>
        <button class="next" @click="${this.nextArrowClickHandler}"></button>
      </div>
      <div class="viewport">
        <div class="fit" ${animate()} style=${styleMap({ left: animateLeft })}>
          <div
            class="fit"
            style=${shouldMove ? styleMap({ left: previousLeft }) : noChange}
          >
            <slot name="previous"></slot>
          </div>
          <div
            class="fit selected"
            style=${shouldMove ? styleMap({ left: selectedLeft }) : noChange}
            @swipe="${this.swipeHandler}"
          >
            <slot name="selected"></slot>
          </div>
        </div>
      </div>
    `
  }

  previous = -1
  async updated(changedProperties) {
    if (
      (changedProperties.has('selected') || this.previous === -1) &&
      this.hasValidSelected()
    ) {
      this.updateSlots()
      this.previous = this.selected
    }
  }

  updateSlots() {
    // unset old slot state
    this.selectedSlot.assignedElements()[0]?.removeAttribute('slot')
    this.previousSlot.assignedElements()[0]?.removeAttribute('slot')
    // set slots
    this.children[this.previous]?.setAttribute('slot', 'previous')
    this.children[this.selected]?.setAttribute('slot', 'selected')
  }

  dispatchChangeSlide() {
    const change = new CustomEvent('change', {
      detail: this.selected,
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(change)
  }

  swipeHandler(e) {
    switch (e.data) {
      case 'left':
        this.nextArrowClickHandler()
        break
      case 'right':
        this.previousArrowClickHandler()
        break
    }
  }

  bulletClickHandler(e) {
    this.selected = parseInt(e.target.dataset.slide)
    this.dispatchChangeSlide()
  }

  previousArrowClickHandler() {
    if (this.selected <= 0) return
    this.selected--
    this.dispatchChangeSlide()
  }

  nextArrowClickHandler() {
    if (this.selected >= this.childElementCount - 1) return
    this.selected++
    this.dispatchChangeSlide()
  }
}
customElements.define('hh-carousel', HHCarousel)
