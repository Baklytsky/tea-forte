import { LitElement, css, html, noChange } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock'
import { animate } from '@lit-labs/motion'
import './lib/shopify.js'
import * as paths from './lib/paths.js'
import broadcastReceiver from './lib/broadcast-receiver.js'
import * as utils from './lib/utils/index.js'
import * as styles from './lib/styles/mixins.js'

window.LitElement = LitElement
window.HH = {
  css,
  html,
  ...utils,
  ...window.HH,
}

const t = (namespace) => {
  return namespace
}

export {
  t,
  paths,
  utils,
  styles,
  LitElement,
  css,
  html,
  noChange,
  classMap,
  styleMap,
  ifDefined,
  ref,
  createRef,
  unsafeHTML,
  disableBodyScroll,
  enableBodyScroll,
  animate,
  clearAllBodyScrollLocks,
  broadcastReceiver,
}
