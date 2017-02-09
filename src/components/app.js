// React
import React from 'react';

// Routing
import { Link, Route } from 'react-router-dom';

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
  </div>
);
