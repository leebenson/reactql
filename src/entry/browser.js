// Browser entry point, for Webpack.  We'll grab the browser-flavoured
// versions of React mounting, routing etc to hook into the DOM

// ----------------------
// IMPORTS

// React parts
import React from 'react';
import ReactDOM from 'react-dom';

// Browser routing
import { BrowserRouter } from 'react-router-dom';

// Root component.  This is our 'entrypoint' into the app.  If you're using
// the ReactNow starter kit for the first time, `components/app` is where
// you can start editing to add your own code
import App from 'components/app';

// ----------------------

// Create the 'root' entry point into the app.  If we have React hot loading
// (i.e. if we're in development), then we'll wrap the whole thing in an
// <AppContainer>.  Otherwise, we'll jump straight to the browser router
function doRender() {
  ReactDOM.render(
    <Root />,
    document.getElementById('main'),
  );
}

// The <Root> component.  We'll run this as a self-contained function since
// we're using a bunch of temporary vars that we can safely discard.
//
// If we have hot reloading enabled (i.e. if we're in development), then
// we'll wrap the whole thing in <AppContainer> so that our views can respond
// to code changes as needed
const Root = (() => {
  // Wrap the component hierarchy in <BrowserRouter>, so that our children
  // can respond to route changes
  const Chain = () => (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // React hot reloading -- only enabled in production.  This branch will
  // be shook from production, so we can run a `require` statement here
  // without fear that it'll inflate the bundle size
  if (module.hot) {
    // <AppContainer> will response to our Hot Module Reload (HMR) changes
    // back from WebPack, and handle re-rendering the chain as needed
    const AppContainer = require('react-hot-loader').AppContainer;

    // Start our 'listener' at the root component, so that any changes that
    // occur in the hierarchy can be captured
    module.hot.accept('components/app', () => {
      // Refresh the entry point of our app, to get the changes.

      // eslint-disable-next-line
      require('components/app').default;

      // Re-render the hierarchy
      doRender();
    });

    return () => (
      <AppContainer>
        <Chain />
      </AppContainer>
    );
  }
  return <Chain />;
})();

doRender();
