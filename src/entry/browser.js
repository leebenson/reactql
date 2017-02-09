// React parts
import React from 'react';
import ReactDOM from 'react-dom';

// Browser routing
import { BrowserRouter } from 'react-router-dom';

// Components
import App from 'components/app';

// Create the 'root' entry point into the app.  If we have React hot loading
// (i.e. if we're in development), then we'll wrap the whole thing in an
// <AppContainer>.  Otherwise, we'll jump straight to the browser router
function doRender() {
  ReactDOM.render(
    <Root />,
    document.getElementById('main'),
  );
}

const Root = (() => {
  // Wrap the component hierarchy in <BrowserRouter>, so that our children
  // can respond to route changes, and <AppContainer> to handle hot reloading
  const Chain = () => (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // React hot reloading
  if (module.hot) {
    const AppContainer = require('react-hot-loader').AppContainer;

    // Listen to changes to our root App and beyond
    module.hot.accept('components/app', () => {
      // Refresh the entry point of our app, to get the changes
      // eslint-disable-next-line
      require('components/app').default;
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
