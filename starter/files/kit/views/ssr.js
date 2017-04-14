/* eslint-disable react/no-danger */

// Component to render the full HTML response in React

// ----------------------
// IMPORTS
import React from 'react';
import PropTypes from 'prop-types';

// ----------------------

const Html = ({ head, html, state, manifest, vendor, browser, chunkManifest, css }) => (
  <html lang="en" prefix="og: http://ogp.me/ns#">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {head.meta.toComponent()}
      <link rel="stylesheet" href={css} />
      {head.title.toComponent()}
      <script
        dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
                   window.webpackManifest = ${chunkManifest}
                   //]]>`,
        }} />
    </head>
    <body>
      <div
        id="main"
        dangerouslySetInnerHTML={{ __html: html }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__STATE__ = ${JSON.stringify(state)}`,
        }} />
      <script defer src={manifest} />
      <script defer src={vendor} />
      <script defer src={browser} />
    </body>
  </html>
);

Html.propTypes = {
  head: PropTypes.object.isRequired,
  html: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
};

export default Html;
