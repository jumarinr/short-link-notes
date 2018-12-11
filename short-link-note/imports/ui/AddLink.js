import React from "react";
import { Meteor } from "meteor/meteor";
import { Links } from "../api/links";

export default class AddLink extends React.Component {
  onSubmit(event) {
    const url = this.refs.url.value.trim();
    event.preventDefault();
    if (url) {
      Meteor.call("links.insert", url);
      this.refs.url.value = "";
    }
  }
  render() {
    return (
      <div>
        <h3>Add link</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" ref="url" placeholder="Url" />
          <button>Add link</button>
        </form>
      </div>
    );
  }
}
