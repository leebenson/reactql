// React
import React from 'react';

// Routing
import { Link, Route } from 'react-router-dom';

// RxJS lib.  We'll use this to create a live 'clock' event that will
// update our <Stats> component below
import { Observable } from 'rxjs/Observable';

// RxJS connector for 'listening' to observables, and feeding the results
// down to underlying component props
import connect from 'lib/connect';

// Styles
import css from './app.css';

// We'll display this <Home> component when we're on the / route
const Home = () => (
  <h1>You&apos;re on the home page - click another link above</h1>
);

// Helper component that will be conditionally shown when the route matches.
// This gives you an idea how React Router v4 works
const Page = ({ match }) => (
  <h1>Changed route: {match.params.name}</h1>
);

// Specify PropTypes if the `match` object, which is injected to props by
// the <Route> component
Page.propTypes = {
  match: React.PropTypes.shape({
    params: React.PropTypes.object,
  }).isRequired,
};

// Stats pulled from the environment.  This demonstrates how data will
// change depending where we're running the code (environment vars, etc)
// and also how we can connect a 'vanilla' React component to an RxJS
// observable source, and feed eventual values in as properties
const Stats = ({ now }) => {
  const info = [
    ['Environment', process.env.NODE_ENV],
    ['Running', SERVER ? 'On the server' : 'In the browser'],
    ['Current time', `${now.toTimeString()} ← RxJS at work`],
  ];

  return (
    <ul className={css.data}>
      {info.map(([key, val]) => (
        <li key={key}>{key}: <span>{val}</span></li>
      ))}
    </ul>
  );
};

// `now` will always be an instance of Date
Stats.propTypes = {
  now: React.PropTypes.instanceOf(Date),
};

// By default, we'll start with the current date.  That will 'seed' the
// `props` value that our component can display
Stats.defaultProps = {
  now: new Date(),
};

// Wrap the <Stats> component in a Higher-Order Component (HOC) to 'listen'
// to passed in observables.  The keys we pass here will become props to the
// underlying component, and will re-render whenever we get another value
const StatsObserver = connect({
  now: Observable.interval(1000).map(() => new Date()),
})(Stats);

// Export a simple component that allows clicking on list items to change
// the route, along with a <Route> 'listener' that will conditionally display
// the <Page> component based on the route name
export default () => (
  <div>
    <div className={css.hello}>
      <h1>ReactNow</h1>
    </div>
    <hr />
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/contact">Contact</Link></li>
    </ul>
    <hr />
    <Route exact path="/" component={Home} />
    <Route path="/:name" component={Page} />
    <hr />
    <p>Runtime info:</p>
    <StatsObserver />
  </div>
);
