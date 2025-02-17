import { css } from 'lit'
import breakpoints from './breakpoints.js'

export default css`
  :root {
    --hh-color-brand-primary: #0500ff;
    --hh-color-brand-secondary: #788c94;
    --hh-color-brand-tertiary: #c1e0d8;
    --hh-color-night: black;
    --hh-color-day: white;

    --hh-h1-font: 400 48px/52px 'NBAkademieStd-Regular', sans-serif;
    --hh-h2-font: 400 38px/42px 'NBAkademieStd-Regular', sans-serif;
    --hh-h3-font: 400 32px/36px 'NBAkademieStd-Regular', sans-serif;
    --hh-h4-font: 400 24px/32px 'NBAkademieStd-Regular', sans-serif;
    --hh-h5-font: 400 18px/24px 'NBAkademieStd-Regular', sans-serif;
    --hh-h6-font: 400 14px/20px 'NBAkademieStd-Regular', sans-serif;
    --hh-body-font: 400 12px/16px 'NBAkademieStd-Regular', sans-serif;
    --hh-body-caption: 400 12px/13px 'NBAkademieStd-Regular', sans-serif;
    --hh-body-utility: 400 12px/14px 'NBAkademieStd-Regular', sans-serif;

    --hh-h1-letter-spacing: 0;
    --hh-h2-letter-spacing: 0;
    --hh-h3-letter-spacing: 0;
    --hh-h4-letter-spacing: 0;
    --hh-h5-letter-spacing: 0;
    --hh-h6-letter-spacing: 0;
    --hh-body-letter-spacing: 0;
    --hh-caption-letter-spacing: 0;
    --hh-utility-letter-spacing: 0;

    --hh-h1-text-transform: none;
    --hh-h2-text-transform: none;
    --hh-h3-text-transform: none;
    --hh-h4-text-transform: none;
    --hh-h5-text-transform: none;
    --hh-h6-text-transform: none;
    --hh-body-text-transform: none;
    --hh-caption-text-transform: none;
    --hh-utility-text-transform: uppercase;
  }

  /* breakpoints.md */
  @media screen and (min-width: ${breakpoints.md}) {
    :root {
      --hh-h1-font: 400 64px/66px 'NBAkademieStd-Regular', sans-serif;
      --hh-h2-font: 400 48px/52px 'NBAkademieStd-Regular', sans-serif;
      --hh-h3-font: 400 40px/44px 'NBAkademieStd-Regular', sans-serif;
      --hh-h4-font: 400 32px/38px 'NBAkademieStd-Regular', sans-serif;
      --hh-h5-font: 400 24px/32px 'NBAkademieStd-Regular', sans-serif;
      --hh-h6-font: 400 18px/23px 'NBAkademieStd-Regular', sans-serif;
      --hh-body-font: 400 14px/20px 'NBAkademieStd-Regular', sans-serif;
      --hh-body-caption: 400 12px/14px 'NBAkademieStd-Regular', sans-serif;
      --hh-body-utility: 400 14px/12px 'NBAkademieStd-Regular', sans-serif;
    }
  }

  :root {
    /* These are not in the base Figma file and are utility for developers */
    --hh-spacing-1: 1em;
    --hh-spacing-2: 2em;
    --hh-spacing-3: 3em;
    --hh-spacing-4: 4em;
    --hh-spacing-5: 5em;
    --hh-spacing-6: 6em;
    --hh-spacing-7: 7em;
    --hh-spacing-8: 8em;
    --hh-spacing-9: 9em;
  }
`
