import React from "react";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Links } from "../api/links";
import { Notes } from "../api/notes";
import LinksList from "./LinksList";
import NotesList from "./NotesList";

export default class Link extends React.Component {
  logOut() {
    Accounts.logout();
  }
  onSubmit(event) {
    const url = this.refs.url.value.trim();
    const notes = this.refs.note.value.trim();
    event.preventDefault();
    if (notes) {
      Notes.insert({ notes, userId: Meteor.userId() });
      this.refs.note.value = "";
    }
    if (url) {
      Links.insert({ url, userId: Meteor.userId() });
      const youtube = this.refs.url.value;
      this.refs.url.value = "";
    }
  }
  render() {
    return (
      <div>
        <p>Link component here</p>
        <button onClick={this.logOut.bind(this)}>log-out</button>
        <LinksList />
        <p>Add link</p>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" ref="url" placeholder="Url" />
          <button>Add link</button>
        </form>

        <p>Add Note</p>
        <NotesList />
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" ref="note" placeholder="Nota bonita" />
          <button>Add Note</button>
        </form>
      </div>
    );
  }
}
