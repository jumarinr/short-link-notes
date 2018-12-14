import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="boxed-view ">
      <div className="boxed-view__box">
        <h1>Pagina no encontrada</h1>
        <p>La pagina suministrada no esta en nuestro dominio :c</p>
        <Link className="button button--link" to="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
