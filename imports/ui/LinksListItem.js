//este compontente se encarga de cargar cada item que este en los datos que le paso linklist
import React from "react";
import Clipboard from "clipboard"; //modulo de npm que nos permite copiar al portapapeles
import { Meteor } from "meteor/meteor";
import moment from "moment"; //modulo de npm que nos permite convertir el tiempo en lindas fechas todas chidoris

export default class LinksListItem extends React.Component {
  constructor(props) {
    super(props);
    //creamos el estado de "just copied" que nos servira para el texto del boton cuando el estado cambie
    this.state = { justCopied: false };
  }
  componentDidMount() {
    //definios que vamos a copiar dandole referencia
    this.clipboard = new Clipboard(this.refs.copy);

    this.clipboard
      .on("success", () => {
        //para cambiar el texto de copiar a copiado
        this.setState({ justCopied: true });
        setTimeout(() => {
          //para devolver el texto de copiado a copiar
          this.setState({ justCopied: false });
        }, 1000);
      })
      .on("error", () => {
        //si llega a haber algun error, alerteme
        alert(`unable to copy :v`);
      });
  }
  componentWillUnmount() {
    //segun la documentacion de clipboard, esta es la manera de desmontar este componente
    this.clipboard.destroy();
  }
  renderStats() {
    //este metodo sirve para cambiar el texto de "visita" o "visitas", esto es para mantener un legible formato del español al plural o singular y ademas para poder mostrar la fecha exacta del ultimo login
    const visitMessage = this.props.visitedCount === 1 ? "visita" : "visitas";
    let visitedMessage = null;
    if (typeof this.props.lastVisitedAt === "number") {
      visitedMessage = `- (visitada por ultima vez el ${moment(this.props.lastVisitedAt).format(" MM-DD-YYYY,  h:mm:ss a")})`
    }
    return (
      <p className="item__message">
        {this.props.visitedCount} {visitMessage} {visitedMessage}
      </p>
    );
  }
  render() {
    return (
      <div className="item">
        <h2>
          <b>{this.props.url}</b>
        </h2>
        <p className="item__message">{this.props.shortUrl}</p>
        {this.renderStats()}
        <a
          className="button button--pill button-link"
          href={this.props.shortUrl}
          target="_blank"
        >
          {" "}
          Visitar
        </a>
        <button
          className="button button--pill"
          ref="copy"
          data-clipboard-text={this.props.url}
        >
          {this.state.justCopied ? "Copiado" : "Copiar"}{" "}
          {/*, el primer argumento
            es lo que pasa si es verdadero, el segundo si es falso */}
        </button>
        <button
          className="button button--pill"
          onClick={() => {
            Meteor.call(
              "links.setVisibility",
              this.props._id,
              !this.props.visible
            );
          }}
        >
          {this.props.visible ? "Ocultar" : "Desocultar"}
        </button>
        <button
          className="button button--pill"
          onClick={()=>{
            let opcion = confirm("¿Esta seguro?")
            if(opcion){
              Meteor.call(
                "links.remove",
                this.props._id)
            }
          }}
        >
          Borrar
        </button>
      </div>
    );
  }
}
