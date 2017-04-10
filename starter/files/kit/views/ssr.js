/* eslint-disable react/no-danger */

// Component to render the full HTML response in React

// ----------------------
// IMPORTS
import React, { PropTypes } from 'react';

// ----------------------

const Html = ({ head, html, state }) => (
  <html lang="en" prefix="og: http://ogp.me/ns#">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {head.meta.toComponent()}
      <link rel="stylesheet" href="/assets/css/style.css" />
      {head.title.toComponent()}
    </head>
    <body>
      <div
        id="main"
        dangerouslySetInnerHTML={{ __html: html }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__STATE__ = ${JSON.stringify(state)}`,
        }} />
      <script defer src="/vendor.js" />
      <script defer src="/browser.js" />
    </body>
  </html>
);

Html.propTypes = {
  head: PropTypes.object.isRequired,
  html: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
};

export default Html;
