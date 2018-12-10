import { Meteor } from "meteor/meteor"; //Importamos meteor, lo requerimos para startup
import { Tracker } from "meteor/tracker"; //importamos tracker, lo requerimos para autorun
import ReactDOM from "react-dom"; //importamos ReactDOM, lo requerimos para render

import { routes, onAuthChange } from "../imports/routes/routes"; //importamos routes, que es donde estan los links de direccion y onAuthChange que es para verificar que los enlaces en la pagina esten bien para redirrecionar

//Con Tracker.autorun nos aseguramos que siempre se refresque la informacion
Tracker.autorun(() => {
  const isAuthentiated = !!Meteor.userId(); //definimos una constante que nos dice si la persona esta autentificada
  onAuthChange(isAuthentiated); // llamamos la function onAuthChange que recibe como parametro el estado actual del usuario, activo o no
});

Meteor.startup(() => {
  Meteor.call("addNumbers", 11, "187", (err, res) => {
    console.log("greet user arguments", err, res);
  });
  ReactDOM.render(routes, document.getElementById("app"));
});
