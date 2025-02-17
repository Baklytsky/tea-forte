/**
 * This function creates an instance of MutationObserver
 * that watches for attribute changes on document.body. This
 * is complementary to the `hh-broadcast` web component
 * which broadcasts a state change to other parts of the DOM
 * via attribute changes to the document.body parent node.
 *
 * @param {String} attributeName
 * @param {Function} callback
 * @returns MutationObserver
 */
module.exports = (attributeName, callback) => {
  const observer = new MutationObserver((mutations) => {
    const { type, attributeName: _attributeName, target } = mutations[0]
    if (type !== 'attributes' || attributeName !== _attributeName) {
      return
    }

    const data = target.getAttribute(_attributeName) || '{}'
    const parsed = JSON.parse(data) || {}

    callback(parsed, mutations)
  })

  return observer.observe(document.body, {
    attributes: true,
    childList: false,
    subtree: false,
  })
}
