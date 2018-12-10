import { Meteor } from "meteor/meteor";
import "../imports/api/users";
import "../imports/api/links";
import "../imports/api/notes";
Meteor.startup(() => {
  Meteor.call("greetUser", (err, res) => {
    console.log("greet user arguments", err, res);
  });
});
