import React from "react";
import { browserHistory } from "react-router";

const NotFound = () => {
  return (
    <div>
      <p>NotFound component here</p>
      <button
        onClick={() => {
          browserHistory.replace("/");
        }}
      >
        Presione aqui para volver al inicio
      </button>
    </div>
  );
};
export default NotFound;
