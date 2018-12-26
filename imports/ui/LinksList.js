//este componente se encarga de cargar todos los url y renderizarlos en la pagina
import React from "react";
import { Meteor } from "meteor/meteor";
import { Links } from "../api/links"; //importamos la coleccion Links
import FlipMove from "react-flip-move"; //este modulo nos permite agregar estilos al añadir u ocultar celdas
import { Tracker } from "meteor/tracker"; //importamos tracker, lo requerimos para autorun
import LinksListItem from "./LinksListItem"; //este componente carga individualmente cada item
import { Session } from "meteor/session"; // como local storage, pero como paquete de meteor

//Exportamos linkslist y lo extendemos como un componente de react
export default class LinksList extends React.Component {
  constructor(props) {
    super(props);
    //definimos el estado del arreglo links, para luego.
    this.state = {
      links: []
    };
  }
  // se monta el componente, ponemos que se actualice automaticamente con el tracker
  componentDidMount() {
    //definimos el tracker como una variable para poder parar el componente cuando no lo necesitemos
    this.linksTracker = Tracker.autorun(() => {
      //nos suscribimos a la coleccion links, al suscribirnos logramos acceder a los datos de la coleccion para poder mostrarlos en la pagina
      Meteor.subscribe("links");
      //creamos una constante links que va a retornar los elementos de la coleccion con varios parametros, si es visible o no, si es visible se mostrara cuando el boton de "mostrar colecciones ocultas"
      console.log(Session.get("order"));
      const links = Links.find(
        { visible: Session.get("showVisible") },
        {
          sort: {
            lastVisitedAt: Session.get("order") //? Session.get("order") : -1
          }
        }
      ).fetch();
      //actualizamos el estado del arreglo links que estaba vacio, ahora tendra los elementos de la coleccion
      this.setState({ links });
    });
  }
  // desmontamos el componente
  componentWillUnmount() {
    console.log("me fui alv ");
    this.linksTracker.stop();
  }
  // si la lista de items esta vacia en cualquier seccion, muestra un mensaje que no se encontraron links
  renderLinksListItems() {
    //si el tamaño de links es igual a 0, muestre el mensaje
    if (this.state.links.length == 0) {
      return (
        <div className="item__status-message">
          <p>No se encontraron links</p>
        </div>
      );
    }
    //mapeamos links, esto para obtener cada link registrado en esta.
    return this.state.links.map(link => {
      const shortUrl = Meteor.absoluteUrl(link._id);
      // "exportamos unas propiedades" para que linkslistitem pueda renderizarlos individualmente
      return <LinksListItem key={link._id} shortUrl={shortUrl} {...link} />;
    });
  }

  render() {
    return (
      <div>
        <FlipMove>{this.renderLinksListItems()}</FlipMove>
      </div>
    );
  }
}
