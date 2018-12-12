import React from "react";
import { Meteor } from "meteor/meteor";
import { Links } from "../api/links";

export default class AddLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      visitedCount: 0,
      lastVisitedAt: ""
    };
  }
  onSubmit(event) {
    const { url } = this.state;
    event.preventDefault();
    if (url) {
      Meteor.call(
        "links.insert",
        url,
        this.state.visitedCount,
        this.state.lastVisitedAt,
        (err, res) => {
          if (!err) {
            this.setState({ url: "" });
          }
        }
      );
    }
  }
  onChange(event) {
    this.setState({
      url: event.target.value.trim()
    });
  }
  render() {
    return (
      <div>
        <h3>Add link</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input
            type="text"
            placeholder="Url"
            onChange={this.onChange.bind(this)}
            value={this.state.url}
          />
          <button>Add link</button>
        </form>
      </div>
    );
  }
}
