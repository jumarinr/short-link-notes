"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var statelessFunctionalComponentSupplied = exports.statelessFunctionalComponentSupplied = function statelessFunctionalComponentSupplied() {
  return "\n>> Error, via react-flip-move <<\n\nYou provided a stateless functional component as a child to <FlipMove>. Unfortunately, SFCs aren't supported, because Flip Move needs access to the backing instances via refs, and SFCs don't have a public instance that holds that info.\n\nPlease wrap your components in a native element (eg. <div>), or a non-functional component.\n";
};

var invalidTypeForTimingProp = exports.invalidTypeForTimingProp = function invalidTypeForTimingProp(_ref) {
  var prop = _ref.prop,
      value = _ref.value,
      defaultValue = _ref.defaultValue;
  return "\n>> Error, via react-flip-move <<\n\nThe prop you provided for '" + prop + "' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is '" + value + "'.\n\nAs a result,  the default value for this parameter will be used, which is '" + defaultValue + "'.\n";
};

var deprecatedDisableAnimations = exports.deprecatedDisableAnimations = function deprecatedDisableAnimations() {
  return "\n>> Warning, via react-flip-move <<\n\nThe 'disableAnimations' prop you provided is deprecated. Please switch to use 'disableAllAnimations'.\n\nThis will become a silent error in future versions of react-flip-move.\n";
};

var invalidEnterLeavePreset = exports.invalidEnterLeavePreset = function invalidEnterLeavePreset(_ref2) {
  var value = _ref2.value,
      acceptableValues = _ref2.acceptableValues,
      defaultValue = _ref2.defaultValue;
  return "\n>> Error, via react-flip-move <<\n\nThe enter/leave preset you provided is invalid. We don't currently have a '" + value + " preset.'\n\nAcceptable values are " + acceptableValues + ". The default value of '" + defaultValue + "' will be used.\n";
};