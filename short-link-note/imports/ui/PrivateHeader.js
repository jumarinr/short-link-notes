import React from "react";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

const PrivateHeader = props => {
  return (
    <div>
      {" "}
      <h1>{props.title}</h1>
      <button
        onClick={() => {
          Accounts.logout();
        }}
      >
        log-out
      </button>
    </div>
  );
};
export default PrivateHeader;
