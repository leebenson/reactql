/*
Custom Redux store creation.  Instead of using the default Apollo store,
we'll create our own for each request so that we can easily layer in our
own reducers for store state outside of Apollo
*/

// ----------------------
// IMPORTS
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

// ----------------------

export default function createNewStore(apolloClient) {
  const store = createStore(
    // By default, we'll use just the apollo reducer.  We can easily add our
    // own here, for global store management outside of Apollo
    combineReducers({
      apollo: apolloClient.reducer(),
    }),
    // Initial server state, provided by the server.  Only relevant in the
    // browser -- on the server, we'll start with a blank object
    // eslint-disable-next-line no-underscore-dangle
    !SERVER ? window.__STATE__ : {}, // initial state
    compose(
        applyMiddleware(apolloClient.middleware()),
        // Enable Redux Devtools on the browser, for easy state debugging
        // eslint-disable-next-line no-underscore-dangle
        (!SERVER && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );

  return store;
}
