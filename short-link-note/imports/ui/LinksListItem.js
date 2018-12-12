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
      visitedMessage = `visited ${moment(this.props.lastVisitedAt).fromNow()}`;
    }
    return (
      <p>
        {this.props.visitedCount} {visitMessage} - ({visitedMessage})
      </p>
    );
  }
  render() {
    return (
      <div>
        <p>{this.props.url}</p>
        <p>{this.props.shortUrl}</p>
        <p>{this.props.visible.toString()}</p>
        {this.renderStats()}
        <button ref="copy" data-clipboard-text={this.props.url}>
          {this.state.justCopied ? "Copied" : "Copy"}{" "}
          {/*, el primer argumento
            es lo que pasa si es verdadero, el segundo si es falso */}
        </button>
        <button
          onClick={() => {
            Meteor.call(
              "links.setVisibility",
              this.props._id,
              !this.props.visible
            );
          }}
        >
          {this.props.visible ? "Hide" : "Unhide"}
        </button>
      </div>
    );
  }
}
