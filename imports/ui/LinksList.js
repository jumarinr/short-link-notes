import React from "react";
import { Meteor } from "meteor/meteor";
import { Links } from "../api/links"; //importamos la coleccion Links
import FlipMove from "react-flip-move";
import { Tracker } from "meteor/tracker"; //importamos tracker, lo requerimos para autorun
import LinksListItem from "./LinksListItem";
import { Session } from "meteor/session";

export default class LinksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    };
  }
  componentDidMount() {
    console.log("componentDidMount LinksList");
    this.linksTracker = Tracker.autorun(() => {
      Meteor.subscribe("links");
      //llamamos una constante links asociada a nuestra coleccion Links
      const links = Links.find({ visible: Session.get("showVisible") }).fetch();
      this.setState({ links });
    });
  }

  componentWillUnmount() {
    console.log("me fui alv ");
    this.linksTracker.stop();
  }
  renderLinksListItems() {
    if (this.state.links.length == 0) {
      return (
        <div className="item__status-message">
          <p>No links found</p>
        </div>
      );
    }

    return this.state.links.map(link => {
      const shortUrl = Meteor.absoluteUrl(link._id);
      return <LinksListItem key={link._id} shortUrl={shortUrl} {...link} />;
    });
  }
  render() {
    return (
      <div>
        <FlipMove maintainContainerHeight={true}>
          {this.renderLinksListItems()}
        </FlipMove>
      </div>
    );
  }
}
