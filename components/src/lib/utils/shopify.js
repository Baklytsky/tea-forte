/**
 * Attempts to re-render found DOMNodes in the current
 * mounted HTML Document.
 *
 * @param {String} selector
 * @returns Null
 */
export const reRenderShopifySections = (
  response,
  selector = '[data-rerender]'
) => {
  return Object.keys(response.sections).forEach((key) => {
    const wrapper = document.createElement('div')
    wrapper.appendChild(
      new DOMParser()
        .parseFromString(response.sections[key], 'text/html')
        .querySelector(selector)
    )
    document
      .querySelector(`[id^="shopify-section-"][id*="${key}"]`)
      .querySelector(selector).parentNode.innerHTML = wrapper.innerHTML
  })
}

/**
 * Generates a URL that is suitable for the Shopify
 * image CDN. Adds the current image size suffix.
 *
 * @param {*} src
 * @param {*} size
 */
export const getImageWithSize = (src = '', size = 1000) => {
  return ('' + src).replace(/([.](?:jpe?g|png))/, `_${size}x$1`)
}

/**
 * Used by components like the product card to select
 * the current product image based on the active color.
 * If there is no active color, a fallback image
 * should be returned if it is defined.
 *
 * @param {*} color
 * @param {*} images
 * @param {*} featured
 * @param {*} fallback
 */
export const getProductImage = (
  name = '',
  value = '',
  images,
  featured = false,
  fallback = false
) => {
  const key = `${name}-${(value || '').replace(/[/ ]/g, '-')}`.toLowerCase()
  const image = (images || []).find(({ src }) => {
    return ~src.indexOf(key) && ~src.indexOf(featured ? 'pos-1' : 'pos-2')
  })
  if (!image) {
    return getImageWithSize(fallback, 600)
  }
  return getImageWithSize(image, featured ? 1200 : 600)
}

/**
 * Decode Storefront Product ID, this is used
 * with Storefront API
 *
 * @param {*} src
 * @param {*} size
 */
export const decodeIDproduct = (id) => {
  return decodeURIComponent(escape(window.atob(id))).split(
    'gid://shopify/Product/'
  )[1]
}

/**
 * Encode from numerical to Storefront Product ID, this is used
 * with Storefront API
 *
 * @param {*} src
 * @param {*} size
 */
export const encodeIDproduct = (id) => {
  return window.btoa('gid://shopify/Product/' + id)
}

/**
 * Decode Storefront Product Variant ID, this is used
 * with Storefront API
 *
 * @param {*} src
 * @param {*} size
 */
export const decodeIDproductVariant = (id) => {
  return decodeURIComponent(escape(window.atob(id))).split(
    'gid://shopify/ProductVariant/'
  )[1]
}
