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
        this.setState({ error: "Por favor revisa tu correo y contraseña" });
      } else {
        this.setState({ error: "" });
      }
    });
  }
  render() {
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Ingrese para ver sus links</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form
            onSubmit={this.onSubmit.bind(this)}
            className="boxed-view__form"
          >
            <input ref="email" type="email" name="email" placeholder="Email" />
            <input
              ref="password"
              type="password"
              name="password"
              placeholder="Contraseña"
            />
            <button className="button">Ingresar</button>
          </form>
          <Link to="/signup">¿Necesitas una cuenta?</Link>
        </div>
      </div>
    );
  }
}
