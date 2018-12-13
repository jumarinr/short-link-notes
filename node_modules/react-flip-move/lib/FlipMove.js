'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./polyfills');

var _propConverter = require('./prop-converter');

var _propConverter2 = _interopRequireDefault(_propConverter);

var _domManipulation = require('./dom-manipulation');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * React Flip Move
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * (c) 2016-present Joshua Comeau
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * For information on how this code is laid out, check out CODE_TOUR.md
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/* eslint-disable react/prop-types */

var transitionEnd = (0, _domManipulation.whichTransitionEvent)();
var noBrowserSupport = !transitionEnd;

var FlipMove = function (_Component) {
  _inherits(FlipMove, _Component);

  function FlipMove(props) {
    _classCallCheck(this, FlipMove);

    // FlipMove needs to know quite a bit about its children in order to do
    // its job. We store these as a property on the instance. We're not using
    // state, because we don't want changes to trigger re-renders, we just
    // need a place to keep the data for reference, when changes happen.
    var _this = _possibleConstructorReturn(this, (FlipMove.__proto__ || Object.getPrototypeOf(FlipMove)).call(this, props));

    _this.childrenData = {
      /* Populated via callback refs on render. eg
      userSpecifiedKey1: {
        domNode: <domNode>,
        boundingBox: { top, left, right, bottom, width, height },
      },
      userSpecifiedKey2: { ... },
      ...
      */
    };

    // Similarly, track the dom node and box of our parent element.
    _this.parentData = {
      domNode: null,
      boundingBox: null
    };

    // If `maintainContainerHeight` prop is set to true, we'll create a
    // placeholder element which occupies space so that the parent height
    // doesn't change when items are removed from the document flow (which
    // happens during leave animations)
    _this.heightPlaceholderData = {
      domNode: null
    };

    // Copy props.children into state.
    // To understand why this is important (and not an anti-pattern), consider
    // how "leave" animations work. An item has "left" when the component
    // receives a new set of props that do NOT contain the item.
    // If we just render the props as-is, the item would instantly disappear.
    // We want to keep the item rendered for a little while, until its animation
    // can complete. Because we cannot mutate props, we make `state` the source
    // of truth.
    _this.state = { children: props.children };

    // Keep track of remaining animations so we know when to fire the
    // all-finished callback, and clean up after ourselves.
    // NOTE: we can't simply use childrenToAnimate.length to track remaining
    // animations, because we need to maintain the list of animating children,
    // to pass to the `onFinishAll` handler.
    _this.remainingAnimations = 0;
    _this.childrenToAnimate = [];

    _this.doesChildNeedToBeAnimated = _this.doesChildNeedToBeAnimated.bind(_this);
    _this.runAnimation = _this.runAnimation.bind(_this);
    return _this;
  }

  _createClass(FlipMove, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // When the component is handed new props, we need to figure out the
      // "resting" position of all currently-rendered DOM nodes.
      // We store that data in this.parent and this.children,
      // so it can be used later to work out the animation.
      this.updateBoundingBoxCaches();

      // Next, we need to update our state, so that it contains our new set of
      // children. If animation is disabled or unsupported, this is easy;
      // we just copy our props into state.
      // Assuming that we can animate, though, we have to do some work.
      // Essentially, we want to keep just-deleted nodes in the DOM for a bit
      // longer, so that we can animate them away.
      var newChildren = this.isAnimationDisabled(nextProps) ? nextProps.children : this.calculateNextSetOfChildren(nextProps.children);

      this.setState({ children: newChildren });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(previousProps) {
      // If the children have been re-arranged, moved, or added/removed,
      // trigger the main FLIP animation.
      //
      // IMPORTANT: We need to make sure that the children have actually changed.
      // At the end of the transition, we clean up nodes that need to be removed.
      // We DON'T want this cleanup to trigger another update.

      var oldChildrenKeys = this.props.children.map(function (d) {
        return d.key;
      });
      var nextChildrenKeys = previousProps.children.map(function (d) {
        return d.key;
      });

      var shouldTriggerFLIP = !(0, _helpers.arraysEqual)(oldChildrenKeys, nextChildrenKeys) && !this.isAnimationDisabled(this.props);

      if (shouldTriggerFLIP) {
        this.prepForAnimation();
        this.runAnimation();
      }
    }
  }, {
    key: 'calculateNextSetOfChildren',
    value: function calculateNextSetOfChildren(nextChildren) {
      var _this2 = this;

      // We want to:
      //   - Mark all new children as `entering`
      //   - Pull in previous children that aren't in nextChildren, and mark them
      //     as `leaving`
      //   - Preserve the nextChildren list order, with leaving children in their
      //     appropriate places.
      //

      // Start by marking new children as 'entering'
      var updatedChildren = nextChildren.map(function (nextChild) {
        var child = _this2.findChildByKey(nextChild.key);

        // If the current child did exist, but it was in the midst of leaving,
        // we want to treat it as though it's entering
        var isEntering = !child || child.leaving;

        return _extends({}, nextChild, { entering: isEntering });
      });

      // This is tricky. We want to keep the nextChildren's ordering, but with
      // any just-removed items maintaining their original position.
      // eg.
      //   this.state.children  = [ 1, 2, 3, 4 ]
      //   nextChildren         = [ 3, 1 ]
      //
      // In this example, we've removed the '2' & '4'
      // We want to end up with:  [ 2, 3, 1, 4 ]
      //
      // To accomplish that, we'll iterate through this.state.children. whenever
      // we find a match, we'll append our `leaving` flag to it, and insert it
      // into the nextChildren in its ORIGINAL position. Note that, as we keep
      // inserting old items into the new list, the "original" position will
      // keep incrementing.
      var numOfChildrenLeaving = 0;
      this.state.children.forEach(function (child, index) {
        var isLeaving = !nextChildren.find(function (_ref) {
          var key = _ref.key;
          return key === child.key;
        });

        // If the child isn't leaving (or, if there is no leave animation),
        // we don't need to add it into the state children.
        if (!isLeaving || !_this2.props.leaveAnimation) return;

        var nextChild = _extends({}, child, { leaving: true });
        var nextChildIndex = index + numOfChildrenLeaving;

        updatedChildren.splice(nextChildIndex, 0, nextChild);
        numOfChildrenLeaving += 1;
      });

      return updatedChildren;
    }
  }, {
    key: 'prepForAnimation',
    value: function prepForAnimation() {
      var _this3 = this;

      // Our animation prep consists of:
      // - remove children that are leaving from the DOM flow, so that the new
      //   layout can be accurately calculated,
      // - update the placeholder container height, if needed, to ensure that
      //   the parent's height doesn't collapse.

      var _props = this.props,
          leaveAnimation = _props.leaveAnimation,
          maintainContainerHeight = _props.maintainContainerHeight,
          getPosition = _props.getPosition;

      // we need to make all leaving nodes "invisible" to the layout calculations
      // that will take place in the next step (this.runAnimation).

      if (leaveAnimation) {
        var leavingChildren = this.state.children.filter(function (child) {
          return !!child.leaving;
        });

        leavingChildren.forEach(function (leavingChild) {
          var childData = _this3.childrenData[leavingChild.key];

          // We need to take the items out of the "flow" of the document, so that
          // its siblings can move to take its place.
          if (childData.boundingBox) {
            (0, _domManipulation.removeNodeFromDOMFlow)(childData);
          }
        });

        if (maintainContainerHeight) {
          (0, _domManipulation.updateHeightPlaceholder)({
            domNode: this.heightPlaceholderData.domNode,
            parentData: this.parentData,
            getPosition: getPosition
          });
        }
      }

      // For all children not in the middle of entering or leaving,
      // we need to reset the transition, so that the NEW shuffle starts from
      // the right place.
      this.state.children.forEach(function (child) {
        var domNode = _this3.childrenData[child.key].domNode;

        // Ignore children that don't render DOM nodes (eg. by returning null)

        if (!domNode) {
          return;
        }

        if (!child.entering && !child.leaving) {
          (0, _domManipulation.applyStylesToDOMNode)({
            domNode: domNode,
            styles: {
              transition: ''
            }
          });
        }
      });
    }
  }, {
    key: 'runAnimation',
    value: function runAnimation() {
      var _this4 = this;

      var dynamicChildren = this.state.children.filter(this.doesChildNeedToBeAnimated);

      dynamicChildren.forEach(function (child, n) {
        _this4.remainingAnimations += 1;
        _this4.childrenToAnimate.push(child.key);
        _this4.animateChild(child, n);
      });

      if (this.props.onStartAll) {
        var _formatChildrenForHoo = this.formatChildrenForHooks(),
            _formatChildrenForHoo2 = _slicedToArray(_formatChildrenForHoo, 2),
            elements = _formatChildrenForHoo2[0],
            domNodes = _formatChildrenForHoo2[1];

        this.props.onStartAll(elements, domNodes);
      }
    }
  }, {
    key: 'animateChild',
    value: function animateChild(child, index) {
      var _this5 = this;

      var domNode = this.childrenData[child.key].domNode;

      // Apply the relevant style for this DOM node
      // This is the offset from its actual DOM position.
      // eg. if an item has been re-rendered 20px lower, we want to apply a
      // style of 'transform: translate(-20px)', so that it appears to be where
      // it started.
      // In FLIP terminology, this is the 'Invert' stage.

      (0, _domManipulation.applyStylesToDOMNode)({
        domNode: domNode,
        styles: this.computeInitialStyles(child)
      });

      // Start by invoking the onStart callback for this child.
      if (this.props.onStart) this.props.onStart(child, domNode);

      // Next, animate the item from it's artificially-offset position to its
      // new, natural position.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          // NOTE, RE: the double-requestAnimationFrame:
          // Sadly, this is the most browser-compatible way to do this I've found.
          // Essentially we need to set the initial styles outside of any request
          // callbacks to avoid batching them. Then, a frame needs to pass with
          // the styles above rendered. Then, on the second frame, we can apply
          // our final styles to perform the animation.

          // Our first order of business is to "undo" the styles applied in the
          // previous frames, while also adding a `transition` property.
          // This way, the item will smoothly transition from its old position
          // to its new position.
          var styles = {
            transition: (0, _domManipulation.createTransitionString)(index, _this5.props),
            transform: '',
            opacity: ''
          };

          if (child.entering && _this5.props.enterAnimation) {
            styles = _extends({}, styles, _this5.props.enterAnimation.to);
          } else if (child.leaving && _this5.props.leaveAnimation) {
            styles = _extends({}, styles, _this5.props.leaveAnimation.to);
          }

          // In FLIP terminology, this is the 'Play' stage.
          (0, _domManipulation.applyStylesToDOMNode)({ domNode: domNode, styles: styles });
        });
      });

      this.bindTransitionEndHandler(child);
    }
  }, {
    key: 'bindTransitionEndHandler',
    value: function bindTransitionEndHandler(child) {
      var _this6 = this;

      var domNode = this.childrenData[child.key].domNode;

      // The onFinish callback needs to be bound to the transitionEnd event.
      // We also need to unbind it when the transition completes, so this ugly
      // inline function is required (we need it here so it closes over
      // dependent variables `child` and `domNode`)

      var transitionEndHandler = function transitionEndHandler(ev) {
        // It's possible that this handler is fired not on our primary transition,
        // but on a nested transition (eg. a hover effect). Ignore these cases.
        if (ev.target !== domNode) return;

        // Remove the 'transition' inline style we added. This is cleanup.
        domNode.style.transition = '';

        // Trigger any applicable onFinish/onFinishAll hooks
        _this6.triggerFinishHooks(child, domNode);

        domNode.removeEventListener(transitionEnd, transitionEndHandler);

        if (child.leaving) {
          delete _this6.childrenData[child.key];
        }
      };

      domNode.addEventListener(transitionEnd, transitionEndHandler);
    }
  }, {
    key: 'triggerFinishHooks',
    value: function triggerFinishHooks(child, domNode) {
      var _this7 = this;

      if (this.props.onFinish) this.props.onFinish(child, domNode);

      // Reduce the number of children we need to animate by 1,
      // so that we can tell when all children have finished.
      this.remainingAnimations -= 1;

      if (this.remainingAnimations === 0) {
        // Remove any items from the DOM that have left, and reset `entering`.
        var nextChildren = this.state.children.filter(function (_ref2) {
          var leaving = _ref2.leaving;
          return !leaving;
        }).map(function (item) {
          return _extends({}, item, {
            entering: false
          });
        });

        this.setState({ children: nextChildren }, function () {
          if (typeof _this7.props.onFinishAll === 'function') {
            var _formatChildrenForHoo3 = _this7.formatChildrenForHooks(),
                _formatChildrenForHoo4 = _slicedToArray(_formatChildrenForHoo3, 2),
                elements = _formatChildrenForHoo4[0],
                domNodes = _formatChildrenForHoo4[1];

            _this7.props.onFinishAll(elements, domNodes);
          }

          // Reset our variables for the next iteration
          _this7.childrenToAnimate = [];
        });

        // If the placeholder was holding the container open while elements were
        // leaving, we we can now set its height to zero.
        if (this.heightPlaceholderData.domNode !== null) {
          this.heightPlaceholderData.domNode.style.height = 0;
        }
      }
    }
  }, {
    key: 'formatChildrenForHooks',
    value: function formatChildrenForHooks() {
      var _this8 = this;

      var elements = [];
      var domNodes = [];

      this.childrenToAnimate.forEach(function (childKey) {
        // If this was an exit animation, the child may no longer exist.
        // If so, skip it.
        var element = _this8.findChildByKey(childKey);

        if (!element) {
          return;
        }

        elements.push(element);
        domNodes.push(_this8.childrenData[childKey].domNode);
      });

      return [elements, domNodes];
    }
  }, {
    key: 'updateBoundingBoxCaches',
    value: function updateBoundingBoxCaches() {
      var _this9 = this;

      // This is the ONLY place that parentData and childrenData's
      // bounding boxes are updated. They will be calculated at other times
      // to be compared to this value, but it's important that the cache is
      // updated once per update.
      this.parentData.boundingBox = this.props.getPosition(this.parentData.domNode);

      this.state.children.forEach(function (child) {
        // It is possible that a child does not have a `key` property;
        // Ignore these children, they don't need to be moved.
        if (!child.key) {
          return;
        }

        var childData = _this9.childrenData[child.key];

        // In very rare circumstances, for reasons unknown, the ref is never
        // populated for certain children. In this case, avoid doing this update.
        // see: https://github.com/joshwcomeau/react-flip-move/pull/91
        if (!childData) {
          return;
        }

        // If the child element returns null, we need to avoid trying to
        // account for it
        if (!childData.domNode) {
          return;
        }

        childData.boundingBox = (0, _domManipulation.getRelativeBoundingBox)({
          childData: childData,
          parentData: _this9.parentData,
          getPosition: _this9.props.getPosition
        });
      });
    }
  }, {
    key: 'computeInitialStyles',
    value: function computeInitialStyles(child) {
      var enterOrLeaveWithoutAnimation = child.entering && !this.props.enterAnimation || child.leaving && !this.props.leaveAnimation;

      if (enterOrLeaveWithoutAnimation) {
        return {};
      }

      if (child.entering) {
        // If this child was in the middle of leaving, it still has its
        // absolute positioning styles applied. We need to undo those.
        return _extends({
          position: '',
          top: '',
          left: '',
          right: '',
          bottom: ''
        }, this.props.enterAnimation.from);
      } else if (child.leaving) {
        return this.props.leaveAnimation.from;
      }

      var _getPositionDelta = (0, _domManipulation.getPositionDelta)({
        childData: this.childrenData[child.key],
        parentData: this.parentData,
        getPosition: this.props.getPosition
      }),
          _getPositionDelta2 = _slicedToArray(_getPositionDelta, 2),
          dX = _getPositionDelta2[0],
          dY = _getPositionDelta2[1];

      return {
        transform: 'translate(' + dX + 'px, ' + dY + 'px)'
      };
    }
  }, {
    key: 'isAnimationDisabled',
    value: function isAnimationDisabled(props) {
      // If the component is explicitly passed a `disableAllAnimations` flag,
      // we can skip this whole process. Similarly, if all of the numbers have
      // been set to 0, there is no point in trying to animate; doing so would
      // only cause a flicker (and the intent is probably to disable animations)
      // We can also skip this rigamarole if there's no browser support for it.
      return noBrowserSupport || props.disableAllAnimations || props.duration === 0 && props.delay === 0 && props.staggerDurationBy === 0 && props.staggerDelayBy === 0;
    }
  }, {
    key: 'doesChildNeedToBeAnimated',
    value: function doesChildNeedToBeAnimated(child) {
      // If the child doesn't have a key, it's an immovable child (one that we
      // do not want to do FLIP stuff to.)
      if (!child.key) {
        return false;
      }

      var childData = this.childrenData[child.key];

      if (!childData.domNode) {
        return false;
      }

      var _props2 = this.props,
          enterAnimation = _props2.enterAnimation,
          leaveAnimation = _props2.leaveAnimation,
          getPosition = _props2.getPosition;


      var isEnteringWithAnimation = child.entering && enterAnimation;
      var isLeavingWithAnimation = child.leaving && leaveAnimation;

      if (isEnteringWithAnimation || isLeavingWithAnimation) {
        return true;
      }

      // If it isn't entering/leaving, we want to animate it if it's
      // on-screen position has changed.

      var _getPositionDelta3 = (0, _domManipulation.getPositionDelta)({
        childData: childData,
        parentData: this.parentData,
        getPosition: getPosition
      }),
          _getPositionDelta4 = _slicedToArray(_getPositionDelta3, 2),
          dX = _getPositionDelta4[0],
          dY = _getPositionDelta4[1];

      return dX !== 0 || dY !== 0;
    }
  }, {
    key: 'findChildByKey',
    value: function findChildByKey(key) {
      return this.state.children.find(function (child) {
        return child.key === key;
      });
    }
  }, {
    key: 'createHeightPlaceholder',
    value: function createHeightPlaceholder() {
      var _this10 = this;

      var typeName = this.props.typeName;

      // If requested, create an invisible element at the end of the list.
      // Its height will be modified to prevent the container from collapsing
      // prematurely.

      var isContainerAList = typeName === 'ul' || typeName === 'ol';
      var placeholderType = isContainerAList ? 'li' : 'div';

      return _react2.default.createElement(placeholderType, {
        key: 'height-placeholder',
        ref: function ref(domNode) {
          _this10.heightPlaceholderData.domNode = domNode;
        },
        style: { visibility: 'hidden', height: 0 }
      });
    }
  }, {
    key: 'childrenWithRefs',
    value: function childrenWithRefs() {
      var _this11 = this;

      // We need to clone the provided children, capturing a reference to the
      // underlying DOM node. Flip Move needs to use the React escape hatches to
      // be able to do its calculations.
      return this.state.children.map(function (child) {
        return _react2.default.cloneElement(child, {
          ref: function ref(element) {
            // Stateless Functional Components are not supported by FlipMove,
            // because they don't have instances.
            if (!element) {
              return;
            }

            var domNode = (0, _domManipulation.getNativeNode)(element);

            // If this is the first render, we need to create the data entry
            if (!_this11.childrenData[child.key]) {
              _this11.childrenData[child.key] = {};
            }

            _this11.childrenData[child.key].domNode = domNode;
          }
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this12 = this;

      var _props3 = this.props,
          typeName = _props3.typeName,
          delegated = _props3.delegated,
          leaveAnimation = _props3.leaveAnimation,
          maintainContainerHeight = _props3.maintainContainerHeight;


      var props = _extends({}, delegated, {
        ref: function ref(node) {
          _this12.parentData.domNode = node;
        }
      });

      var children = this.childrenWithRefs();
      if (leaveAnimation && maintainContainerHeight) {
        children.push(this.createHeightPlaceholder());
      }

      return _react2.default.createElement(typeName, props, children);
    }
  }]);

  return FlipMove;
}(_react.Component);

exports.default = (0, _propConverter2.default)(FlipMove);
module.exports = exports['default'];