// Scroll to the top of the window

// -----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

// -----------------------------------------------------------------------------

class ScrollTop extends React.PureComponent<RouteComponentProps<any>> {
  public componentDidUpdate(prevProps: RouteComponentProps<any>) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render() {
    return this.props.children;
  }
}

export default withRouter(ScrollTop);
