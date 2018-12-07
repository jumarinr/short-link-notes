import React from "react";
import { Link } from "react-router";
import { Meteor } from "meteor/meteor";

export default class Login extends React.Component {
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

    Meteor.loginWithPassword({ email }, password, err => {
      if (err) {
        this.setState({ error: "unable to login, please check your inputs" });
      } else {
        this.setState({ error: "" });
      }
    });
  }
  render() {
    return (
      <div>
        <h1>Login component here</h1>

        {this.state.error ? <p>{this.state.error}</p> : undefined}

        <form onSubmit={this.onSubmit.bind(this)}>
          <input ref="email" type="email" name="email" placeholder="Email" />
          <input
            ref="password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button> Login</button>
        </form>
        <Link to="/signup">Have an account?</Link>
      </div>
    );
  }
}
