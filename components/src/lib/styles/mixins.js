import { css } from 'lit'

export const visuallyHidden = css`
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
