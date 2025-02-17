import { utils } from './-global.min.js'

const { one, all, toggle } = utils || {}

const invertExpanded = (el) => {
  const value = el.getAttribute('aria-expanded') === 'true'
  el.setAttribute('aria-expanded', !value)
}

all('.js-toggle-new-address').forEach((el) => {
  el.addEventListener('click', (e) => {
    all('.js-toggle-new-address').forEach((el) => invertExpanded(el))
    toggle(one('.js-add-address-form'), ['hidden'])
  })
})

all('.js-toggle-edit-address').forEach((el) => {
  const index = el.dataset.address
  el.addEventListener('click', (e) => {
    all('.js-toggle-edit-address').forEach((el) => invertExpanded(el))
    toggle(one(`.js-edit-address-form[data-address='${index}']`), ['hidden'])
  })
})

new Shopify.CountryProvinceSelector('NewAddressCountry', 'NewAddressProvince', {
  hideElement: 'NewAddressProvinceContainer',
})

all(`.js-edit-address-form[data-address]`).forEach((el) => {
  const index = el.dataset.address
  new Shopify.CountryProvinceSelector(
    `EditAddress_${index}Country`,
    `EditAddress_${index}Province`,
    {
      hideElement: `EditAddress_${index}ProvinceContainer`,
    }
  )
})

all(`.js-delete-address`).forEach((el) => {
  el.addEventListener('click', (e) => {
    const message = el.dataset.confirmMessage
    const target = el.dataset.target

    if (confirm(message)) {
      Shopify.postLink(target, {
        parameters: { _method: 'delete' },
      })
    }
  })
})
