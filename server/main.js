import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import "../imports/api/users";
import "../imports/api/links";
import "../imports/startup/simple-schema-configuration";
import { Links } from "../imports/api/links";

Meteor.startup(() => {
  /* 
    req - a Node.js IncomingMessage object with some extra properties. This argument can be used to get information about the incoming request.
    res - a Node.js ServerResponse object. Use this to write data that should be sent in response to the request, and call res.end() when you are done.
    next - a function. Calling this function will pass on the handling of this request to the next relevant handler.
 */
  WebApp.connectHandlers.use((req, res, next) => {
    const _id = req.url.slice(1);
    const link = Links.findOne({ _id });

    if (link) {
      res.statusCode = 302;
      res.setHeader("Location", link.url);
      res.end();
      Meteor.call("links.trackVisit", _id);
    } else {
      next();
    }
  });
});
