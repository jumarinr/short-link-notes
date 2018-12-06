import React from "react";
import { Link } from "react-router";

export default class Signup extends React.Component {
  render() {
    return (
      <div>
        <h1>Singup component here</h1>
        <Link to="/">Already have an acount? </Link>
      </div>
    );
  }
}
