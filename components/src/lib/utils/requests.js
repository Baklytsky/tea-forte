export const updateQuantity = async (
  line,
  quantity,
  sections = 'mini-cart,header',
  location = window.routes.cart_change_url
) => {
  const response = await fetch(location, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      line,
      quantity,
      sections,
    }),
  })
  return await response.json()
}

export const addToCart = async (
  payload,
  sections = 'mini-cart,header',
  location = window.routes.cart_add_url
) => {
  const response = await fetch(location, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sections,
      ...payload,
    }),
  })
  return await response.json()
}
