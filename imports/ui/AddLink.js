//  Este componente se encarga de añadir un link a la lista de links y a la coleccion links
import React from "react";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";

//Exportamos AddLink como un componente de react
export default class AddLink extends React.Component {
  //Heredamos las propiedades de todos los componentes
  constructor(props) {
    super(props);
    //Declaramos el estado actual de url,  visitedCount y lastVisitedAt.
    this.state = {
      url: "",
      visitedCount: 0,
      lastVisitedAt: ""
    };
  }
  //Creamos una para subir el Link a la coleccion links
  onSubmit(event) {
    //Cogemos el link que suministra el usuario
    const { url } = this.state;
    //prevenimos que se recargue la pagina
    event.preventDefault();
    //llamamos al metodo insert que se encarga de añadir el url, visitedCount, lastVisitedAt a la coleccion
    Meteor.call(
      "links.insert",
      url,
      this.state.visitedCount,
      this.state.lastVisitedAt,
      (err, res) => {
        if (!err) {
          this.setState({ url: "", isOpen: false, error: "" });
          this.handleModalClose();
        } else {
          this.setState({ error: err.reason });
        }
      }
    );
  }
  //se encarga de tener el valor de la url al cambiar y con el trim evitamos que tenga espacios
  onChange(event) {
    this.setState({
      url: event.target.value.trim()
    });
  }
  //se encarga de cerrar la pestaña de añadir link
  handleModalClose() {
    this.setState({ isOpen: false, url: "", error: "" });
  }
  //renderizamos nuestro componente bien bonito :3
  render() {
    return (
      <div>
        {/*Cuando presionamos el boton, cambia el estado de isOpen a true para que podamos ver la pestaña que añade links*/}
        <button
          onClick={() => {
            this.setState({ isOpen: true });
          }}
          className="button"
        >
          + Añadir link
        </button>
        <Modal
          isOpen={this.state.isOpen}
          contentLabel="Add link"
          onAfterOpen={() => {
            this.refs.url.focus();
          }}
          onRequestClose={this.handleModalClose.bind(this)}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
        >
          <h1>Añade tu link aqui</h1>
          <p>{this.state.error ? <p>{this.state.error}</p> : undefined}</p>
          <form
            onSubmit={this.onSubmit.bind(this)}
            className="boxed-view__form"
          >
            <input
              type="text"
              placeholder="Url"
              ref="url"
              onChange={this.onChange.bind(this)}
              value={this.state.url}
            />
            <button className="button">Add link</button>
            <button
              className="button button--secondary"
              type="button"
              onClick={this.handleModalClose.bind(this)}
            >
              Cancel
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}
