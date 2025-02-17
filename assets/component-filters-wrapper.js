import { utils } from './-global.min.js'

const { debounce } = utils

class HHFiltersWrapper extends HTMLElement {
  constructor() {
    super()
    this.filterData = []
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this)

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event)
    }, 500)

    this.querySelector('form').addEventListener(
      'input',
      this.debouncedOnSubmit.bind(this)
    )
    window.addEventListener('popstate', this.onHistoryChange.bind(this))

    this.bindActiveFacetButtonEvents()
  }

  onSubmitHandler(event) {
    event.preventDefault()
    const formData = new FormData(event.target.closest('form'))
    const searchParams = new URLSearchParams(formData).toString()
    this.renderPage(searchParams, event)
  }

  onActiveFilterClick(event) {
    event.preventDefault()
    this.toggleActiveFacets()
    this.renderPage(new URL(event.currentTarget.href).searchParams.toString())
  }

  onHistoryChange(event) {
    const searchParams = event.state?.searchParams || ''
    this.renderPage(searchParams, null, false)
  }

  toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable)
    })
  }

  renderPage(searchParams, event, updateURLHash = true) {
    document
      .getElementById('CollectionProductGrid')
      .querySelector('.js-product-grid')
      .classList.add('loading')

    const url =
      `${window.location.pathname}?` +
      this.getSections()
        .map((section) => `sections[]=${section.section}`)
        .join('&') +
      `&${searchParams}`

    const filterDataUrl = (element) => element.url === url

    this.filterData.some(filterDataUrl)
      ? this.renderSectionFromCache(filterDataUrl, event)
      : this.renderSectionFromFetch(url, event)

    if (updateURLHash) this.updateURLHash(searchParams)
  }

  renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.json())
      .then((parsed) => {
        const html = Object.values(parsed).join('')
        this.filterData = [...this.filterData, { html, url }]
        this.renderFilters(html, event)
        this.renderProductGrid(html)
      })
  }

  renderSectionFromCache(filterDataUrl, event) {
    const html = this.filterData.find(filterDataUrl).html
    this.renderFilters(html, event)
    this.renderProductGrid(html)
  }

  renderProductGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML

    document.getElementById('CollectionProductGrid').innerHTML = innerHTML
  }

  renderFilters(...args) {
    this.renderSingleFormFilters('#CollectionFiltersForm', ...args)
    this.renderSingleFormFilters('#CollectionFiltersFormMobile', ...args)
  }

  renderSingleFormFilters(form, html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html')

    const facetDetailsElements = parsedHTML.querySelectorAll(
      `${form} .js-filter`
    )
    const matchesIndex = (element) =>
      element.dataset.index ===
      event?.target.closest('.js-filter')?.dataset.index

    const facetsToRender = Array.from(facetDetailsElements).filter(
      (element) => !matchesIndex(element)
    )

    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex)

    facetsToRender.forEach((element) => {
      document.querySelector(
        `${form} .js-filter[data-index="${element.dataset.index}"]`
      ).innerHTML = element.innerHTML
    })

    this.renderActiveFacets(parsedHTML)

    if (countsToRender) {
      this.renderCounts(countsToRender, event.target.closest('.js-filter'))
    }
  }

  renderActiveFacets(html) {
    const activeFacetElementSelectors = [
      '.js-facets--mobile',
      '.js-facets--desktop',
    ]

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector)
      if (!activeFacetsElement) return
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML
    })

    this.bindActiveFacetButtonEvents()
    this.toggleActiveFacets(false)
  }

  renderCounts(source, target) {
    const countElementSelectors = ['.js-bubble', '.js-selected']
    countElementSelectors.forEach((selector) => {
      const targetElement = target.querySelector(selector)
      const sourceElement = source.querySelector(selector)

      if (sourceElement && targetElement) {
        target.querySelector(selector).outerHTML =
          source.querySelector(selector).outerHTML
      }
    })
  }

  bindActiveFacetButtonEvents() {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.addEventListener('click', this.onActiveFilterClick, {
        once: true,
      })
    })
  }

  updateURLHash(searchParams) {
    history.pushState(
      { searchParams },
      '',
      `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`
    )
  }

  getSections() {
    return [
      {
        id: 'main-collection-filters',
        section: document.getElementById('main-collection-filters').dataset.id,
      },
      {
        id: 'main-collection-product-grid',
        section: document.getElementById('main-collection-product-grid').dataset
          .id,
      },
    ]
  }
}

customElements.define('hh-filters-wrapper', HHFiltersWrapper)
