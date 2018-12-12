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
  "links.insert"(url, visitedCount, lastVisitedAt) {
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
    Links.insert({
      url,
      userId: this.userId,
      visitedCount: visitedCount,
      lastVisitedAt: lastVisitedAt,
      visible: true
    });
  },
  "links.setVisibility"(_id, visible) {
    if (!this.userId) {
      throw new Meteor.Error("No autorizado");
    }
    new SimpleSchema({
      _id: { type: String, min: 1 },
      visible: { type: Boolean }
    }).validate({ _id, visible });
    Links.update({ _id, userId: this.userId }, { $set: { visible } });
  },
  "links.trackVisit"(_id) {
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({ _id });

    Links.update(
      { _id },
      {
        $set: {
          lastVisitedAt: new Date().getTime()
        },
        $inc: {
          visitedCount: 1
        }
      }
    );
  }
});
