/* tslint:disable no-unused-expression */

// Global styles

/*
  By default, this file does two things:

  1. Importing `styles.global.scss` will tell Webpack to generate a `main.css`
   which is automatically included along with our SSR / initial HTML. This
   is for processing CSS through the SASS/LESS -> PostCSS pipeline.

  2. It exports a global styles template which is used by Emotion to generate
  styles that apply to all pages.
/*

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { css } from "@emotion/core";

/* Local */

// Import global SASS styles that you want to be rendered into the
// resulting `main.css` file included with the initial render. If you don't
// want a CSS file to be generated, you can comment out this line
import "./styles.global.scss";

// ----------------------------------------------------------------------------

// Global styles to apply
export default css`
  /* Make all <h1> tags orange  */
  h1 {
    background-color: orange;
  }
`;
