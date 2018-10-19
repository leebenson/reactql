// Server-side HTML render

// Component to render the full HTML response in React

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";
import { HelmetData } from "react-helmet";

// ----------------------------------------------------------------------------

// Types

export interface IHtmlProps {
  css?: string;
  js: string;
  helmet: HelmetData;
  html: string;
  scripts?: string[];
  styles?: Array<React.ReactElement<{}>>;
  window?: {
    [key: string]: object;
  };
}

export default class Html extends React.PureComponent<IHtmlProps> {
    public render() {
      const { css, helmet, html, js, styles, window = {} } = this.props;
      return (
        <html lang="en" prefix="og: http://ogp.me/ns#" {...helmet.htmlAttributes.toString()}>
          <head>
            {helmet.title.toComponent()}
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta httpEquiv="Content-Language" content="en" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {helmet.meta.toComponent()}
            {helmet.style.toComponent()}
            {helmet.link.toComponent()}
            {css && <link rel="stylesheet" href={css} />}
            {styles}
            {helmet.script.toComponent()}
            {helmet.noscript.toComponent()}
          </head>
          <body {...helmet.bodyAttributes.toComponent()}>
          <div id="root" dangerouslySetInnerHTML={{__html: html }} />
          <script
            dangerouslySetInnerHTML={{
              __html: Object.keys(window).reduce(
                (out, key) => out += `window.${key}=${JSON.stringify(window[key])};`,
                "",
              ),
            }
          } />
          </body>
          <script src={js} />
        </html>
    );
  }
}
