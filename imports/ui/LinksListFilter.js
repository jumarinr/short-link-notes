import React from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";

export default class LinksListFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisible: false
    };
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      this.setState({
        showVisible: Session.get("showVisible")
      });
    });
  }
  componentWillUnmount() {
    this.tracker.stop();
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
      </div>
    );
  }
}
