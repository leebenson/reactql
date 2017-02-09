import React from 'react';
import { Observable } from 'rxjs';

class Connector extends React.Component {
  componentWillMount() {
    this.subscriptions = [];
    for (const name of Object.getOwnPropertyNames(this.props.observables)) {
      this.props.observables[name].subscribe(val => {
        this.setState({
          [name]: val,
        });
      });
      this.subscriptions.push(this.props.observables[name]);
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  render() {
    const Component = this.props.component;
    return (
      <Component {...this.state} />
    );
  }
}

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
