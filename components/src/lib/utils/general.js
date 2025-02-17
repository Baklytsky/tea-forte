/**
 * Finds and returns a slotted child within a Web Component
 *
 * @param {DOMElement} shadowRoot
 * @param {String} name
 * @param {Boolean} firstOnly
 * @returns DOMElement | Empty
 */
export function getChildSlot(shadowRoot = null, name = '', firstOnly = false) {
  const children =
    shadowRoot
      ?.querySelector('slot')
      ?.assignedElements({ flatten: true })
      .filter((node) => {
        return node.matches(name)
      }) || []
  return firstOnly ? (children || [])[0] : children
}

/**
 * A shorthand for querySelector
 *
 * @param {String} selector
 * @param {DomElement} parent
 * @returns DOMElement | Empty
 */
export function one(selector, parent) {
  parent || (parent = document)
  return parent.querySelector(selector)
}

/**
 * A shorthand for querySelectorAll
 *
 * @param {String} selector
 * @param {DomElement} parent
 * @returns DOMElement | Empty
 */
export function all(selector, parent) {
  parent || (parent = document)
  var selection = parent.querySelectorAll(selector)
  return Array.prototype.slice.call(selection)
}

/**
 * Toggles an array of classes on a DOMElement
 *
 * @param {DOMElement} element
 * @param {Array} classes
 */
export function toggle(element, classes = []) {
  classes.forEach((_class) => {
    element.classList.toggle(_class)
  })
}

/**
 * Formats a given integer to a standard fraction.
 *
 * @param {Integer} num A price, with cents
 * @param {Integer} fraction
 */
export const formatPrice = (num, fraction = 2) => {
  return (
    '$' +
    (Number(num) / 100).toFixed(2).toLocaleString('en-EN', {
      minimumFractionDigits: fraction,
    })
  )
}

/**
 * Not lovely & not pure; attempts to pause all currently
 * playing media (ie. videos)
 */
export const pauseAllMedia = () => {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + 'pauseVideo' + '","args":""}',
      '*'
    )
  })
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*')
  })
  document.querySelectorAll('video').forEach((video) => video.pause())
  document
    .querySelectorAll('product-model')
    .forEach((model) => model.modelViewerUI?.pause())
}

/**
 * A classic debounce helper
 *
 * @param {Function} fn
 * @param {Number} wait
 * @returns
 */
export const debounce = (fn, wait) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(window, args), wait)
  }
}

/**
 * A classic throttle helper
 *
 * @param {Function} callback
 * @param {Number} limit
 * @returns
 */
export const throttle = (callback, limit) => {
  let waiting = false
  return function () {
    if (!waiting) {
      callback.apply(this, arguments)
      waiting = true
      setTimeout(function () {
        waiting = false
      }, limit)
    }
  }
}

/**
 * Serializes form
 *
 * @param {Form} form
 * @returns String
 */
export const serializeForm = (form) => {
  const obj = {}
  const formData = new FormData(form)
  for (const key of formData.keys()) {
    obj[key] = formData.get(key)
  }
  return JSON.stringify(obj)
}

/**
 * Returns a generic fetch config object (XHR)
 *
 * @param {String} type
 * @param {String} method
 * @returns Object
 */
export const fetchConfig = (type = 'json', method = 'POST') => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: `application/${type}`,
    },
  }
}

/**
 * Checks to see if the device supports touch gestures.
 */
export const isTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints
}

/**
 * Clones a complex Javascript object. This is a
 * thorough way to ensure that the object is fully
 * cloned with no references kept in place.
 *
 * @param {Object} obj
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Removes whitespace within a string and makes all
 * characters lowercase.
 *
 * @param {String} str
 */
export const handleize = (str) => str.replace(/[ /_]/g, '-').toLowerCase()

/**
 * Decodes a string that has been encoded through the 'url_encode' Shopify filter
 * @param {*} str
 */
export const decode = (str) => decodeURIComponent(str).replace(/\+/g, ' ')
