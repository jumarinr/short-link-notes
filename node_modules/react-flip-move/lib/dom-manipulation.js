'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransitionString = exports.getNativeNode = exports.updateHeightPlaceholder = exports.removeNodeFromDOMFlow = exports.getPositionDelta = exports.getRelativeBoundingBox = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * React Flip Move
                                                                                                                                                                                                                                                                   * (c) 2016-present Joshua Comeau
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * These methods read from and write to the DOM.
                                                                                                                                                                                                                                                                   * They almost always have side effects, and will hopefully become the
                                                                                                                                                                                                                                                                   * only spot in the codebase with impure functions.
                                                                                                                                                                                                                                                                   */


exports.applyStylesToDOMNode = applyStylesToDOMNode;
exports.whichTransitionEvent = whichTransitionEvent;

var _reactDom = require('react-dom');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function applyStylesToDOMNode(_ref) {
  var domNode = _ref.domNode,
      styles = _ref.styles;

  // Can't just do an object merge because domNode.styles is no regular object.
  // Need to do it this way for the engine to fire its `set` listeners.
  Object.keys(styles).forEach(function (key) {
    // eslint-disable-next-line no-param-reassign
    domNode.style[key] = styles[key];
  });
}

// Modified from Modernizr
function whichTransitionEvent() {
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  // If we're running in a browserless environment (eg. SSR), it doesn't apply.
  // Return a placeholder string, for consistent type return.
  if (typeof document === 'undefined') return '';

  var el = document.createElement('fakeelement');

  var match = Object.keys(transitions).find(function (t) {
    return el.style[t] !== undefined;
  });

  // If no `transition` is found, we must be running in a browser so ancient,
  // React itself won't run. Return an empty string, for consistent type return
  return match ? transitions[match] : '';
}

var getRelativeBoundingBox = exports.getRelativeBoundingBox = function getRelativeBoundingBox(_ref2) {
  var childData = _ref2.childData,
      parentData = _ref2.parentData,
      getPosition = _ref2.getPosition;
  var childDomNode = childData.domNode;
  var parentDomNode = parentData.domNode;


  var parentBox = getPosition(parentDomNode);

  var _getPosition = getPosition(childDomNode),
      top = _getPosition.top,
      left = _getPosition.left,
      right = _getPosition.right,
      bottom = _getPosition.bottom;

  return {
    top: top - parentBox.top,
    left: left - parentBox.left,
    right: parentBox.right - right,
    bottom: parentBox.bottom - bottom
  };
};

/** getPositionDelta
 * This method returns the delta between two bounding boxes, to figure out
 * how mant pixels on each axis the element has moved.
 *
 * @param {Object} childData - needs shape { domNode, boundingBox }
 * @param {Object} parentData - needs shape { domNode, boundingBox }
 * @param {Function} getPosition - the function called to get bounding boxes
 * for a DOM node. Defaults to `getBoundingClientRect`.
 *
 * @returns [{Number: left}, {Number: top}]
 */
var getPositionDelta = exports.getPositionDelta = function getPositionDelta(_ref3) {
  var childData = _ref3.childData,
      parentData = _ref3.parentData,
      getPosition = _ref3.getPosition;

  // TEMP: A mystery bug is sometimes causing unnecessary boundingBoxes to
  // remain. Until this bug can be solved, this band-aid fix does the job:
  var defaultBox = { left: 0, top: 0 };

  // Our old box is its last calculated position, derived on mount or at the
  // start of the previous animation.
  var oldRelativeBox = childData.boundingBox || defaultBox;

  // Our new box is the new final resting place: Where we expect it to wind up
  // after the animation. First we get the box in absolute terms (AKA relative
  // to the viewport), and then we calculate its relative box (relative to the
  // parent container)
  var newAbsoluteBox = getPosition(childData.domNode);
  var newRelativeBox = {
    top: newAbsoluteBox.top - parentData.boundingBox.top,
    left: newAbsoluteBox.left - parentData.boundingBox.left
  };

  return [oldRelativeBox.left - newRelativeBox.left, oldRelativeBox.top - newRelativeBox.top];
};

