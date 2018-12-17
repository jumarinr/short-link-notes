//componente encargado para crear una cuenta en la aplicacion web
import React from "react";
import { Link } from "react-router";
import { Accounts } from "meteor/accounts-base";
import { Session } from "meteor/session";


export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    //definimos el estado de error
    this.state = {
      error: "",
      showPassword : "password",
    };
  }
  componentDidMount() {
    //con esto, cada que apretamos el boton podemos ver o no la contraseña

    this.tracker = Tracker.autorun(() => {
      this.setState({
        showPassword: Session.get("showPassword") ? Session.get("showPassword"): "password",
      });
    });
  }
  componentWillUnmount() {
    this.tracker.stop();
  }
  //cuando el usuario ingrese, evitara ser cargada de nuevo la pagina y se subiran las credenciales si no se comete un error al hacerlo
  onSubmit(event) {
    event.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    if (password.length < 9) {
      return this.setState({
        error: "La contraseña debe ser de minimo 8 caracteres"
      });
    }
    //metodo para crear contraseña, recibe como parametros un email y una contraseña dentro de un objeto
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
          <h1>Registro nuevos usuarios</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form
            onSubmit={this.onSubmit.bind(this)}
            noValidate
            className="boxed-view__form"
          >
            <input ref="email" type="email" name="email" placeholder="Email" />
            <input
              ref="password"
              type={this.state.showPassword}
              name="password"
              placeholder="Contraseña"
            />
            <button className="button">Crear cuenta</button>
            <label className="checkbox"> 
            <input type="checkbox"  
            className="checkbox__box"
            onChange={(event)=>{
              //con esta funcion, me encargo de mostrar o no la contraseña a traves de session y state, con session obtengo arriba el valor actual de mi contraseña y con set state la cambio a mi place del boton.
              let valor;
              if (!event.target.checked){
                valor = "password"
              }
              else if (event.target.checked){
                valor="text"
              }
              Session.set("showPassword", valor)
            }}/>
            Mostrar contraseña
            </label>
            <Link to="/" onClick={()=>{
              //con esto obligo a que no muestre la contraseña cuando cambio de pagina
              Session.set("showPassword", "password")
            }}> ¿Ya tienes una cuenta?</Link>
          </form>
        </div>
      </div>
    );
  }
}
