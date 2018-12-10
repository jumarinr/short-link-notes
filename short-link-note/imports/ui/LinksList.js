import React from "react";
import { Meteor } from "meteor/meteor";
import { Links } from "../api/links"; //importamos la coleccion Links
import { Tracker } from "meteor/tracker"; //importamos tracker, lo requerimos para autorun

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
      const links = Links.find({}).fetch();
      this.setState({ links });
    });
  }

  componentWillUnmount() {
    console.log("me fui alv ");
    this.linksTracker.stop();
  }
  renderLinksListItems() {
    return this.state.links.map(link => {
      return <p key={link._id}>{link.url}</p>;
    });
  }
  render() {
    return (
      <div>
        <p>Links List</p>
        <div>{this.renderLinksListItems()}</div>
      </div>
    );
  }
}
