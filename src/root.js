import React from 'react';

const App = props => (
  <div>
    Message: {props.message}
  </div>
);

App.displayName = 'App';
App.propTypes = {
  message: React.PropTypes.string.isRequired,
};

const AppContainer = () => ({
  reducers: sources => (
    sources.store$.reducer((oldState, newState) => newState)
  ),

  view: (props, state) => (
    <App message={state.message} />
  ),
});

export default AppContainer;
