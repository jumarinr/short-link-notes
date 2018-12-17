//este componente es aquel que me mostrara la pagina de inicio de sesion del usuario
import React from "react";
import { Link } from "react-router"; //con esto podemos redireccionar al componente que queramos
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      showPasswordLogin: "password"
    };
  }
  componentDidMount() {
    //con esto, cada que apretamos el boton podemos ver o no la contraseña

    this.tracker = Tracker.autorun(() => {
      this.setState({
        showPasswordLogin: Session.get("showPasswordLogin")
          ? Session.get("showPasswordLogin")
          : "password"
      });
    });
  }
  componentWillUnmount() {
    this.tracker.stop();
  }
  //este metodo se encarga de mostrar o no la contraseña suministrada por el usuario
  onCheck(event) {
    //definimos un valor que cambia, dicho valor depende del checkbox.
    let valor = event.target.checked ? "text" : "password";
    //si no esta seleccionada la checkbox, no me muestre la contraseña
    //si esta checkeada la checkbox, debemos poner el texfield como text en vez de password
    Session.set("showPasswordLogin", valor);
  }
  //este metodo recibe un evento, esto para evitar que se recargue la pagina. ademas es el encargado de subir las credenciales para que el usario pueda ingresar a la pagina
  onSubmit(event) {
    event.preventDefault();
    //pone las credenciales en bloques y elimina los espacios
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();
    //utiliza el metodo Meteor.loginWithPassword que recibe como parametros nuestras credenciales y si se quiere, una funcion para recibir un error, en este caso se requiere para decirle al usuario que hay un error
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
              type={this.state.showPasswordLogin}
              name="password"
              placeholder="Contraseña"
            />
            <button className="button">Ingresar</button>
          </form>
          <label className="checkbox">
            <input
              type="checkbox"
              className="checkbox__box"
              onChange={this.onCheck.bind(this)}
            />
            Mostrar contraseña
          </label>
          <Link
            to="/signup"
            onClick={() => {
              Session.set("showPasswordLogin", "password");
            }}
          >
            ¿Necesitas una cuenta?
          </Link>
        </div>
      </div>
    );
  }
}
