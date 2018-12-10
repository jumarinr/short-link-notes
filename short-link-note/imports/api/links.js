import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const Links = new Mongo.Collection("links");

if (Meteor.isServer) {
  Meteor.publish("links", function() {
    //this.userId
    return Links.find({ userId: this.userId });
  });
}

Meteor.methods({
  greetUser() {
    console.log("greetUser is running");
    return "Hello user";
  },
  addNumbers(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Meteor.Error("invalid-arguments", "expecting two numbers");
    } else {
      return a + b;
    }
  }
});
