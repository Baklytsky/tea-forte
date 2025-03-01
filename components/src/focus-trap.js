import { LitElement, html } from 'lit'

class HHFocusTrap extends LitElement {
  static properties = {
    isActive: {
      attribute: 'active',
      converter(value) {
        if (value === 'false') return false
        return true
      },
    },
    selector: {
      type: String,
    },
  }

  constructor() {
    super()

    this.focusIn = this.focusIn.bind(this)
    this.keyDown = this.keyDown.bind(this)
  }

  requestUpdate(name, oldValue) {
    const newValue = this[name]
    if (name === 'isActive') {
      if (newValue === true) {
        this.addTrapFocus(this.renderRoot)
        this.selectInitialElement()
      } else {
        this.removeTrapFocus()
      }
    }

    return super.requestUpdate(name, oldValue)
  }

  selectInitialElement() {
    for (let i = 0; i < this.elements.length; i++) {
      if (!this.selector) {
        this.elements[i].focus()
        break
      }
      if (this.elements[i].matches(this.selector)) {
        this.elements[i].focus()
        break
      }
    }
  }

  isHidden(element) {
    return (
      element.getAttribute('tabindex') === '-1' ||
      element.hasAttribute('hidden') ||
      (element.hasAttribute('aria-hidden') &&
        element.getAttribute('aria-hidden') !== 'false') ||
      element.style.display === `none` ||
      element.style.opacity === `0`
    )
  }

  isFocusable(element) {
    return (
      element.hasAttribute('tabindex') ||
      ((element instanceof HTMLAnchorElement ||
        element instanceof HTMLAreaElement) &&
        element.hasAttribute('href')) ||
      element instanceof HTMLButtonElement ||
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLIFrameElement
    )
  }

  traverseSlot(element, depth) {
    const assignedNodes = element
      .assignedNodes()
      .filter((node) => node.nodeType === 1)
    if (assignedNodes.length > 0) {
      const parent = assignedNodes[0].parentElement
      return this.queryShadowRoot(parent, depth + 1)
    }

    return []
  }

  queryShadowRoot(root, depth = 1, maxDepth = 20) {
    if (!root) {
      return []
    }
    const matches = []
    for (const $child of Array.from(root.children || [])) {
      if (this.isHidden($child)) {
        continue
      }

      if (this.isFocusable($child)) {
        matches.push($child)
      }

      if ($child.shadowRoot != null) {
        matches.push(...this.queryShadowRoot($child.shadowRoot, depth + 1))
      } else if ($child.tagName === 'SLOT') {
        matches.push(...this.traverseSlot($child, depth))
      } else {
        matches.push(...this.queryShadowRoot($child, depth + 1))
      }
    }
    return matches
  }

  focusIn(event) {
    if (
      event.target !== this.renderRoot &&
      event.target !== this.last &&
      event.target !== this.first
    ) {
      return
    }

    event.target.addEventListener('keydown', this.keyDown)
  }

  keyDown(event) {
    if (event.code.toUpperCase() !== 'TAB') return
    if (event.target === this.last && !event.shiftKey) {
      event.preventDefault()
      this.first.focus()
    }
    if (
      (event.target === this.renderRoot || event.target === this.first) &&
      event.shiftKey
    ) {
      event.preventDefault()
      this.last.focus()
    }
  }

  removeTrapFocus() {
    ;(this.elements || []).forEach((element) => {
      element.removeEventListener('focusin', this.focusIn)
      element.removeEventListener('keydown', this.keyDown)
    })
  }

  addTrapFocus(root) {
    this.removeTrapFocus()

    this.elements = this.queryShadowRoot(root)
    this.first = this.elements[0]
    this.last = this.elements[this.elements.length - 1]

    this.elements.forEach((element) => {
      element.addEventListener('focusin', this.focusIn)
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeTrapFocus()
  }

  render() {
    return html`<slot></slot> `
  }
}
customElements.define('hh-focus-trap', HHFocusTrap)
