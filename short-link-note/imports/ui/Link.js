import React from "react";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Links } from "../api/links";
import { Notes } from "../api/notes";
import LinksList from "./LinksList";
import PrivateHeader from "./PrivateHeader";
import AddLink from "./AddLink";
import NotesList from "./NotesList";
import LinksListFilter from "./LinksListFilter";

export default () => {
  return (
    <div>
      <PrivateHeader title="Your Staff" />
      <LinksListFilter />
      <LinksList />
      <AddLink />
    </div>
  );
};
