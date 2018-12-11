import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";

export const Links = new Mongo.Collection("links");

if (Meteor.isServer) {
  Meteor.publish("links", function() {
    //this.userId
    return Links.find({ userId: this.userId });
  });
}

Meteor.methods({
  "links.insert"(url) {
    if (!this.userId) {
      throw new Meteor.Error("No autorizado");
    }
    new SimpleSchema({
      url: {
        type: String,
        label: "Your link>:v",
        regEx: SimpleSchema.RegEx.Url
      }
    }).validate({ url });
    Links.insert({ url, userId: this.userId, visible: true });
  },
  "links.setVisibility"(_id, visibility) {
    if (!this.userId) {
      throw new Meteor.Error("No autorizado");
    }
    new SimpleSchema({
      validate: {
        _id: Boolean,
        visible: Boolean
      }
    });

    Links.update({ _id: userId, visible: visibility });
  }
});