/** removeNodeFromDOMFlow
 * This method does something very sneaky: it removes a DOM node from the
 * document flow, but without actually changing its on-screen position.
 *
 * It works by calculating where the node is, and then applying styles
 * so that it winds up being positioned absolutely, but in exactly the
 * same place.
 *
 * This is a vital part of the FLIP technique.
 *
 * @param {Object} domNode - the node we'll be working with
 * @param {Object} boundingBox - the node's starting position.
 *
 * @returns null
 */
var removeNodeFromDOMFlow = exports.removeNodeFromDOMFlow = function removeNodeFromDOMFlow(_ref4) {
  var domNode = _ref4.domNode,
      boundingBox = _ref4.boundingBox;

  // For this to work, we have to offset any given `margin`.
  var computed = window.getComputedStyle(domNode);

  // We need to clean up margins, by converting and removing suffix:
  // eg. '21px' -> 21
  var marginAttrs = ['margin-top', 'margin-left', 'margin-right'];
  var margins = marginAttrs.reduce(function (acc, margin) {
    var propertyVal = computed.getPropertyValue(margin);

    return _extends({}, acc, _defineProperty({}, margin, Number(propertyVal.replace('px', ''))));
  }, {});

  var styles = {
    position: 'absolute',
    top: boundingBox.top - margins['margin-top'] + 'px',
    left: boundingBox.left - margins['margin-left'] + 'px',
    right: boundingBox.right - margins['margin-right'] + 'px'
  };

  applyStylesToDOMNode({ domNode: domNode, styles: styles });
};

/** updateHeightPlaceholder
 * An optional property to FlipMove is a `maintainContainerHeight` boolean.
 * This property creates a node that fills space, so that the parent
 * container doesn't collapse when its children are removed from the
 * document flow.
 *
 * @param {Object} domNode - the node we'll be working with
 * @param {Object} parentData - needs shape { domNode, boundingBox }
 * @param {Function} getPosition - the function called to get bounding boxes
 * for a DOM node. Defaults to `getBoundingClientRect`.
 *
 * @returns null
 */
var updateHeightPlaceholder = exports.updateHeightPlaceholder = function updateHeightPlaceholder(_ref5) {
  var domNode = _ref5.domNode,
      parentData = _ref5.parentData,
      getPosition = _ref5.getPosition;

  // We need to find the height of the container *without* the placeholder.
  // Since it's possible that the placeholder might already be present,
  // we first set its height to 0.
  // This allows the container to collapse down to the size of just its
  // content (plus container padding or borders if any).
  applyStylesToDOMNode({ domNode: domNode, styles: { height: 0 } });

  // Find the distance by which the container would be collapsed by elements
  // leaving. We compare the freshly-available parent height with the original,
  // cached container height.
  var originalParentHeight = parentData.boundingBox.height;
  var collapsedParentHeight = getPosition(parentData.domNode).height;
  var reductionInHeight = originalParentHeight - collapsedParentHeight;

  // If the container has become shorter, update the padding element's
  // height to take up the difference. Otherwise set its height to zero,
  // so that it has no effect.
  var styles = {
    height: reductionInHeight > 0 ? reductionInHeight + 'px' : 0
  };

  applyStylesToDOMNode({ domNode: domNode, styles: styles });
};

var getNativeNode = exports.getNativeNode = function getNativeNode(element) {
  // When running in a windowless environment, abort!
  if (typeof HTMLElement === 'undefined') {
    return null;
  }

  // `element` may already be a native node.
  if (element instanceof HTMLElement) {
    return element;
  }

  // While ReactDOM's `findDOMNode` is discouraged, it's the only
  // publicly-exposed way to find the underlying DOM node for
  // composite components.
  return (0, _reactDom.findDOMNode)(element);
};

var createTransitionString = exports.createTransitionString = function createTransitionString(index, props) {
  var delay = props.delay,
      duration = props.duration;
  var staggerDurationBy = props.staggerDurationBy,
      staggerDelayBy = props.staggerDelayBy,
      easing = props.easing;


  delay += index * staggerDelayBy;
  duration += index * staggerDurationBy;

  var cssProperties = ['transform', 'opacity'];

  return cssProperties.map(function (prop) {
    return prop + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms';
  }).join(', ');
};