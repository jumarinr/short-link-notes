//este componente se encarga de cargar la pagina principal de links, donde se encuentran los enlaces del usuario
import React from "react";
import LinksList from "./LinksList"; //aqui es donde se renderiza la lista de links en la pagina
import PrivateHeader from "./PrivateHeader"; //aqui es donde esta el header de la pagina cuando estas logueado
import AddLink from "./AddLink"; //este componente permite añadir enlaces a la pagina
import LinksListFilter from "./LinksListFilter"; //este componente permite cambiar la visibilidad de los enlances

export default () => {
  return (
    <div>
      <PrivateHeader title="Tus Links" />
      <div className="page-content">
        <LinksListFilter />
        <AddLink />
        <LinksList />
      </div>
    </div>
  );
};
