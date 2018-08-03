/* tslint:disable no-unused-expression */

// Global styles

/*
  Import this file for side-effects -- by default, this does two things:

  1. Importing `styles.global.scss` will tell Webpack to generate a `main.css`
   which is automatically included along with our SSR / initial HTML. This
   is for processing CSS through the SASS/LESS -> PostCSS pipeline.

  2. Using Styled-Component's `injectGlobal`
/*

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { injectGlobal } from "@/lib/styledComponents";

/* Local */

// Import global SASS styles that you want to be rendered into the
// resulting `main.css` file included with the initial render. If you don't
// want a CSS file to be generated, you can comment out this line
import "./styles.global.scss";

// ----------------------------------------------------------------------------

// Inject Styled-Components output onto the page. By default, this is blank --
// you can add global styles to the template tags below
injectGlobal``;
