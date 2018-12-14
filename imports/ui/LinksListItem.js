import React from "react";
import Clipboard from "clipboard";
import { Meteor } from "meteor/meteor";
import moment from "moment";

export default class LinksListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { justCopied: false };
  }
  componentDidMount() {
    this.clipboard = new Clipboard(this.refs.copy);

    this.clipboard
      .on("success", () => {
        this.setState({ justCopied: true });
        setTimeout(() => {
          this.setState({ justCopied: false });
        }, 1000);
      })
      .on("error", () => {
        alert(`unable to copy :v`);
      });
  }
  componentWillUnmount() {
    this.clipboard.destroy();
  }
  renderStats() {
    const visitMessage = this.props.visitedCount === 1 ? "visit" : "visits";
    let visitedMessage = null;
    if (typeof this.props.lastVisitedAt === "number") {
      visitedMessage = `- (visited ${moment(
        this.props.lastVisitedAt
      ).fromNow()})`;
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
          style={{ textDecoration: "none", textDecorationColor: "#000000" }}
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
      </div>
    );
  }
}
