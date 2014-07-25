(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.matter = factory ();
  }
})(this, function () {
  'use strict';
  var matter = {},
      types = {
        category : 'eventCategory',
        action : 'eventAction',
        label : 'eventLabel',
        value : 'eventValue'
      },
      addEvent = function (obj, type, fn) {
        if (obj.attachEvent) {
          obj['e' + type + fn] = fn;
          obj[type + fn] = function () {
            obj['e' + type + fn](window.event);
          };
          obj.attachEvent('on' + type, obj[type + fn]);
        } else {
          obj.addEventListener(type, fn, false);
        }
      };
  matter.emit = function (trackers) {
    var track = { hitType : 'event' };
    for (var prop in trackers) {
      if (types[prop]) {
        track[types[prop]] = trackers[prop];
      }
    }
    try {
      ga('send', track);
    } catch (e) {}
  };
  matter.init = function () {
    var nodes = document.querySelectorAll('[data-matter]'),
        i = nodes.length,
        emit = function () {
          matter.emit(JSON.parse(this.getAttribute('data-matter')));
        };
    while (i--) {
      addEvent(nodes[i], (nodes[i].getAttribute('data-matter-event') || 'click'), emit);
    }
  };
  return matter;
});
