//componente encargado de mostrarse como header, donde se contendra un mensaje de inicio y el boton de salir.
import React from "react";
import { Accounts } from "meteor/accounts-base";

const PrivateHeader = props => {
  return (
    <div className="header">
      <div className="header__content">
        <h1 className="header__title">{props.title}</h1>
        <button
          className="button button--link-text"
          onClick={() => {
            Accounts.logout();
          }}
        >
          Salir
        </button>
      </div>
    </div>
  );
};
export default PrivateHeader;
