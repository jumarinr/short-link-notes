import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
export const Notes = new Mongo.Collection("notes");

if (Meteor.isServer) {
  Meteor.publish("notes", function() {
    return Notes.find({ userId: this.userId });
  });
}
