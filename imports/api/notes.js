import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
export const Notes = new Mongo.Collection("notes");

if (Meteor.isServer) {
  Meteor.publish("notes", function() {
    return Notes.find({ userId: this.userId });
  });
}
Meteor.methods({
  "notes.insert"(notes) {
    if (!this.userId) {
      throw new Meteor.Error("No autorizado");
    }
    Notes.insert({ notes, userId: this.userId });
  }
});
