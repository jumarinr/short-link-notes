import React from "react";
import { Notes } from "../api/notes";
import { Tracker } from "meteor/tracker"; //importamos tracker, lo requerimos para autorun
import { Meteor } from "meteor/meteor";

export default class NotesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }
  componentDidMount() {
    console.log("componentDidMount LinksList");
    this.NoteTracker = Tracker.autorun(() => {
      Meteor.subscribe("notes");
      //llamamos una constante links asociada a nuestra coleccion Notes
      const notes = Notes.find({}).fetch();
      this.setState({ notes });
    });
  }
  componentWillUnmount() {
    console.log("me fui alv ");
    this.NoteTracker.stop();
  }
  renderNotesList() {
    return this.state.notes.map(note => {
      return <p key={note._id}>{note.notes}</p>;
    });
  }
  render() {
    return (
      <div>
        <p>Notes List</p>
        <div>{this.renderNotesList()}</div>
      </div>
    );
  }
}
