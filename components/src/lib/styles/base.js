import { css } from 'lit'

export default css`
  @font-face {
    font-family: 'NBAkademieStd-Regular';
    src: url('fonts/NBAkademieStd-Regular.ttf') format('ttf');
    font-weight: 300;
    font-display: swap;
  }

  @font-face {
    font-family: 'NBAkademieStd-Medium';
    src: url('fonts/NBAkademieStd-Medium.ttf') format('ttf');
    font-weight: 500;
    font-display: swap;
  }

  body {
    font: var(--hh-body-font);

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  .visually-hidden {
    position: absolute !important;
    overflow: hidden;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0 0 0 0);
    word-wrap: normal !important;
  }
`
