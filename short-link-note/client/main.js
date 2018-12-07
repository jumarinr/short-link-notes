import { Meteor } from "meteor/meteor";
import React from "react";
import ReactDOM from "react-dom";
import { Tracker } from "meteor/tracker";
import { Router, Route, browserHistory } from "react-router";
import Signup from "../imports/ui/Signup";
import Link from "../imports/ui/Link";
import NotFound from "../imports/ui/NotFound";
import Login from "../imports/ui/Login";

const unauthenticatedPages = ["/", "/signup"];
const authenticatedPages = ["/links"];
const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace("/links");
  }
};
const onEnterPrivatePages = () => {
  if (!Meteor.userId()) {
    browserHistory.replace("/");
  }
};
const onError = () => {
  setTimeout(function() {
    const eleccion = confirm(
      "Desea irse de aqui o quiere quedarse y seguir chimbeando?"
    );
    if (eleccion) {
      browserHistory.replace("/");
    }
  }, 4000);
};
const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Login} onEnter={onEnterPublicPage} />
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage} />
    <Route path="/links" component={Link} onEnter={onEnterPrivatePages} />
    <Route path="*" component={NotFound} onEnter={onError} />
  </Router>
);

Tracker.autorun(() => {
  const isAuthentiated = !!Meteor.userId();
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isUnauthentiatedPage = unauthenticatedPages.includes(pathname);
  const isAuthentiatedPage = authenticatedPages.includes(pathname);

  if (isUnauthentiatedPage && isAuthentiated) {
    browserHistory.replace("/links");
  } else if (isAuthentiatedPage && !isAuthentiated) {
    browserHistory.replace("/");
  }
  console.log("isAuthentiated", isAuthentiated);
});

Meteor.startup(() => {
  ReactDOM.render(routes, document.getElementById("app"));
});
