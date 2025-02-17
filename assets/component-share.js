class ShareButton extends HTMLElement {
  constructor() {
    super()

    this.elements = {
      shareButton: this.querySelector('button'),
      successMessage: this.querySelector('[id^="ShareMessage"]'),
      urlInput: this.querySelector('input'),
      mainDetailsToggle: this.querySelector('details'),
    }

    this.addEventListener('keyup', this.onKeyUp)
    this.elements.mainDetailsToggle.addEventListener(
      'focusout',
      this.onFocusOut.bind(this)
    )

    if (navigator.share) {
      this.elements.mainDetailsToggle.setAttribute('hidden', '')
      if (this.elements.shareButton) {
        this.elements.shareButton.classList.remove('hidden')
        this.elements.shareButton.addEventListener('click', () => {
          navigator.share({ url: document.location.href, title: document.title })
        })
      }
    } else {
      this.elements.mainDetailsToggle.addEventListener(
        'toggle',
        this.toggleDetails.bind(this)
      )
      this.elements.mainDetailsToggle
        .querySelector('hh-button')
        .addEventListener('click', this.copyToClipboard.bind(this))
    }
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return

    const openDetailsElement = event.target.closest('details[open]')
    if (!openDetailsElement) return

    const summaryElement = openDetailsElement.querySelector('summary')
    openDetailsElement.removeAttribute('open')
    summaryElement.focus()
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close()
    })
  }

  close() {
    this.elements.mainDetailsToggle.removeAttribute('open')
  }

  toggleDetails() {
    if (!this.mainDetailsToggle.open)
      this.elements.successMessage.classList.add('hidden')
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.elements.urlInput.value).then(() => {
      this.elements.successMessage.classList.remove('hidden')
      this.elements.successMessage.setAttribute('aria-hidden', false)

      setTimeout(() => {
        this.elements.successMessage.setAttribute('aria-hidden', true)
      }, 6000)
    })
  }
}

customElements.define('share-button', ShareButton)
