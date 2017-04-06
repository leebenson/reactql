import React, { PropTypes } from 'react';

const Html = ({ title, meta, html, state }) => (
  <html lang="en" prefix="og: http://ogp.me/ns#">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {meta.toComponent()}
      <link rel="stylesheet" href="/assets/css/style.css" />
      {title.toComponent()}
    </head>
    <body>
      <div id="main" dangerouslySetInnerHTML={{ __html: html }} />
      <script dangerouslySetInnerHTML={{ __html: `window.__STATE__ = ${state}` }} />
      <script defer src="/vendor.js" />
      <script defer src="/browser.js" />
    </body>
  </html>
);

Html.propTypes = {
  title: PropTypes.object.isRequired,
  meta: PropTypes.any.isRequired,
  html: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};

export default Html;
