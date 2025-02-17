import { LitElement, html, utils } from './-global.min.js'

class HHHeader extends LitElement {
  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()

    this.detailsDesktop = this.querySelectorAll('.desktop-menu > li details')
    this.overlay = this.querySelector('.js-header-overlay')

    this.querySelectorAll('.js-details-trigger').forEach(trigger => {
      trigger.addEventListener('click', this.closeDetails.bind(this))
    })

    this.querySelectorAll('.js-submenu .js-header-submenu-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault()
        this.toggleMenuGroup(trigger)
      })
    })

    this.openNavigation()
  }

  toggleMenuGroup (trigger) {
    const menu = trigger.closest('.js-submenu')
    const target = trigger.getAttribute('data-child-group')
    menu.querySelectorAll('.js-header-submenu-group, .js-header-submenu-trigger').forEach(group => {
      if (group.getAttribute('data-child-group') == target) {
        group.classList.add('active')
      } else {
        group.classList.remove('active')
      }
    })
    this.adjustSubmenuActiveHeight(menu)
  }

  adjustSubmenuActiveHeight (menu) {
    if (!menu) return false
    const activeGroup = menu.querySelector('.js-header-submenu-group.active')
    const content = menu.querySelector('.js-header-submenu-content')
    if (activeGroup && content) content.style.height = activeGroup.scrollHeight + 'px'

    this.overlay.classList.add('active')
    const sourceElement = menu.closest('.js-header-submenu-container')
    if (sourceElement) this.overlay.style.height = sourceElement.scrollHeight + 'px'
  }

  closeDetails (e) {
    e.preventDefault()

    const target = e.target
    const details = target.closest('details')
    details.setAttribute('closing', true)

    setTimeout(function() {
      details.removeAttribute('open')
      details.removeAttribute('closing')
    }, 300)
  }

  triggerOverlay (details) {
    if (details.hasAttribute('opening')) {
      this.adjustSubmenuActiveHeight(details.querySelector('.js-submenu'))
    } else {
      this.overlay.classList.remove('active')
    }
  }

  openNavigation() {
    if (window.matchMedia('(min-width: 990px)')) {
      this.detailsDesktop.forEach((trigger) => {
        trigger.addEventListener('mouseenter', () => {
          trigger.setAttribute('open', true)
          trigger.setAttribute('opening', true)
          trigger.setAttribute('is-opening', true)
          this.triggerOverlay(trigger)
          setTimeout(function() {
            trigger.removeAttribute('is-opening')
          }, 300);
        })

        trigger.addEventListener('mouseleave', () => {
          trigger.removeAttribute('opening')
          this.triggerOverlay(trigger)
          this.closeAnimation(trigger)
        })

        trigger.addEventListener('click', (e) => {
          if(!e.target.closest('.header__submenu--child')) {
            e.preventDefault()
            const state = trigger.hasAttribute('open')
            if (state) {
              trigger.removeAttribute('open')
              trigger.removeAttribute('opening')
            } else {
              trigger.setAttribute('open', true)
              trigger.setAttribute('opening', true)
            }
            this.triggerOverlay(trigger)
          }
        })
      })
    }
  }

  closeAnimation(detailsElement) {
    let animationStart

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time
      }

      const elapsedTime = time - animationStart

      if (elapsedTime < 300) {
        window.requestAnimationFrame(handleAnimation)
      } else {
        if (!detailsElement.hasAttribute('is-opening')) detailsElement.removeAttribute('open')
      }
    }

    window.requestAnimationFrame(handleAnimation)
  }

  closeOpenModals(e) {
    utils.all('hh-details-modal', this).map((element) => {
      if (element !== e.detail.value) {
        element.setAttribute('open', false)
      }
    })
  }

  toggleCart(e) {
    e?.detail?.event?.preventDefault()
    utils.toggle(document.body, ['mini-cart-is-active'])
  }

  render() {
    return html`<slot
      @modalOpened="${this.closeOpenModals}"
      @toggleCart="${this.toggleCart}"
    ></slot>`
  }
}

customElements.define('hh-header', HHHeader)

var links = document.links;
for (let i = 0, linksLength = links.length ; i < linksLength ; i++) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noreferrer noopener';
  }
}