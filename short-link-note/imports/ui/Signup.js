import React from "react";
import { Link } from "react-router";
import { Accounts } from "meteor/accounts-base";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }
  onSubmit(event) {
    event.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    Accounts.createUser({ email, password }, err => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: "" });
      }
    });
  }
  render() {
    return (
      <div>
        <h1>Singup component here</h1>

        {this.state.error ? <p>{this.state.error}</p> : undefined}

        <Link to="/">Already have an acount? </Link>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input ref="email" type="email" name="email" placeholder="Email" />
          <input
            ref="password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button> Create Account</button>
        </form>
      </div>
    );
  }
}
