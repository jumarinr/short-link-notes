import React from "react";
import { browserHistory } from "react-router";

export default class Link extends React.Component {
  logOut() {
    browserHistory.push("/");
  }
  render() {
    return (
      <div>
        <p>Link component here</p>
        <button onClick={this.logOut.bind(this)}>log-out</button>
      </div>
    );
  }
}
