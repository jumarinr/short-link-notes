import React from "react";
import Clipboard from "clipboard";
import { Meteor } from "meteor/meteor";

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

  render() {
    return (
      <div>
        <p>
          {this.props.url} {this.props.shortUrl} {this.props.visible.toString()}
        </p>
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
