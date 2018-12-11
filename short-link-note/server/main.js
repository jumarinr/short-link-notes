import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import "../imports/api/users";
import "../imports/api/links";
import "../imports/api/notes";
import "../imports/startup/simple-schema-configuration";
import { Links } from "../imports/api/links";

Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) => {
    const _id = req.url.slice(1);
    const link = Links.findOne({ _id });

    if (link) {
      res.statusCode = 302;
      res.setHeader("Location", link.url);
      res.end();
    } else {
      next();
    }
  });
});
