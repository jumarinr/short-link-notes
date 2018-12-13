import React from "react";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";

export default class AddLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      visitedCount: 0,
      lastVisitedAt: ""
    };
  }
  onSubmit(event) {
    const { url } = this.state;
    event.preventDefault();

    Meteor.call(
      "links.insert",
      url,
      this.state.visitedCount,
      this.state.lastVisitedAt,
      (err, res) => {
        if (!err) {
          this.setState({ url: "", isOpen: false, error: "" });
          this.handleModalClose();
        } else {
          this.setState({ error: err.reason });
        }
      }
    );
  }
  onChange(event) {
    this.setState({
      url: event.target.value.trim()
    });
  }
  handleModalClose() {
    this.setState({ isOpen: false, url: "", error: "" });
  }
  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ isOpen: true });
          }}
          className="button"
        >
          + Add link
        </button>
        <Modal
          isOpen={this.state.isOpen}
          contentLabel="Add link"
          onAfterOpen={() => {
            this.refs.url.focus();
          }}
          onRequestClose={this.handleModalClose.bind(this)}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
        >
          <h1>Add link</h1>
          <p>{this.state.error ? <p>{this.state.error}</p> : undefined}</p>
          <form
            onSubmit={this.onSubmit.bind(this)}
            className="boxed-view__form"
          >
            <input
              type="text"
              placeholder="Url"
              ref="url"
              onChange={this.onChange.bind(this)}
              value={this.state.url}
            />
            <button className="button">Add link</button>
            <button
              className="button button--secondary"
              type="button"
              onClick={this.handleModalClose.bind(this)}
            >
              Cancel
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}
