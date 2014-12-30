"use strict";

var $ = require('jquery'),
    _ = require('lodash'),
    Promise = require('bluebird');

// Custom Errors and throwers.
class notImplementedError extends Error {}
function throwNotImplemented() {
    throw notImplementedError("These methods are not implemented, use jQuery\'s instead");
}

var _methods = {};
var defaultHeaders = {};
var defaultOptions = {
    type: 'POST',
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
                reject({jqXhr, textStatus, errorThrown});
            }
        }));
    });
}

// Borrowed from jQuery source
_.each(["post", "get", "put", "delete"], (method) => {
    _methods[method] = (url, data, callback, type) => {
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

function getJSON (url, data, callback) {
    return _methods.get(url, data, callback, "json");
}

function getScript (url, callback) {
    return _methods.get(url, undefined, callback, "script");
}

module.exports = {
    defaultHeaders: defaultHeaders,
    defaultOptions: defaultOptions,
    ajax: ajax,
    get: _methods.get,
    post: _methods.post,
    put: _methods.put,             // non-jQuery API
    delete: _methods.delete,       // non-jQuery API
    getJSON: getJSON,
    getScript: getScript,
    param: throwNotImplemented,
    ajaxPrefilter: throwNotImplemented,
    ajaxSetup: throwNotImplemented,
    ajaxTransport: throwNotImplemented,
};
