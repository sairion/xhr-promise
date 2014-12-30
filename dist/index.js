"use strict";

var _inherits = function (child, parent) {
  child.prototype = Object.create(parent && parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (parent) child.__proto__ = parent;
};

"use strict";

var $ = require("jquery"), _ = require("lodash"), Promise = require("bluebird");

// Custom Errors and throwers.
var notImplementedError = function notImplementedError() {
  if (Error) {
    Error.apply(this, arguments);
  }
};

_inherits(notImplementedError, Error);

function throwNotImplemented() {
  throw notImplementedError("These methods are not implemented, use jQuery's instead");
}

var _methods = {};
var defaultHeaders = {};
var defaultOptions = {
  type: "POST",
  headers: defaultHeaders,
  xhrFields: {
    withCredentials: true
  }
};

function ajax(options) {
  return new Promise(function (resolve, reject) {
    $.ajax($.extend({}, defaultOptions, options, {
      success: function (data) {
        resolve(data);
      },
      error: function (jqXhr, textStatus, errorThrown) {
        reject({ jqXhr: jqXhr, textStatus: textStatus, errorThrown: errorThrown });
      }
    }));
  });
}

// Borrowed from jQuery source
_.each(["post", "get", "put", "delete"], function (method) {
  _methods[method] = function (url, data, callback, type) {
    if (_.isFunction(data)) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

function getJSON(url, data, callback) {
  return _methods.get(url, data, callback, "json");
}

function getScript(url, callback) {
  return _methods.get(url, undefined, callback, "script");
}

module.exports = {
  defaultHeaders: defaultHeaders,
  defaultOptions: defaultOptions,
  ajax: ajax,
  get: _methods.get,
  post: _methods.post,
  put: _methods.put, // non-jQuery API
  "delete": _methods["delete"], // non-jQuery API
  getJSON: getJSON,
  getScript: getScript,
  param: throwNotImplemented,
  ajaxPrefilter: throwNotImplemented,
  ajaxSetup: throwNotImplemented,
  ajaxTransport: throwNotImplemented };

