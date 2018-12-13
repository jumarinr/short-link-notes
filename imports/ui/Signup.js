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

    if (password.length < 9) {
      return this.setState({
        error: "password must be more than 8 characters long"
      });
    }

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
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Singup component here</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form
            onSubmit={this.onSubmit.bind(this)}
            noValidate
            className="boxed-view__form"
          >
            <input ref="email" type="email" name="email" placeholder="Email" />
            <input
              ref="password"
              type="password"
              name="password"
              placeholder="Password"
            />
            <button className="button"> Create Account</button>

            <Link to="/">Already have an acount? </Link>
          </form>
        </div>
      </div>
    );
  }
}