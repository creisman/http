/**
 * @fileoverview Defines an HTTP server using Chrome sockets.
 * @author creisman
 */

goog.provide('http.Server');

goog.require('goog.async.Deferred');

/**
 * Constructs an HTTP server instance.
 * 
 * @param {string}
 *          address The IP address to listen on.
 * @param {number}
 *          port The port to listen on.
 * @constructor
 */
http.Server = function(address, port) {
  /**
   * @type {string}
   * @private
   */
  this.address_ = address;

  /**
   * @type {number}
   * @private
   */
  this.port_ = port;

  /**
   * @type {?number}
   * @private
   */
  this.listeningSocketId_ = null;
};

/**
 * Starts the server, using the given socket options if passed.
 * 
 * @returns {goog.async.Deferred} The deferred with the result.
 */
http.Server.prototype.start = function() {
  var def = new goog.async.Deferred();

  chrome.socket.create('tcp', goog.bind(function(socket) {
    this.listeningSocketId_ = socket.socketId;
    chrome.socket.listen(socket.socketId, this.address_, this.port_, goog.bind(
        function(res) {
          if (res != 0) {
            def.errback('Could not listen on socket');
          } else {
            def.callback();
          }
        }, this));
  }, this));

  return def;
};

/**
 * Stop listening on the socket. NOTE: This may not work when called during the
 * onClosed listener. See crbug/295100.
 */
http.Server.prototype.stop = function() {
  chrome.socket.destroy(this.listeningSocketId_);
};

/**
 * Common addresses.
 * 
 * @enum {string}
 */
http.Server.Addresses = {
  ALL : '0',
  LOCALHOST : '127.0.0.1'
};
