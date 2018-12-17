// este componente se encarga de filtrar los items, entre no visibles y visibles
import React from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";

export default class LinksListFilter extends React.Component {
  constructor(props) {
    super(props);
    //definimos la visibilidad de un enlace por defecto de afirmativo
    this.state = {
      showVisible: true
    };
  }
  componentDidMount() {
    //con esto, cada que apretamos el boton podemos actualizar automaticamente el estado de la visibilidad
    this.tracker = Tracker.autorun(() => {
      this.setState({
        showVisible: Session.get("showVisible")
      });
    });
  }
  componentWillUnmount() {
    this.tracker.stop();
  }
  onChangeOrder(event) {
    let ordenFinal = event.target.checked ? 1 : -1;
    Session.set({ order: ordenFinal });
  }
  render() {
    return (
      <div>
        <label className="checkbox">
          <input
            className="checkbox__box"
            type="checkbox"
            checked={!this.state.showVisible}
            onChange={event => {
              Session.set("showVisible", !event.target.checked);
            }}
          />
          Mostrar links ocultos
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            className="checkbox__box"
            onChange={this.onChangeOrder.bind(this)}
          />
          Alternar orden
        </label>
      </div>
    );
  }
}
