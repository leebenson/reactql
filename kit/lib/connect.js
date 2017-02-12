// Connect HOC for wrapping a React component, and passing in RxJS values
// as props.  This allows React to re-render every time a new value is made
// available from an RxJS observer.
//
// This can be used in two ways:
//
// 1.  As a simple wrapper:  connect({ key: Observer})(Component).  Pass in
// an object of name/observables, and the value will be passed as a prop to
// <Component>
//
// 2.  Using the decorator syntax: @connect({ key: Observer })
// Just add it above a class that extends React.Component.  Same effect

// ----------------------
// IMPORTS

import React from 'react';
import { Observable } from 'rxjs/Observable';

// ----------------------

class Connector extends React.Component {

  // When the component mounts, grab a list of observables fed into it
  // and subscribe to values.  Update the component's state with that value
  // which will cause the hierarchy to re-render.
  componentWillMount() {
    this.subscriptions = [];
    for (const name of Object.getOwnPropertyNames(this.props.observables)) {
      const o$ = !SERVER ? this.props.observables[name] : this.props.observables[name].take(1);
      const sub = o$.subscribe(val => {
        this.setState({
          [name]: val,
        });
      });
      this.subscriptions.push(sub);
    }
  }

  // Unsubscribe when the HOC unmounts from the DOM
  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Pass the current state through to the child component as props, so the
  // component can consume easily without worrying about the implementation
  render() {
    const Component = this.props.component;
    return (
      <Component {...this.state} />
    );
  }
}

// We expect two props: component = the child component we want to pass
// props to.  observables = an object containing one or more key/Observer vals
Connector.propTypes = {
  component: React.PropTypes.func.isRequired,
  observables: React.PropTypes.objectOf(
    React.PropTypes.instanceOf(Observable),
  ).isRequired,
};

export default function connect(observables) {
  return Component => () => (
    <Connector
      component={Component}
      observables={observables} />
  );
}
