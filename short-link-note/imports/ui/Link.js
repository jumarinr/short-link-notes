import React from "react";
import { Accounts } from "meteor/accounts-base";

export default class Link extends React.Component {
  logOut() {
    Accounts.logout();
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
