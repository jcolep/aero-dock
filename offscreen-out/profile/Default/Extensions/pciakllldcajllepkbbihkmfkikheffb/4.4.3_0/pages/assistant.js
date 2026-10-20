/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 61934:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});


/***/ }),

/***/ 14839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);
var tryToString = __webpack_require__(52824);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 62947:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPossiblePrototype = __webpack_require__(99946);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 38228:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(92704);
var create = __webpack_require__(64515);
var defineProperty = (__webpack_require__(90484).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 49352:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(82917);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 93980:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(81958);
var toAbsoluteIndex = __webpack_require__(63513);
var lengthOfArrayLike = __webpack_require__(71959);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 21378:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var isArray = __webpack_require__(98185);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 73431:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 43924:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(8695);
var isCallable = __webpack_require__(14226);
var classofRaw = __webpack_require__(73431);
var wellKnownSymbol = __webpack_require__(92704);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 47187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(3412);
var ownKeys = __webpack_require__(47066);
var getOwnPropertyDescriptorModule = __webpack_require__(85534);
var definePropertyModule = __webpack_require__(90484);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 70386:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var definePropertyModule = __webpack_require__(90484);
var createPropertyDescriptor = __webpack_require__(81329);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 81329:
/***/ ((module) => {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 82927:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);
var definePropertyModule = __webpack_require__(90484);
var makeBuiltIn = __webpack_require__(52240);
var defineGlobalProperty = __webpack_require__(39548);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 39548:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ 96591:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 35784:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var isObject = __webpack_require__(82917);

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 52608:
/***/ ((module) => {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 41168:
/***/ ((module) => {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 46834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ 63782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var userAgent = __webpack_require__(46834);

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 92202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ 41044:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var createNonEnumerableProperty = __webpack_require__(70386);
var clearErrorStack = __webpack_require__(92202);
var ERROR_STACK_INSTALLABLE = __webpack_require__(73656);

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ 73656:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);
var createPropertyDescriptor = __webpack_require__(81329);

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ 93499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var getOwnPropertyDescriptor = (__webpack_require__(85534).f);
var createNonEnumerableProperty = __webpack_require__(70386);
var defineBuiltIn = __webpack_require__(82927);
var defineGlobalProperty = __webpack_require__(39548);
var copyConstructorProperties = __webpack_require__(47187);
var isForced = __webpack_require__(60015);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 53668:
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 29968:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(76169);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 76169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 72530:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(76169);

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 47241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var hasOwn = __webpack_require__(3412);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 42055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var aCallable = __webpack_require__(14839);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 25963:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(76169);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 30454:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var isCallable = __webpack_require__(14226);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ 13791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(14839);
var isNullOrUndefined = __webpack_require__(38904);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 84439:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 3412:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var toObject = __webpack_require__(31450);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 37050:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 78664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 18264:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var fails = __webpack_require__(53668);
var createElement = __webpack_require__(35784);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 78042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var fails = __webpack_require__(53668);
var classof = __webpack_require__(73431);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 36348:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);
var isObject = __webpack_require__(82917);
var setPrototypeOf = __webpack_require__(41312);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 94959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var isCallable = __webpack_require__(14226);
var store = __webpack_require__(97880);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 11299:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(82917);
var createNonEnumerableProperty = __webpack_require__(70386);

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ 17436:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(73759);
var globalThis = __webpack_require__(84439);
var isObject = __webpack_require__(82917);
var createNonEnumerableProperty = __webpack_require__(70386);
var hasOwn = __webpack_require__(3412);
var shared = __webpack_require__(97880);
var sharedKey = __webpack_require__(50418);
var hiddenKeys = __webpack_require__(37050);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 98185:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(73431);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 14226:
/***/ ((module) => {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 60015:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);
var isCallable = __webpack_require__(14226);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 38904:
/***/ ((module) => {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 82917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 99946:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(82917);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 69320:
/***/ ((module) => {

"use strict";

module.exports = false;


/***/ }),

/***/ 56882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);
var isCallable = __webpack_require__(14226);
var isPrototypeOf = __webpack_require__(46816);
var USE_SYMBOL_AS_UID = __webpack_require__(60511);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 71959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toLength = __webpack_require__(11801);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 52240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var fails = __webpack_require__(53668);
var isCallable = __webpack_require__(14226);
var hasOwn = __webpack_require__(3412);
var DESCRIPTORS = __webpack_require__(96591);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(47241).CONFIGURABLE);
var inspectSource = __webpack_require__(94959);
var InternalStateModule = __webpack_require__(17436);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 5760:
/***/ ((module) => {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 48088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toString = __webpack_require__(54056);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 64515:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(49352);
var definePropertiesModule = __webpack_require__(85268);
var enumBugKeys = __webpack_require__(41168);
var hiddenKeys = __webpack_require__(37050);
var html = __webpack_require__(78664);
var documentCreateElement = __webpack_require__(35784);
var sharedKey = __webpack_require__(50418);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 85268:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(57133);
var definePropertyModule = __webpack_require__(90484);
var anObject = __webpack_require__(49352);
var toIndexedObject = __webpack_require__(81958);
var objectKeys = __webpack_require__(98531);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 90484:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var IE8_DOM_DEFINE = __webpack_require__(18264);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(57133);
var anObject = __webpack_require__(49352);
var toPropertyKey = __webpack_require__(23822);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 85534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var call = __webpack_require__(72530);
var propertyIsEnumerableModule = __webpack_require__(48150);
var createPropertyDescriptor = __webpack_require__(81329);
var toIndexedObject = __webpack_require__(81958);
var toPropertyKey = __webpack_require__(23822);
var hasOwn = __webpack_require__(3412);
var IE8_DOM_DEFINE = __webpack_require__(18264);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 13971:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(22093);
var enumBugKeys = __webpack_require__(41168);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 3994:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 46816:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 22093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var hasOwn = __webpack_require__(3412);
var toIndexedObject = __webpack_require__(81958);
var indexOf = (__webpack_require__(93980).indexOf);
var hiddenKeys = __webpack_require__(37050);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 98531:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(22093);
var enumBugKeys = __webpack_require__(41168);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 48150:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 41312:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(42055);
var isObject = __webpack_require__(82917);
var requireObjectCoercible = __webpack_require__(7975);
var aPossiblePrototype = __webpack_require__(62947);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 24653:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(72530);
var isCallable = __webpack_require__(14226);
var isObject = __webpack_require__(82917);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 47066:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);
var uncurryThis = __webpack_require__(25963);
var getOwnPropertyNamesModule = __webpack_require__(13971);
var getOwnPropertySymbolsModule = __webpack_require__(3994);
var anObject = __webpack_require__(49352);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 79877:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineProperty = (__webpack_require__(90484).f);

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


/***/ }),

/***/ 7975:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isNullOrUndefined = __webpack_require__(38904);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 50418:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var shared = __webpack_require__(74032);
var uid = __webpack_require__(86379);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 97880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_PURE = __webpack_require__(69320);
var globalThis = __webpack_require__(84439);
var defineGlobalProperty = __webpack_require__(39548);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.40.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 74032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var store = __webpack_require__(97880);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 54638:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(63782);
var fails = __webpack_require__(53668);
var globalThis = __webpack_require__(84439);

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 63513:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(54050);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 81958:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(78042);
var requireObjectCoercible = __webpack_require__(7975);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 54050:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var trunc = __webpack_require__(5760);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 11801:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(54050);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 31450:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var requireObjectCoercible = __webpack_require__(7975);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 50132:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(72530);
var isObject = __webpack_require__(82917);
var isSymbol = __webpack_require__(56882);
var getMethod = __webpack_require__(13791);
var ordinaryToPrimitive = __webpack_require__(24653);
var wellKnownSymbol = __webpack_require__(92704);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 23822:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(50132);
var isSymbol = __webpack_require__(56882);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 8695:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(92704);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 54056:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(43924);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 52824:
/***/ ((module) => {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 86379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 60511:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(54638);

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 57133:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var fails = __webpack_require__(53668);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 73759:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var isCallable = __webpack_require__(14226);

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 92704:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var shared = __webpack_require__(74032);
var hasOwn = __webpack_require__(3412);
var uid = __webpack_require__(86379);
var NATIVE_SYMBOL = __webpack_require__(54638);
var USE_SYMBOL_AS_UID = __webpack_require__(60511);

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 58102:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);
var hasOwn = __webpack_require__(3412);
var createNonEnumerableProperty = __webpack_require__(70386);
var isPrototypeOf = __webpack_require__(46816);
var setPrototypeOf = __webpack_require__(41312);
var copyConstructorProperties = __webpack_require__(47187);
var proxyAccessor = __webpack_require__(79877);
var inheritIfRequired = __webpack_require__(36348);
var normalizeStringArgument = __webpack_require__(48088);
var installErrorCause = __webpack_require__(11299);
var installErrorStack = __webpack_require__(41044);
var DESCRIPTORS = __webpack_require__(96591);
var IS_PURE = __webpack_require__(69320);

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    installErrorStack(result, WrappedError, result.stack, 2);
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


/***/ }),

/***/ 92588:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(93499);
var $includes = (__webpack_require__(93980).includes);
var fails = __webpack_require__(53668);
var addToUnscopables = __webpack_require__(38228);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ 69529:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(93499);
var toObject = __webpack_require__(31450);
var lengthOfArrayLike = __webpack_require__(71959);
var setArrayLength = __webpack_require__(21378);
var doesNotExceedSafeInteger = __webpack_require__(52608);
var fails = __webpack_require__(53668);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 6277:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__(93499);
var globalThis = __webpack_require__(84439);
var apply = __webpack_require__(29968);
var wrapErrorConstructorWithCause = __webpack_require__(58102);

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = globalThis[WEB_ASSEMBLY];

// eslint-disable-next-line es/no-error-cause -- feature detection
var FORCED = new Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  }
};

// https://tc39.es/ecma262/#sec-nativeerror
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69529);
// EXTERNAL MODULE: ./node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(61934);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__(6277);
;// ./src/common/logger.js

const LEVELS = {
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5
};
const METHOD = {
    error: 'error',
    warn: 'warn',
    info: 'info',
    debug: 'debug',
    verbose: 'trace'
};
let levelNum =  true ? LEVELS.info : 0;
let level =  true ? 'info' : 0;
function getErrorMessage(error) {
    if (typeof error === 'object' && error !== null && typeof error.message === 'string') {
        return error.message;
    }
    try {
        return JSON.stringify(error);
    } catch  {
        return String(error);
    }
}
function log(lvl, args) {
    if (levelNum < LEVELS[lvl] || !args.length || !args[0]) {
        return;
    }
    // eslint-disable-next-line no-console
    console[METHOD[lvl]](...args);
}
const logger_logger = {
    get currentLevel () {
        return level;
    },
    set currentLevel (l){
        if (!LEVELS[l]) {
            throw new Error(`Unsupported log level: ${l}`);
        }
        level = l;
        levelNum = LEVELS[l];
    },
    isVerbose: ()=>levelNum >= LEVELS.debug,
    error: (...args)=>log('error', args),
    warn: (...args)=>log('warn', args),
    info: (...args)=>log('info', args),
    debug: (...args)=>log('debug', args),
    trace: (...args)=>log('verbose', args)
};


;// ./src/common/i18n.js



// Kept in browser.storage.local (not localStorage) so the background worker,
// which composes toast and context-menu strings, can read it too.
const DEV_LOCALE_STORAGE_KEY = 'abu-dev-ui-locale';
const RTL_LOCALES = new Set([
    'ar',
    'he',
    'fa'
]);
let overrideMessages = null;
let devLocale = '';
/** Locale folder names from `src/resources/_locales` (injected at build time). */ const DEV_LOCALES = (/* unused pure expression or super */ null && ( true ? [] : 0));
function applySubstitutions(message, substitutions, placeholders) {
    const subs = substitutions == null ? [] : Array.isArray(substitutions) ? substitutions : [
        substitutions
    ];
    let result = message;
    if (placeholders) {
        for (const [name, { content }] of Object.entries(placeholders)){
            // Chrome only supports positional $1–$9 in placeholder content.
            const resolved = String(content).replace(/\$([1-9])/g, (_, n)=>{
                const value = subs[Number(n) - 1];
                return value !== undefined ? String(value) : '';
            });
            result = result.replace(new RegExp(`\\$${name}\\$`, 'gi'), ()=>resolved);
        }
    }
    // Chrome: $$ → literal $; only $1–$9 are substitution slots.
    result = result.replace(/\$\$|\$([1-9])/g, (match, n)=>{
        if (match === '$$') {
            return '$';
        }
        const value = subs[Number(n) - 1];
        return value !== undefined ? String(value) : match;
    });
    return result;
}
/** UI direction for the active locale: DEV override if set, else `@@bidi_dir`. */ function getUiDir() {
    if (devLocale) {
        return RTL_LOCALES.has(devLocale) ? 'rtl' : 'ltr';
    }
    return browser_polyfill.i18n.getMessage('@@bidi_dir') || 'ltr';
}
/** Sets `dir` (and `lang` when a DEV locale override is active) on a document. */ function applyDocumentLocale(doc) {
    if (!doc?.documentElement) {
        return;
    }
    if (devLocale) {
        doc.documentElement.lang = devLocale.replace(/_/g, '-');
    }
    doc.documentElement.dir = getUiDir();
}
/** Resolved during initDevLocale; empty when using the browser language. */ function getDevLocale() {
    return devLocale;
}
/** Snapshot for the background GetDevLocale handler / content-script inject. */ function getDevLocaleState() {
    return {
        locale: devLocale,
        messages: overrideMessages
    };
}
/**
 * Injects an override pack into this bundle's i18n module state.
 * Used by content-script contexts that receive the pack from the background.
 * Does not touch `document` — call `applyDocumentLocale` separately (e.g. on
 * an iframe doc) so content scripts never mutate the host page's lang/dir.
 */ function applyDevLocale(state = {}) {
    if (state.locale !== undefined) {
        devLocale = state.locale || '';
    }
    if (state.messages !== undefined) {
        overrideMessages = state.messages || null;
    }
}
/** Persist override and reload. Pass empty to clear. */ async function setDevLocale(locale) {
    if (true) {
        return;
    }
    if (locale) {
        await browser.storage.local.set({
            [DEV_LOCALE_STORAGE_KEY]: locale
        });
    } else {
        await browser.storage.local.remove(DEV_LOCALE_STORAGE_KEY);
    }
    location.reload();
}
async function loadOverride(locale) {
    if (!locale) {
        applyDevLocale({
            locale: '',
            messages: null
        });
    } else {
        try {
            const response = await fetch(browser.runtime.getURL(`_locales/${locale}/messages.json`));
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            applyDevLocale({
                locale,
                messages: await response.json()
            });
        } catch (e) {
            logger.warn(`[i18n] Failed to load DEV locale "${locale}":`, e);
            applyDevLocale({
                locale: '',
                messages: null
            });
        }
    }
    // Extension pages only — content scripts never call loadOverride.
    if (typeof document !== 'undefined') {
        applyDocumentLocale(document);
    }
}
/**
 * Loads the DEV locale override before the first getMessage call, and always
 * applies `dir` on extension pages. Call it on pages before render and on
 * background startup. The override load is a no-op in release builds.
 *
 * Pass `{ watch: true }` from the background so the pack stays in sync when
 * Options changes the override (pages reload on switch and do not need this).
 */ async function initDevLocale({ watch = false } = {}) {
    if (true) {
        if (typeof document !== 'undefined') {
            applyDocumentLocale(document);
        }
        return;
    }
    if (watch) {
        browser.storage.onChanged.addListener((changes, area)=>{
            if (area === 'local' && DEV_LOCALE_STORAGE_KEY in changes) {
                loadOverride(changes[DEV_LOCALE_STORAGE_KEY].newValue || '');
            }
        });
    }
    const stored = await browser.storage.local.get(DEV_LOCALE_STORAGE_KEY);
    await loadOverride(stored[DEV_LOCALE_STORAGE_KEY] || '');
}
function getMessage(messageName, substitutions = []) {
    if (false) {}
    return browser_polyfill.i18n.getMessage(messageName, substitutions);
}

;// ./src/common/iframe-fit.js
/**
 * Shared sizing helper for injected iframes (toasts, rate-us, assistant).
 * Container CSS fixes only the width; the iframe height is derived from the
 * rendered content card so long localizations grow the popup instead of
 * being clipped.
 */ /**
 * Extra free space added below the measured card (px). Safety margin against
 * measurement edge cases (sub-pixel rounding, late layout shifts).
 */ const IFRAME_HEIGHT_BUFFER_PX = 20;
/**
 * Computes the iframe height for a content card: rendered height including
 * borders (`offsetHeight`) plus the safety buffer.
 *
 * @param {Element|null|undefined} card Root element of the popup card.
 * @returns {number|null} Height in px, or null if the card isn't measurable yet.
 */ function getCardFitHeight(card) {
    if (!card || !(card.offsetHeight > 0)) {
        return null;
    }
    return card.offsetHeight + IFRAME_HEIGHT_BUFFER_PX;
}

;// ./src/common/theme.js
/**
 * Shared theme-mode helpers.
 *
 * Design tokens (src/resources/css/theme-tokens.css) key off `abu-theme-*`
 * classes on the root element. These helpers resolve a theme mode
 * ('system' | 'light' | 'dark') to a concrete boolean or class, with
 * `system` following the OS preference via matchMedia.
 */ const ThemeMode = {
    System: 'system',
    Light: 'light',
    Dark: 'dark'
};
const THEME_CLASS_LIGHT = 'abu-theme-light';
const THEME_CLASS_DARK = 'abu-theme-dark';
const DARK_QUERY = '(prefers-color-scheme: dark)';
function systemPrefersDark() {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;
}
/** Resolves a theme mode to a concrete boolean (system follows the OS). */ function resolveIsDark(mode) {
    if (mode === ThemeMode.Dark) {
        return true;
    }
    if (mode === ThemeMode.Light) {
        return false;
    }
    return systemPrefersDark();
}
/**
 * Resolves a theme mode to the CSS class that theme-tokens.css keys off of.
 *
 * @param {string} mode 'system' | 'light' | 'dark'
 * @returns {string} 'abu-theme-dark' or 'abu-theme-light'
 */ function resolveThemeClass(mode) {
    return resolveIsDark(mode) ? THEME_CLASS_DARK : THEME_CLASS_LIGHT;
}
/**
 * Subscribes to OS color-scheme changes. Returns an unsubscribe function.
 * Callers should only react while in system mode.
 */ function watchSystemTheme(onChange) {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return ()=>{};
    }
    const mql = window.matchMedia(DARK_QUERY);
    const handler = ()=>onChange(mql.matches);
    mql.addEventListener('change', handler);
    return ()=>mql.removeEventListener('change', handler);
}

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(92588);
;// ./src/common/messages/constants.js
const constants_APP_MESSAGE_HANDLER_NAME = 'app';
const MessageType = {
    CreateEventListener: 'createEventListener',
    RemoveListener: 'removeListener',
    OpenExtensionStore: 'openExtensionStore',
    SetFilterEnabled: 'setFilterEnabled',
    GetUserRules: 'getUserRules',
    SaveUserRules: 'saveUserRules',
    GetAllowlistDomains: 'getAllowlistDomains',
    SaveAllowlistDomains: 'saveAllowlistDomains',
    CheckFiltersUpdate: 'checkFiltersUpdate',
    LoadCustomFilterInfo: 'loadCustomFilterInfo',
    SubscribeToCustomFilter: 'subscribeToCustomFilter',
    RemoveAntiBannerFilter: 'removeAntiBannerFilter',
    GetIsAppInitialized: 'getIsAppInitialized',
    GetTabInfoForPopup: 'getTabInfoForPopup',
    ChangeApplicationFilteringPaused: 'changeApplicationFilteringPaused',
    OpenRulesLimitsTab: 'openRulesLimitsTab',
    OpenSettingsTab: 'openSettingsTab',
    OpenAssistant: 'openAssistant',
    OpenAbuseTab: 'openAbuseTab',
    OpenSiteReportTab: 'openSiteReportTab',
    OpenChromeExtensionsSettingsPage: 'openChromeExtensionsSettingsPage',
    OpenExtensionDetailsPage: 'openExtensionDetailsPage',
    RemoveAllowlistDomain: 'removeAllowlistDomain',
    AddAllowlistDomainForTabId: 'addAllowlistDomainForTabId',
    RefreshPage: 'refreshPage',
    AddUserRule: 'addUserRule',
    RemoveUserRule: 'removeUserRule',
    SetGroupEnabled: 'setGroupEnabled',
    NotifyListeners: 'notifyListeners',
    AddLongLivedConnection: 'addLongLivedConnection',
    GetOptionsData: 'getOptionsData',
    ChangeUserSettings: 'changeUserSetting',
    GetSelectorsAndScripts: 'getSelectorsAndScripts',
    CheckPageScriptWrapperRequest: 'checkPageScriptWrapperRequest',
    ProcessShouldCollapse: 'processShouldCollapse',
    ProcessShouldCollapseMany: 'processShouldCollapseMany',
    GetCookieRules: 'getCookieRules',
    SaveCookieLogEvent: 'saveCookieRuleEvent',
    AddUrlToTrusted: 'addUrlToTrusted',
    GetEditorStorageContent: 'getEditorStorageContent',
    SetEditorStorageContent: 'setEditorStorageContent',
    AppInitialized: 'appInitialized',
    UpdateTotalBlocked: 'updateTotalBlocked',
    UpdateLimitsVerdict: 'updateLimitsVerdict',
    ScriptletCloseWindow: 'scriptletCloseWindow',
    ShowRuleLimitsAlert: 'showRuleLimitsAlert',
    ShowRateUsPopup: 'showRateUsPopup',
    ShowAlertPopup: 'showAlertPopup',
    UpdateListeners: 'updateListeners',
    CurrentLimitsMv3: 'currentLimitsMv3',
    GetRulesLimitsCountersMv3: 'getRulesLimitsCountersMv3',
    GetDesktopAppStatus: 'getDesktopAppStatus',
    SendFeedback: 'sendFeedback',
    GetRateUsEligibility: 'getRateUsEligibility',
    GetWelcomeState: 'getWelcomeState',
    ApplyWelcomeSettings: 'applyWelcomeSettings',
    GetThemeMode: 'getThemeMode',
    GetDevLocale: 'getDevLocale'
};

;// ./src/common/messages/error-response.js
/**
 * Error transport for app messages.
 *
 * Errors thrown in background message handlers cannot be propagated to the
 * sender as promise rejections: Chrome's native promise-based messaging
 * (used since webextension-polyfill passes through the native `browser`
 * namespace when available) re-wraps rejected values and mangles their
 * `message` (e.g. 'limits_exceeded' arrives as 'Error: limits_exceeded').
 * Instead, handlers respond with a plain envelope object which the sender
 * side converts back into a thrown Error.
 *
 * This module must stay dependency-free: it is bundled into content scripts.
 */ /** Marker key for error responses produced by {@link wrapErrorResponse}. */ 
const ERROR_RESPONSE_KEY = '__appMessagingError__';
/**
 * Wraps a handler error into a plain response object that survives the
 * messaging boundary verbatim.
 *
 * @param {unknown} e Error thrown by a message handler.
 * @returns {object} Error envelope response.
 */ const wrapErrorResponse = (e)=>{
    return {
        [ERROR_RESPONSE_KEY]: {
            name: e instanceof Error ? e.name : 'Error',
            message: e instanceof Error ? e.message : String(e)
        }
    };
};
/**
 * Rethrows an error transported via {@link wrapErrorResponse}, if the
 * response is such an envelope. Otherwise does nothing.
 *
 * @param {unknown} response Response received from the background.
 * @throws {Error} The reconstructed handler error.
 */ const error_response_unwrapErrorResponse = (response)=>{
    if (typeof response === 'object' && response !== null && ERROR_RESPONSE_KEY in response) {
        const { name, message } = response[ERROR_RESPONSE_KEY];
        const error = new Error(message);
        error.name = name;
        throw error;
    }
};

;// ./src/common/messages/send-message.js



async function sendMessage(message) {
    try {
        const response = await browser.runtime.sendMessage({
            handlerName: APP_MESSAGE_HANDLER_NAME,
            ...message
        });
        // Rethrows handler errors transported as error-envelope responses
        // (swallowed below, as before, since callers do not consume errors).
        unwrapErrorResponse(response);
        return response;
    } catch (e) {
    // do nothing
    }
}
async function sendTabMessage(tabId, message) {
    return browser.tabs.sendMessage(tabId, {
        handlerName: APP_MESSAGE_HANDLER_NAME,
        ...message
    });
}

;// ./src/common/messages/message-handler.js
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}



const messageHasTypeField = (message)=>{
    return typeof message === 'object' && message !== null && 'type' in message;
};
const messageHasTypeAndDataFields = (message)=>{
    return messageHasTypeField(message) && 'data' in message;
};
class MessageHandler {
    static isValidMessageType(message) {
        return messageHasTypeField(message) && typeof message.type === 'string';
    }
    init() {
        browser.runtime.onMessage.addListener(this.handleMessage);
    }
    handleMessage(message, sender) {
        if (this.customHandler && typeof this.customHandler === 'function') {
            const res = this.customHandler(message, sender);
            if (res !== undefined) {
                return res;
            }
        }
        const listener = this.listeners.get(message.type);
        if (!listener) {
            return;
        }
        const fn = async ()=>{
            try {
                return await listener(message, sender);
            } catch (e) {
                logger.error('An error occurred while handling message:', message, 'error:', e);
                throw e;
            }
        };
        return fn();
    }
    addListener(type, listener) {
        if (this.listeners.has(type)) {
            throw new Error(`Message handler: ${type} listener has already been registered`);
        }
        this.listeners.set(type, listener);
    }
    removeListeners() {
        this.listeners.clear();
    }
    constructor(customHandler){
        _define_property(this, "listeners", new Map());
        this.handleMessage = this.handleMessage.bind(this);
        this.customHandler = customHandler;
    }
}

;// ./src/common/messages/index.js
/**
 * Since exports from './constants' are: the MessageType enum and a lot of types,
 * and imports there are types only, so it should not affect bundle size
 */ // eslint-disable-next-line no-restricted-syntax





;// ./src/pages/services/messenger.js
function _class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function _class_static_private_method_get(receiver, classConstructor, method) {
    _class_check_private_static_access(receiver, classConstructor);
    return method;
}




class Messenger {
    static async createEventListener(events, callback, onUnloadCallback) {
        let listenerId;
        const response = await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.CreateEventListener, {
            events
        });
        listenerId = response;
        const onUpdateListeners = async ()=>{
            const updatedResponse = await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.CreateEventListener, {
                events
            });
            listenerId = updatedResponse;
        };
        browser_polyfill.runtime.onMessage.addListener((message)=>{
            if (!messageHasTypeField(message)) {
                logger_logger.error('Received message in Messenger.createEventListener has no type field: ', message);
                return undefined;
            }
            if (message.type === MessageType.NotifyListeners) {
                if (!messageHasTypeAndDataFields(message)) {
                    logger_logger.error('Received message with type MessageType.NotifyListeners has no data: ', message);
                    return undefined;
                }
                const castedMessage = message;
                const [type, ...data] = castedMessage.data;
                if (events.includes(type)) {
                    callback({
                        type,
                        data
                    });
                }
            }
            if (message.type === MessageType.UpdateListeners) {
                onUpdateListeners();
            }
        });
        const onUnload = ()=>{
            if (!listenerId) {
                return;
            }
            _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.RemoveListener, {
                listenerId
            });
            listenerId = null;
            if (typeof onUnloadCallback === 'function') {
                onUnloadCallback();
            }
        };
        window.addEventListener('beforeunload', onUnload);
        window.addEventListener('unload', onUnload);
        return onUnload;
    }
    static async updateListeners() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.UpdateListeners);
    }
    static async getOptionsData() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetOptionsData);
    }
    static async changeUserSetting(settingId, value) {
        await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.ChangeUserSettings, {
            key: settingId,
            value
        });
    }
    static async setFilterEnabled(filterId, enabled) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.SetFilterEnabled, {
            filterId,
            enabled
        });
    }
    static async getUserRules() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetUserRules);
    }
    static async saveUserRules(value) {
        await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.SaveUserRules, {
            value
        });
    }
    static async getAllowlist() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetAllowlistDomains);
    }
    static async saveAllowlist(value) {
        await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.SaveAllowlistDomains, {
            value
        });
    }
    static async updateFilters() {
        if (true) {
            logger_logger.debug('Filters update is not supported in MV3');
            return [];
        }
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.CheckFiltersUpdate);
    }
    static async setGroupEnabled(groupId, enabled) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.SetGroupEnabled, {
            groupId,
            enabled
        });
    }
    static async checkCustomUrl(url) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.LoadCustomFilterInfo, {
            url
        });
    }
    static async addCustomFilter(filter) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.SubscribeToCustomFilter, {
            filter
        });
    }
    static async removeCustomFilter(filterId) {
        await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.RemoveAntiBannerFilter, {
            filterId
        });
    }
    static async getIsEngineStarted() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetIsEngineStarted);
    }
    static async getTabInfoForPopup(tabId) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetTabInfoForPopup, {
            tabId
        });
    }
    static async openSettingsTab() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.OpenSettingsTab);
    }
    static async openRulesLimitsTab() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.OpenRulesLimitsTab);
    }
    static async openAssistant() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.OpenAssistant);
    }
    static async removeAllowlistDomain(tabId, tabRefresh) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.RemoveAllowlistDomain, {
            tabId,
            tabRefresh
        });
    }
    static async addAllowlistDomain(tabId) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.AddAllowlistDomainForTabId, {
            tabId
        });
    }
    static async addUserRule(ruleText) {
        await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.AddUserRule, {
            ruleText
        });
    }
    static async removeUserRule(ruleText) {
        await _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.RemoveUserRule, {
            ruleText
        });
    }
    static async getCurrentLimits() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.CurrentLimitsMv3);
    }
    static async getRulesLimitsCounters() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetRulesLimitsCountersMv3);
    }
    static async addUrlToTrusted(url) {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.AddUrlToTrusted, {
            url
        });
    }
    static async getThemeMode() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetThemeMode);
    }
    static async getDevLocale() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.GetDevLocale);
    }
    static async openChromeExtensionsPage() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.OpenChromeExtensionsSettingsPage);
    }
    static async openExtensionDetailsPage() {
        return _class_static_private_method_get(Messenger, Messenger, messenger_sendMessage).call(Messenger, MessageType.OpenExtensionDetailsPage);
    }
}
async function messenger_sendMessage(type, data) {
    const response = await browser_polyfill.runtime.sendMessage({
        handlerName: constants_APP_MESSAGE_HANDLER_NAME,
        type,
        data
    });
    // Rethrows handler errors transported as error-envelope responses.
    error_response_unwrapErrorResponse(response);
    return response;
}


;// ./src/pages/assistant/i18n.js

/**
 * Translates all elements with an `i18n` attribute in the given document.
 * Also applies lang/dir on the iframe document (RTL when the UI locale is RTL).
 */ function translateUi(doc) {
    applyDocumentLocale(doc);
    const elements = doc.querySelectorAll('[i18n]');
    for (const el of elements){
        const key = el.getAttribute('i18n');
        const message = getMessage(key);
        if (message) {
            el.textContent = message;
        }
    }
}

;// ./src/pages/assistant/utils/dom-utils.js
/**
 * Returns tag name for passed element.
 * @param {Element} element
 */ 
const getNodeName = (element)=>element && element.nodeName ? element.nodeName.toUpperCase() : '';
/**
 * Returns array of parents for passed element.
 * @param {Element} element
 */ const getParentsLevel = (element)=>{
    let parent = element;
    const parentArr = [];
    while((parent = parent.parentNode) && getNodeName(parent) !== 'BODY'){
        parentArr.push(parent);
    }
    return parentArr;
};
/**
 * Returns child element if it has exactly one ELEMENT_NODE child.
 * @param {Element} element
 */ const getSingleChildren = (element)=>{
    const children = element.childNodes;
    if (children) {
        let count = 0;
        let child;
        for(let i = 0; i < children.length; i += 1){
            if (children[i].nodeType === 1) {
                child = children[i];
                count += 1;
            }
        }
        return count === 1 ? child : null;
    }
    return null;
};
/**
 * Returns all single-children descendants of element.
 * @param {Element} element
 */ const getAllChildren = (element)=>{
    const childArray = [];
    let child = element;
    while(child = getSingleChildren(child)){
        childArray.push(child);
    }
    return childArray;
};
/**
 * Converts NodeList or similar to Array.
 * @param {any} elems
 */ const toArray = (elems)=>elems && elems.length !== undefined ? Array.from(elems) : [
        elems
    ];
/**
 * Adds CSS classes to target element(s).
 * @param {Element|NodeList} elem
 * @param {string} className space-separated class names
 */ const addClass = (elem, className)=>{
    const elems = toArray(elem);
    elems.forEach((item)=>{
        item.classList.add(...className.split(/\s/));
    });
};
/**
 * Removes CSS classes from target element(s).
 * @param {Element|NodeList} elem
 * @param {string} className space-separated class names
 */ const removeClass = (elem, className)=>{
    const elems = toArray(elem);
    elems.forEach((item)=>{
        item.classList.remove(...className.split(/\s/));
    });
};
/**
 * Checks whether an element has a specific class.
 * @param {Element} elem
 * @param {string} className
 */ const hasClass = (elem, className)=>{
    const elems = toArray(elem);
    const [target] = elems;
    return !!(target.classList && target.classList.contains(className));
};
/**
 * Makes element visible.
 * @param {Element|NodeList} elem
 */ const show = (elem)=>{
    const elems = toArray(elem);
    elems.forEach((item)=>{
        item.style.display = 'block';
    });
};
/**
 * Makes element invisible.
 * @param {Element|NodeList} elem
 */ const hide = (elem)=>{
    const elems = toArray(elem);
    elems.forEach((item)=>{
        item.style.display = 'none';
    });
};
/**
 * Inlines a CSS style on target element(s).
 * @param {Element|NodeList} elem
 * @param {string} attr CSS property name
 * @param {string} value CSS property value
 */ const addStyle = (elem, attr, value)=>{
    const elems = toArray(elem);
    elems.forEach((item)=>{
        item.style[attr] = value;
    });
};
const DEFAULT_POLICY_NAME = 'AGPolicy';
/**
 * Creates a DOM element from an HTML string, with Trusted Types support.
 * For simple tag names (no `<`), wraps in opening/closing tags first.
 *
 * @param {string} markup HTML string or tag name
 * @returns {Element}
 */ const createElementFromHtml = (markup)=>{
    const doc = document.implementation.createHTMLDocument('');
    let html = markup;
    if (html && html[0] !== '<') {
        html = `<${html}></${html}>`;
    }
    try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            const policy = window.trustedTypes.createPolicy(DEFAULT_POLICY_NAME, {
                createHTML: (s)=>s
            });
            html = policy.createHTML(html);
        }
    } catch  {
    // Trusted Types policy already exists or not supported
    }
    doc.body.innerHTML = html;
    return doc.body.firstChild;
};
/**
 * Creates a `<style>` element with the given CSS text.
 *
 * @param {string} styles CSS text
 * @param {string} [id] optional id to prevent duplicates
 * @returns {HTMLStyleElement|false} the style element, or false if already exists
 */ const createStyleElement = (styles, id)=>{
    if (id && document.querySelector(`#${id}`)) {
        return false;
    }
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    if (id) {
        style.setAttribute('id', id);
    }
    style.appendChild(document.createTextNode(styles));
    return style;
};
/**
 * Replaces innerHTML of an element safely.
 *
 * @param {HTMLElement} element
 * @param {string} html
 */ const setElementHtml = (element, html)=>{
    while(element.lastChild){
        element.removeChild(element.lastChild);
    }
    element.appendChild(createElementFromHtml(html));
};
/**
 * All target browsers (Chrome 121+, Firefox 78+) support Shadow DOM.
 * @returns {boolean}
 */ const checkShadowDomSupport = ()=>true;

;// ./src/pages/assistant/selector.js

/**
 * Element selector for the assistant UI.
 * Handles mouseover/click-based element picking and border rendering.
 */ function ABUSelector(api = {}) {
    const PLACEHOLDER_PREFIX = 'abu-placeholder';
    let placeholdedElements = null;
    let transparentPlaceholdedElement = null;
    let restrictedElements = null;
    const SELECTED_CLASS = 'abu_sg_selected';
    const REJECTED_CLASS = 'abu_sg_rejected';
    const IGNORED_CLASS = 'abu-ignore-select';
    let unbound = true;
    let onElementSelectedHandler = null;
    let ignoreTouchEvent = 0;
    let selectionRenderer;
    const removeClassName = function(className) {
        const elem = document.querySelectorAll(`.${className}`);
        removeClass(elem, className);
    };
    const firstSelectedOrSuggestedParent = function(element) {
        if (hasClass(element, SELECTED_CLASS)) {
            return element;
        }
        let el = element;
        while(el.parentNode && (el = el.parentNode)){
            if (restrictedElements.indexOf(el) === -1) {
                if (hasClass(el, SELECTED_CLASS)) {
                    return el;
                }
            }
        }
        return null;
    };
    const px = function(p) {
        return `${p}px`;
    };
    const getTagPath = function(element) {
        if (element.parentNode) {
            return `${element.parentNode.tagName.toLowerCase()} ${element.tagName.toLowerCase()}`;
        }
        return element.tagName.toLowerCase();
    };
    const sgMouseoverHandler = function(e) {
        e.stopPropagation();
        if (unbound) {
            return true;
        }
        if (this === document.documentElement || this === document.documentElement.parentNode) {
            return false;
        }
        const parent = firstSelectedOrSuggestedParent(this);
        if (parent !== null && parent !== this) {
            selectionRenderer.add(parent);
        } else {
            selectionRenderer.add(this);
        }
        return false;
    };
    const sgMousedownHandler = function(e) {
        if (e && e.isTrusted === false) {
            return false;
        }
        if (hasClass(e.target, IGNORED_CLASS)) {
            return false;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        if (unbound) {
            return true;
        }
        let elem = e.target;
        const borders = elem === selectionRenderer.borderTop || elem === selectionRenderer.borderLeft || elem === selectionRenderer.borderRight || elem === selectionRenderer.borderBottom;
        if (borders) {
            elem = elem.target_elem || elem;
        }
        if (elem === document.documentElement || elem === document.documentElement.parentNode) {
            return undefined;
        }
        selectionRenderer.remove();
        onElementSelectedHandler(elem);
        return false;
    };
    const touchElementSelectHandler = function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        sgMouseoverHandler.call(this, e);
        sgMousedownHandler.call(this, e);
    };
    const removeElementToPreventEvents = function() {
        if (!transparentPlaceholdedElement) {
            return;
        }
        transparentPlaceholdedElement.removeEventListener('click', touchElementSelectHandler);
        transparentPlaceholdedElement.removeEventListener('touchstart', touchElementSelectHandler);
        transparentPlaceholdedElement.removeEventListener('pointerdown', touchElementSelectHandler);
        transparentPlaceholdedElement.parentNode.removeChild(transparentPlaceholdedElement);
        transparentPlaceholdedElement = null;
    };
    const clearSelected = function() {
        removeElementToPreventEvents();
        removeClassName(SELECTED_CLASS);
        removeClassName(REJECTED_CLASS);
        selectionRenderer.remove();
    };
    const getOffsetExtended = function(elem) {
        const bodyRect = document.documentElement.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
        const rectTop = elemRect.top - bodyRect.top;
        const rectLeft = elemRect.left - bodyRect.left;
        return {
            top: rectTop,
            left: rectLeft,
            outerWidth: elem.offsetWidth,
            outerHeight: elem.offsetHeight
        };
    };
    const BorderSelectionRenderer = function(rendererApi) {
        const BORDER_WIDTH = 5;
        const BORDER_PADDING = 2;
        const BORDER_CSS = {
            position: 'absolute',
            background: 'white',
            margin: '0px',
            padding: '0px',
            display: 'block',
            float: 'none',
            border: '0',
            outline: '0',
            'background-color': '#e74c3c',
            'font-style': 'normal',
            'vertical-align': 'baseline',
            'text-align': 'left',
            'line-height': '12px',
            'box-sizing': 'content-box',
            'min-height': 'auto',
            'max-height': 'auto',
            'min-width': 'auto',
            'max-width': 'auto',
            width: 0,
            height: 0,
            'z-index': 2147483646,
            'border-radius': 0
        };
        const BORDER_BOTTOM_CSS = {
            'font-size': '10px',
            'font-weight': 'bold',
            color: 'white',
            padding: '2px 0px 2px 5px',
            overflow: 'hidden'
        };
        let borderTop = null;
        let borderLeft = null;
        let borderRight = null;
        let borderBottom = null;
        const showBorders = function() {
            if (borderTop && borderBottom && borderLeft && borderRight) {
                show(borderTop);
                show(borderBottom);
                show(borderLeft);
                show(borderRight);
            }
        };
        const addBorderToDom = function() {
            document.documentElement.appendChild(borderTop);
            document.documentElement.appendChild(borderBottom);
            document.documentElement.appendChild(borderLeft);
            document.documentElement.appendChild(borderRight);
        };
        const addBorderCSS = function() {
            Object.keys(BORDER_CSS).forEach((item)=>{
                borderTop.style[item] = BORDER_CSS[item];
                borderBottom.style[item] = BORDER_CSS[item];
                borderLeft.style[item] = BORDER_CSS[item];
                borderRight.style[item] = BORDER_CSS[item];
            });
            Object.keys(BORDER_BOTTOM_CSS).forEach((item)=>{
                borderBottom.style[item] = BORDER_BOTTOM_CSS[item];
            });
        };
        const removeBorderFromDom = function() {
            if (borderTop) {
                const parent = borderTop.parentNode;
                if (parent) {
                    parent.removeChild(borderTop);
                    parent.removeChild(borderBottom);
                    parent.removeChild(borderLeft);
                    parent.removeChild(borderRight);
                }
            }
            borderTop = null;
            borderBottom = null;
            borderRight = null;
            borderLeft = null;
        };
        rendererApi.init = function() {
            if (!borderTop) {
                const width = px(BORDER_WIDTH);
                const bottomHeight = px(BORDER_WIDTH + 6);
                borderTop = document.createElement('div');
                borderBottom = document.createElement('div');
                borderLeft = document.createElement('div');
                borderRight = document.createElement('div');
                borderTop.addEventListener('click', sgMousedownHandler);
                borderBottom.addEventListener('click', sgMousedownHandler);
                borderLeft.addEventListener('click', sgMousedownHandler);
                borderRight.addEventListener('click', sgMousedownHandler);
                addStyle(borderTop, 'height', width);
                addStyle(borderBottom, 'height', bottomHeight);
                addStyle(borderLeft, 'width', width);
                addStyle(borderRight, 'width', width);
                hide(borderTop);
                hide(borderBottom);
                hide(borderLeft);
                hide(borderRight);
                rendererApi.borderTop = borderTop;
                rendererApi.borderBottom = borderBottom;
                rendererApi.borderLeft = borderLeft;
                rendererApi.borderRight = borderRight;
                addBorderCSS();
                addBorderToDom();
            }
        };
        rendererApi.finalize = function() {
            removeBorderFromDom();
        };
        rendererApi.add = function(element) {
            rendererApi.remove();
            if (!element) {
                return;
            }
            const p = getOffsetExtended(element);
            const { top } = p;
            const { left } = p;
            const width = p.outerWidth;
            const height = p.outerHeight;
            addStyle(borderTop, 'width', px(width + BORDER_PADDING * 2 + BORDER_WIDTH * 2));
            addStyle(borderTop, 'height', px(5));
            addStyle(borderTop, 'top', px(top - BORDER_WIDTH - BORDER_PADDING));
            addStyle(borderTop, 'left', px(left - BORDER_PADDING - BORDER_WIDTH));
            addStyle(borderBottom, 'width', px(width + BORDER_PADDING * 2 + BORDER_WIDTH));
            addStyle(borderBottom, 'height', px(12));
            addStyle(borderBottom, 'top', px(top + height + BORDER_PADDING));
            addStyle(borderBottom, 'left', px(left - BORDER_PADDING - BORDER_WIDTH));
            addStyle(borderLeft, 'height', px(height + BORDER_PADDING * 2));
            addStyle(borderLeft, 'width', px(5));
            addStyle(borderLeft, 'top', px(top - BORDER_PADDING));
            addStyle(borderLeft, 'left', px(left - BORDER_PADDING - BORDER_WIDTH));
            addStyle(borderRight, 'height', px(height + BORDER_PADDING * 2));
            addStyle(borderRight, 'width', px(5));
            addStyle(borderRight, 'top', px(top - BORDER_PADDING));
            addStyle(borderRight, 'left', px(left + width + BORDER_PADDING));
            borderBottom.textContent = getTagPath(element);
            borderRight.target_elem = element;
            borderLeft.target_elem = element;
            borderTop.target_elem = element;
            borderBottom.target_elem = element;
            showBorders();
        };
        rendererApi.remove = function() {
            if (borderTop && borderBottom && borderLeft && borderRight) {
                hide(borderTop);
                hide(borderBottom);
                hide(borderLeft);
                hide(borderRight);
            }
        };
        return rendererApi;
    }({});
    const linkHelper = document.createElement('a');
    const getHost = function(url) {
        if (!url) {
            return '';
        }
        linkHelper.href = url;
        return linkHelper.hostname;
    };
    const makePlaceholderImage = function(element) {
        const placeHolder = document.createElement('div');
        const style = window.getComputedStyle(element);
        placeHolder.style.height = style.height;
        placeHolder.style.width = style.width;
        placeHolder.style.position = style.position;
        placeHolder.style.top = style.top;
        placeHolder.style.bottom = style.bottom;
        placeHolder.style.left = style.left;
        placeHolder.style.right = style.right;
        placeHolder.className += `${PLACEHOLDER_PREFIX} ${IGNORED_CLASS}`;
        const icon = document.createElement('div');
        icon.className += `${PLACEHOLDER_PREFIX}-icon ${IGNORED_CLASS}`;
        const domain = document.createElement('div');
        domain.textContent = getHost(element.src);
        domain.className += `${PLACEHOLDER_PREFIX}-domain ${IGNORED_CLASS}`;
        icon.appendChild(domain);
        placeHolder.appendChild(icon);
        return placeHolder;
    };
    const removePlaceholders = function() {
        removeElementToPreventEvents();
        if (!placeholdedElements) {
            return;
        }
        const elements = placeholdedElements;
        for(let i = 0; i < elements.length; i += 1){
            const current = elements[i];
            const id = PLACEHOLDER_PREFIX + i;
            const placeHolder = document.querySelector(`#${id}`);
            if (placeHolder) {
                const parent = placeHolder.parentNode;
                if (parent) {
                    parent.replaceChild(current, placeHolder);
                }
            }
        }
        placeholdedElements = null;
    };
    const placeholderClick = function(element) {
        selectionRenderer.remove();
        removePlaceholders();
        onElementSelectedHandler(element);
    };
    const preventEvents = function(element) {
        const placeHolder = document.createElement('div');
        const style = getOffsetExtended(element);
        placeHolder.style.height = px(style.outerHeight);
        placeHolder.style.width = px(style.outerWidth);
        placeHolder.style.top = px(style.top);
        placeHolder.style.left = px(style.left);
        placeHolder.style.background = 'transparent';
        placeHolder.style.position = 'absolute';
        placeHolder.style['pointer-events'] = 'all';
        placeHolder.style['box-sizing'] = 'content-box';
        placeHolder.style['z-index'] = '2147483646';
        placeHolder.className += IGNORED_CLASS;
        transparentPlaceholdedElement = placeHolder;
        placeHolder.addEventListener('click', touchElementSelectHandler);
        placeHolder.addEventListener('touchstart', touchElementSelectHandler);
        placeHolder.addEventListener('pointerdown', touchElementSelectHandler);
        document.documentElement.appendChild(placeHolder);
    };
    const touchMoveHandler = function() {
        ignoreTouchEvent = 1;
        return true;
    };
    const needIgnoreTouchEvent = function() {
        if (ignoreTouchEvent > 0) {
            ignoreTouchEvent -= 1;
            return true;
        }
        return false;
    };
    const makeIFrameAndEmbeddedSelector = function() {
        placeholdedElements = document.querySelectorAll(`iframe:not(.${IGNORED_CLASS}),embed,object`);
        toArray(placeholdedElements).filter((elem)=>{
            const isVisible = elem.style.display !== 'none';
            const isHaveSize = elem.offsetWidth !== 0 && elem.offsetHeight !== 0;
            return isVisible && isHaveSize;
        });
        const elements = placeholdedElements;
        for(let i = 0; i < elements.length; i += 1){
            const current = elements[i];
            (function(cur) {
                const placeHolder = makePlaceholderImage(cur);
                const id = PLACEHOLDER_PREFIX + i;
                placeHolder.setAttribute('id', id);
                const parent = cur.parentNode;
                if (parent) {
                    parent.replaceChild(placeHolder, cur);
                    placeHolder.addEventListener('touchmove', touchMoveHandler);
                    placeHolder.addEventListener('touchend', (e)=>{
                        e.preventDefault();
                        if (needIgnoreTouchEvent()) {
                            return;
                        }
                        placeholderClick(cur);
                    });
                    const elems = document.querySelectorAll(`#${id}`);
                    toArray(elems).forEach((elem)=>{
                        elem.addEventListener('click', (e)=>{
                            e.preventDefault();
                            placeholderClick(cur);
                        });
                    });
                }
            })(current);
        }
    };
    const sgMouseoutHandler = function() {
        if (unbound) {
            return true;
        }
        if (this === document.documentElement || this === document.documentElement.parentNode) {
            return false;
        }
        selectionRenderer.remove();
        return false;
    };
    const elementTouchendHandler = function(e) {
        if (hasClass(e.target, IGNORED_CLASS)) {
            return false;
        }
        e.stopPropagation();
        if (needIgnoreTouchEvent()) {
            return true;
        }
        touchElementSelectHandler.call(this, e);
        return false;
    };
    const emptyEventHandler = function(e) {
        e.stopPropagation();
        return false;
    };
    const setupEventHandlers = function() {
        makeIFrameAndEmbeddedSelector();
        const elements = document.querySelectorAll(`body *:not(.${IGNORED_CLASS})`);
        toArray(elements).forEach((el)=>{
            el.addEventListener('touchmove', touchMoveHandler);
            el.addEventListener('touchend', elementTouchendHandler, true);
            el.addEventListener('touchstart', emptyEventHandler);
            el.addEventListener('mouseover', sgMouseoverHandler);
            el.addEventListener('mouseout', sgMouseoutHandler);
            el.addEventListener('click', sgMousedownHandler, true);
        });
    };
    const deleteEventHandlers = function() {
        removePlaceholders();
        const elements = document.querySelectorAll('body *');
        toArray(elements).forEach((el)=>{
            el.removeEventListener('touchmove', touchMoveHandler);
            el.removeEventListener('touchend', elementTouchendHandler, true);
            el.removeEventListener('touchstart', emptyEventHandler);
            el.removeEventListener('mouseover', sgMouseoverHandler);
            el.removeEventListener('mouseout', sgMouseoutHandler);
            el.removeEventListener('click', sgMousedownHandler, true);
        });
    };
    selectionRenderer = BorderSelectionRenderer;
    api.init = function(onElementSelected, selectionRenderImpl) {
        onElementSelectedHandler = onElementSelected;
        if (selectionRenderImpl && typeof selectionRenderImpl === 'object') {
            selectionRenderer = selectionRenderImpl;
        }
        restrictedElements = [
            'html',
            'body',
            'head',
            'base'
        ].map((sel)=>document.querySelector(sel));
        selectionRenderer.init();
        setupEventHandlers();
        unbound = false;
    };
    api.reset = function() {
        clearSelected();
    };
    api.close = function() {
        unbound = true;
        selectionRenderer.finalize();
        deleteEventHandlers();
    };
    api.selectElement = function(element) {
        selectionRenderer.add(element);
        removePlaceholders();
        unbound = true;
        preventEvents(element);
    };
    api.ignoreClassName = function() {
        return IGNORED_CLASS;
    };
    return api;
}
const selector = new ABUSelector();
/* harmony default export */ const assistant_selector = (selector);

;// ./src/pages/assistant/controllers/selector-menu.js


/**
 * Selector menu controller.
 * Handles the initial "select an element" mode.
 *
 * @param {Object} iframeCtrl iframe controller instance
 */ function SelectorMenuController(iframeCtrl) {
    let contentDocument = null;
    const close = ()=>{
        iframeCtrl.removeIframe();
    };
    const bindEvents = ()=>{
        const menuEvents = {
            '#close': close,
            '#cancel-select-mode': close
        };
        Object.keys(menuEvents).forEach((item)=>{
            const elems = contentDocument.querySelectorAll(item);
            toArray(elems).forEach((elem)=>elem.addEventListener('click', menuEvents[item]));
        });
    };
    const onElementSelected = (element)=>{
        iframeCtrl.showSliderMenu(element);
    };
    const startSelector = ()=>{
        assistant_selector.reset();
        assistant_selector.init(onElementSelected);
    };
    const init = (iframe)=>{
        contentDocument = iframe.contentDocument;
        bindEvents();
        startSelector();
    };
    iframeCtrl.onCloseMenu.attach(assistant_selector.close);
    return {
        init,
        startSelector
    };
}

;// ./src/pages/assistant/utils/common-utils.js
/**
 * Multiple event handler helper.
 * @param {Object} elements element or nodeList
 * @param {string} es multiple events divided by space
 * @param {Function} eventHandler
 * @param {boolean} [useCapture]
 */ const events = {
    add (elements, es, eventHandler, useCapture) {
        this.addRemoveEvents(true, elements, es, eventHandler, useCapture);
    },
    remove (elements, es, eventHandler, useCapture) {
        this.addRemoveEvents(false, elements, es, eventHandler, useCapture);
    },
    addRemoveEvents (add, elements, es, eventHandler, useCapture) {
        if (!elements || !es || !eventHandler) {
            return;
        }
        const eventList = es.split(' ');
        if (!eventList || eventList.length < 1) {
            return;
        }
        let elems = elements;
        if (!elems.length) {
            elems = [
                elems
            ];
        }
        for(let el = 0; el < elems.length; el += 1){
            for(let evt = 0; evt < eventList.length; evt += 1){
                if (!eventList[evt] || !eventList[evt].length) {
                    continue;
                }
                if (add) {
                    elems[el].addEventListener(eventList[evt], eventHandler, !!useCapture);
                } else {
                    elems[el].removeEventListener(eventList[evt], eventHandler, !!useCapture);
                }
            }
        }
    }
};

;// ./src/pages/assistant/slider-widget.js


const RED_COLOR = '#e74c3c';
const TICK_RIGHT_COLOR = '#666';
/**
 * Slider widget for parent/child element navigation.
 */ function SliderWidget(api = {}) {
    const HANDLE_CLASS = 'abu-ui-slider-handle';
    const TICK_CLASS = 'tick';
    let tickLeftColor = RED_COLOR;
    let placeholder = null;
    let clueMin = null;
    let clueMax = null;
    let handle = null;
    let ticks = null;
    let sliderArea = null;
    let min = 0;
    let max = 1;
    let value = 0;
    let onValueChanged = null;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        tickLeftColor = RED_COLOR;
    }
    const refresh = ()=>{
        addStyle(handle, 'left', `${(value - 1) * 100 / (max - min)}%`);
        for(let i = 0; i < ticks.length; i += 1){
            if (i + 1 < value) {
                addStyle(ticks[i], 'background-color', tickLeftColor);
            } else {
                addStyle(ticks[i], 'background-color', TICK_RIGHT_COLOR);
            }
        }
    };
    const setValue = (v)=>{
        if (v < min) {
            value = min;
        } else if (v > max) {
            value = max;
        } else {
            value = v;
        }
        refresh();
        onValueChanged(value);
    };
    const render = ()=>{
        clueMin = placeholder.querySelector('.abu-slide-clue-min');
        clueMax = placeholder.querySelector('.abu-slide-clue-max');
        handle = document.createElement('span');
        handle.setAttribute('class', HANDLE_CLASS);
        placeholder.appendChild(handle);
        const tickCount = max - min;
        ticks = [];
        for(let i = 0; i < tickCount; i += 1){
            const tick = document.createElement('div');
            tick.setAttribute('class', TICK_CLASS);
            tick.style.left = `${100 / tickCount * i}%`;
            tick.style.width = `${100 / tickCount}%`;
            placeholder.appendChild(tick);
            ticks.push(tick);
        }
        refresh();
    };
    const bindEvents = ()=>{
        if (clueMin) {
            clueMin.addEventListener('click', ()=>{
                setValue(min);
            });
        }
        if (clueMax) {
            clueMax.addEventListener('click', ()=>{
                setValue(max);
            });
        }
        const rect = placeholder.getBoundingClientRect();
        const sliderWidth = rect.width;
        const offsetLeft = rect.left + document.body.scrollLeft;
        const getSliderValue = (pageX)=>Math.round((max - min) / sliderWidth * (pageX - offsetLeft) + min);
        const onMouseMove = (e)=>{
            const val = getSliderValue(e.pageX);
            setValue(val);
        };
        const onClick = (e)=>{
            const val = getSliderValue(e.pageX);
            setValue(val);
        };
        const onMouseDown = (e)=>{
            e.stopPropagation();
            e.preventDefault();
            if (sliderArea) {
                sliderArea.addEventListener('mousemove', onMouseMove);
                sliderArea.addEventListener('touchmove', onMouseMove);
                sliderArea.addEventListener('pointermove', onMouseMove);
            }
        };
        const sliderAreaRemoveListeners = ()=>{
            if (sliderArea) {
                sliderArea.removeEventListener('mousemove', onMouseMove);
                sliderArea.removeEventListener('touchmove', onMouseMove);
                sliderArea.removeEventListener('pointermove', onMouseMove);
            }
        };
        document.addEventListener('mouseup', sliderAreaRemoveListeners);
        document.addEventListener('touchend', sliderAreaRemoveListeners);
        document.addEventListener('pointerup', sliderAreaRemoveListeners);
        placeholder.addEventListener('click', onClick);
        placeholder.addEventListener('mousedown', onMouseDown);
        placeholder.addEventListener('touchstart', onMouseDown);
        if (sliderArea) {
            sliderArea.addEventListener('mouseup', sliderAreaRemoveListeners);
            sliderArea.addEventListener('touchend', sliderAreaRemoveListeners);
            sliderArea.addEventListener('pointerup', sliderAreaRemoveListeners);
            sliderArea.addEventListener('mouseleave', sliderAreaRemoveListeners);
        }
    };
    api.init = (placeholderElement, options)=>{
        placeholder = placeholderElement;
        min = options.min;
        max = options.max;
        value = options.value;
        onValueChanged = options.onValueChanged;
        sliderArea = options.sliderArea;
        render();
        bindEvents();
    };
    return api;
}
const sliderWidget = new SliderWidget();
/* harmony default export */ const slider_widget = (sliderWidget);

;// ./src/pages/assistant/rules-constructor.js
/**
 * ABU rules constructor.
 * Builds filter rule text from DOM elements and user options.
 */ 
function ABURulesConstructorLib(api = {}) {
    const CSS_RULE_MARK = '##';
    const RULE_OPTIONS_MARK = '$';
    const URLBLOCK_ATTRIBUTES = [
        'src',
        'data'
    ];
    const linkHelper = document.createElement('a');
    const constructClassCssSelectorByAND = (classList)=>{
        const selectors = [];
        if (classList) {
            for(let i = 0; i < classList.length; i += 1){
                selectors.push(`.${CSS.escape(classList[i])}`);
            }
        }
        return selectors.join('');
    };
    const makeDefaultCssFilter = (element, classList, excludeTagName, excludeId)=>{
        let cssSelector = excludeTagName ? '' : element.tagName.toLowerCase();
        if (element.id && !excludeId) {
            cssSelector += `#${CSS.escape(element.id)}`;
        }
        cssSelector += constructClassCssSelectorByAND(classList || element.classList);
        return cssSelector;
    };
    const makeCssNthChildFilter = (element, options)=>{
        const opts = options || {};
        const { classList, excludeTagName, excludeId } = opts;
        const excludeTagNameOverride = 'excludeTagName' in opts;
        const excludeIdOverride = 'excludeId' in opts;
        const path = [];
        let el = element;
        while(el.parentNode){
            const nodeName = el && el.nodeName ? el.nodeName.toUpperCase() : '';
            if (nodeName === 'BODY') {
                break;
            }
            if (el.id) {
                let cssSelector = '';
                if (el === element) {
                    cssSelector = makeDefaultCssFilter(el, classList || [], excludeTagNameOverride ? excludeTagName : true, excludeIdOverride ? excludeId : false);
                } else {
                    cssSelector = makeDefaultCssFilter(el, [], true, false);
                }
                path.unshift(cssSelector);
                break;
            } else {
                let c = 1;
                for(let e = el; e.previousSibling; e = e.previousSibling){
                    if (e.previousSibling.nodeType === 1) {
                        c += 1;
                    }
                }
                let cldCount = 0;
                for(let i = 0; el.parentNode && i < el.parentNode.childNodes.length; i += 1){
                    cldCount += el.parentNode.childNodes[i].nodeType === 1 ? 1 : 0;
                }
                let ch;
                if (cldCount === 0 || cldCount === 1) {
                    ch = '';
                } else if (c === 1) {
                    ch = ':first-child';
                } else if (c === cldCount) {
                    ch = ':last-child';
                } else {
                    ch = `:nth-child(${c})`;
                }
                if (el === element) {
                    let p = makeDefaultCssFilter(el, classList, excludeId, excludeTagNameOverride ? excludeTagName : false);
                    p += ch;
                    path.unshift(p);
                } else {
                    path.unshift(makeDefaultCssFilter(el, el.classList, false, false) + ch);
                }
                el = el.parentNode;
            }
        }
        return path.join(' > ');
    };
    const constructClassCssSelectorByOR = (classList)=>{
        const selectors = [];
        if (classList) {
            for(let i = 0; i < classList.length; i += 1){
                selectors.push(`.${CSS.escape(classList[i])}`);
            }
        }
        return selectors.join(', ');
    };
    const makeSimilarCssFilter = (element, classList)=>constructClassCssSelectorByOR(classList || element.classList);
    const constructCssRuleText = (element, options)=>{
        if (!element) {
            return;
        }
        const opts = options || {};
        const cssSelectorType = opts.cssSelectorType || 'STRICT_FULL';
        let selector;
        switch(cssSelectorType){
            case 'STRICT_FULL':
                selector = makeCssNthChildFilter(element, opts);
                break;
            case 'STRICT':
                selector = makeDefaultCssFilter(element, opts.classList, opts.excludeTagName, opts.excludeId);
                break;
            case 'SIMILAR':
                selector = makeSimilarCssFilter(element, opts.classList, true);
                break;
            default:
                break;
        }
        return selector ? CSS_RULE_MARK + selector : '';
    };
    const constructUrlBlockRuleText = (element, urlBlockAttribute, oneDomain, domain)=>{
        if (!urlBlockAttribute) {
            return null;
        }
        let blockUrlRuleText = urlBlockAttribute.replace(/^http:\/\/(www\.)?/, '||');
        if (blockUrlRuleText.indexOf('.') === 0) {
            blockUrlRuleText = blockUrlRuleText.substring(1);
        }
        if (!oneDomain) {
            blockUrlRuleText = `${blockUrlRuleText}${RULE_OPTIONS_MARK}domain=${domain}`;
        }
        return blockUrlRuleText;
    };
    const isValidUrl = (value)=>{
        if (value) {
            linkHelper.href = value;
            if (linkHelper.hostname) {
                return true;
            }
        }
        return false;
    };
    const getUrlBlockAttribute = (element)=>{
        if (!element || !element.getAttribute) {
            return null;
        }
        for(let i = 0; i < URLBLOCK_ATTRIBUTES.length; i += 1){
            const attr = URLBLOCK_ATTRIBUTES[i];
            const value = element.getAttribute(attr);
            if (isValidUrl(value)) {
                return value;
            }
        }
        return null;
    };
    const haveUrlBlockParameter = (element)=>{
        const value = getUrlBlockAttribute(element);
        return value && value !== '';
    };
    const haveClassAttribute = (element)=>element.classList && element.classList.length > 0;
    const haveIdAttribute = (element)=>element.id && element.id.trim() !== '';
    const getUrl = (url)=>{
        const pattern = '^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$';
        const rx = new RegExp(pattern);
        const parts = rx.exec(url);
        return {
            host: parts[4] || '',
            path: parts[7] || ''
        };
    };
    const cropDomain = (url)=>{
        const domain = getUrl(url).host;
        return domain.replace('www.', '').replace(/:\d+/, '');
    };
    api.makeCssNthChildFilter = makeCssNthChildFilter;
    api.getElementInfo = (element)=>{
        const attributes = [];
        const elementAttributes = element.attributes;
        if (elementAttributes) {
            for(let i = 0; i < elementAttributes.length; i += 1){
                const attr = elementAttributes[i];
                attributes.push({
                    name: attr.name,
                    value: attr.value
                });
            }
        }
        return {
            tagName: element.tagName,
            attributes,
            urlBlockAttributeValue: getUrlBlockAttribute(element),
            haveUrlBlockParameter: haveUrlBlockParameter(element),
            haveClassAttribute: haveClassAttribute(element),
            haveIdAttribute: haveIdAttribute(element)
        };
    };
    api.constructRuleCssSelector = (ruleText)=>{
        if (!ruleText) {
            return null;
        }
        const index = ruleText.indexOf(CSS_RULE_MARK);
        const optionsIndex = ruleText.indexOf(RULE_OPTIONS_MARK);
        if (index >= 0) {
            return ruleText.substring(index + CSS_RULE_MARK.length, optionsIndex >= 0 ? optionsIndex : ruleText.length);
        }
        let s = ruleText.substring(0, optionsIndex);
        s = s.replace(/[|]|[\^]/g, '');
        if (isValidUrl(s)) {
            return `[src*="${s}"]`;
        }
        return null;
    };
    api.constructRuleText = (element, options)=>{
        const croppedDomain = cropDomain(options.url);
        const { ruleType } = options;
        if (ruleType === 'URL') {
            const blockUrlRuleText = constructUrlBlockRuleText(element, options.urlMask, options.isBlockOneDomain, croppedDomain);
            if (blockUrlRuleText) {
                return blockUrlRuleText;
            }
        }
        let result;
        if (ruleType === 'CSS') {
            result = constructCssRuleText(element, options);
            if (options.attributes) {
                result = (result || CSS_RULE_MARK + result) + options.attributes;
            }
        }
        if (!options.isBlockOneDomain) {
            result = croppedDomain + result;
        }
        return result;
    };
    return api;
}
const abuRulesConstructor = new ABURulesConstructorLib();
/* harmony default export */ const rules_constructor = (abuRulesConstructor);

;// ./src/pages/assistant/controllers/slider-menu.js





/**
 * Slider menu controller.
 * Handles the element adjustment slider and rule options.
 *
 * @param {Function} addRule callback to add a filter rule
 * @param {Object} iframeCtrl iframe controller instance
 */ function SliderMenuController(addRule, iframeCtrl) {
    let contentDocument = null;
    let selectedElement = null;
    let startElement = null;
    let currentElement = null;
    const getFilterRuleInputText = ()=>contentDocument.getElementById('filter-rule').value;
    const close = ()=>{
        iframeCtrl.removeIframe();
    };
    const expandAdvanced = ()=>{
        const advancedSettings = contentDocument.querySelector('#advanced-settings');
        const extendedSettingsText = contentDocument.querySelector('#extended-settings-text');
        const hidden = !hasClass(advancedSettings, 'open');
        if (hidden) {
            addClass(advancedSettings, 'open');
            addClass(extendedSettingsText, 'active');
            iframeCtrl.resizeSliderMenuToAdvanced();
        } else {
            removeClass(advancedSettings, 'open');
            removeClass(extendedSettingsText, 'active');
            iframeCtrl.resizeSliderMenuToNormal();
        }
    };
    const showPreview = ()=>{
        const options = {
            isBlockByUrl: contentDocument.getElementById('block-by-url-checkbox').checked,
            isBlockSimilar: contentDocument.getElementById('block-similar-checkbox').checked,
            isBlockOneDomain: contentDocument.getElementById('one-domain-checkbox').checked
        };
        iframeCtrl.showBlockPreview(selectedElement, getFilterRuleInputText(), startElement, options);
    };
    const blockElement = ()=>{
        const path = getFilterRuleInputText();
        iframeCtrl.blockElement(path, addRule);
    };
    const handleShowBlockSettings = (showBlockByUrl, showBlockSimilar)=>{
        const blockByUrlBlock = contentDocument.querySelector('#block-by-url-checkbox-block');
        const blockSimilarBlock = contentDocument.querySelector('#block-similar-checkbox-block');
        if (showBlockByUrl) {
            show(blockByUrlBlock);
        } else {
            contentDocument.getElementById('block-by-url-checkbox').checked = false;
            hide(blockByUrlBlock);
        }
        if (showBlockSimilar) {
            show(blockSimilarBlock);
        } else {
            contentDocument.getElementById('block-similar-checkbox').checked = false;
            hide(blockSimilarBlock);
        }
    };
    const getUrlBlockAttribute = (element)=>{
        const urlBlockAttributes = [
            'src',
            'data'
        ];
        for(let i = 0; i < urlBlockAttributes.length; i += 1){
            const attr = urlBlockAttributes[i];
            const value = element.getAttribute(attr);
            if (value) {
                return value;
            }
        }
        return null;
    };
    const haveUrlBlockParameter = (element)=>{
        const value = getUrlBlockAttribute(element);
        return value && value !== '';
    };
    const haveClassAttribute = (element)=>{
        const { className } = element;
        return className && typeof className === 'string' && className.trim() !== '';
    };
    const setFilterRuleInputText = (ruleText)=>{
        contentDocument.getElementById('filter-rule').value = ruleText;
    };
    const onScopeChange = ()=>{
        const isBlockByUrl = contentDocument.getElementById('block-by-url-checkbox').checked;
        const isBlockSimilar = contentDocument.getElementById('block-similar-checkbox').checked;
        const isBlockOneDomain = contentDocument.getElementById('one-domain-checkbox').checked;
        handleShowBlockSettings(haveUrlBlockParameter(selectedElement) && !isBlockSimilar, haveClassAttribute(selectedElement) && !isBlockByUrl);
        const options = {
            urlMask: getUrlBlockAttribute(selectedElement),
            cssSelectorType: isBlockSimilar ? 'SIMILAR' : 'STRICT_FULL',
            isBlockOneDomain,
            url: document.location,
            ruleType: isBlockByUrl ? 'URL' : 'CSS'
        };
        const ruleText = rules_constructor.constructRuleText(selectedElement, options);
        setFilterRuleInputText(ruleText);
        iframeCtrl.resizeIframe();
    };
    const bindEvents = ()=>{
        const menuEvents = {
            '#close': close,
            '#extended-settings-text': expandAdvanced,
            '#cancel': iframeCtrl.showSelectorMenu,
            '#preview': showPreview,
            '#accept': blockElement,
            '#block-by-url-checkbox-block': onScopeChange,
            '#one-domain-checkbox-block': onScopeChange,
            '#block-similar-checkbox-block': onScopeChange
        };
        Object.keys(menuEvents).forEach((item)=>{
            const elems = contentDocument.querySelectorAll(item);
            toArray(elems).forEach((elem)=>elem.addEventListener('click', menuEvents[item]));
        });
    };
    const makeDefaultCheckboxesForDetailedMenu = (options)=>{
        contentDocument.getElementById('block-by-url-checkbox').checked = options && options.isBlockByUrl;
        contentDocument.getElementById('block-similar-checkbox').checked = options && options.isBlockSimilar;
        contentDocument.getElementById('one-domain-checkbox').checked = options && options.isBlockOneDomain;
        if (options && (options.isBlockByUrl || options.isBlockSimilar)) {
            handleShowBlockSettings(options.isBlockByUrl, options.isBlockSimilar);
        }
    };
    const onSliderMove = (element)=>{
        selectedElement = element;
        assistant_selector.selectElement(element);
        makeDefaultCheckboxesForDetailedMenu();
        onScopeChange();
        handleShowBlockSettings(haveUrlBlockParameter(element), haveClassAttribute(element));
    };
    const createSlider = (setElement)=>{
        const parents = getParentsLevel(selectedElement);
        const children = getAllChildren(selectedElement);
        const value = Math.abs(parents.length + 1);
        const max = parents.length + children.length + 1;
        const min = 1;
        const options = {
            value,
            min,
            max
        };
        const slider = contentDocument.querySelector('#slider');
        if (min === max) {
            hide(slider);
            hide(contentDocument.querySelectorAll('.element-rule_text'));
            expandAdvanced();
        }
        options.onSliderMove = (delta)=>{
            let elem;
            if (delta > 0) {
                elem = parents[delta - 1];
            }
            if (delta === 0) {
                elem = startElement;
            }
            if (delta < 0) {
                elem = children[Math.abs(delta + 1)];
            }
            onSliderMove(elem);
        };
        let currentVal = options.value;
        if (setElement) {
            const setElementParents = getParentsLevel(setElement);
            currentVal = setElementParents.length + 1;
        }
        const sliderArea = contentDocument.querySelector('#slider-area');
        slider_widget.init(slider, {
            min: options.min,
            max: options.max,
            value: currentVal,
            sliderArea,
            onValueChanged (val) {
                const delta = options.value - (options.max - val + options.min);
                options.onSliderMove(delta);
            }
        });
    };
    const init = (iframe, options)=>{
        selectedElement = options.element;
        startElement = selectedElement;
        contentDocument = iframe.contentDocument;
        currentElement = options.currentElement;
        bindEvents();
        createSlider(currentElement);
        onScopeChange();
        assistant_selector.selectElement(selectedElement);
        if (currentElement) {
            onSliderMove(currentElement);
        }
        events.add(contentDocument.getElementById('filter-rule'), 'contextmenu', (e)=>{
            e.stopPropagation();
        });
        if (options.path) {
            setFilterRuleInputText(options.path);
            expandAdvanced();
        }
        if (options.options) {
            makeDefaultCheckboxesForDetailedMenu(options.options);
        }
    };
    return {
        init
    };
}

;// ./src/pages/assistant/controllers/block-preview.js



/**
 * Block preview controller.
 * Shows a preview of what the blocking rule will hide.
 *
 * @param {Function} addRule callback to add a filter rule
 * @param {Object} iframeCtrl iframe controller instance
 */ function BlockPreviewController(addRule, iframeCtrl) {
    let contentDocument = null;
    let currentElement = null;
    let selectedElement = null;
    let selectedPath = null;
    let optionsState = null;
    const previewStyleID = 'abu-preview-style-id';
    const showElement = ()=>{
        iframeCtrl.showHiddenElements(previewStyleID);
    };
    const close = ()=>{
        showElement();
        iframeCtrl.removeIframe();
    };
    const selectAnotherElement = ()=>{
        showElement();
        iframeCtrl.showSelectorMenu();
    };
    const blockElement = (e)=>{
        e.stopPropagation();
        iframeCtrl.blockElement(selectedPath, addRule);
    };
    const showSliderMenu = ()=>{
        showElement();
        iframeCtrl.showSliderMenu(currentElement, selectedElement, selectedPath, optionsState);
    };
    const bindEvents = ()=>{
        const menuEvents = {
            '#close': close,
            '#select-another-element': selectAnotherElement,
            '#end-preview': showSliderMenu,
            '#block-element': blockElement
        };
        Object.keys(menuEvents).forEach((item)=>{
            const elems = contentDocument.querySelectorAll(item);
            toArray(elems).forEach((elem)=>elem.addEventListener('click', menuEvents[item]));
        });
    };
    const hideElement = ()=>{
        if (!selectedPath) {
            logger_logger.error('Can`t block element: `selector` path is empty');
            return;
        }
        iframeCtrl.hideElementsByPath(selectedPath, previewStyleID);
    };
    const init = (iframe, options)=>{
        selectedElement = options.element;
        selectedPath = options.path;
        currentElement = options.currentElement;
        contentDocument = iframe.contentDocument;
        optionsState = options.options;
        assistant_selector.reset();
        bindEvents();
        hideElement();
    };
    return {
        init
    };
}

;// ./src/pages/assistant/settings.js
/**
 * Assistant settings and constants.
 */ function Settings() {
    const Constants = {
        IFRAME_ID: 'abu-assistant-dialog'
    };
    const MenuItemsNames = {
        SelectorMenu: 'selectorMenu.html',
        SliderMenu: 'sliderMenu.html',
        BlockPreview: 'blockPreview.html'
    };
    return {
        Constants,
        MenuItemsNames
    };
}
const settings = new Settings();
/* harmony default export */ const assistant_settings = (settings);

;// ./src/pages/assistant/utils/ui-validation-utils.js
/**
 * Utils that check environment compatibility with the assistant.
 */ function UIValidationUtils() {
    const getViewPort = ()=>{
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {
            width,
            height
        };
    };
    return {
        getViewPort
    };
}
const uiValidationUtils = new UIValidationUtils();
/* harmony default export */ const ui_validation_utils = (uiValidationUtils);

;// ./src/pages/assistant/utils/ui-utils.js

/**
 * UI utils for dragging the assistant iframe.
 */ function UIUtils() {
    const getOriginalEvent = (e)=>e.targetTouches ? e.targetTouches[0] : e;
    const makeIframeDraggable = (iframe, handleElement)=>{
        const iframeDoc = iframe.contentDocument;
        const offset = Object.create(null);
        const drag = (x, y)=>{
            iframe.style.left = `${x}px`;
            iframe.style.top = `${y}px`;
        };
        const cancelIFrameSelection = (e)=>{
            e.preventDefault();
            e.stopPropagation();
        };
        const onMouseMove = (e)=>{
            const eventPosition = getOriginalEvent(e);
            const dx = eventPosition.screenX - offset.mouseStartX;
            const dy = eventPosition.screenY - offset.mouseStartY;
            drag(offset.startX + dx, offset.startY + dy);
        };
        const onMouseDown = (e)=>{
            const eventPosition = getOriginalEvent(e);
            const rect = iframe.getBoundingClientRect();
            offset.startX = rect.left;
            offset.startY = rect.top;
            offset.mouseStartX = eventPosition.screenX;
            offset.mouseStartY = eventPosition.screenY;
            events.add(iframeDoc, 'mousemove touchmove pointermove', onMouseMove);
            events.add(iframeDoc, 'selectstart', cancelIFrameSelection);
        };
        const onMouseUp = ()=>{
            events.remove(iframeDoc, 'mousemove touchmove pointermove', onMouseMove);
            events.remove(iframeDoc, 'selectstart', cancelIFrameSelection);
        };
        document.addEventListener('visibilitychange', onMouseUp);
        events.add(handleElement, 'mousedown touchstart', onMouseDown);
        events.add(iframeDoc, 'mouseup touchend pointerup', onMouseUp);
        events.add(iframeDoc, 'contextmenu', (e)=>{
            e.preventDefault();
            return false;
        });
    };
    return {
        makeIframeDraggable
    };
}
const uiUtils = new UIUtils();
/* harmony default export */ const ui_utils = (uiUtils);

;// ./src/pages/assistant/templates/selectorMenu.html
const selectorMenu_namespaceObject = "<div class=\"abu-assistant abu-ignore-select\">\n    <div class=\"close\" id=\"close\">×</div>\n\n    <div class=\"head draggable\">\n        <div class=\"abu-logo\"></div>\n\n        <div>\n            <div i18n=\"assistant_select_element\" class=\"title\">Selection mode</div>\n\n            <div class=\"text\">\n                <span i18n=\"assistant_select_element_ext\">Click on any element on the page or</span>\n\n                <span i18n=\"assistant_select_element_cancel\" class=\"clickable\" id=\"cancel-select-mode\">cancel selection\n                    mode</span>\n            </div>\n        </div>\n    </div>\n</div>\n";
;// ./src/pages/assistant/templates/sliderMenu.html
const sliderMenu_namespaceObject = "<div class=\"abu-assistant\">\n    <div class=\"close\" id=\"close\">×</div>\n\n    <div class=\"head draggable\">\n        <div class=\"abu-logo\"></div>\n\n        <div>\n            <div i18n=\"assistant_block_element\" class=\"title\">Block element</div>\n\n            <div i18n=\"assistant_block_element_explain\" class=\"text\" id=\"head_title\">Element blocking rule setup</div>\n        </div>\n    </div>\n\n    <div class=\"content\" id=\"slider-area\">\n        <div i18n=\"assistant_slider_explain\" class=\"element-rule_text\">Adjust the slider to resize the frame\n        </div>\n\n        <div class=\"abu-slide\" id=\"slider\">\n            <div class=\"abu-slide-clue-max\">+</div>\n\n            <div class=\"abu-slide-clue-min\">-</div>\n        </div>\n\n\n        <div class=\"element-rule_expand-link\" id=\"extended-settings-text\">\n            <span i18n=\"assistant_extended_settings\" class=\"element-rule_expand-link_txt\">Detailed\n                settings</span>\n            <span class=\"element-rule_expand-link_arr\"></span>\n        </div>\n\n\n        <div class=\"element-rule_form\" id=\"advanced-settings\">\n            <div class=\"element-rule_form-cont\">\n                <div class=\"element-rule_fieldset\" id=\"one-domain-checkbox-block\">\n                    <input class=\"form-ui-control\" id=\"one-domain-checkbox\" type=\"checkbox\" />\n\n                    <label for=\"one-domain-checkbox\" class=\"form-ui\">\n                        <span i18n=\"assistant_apply_rule_to_all_sites\" class=\"form-ui-txt\">Apply this rule to every\n                            website</span>\n                    </label>\n                </div>\n\n                <div style=\"display: none;\" class=\"element-rule_fieldset\" id=\"block-by-url-checkbox-block\">\n                    <input class=\"form-ui-control\" id=\"block-by-url-checkbox\" type=\"checkbox\" />\n\n                    <label for=\"block-by-url-checkbox\" class=\"form-ui\">\n                        <span i18n=\"assistant_block_by_reference\" class=\"form-ui-txt\">Block element by url</span>\n                    </label>\n                </div>\n\n                <div style=\"display: none;\" class=\"element-rule_fieldset\" id=\"block-similar-checkbox-block\">\n                    <input class=\"form-ui-control\" id=\"block-similar-checkbox\" type=\"checkbox\" />\n\n                    <label for=\"block-similar-checkbox\" class=\"form-ui\">\n                        <span i18n=\"assistant_block_similar\" class=\"form-ui-txt\">Block similar elements</span>\n                    </label>\n                </div>\n\n                <div class=\"element-rule_fieldset\">\n                    <input class=\"form-control\" id=\"filter-rule\" type=\"text\" />\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <button i18n=\"assistant_block\" class=\"btn btn--cancel\" id=\"accept\">Block</button>\n\n        <button i18n=\"assistant_preview_start\" class=\"btn\" id=\"preview\">Preview</button>\n\n        <button i18n=\"assistant_another_element\" class=\"btn\" id=\"cancel\">Select another element</button>\n    </div>\n</div>\n";
;// ./src/pages/assistant/templates/blockPreview.html
const blockPreview_namespaceObject = "<div class=\"abu-assistant\">\n    <div class=\"close\" id=\"close\">×</div>\n\n    <div class=\"head draggable\">\n        <div class=\"abu-logo\"></div>\n\n        <div>\n            <div i18n=\"assistant_block_element\" class=\"title\">Block element</div>\n\n            <div i18n=\"assistant_block_element_explain\" class=\"text\">Element blocking rule setup</div>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <button i18n=\"assistant_block\" class=\"btn btn--cancel\" id=\"block-element\">Block</button>\n\n        <button i18n=\"assistant_preview_end\" class=\"btn\" id=\"end-preview\">Finish preview</button>\n\n        <button i18n=\"assistant_another_element\" class=\"btn\" id=\"select-another-element\">Select another element</button>\n    </div>\n</div>\n";
;// ./src/pages/assistant/iframe-controller.js



















/**
 * Manages the assistant iframe, its content views, and CSS injection.
 */ function IframeController() {
    let iframe = null;
    let iframeAnchor = null;
    let currentItem = null;
    const iframeMaxHeight = 407;
    let menuMaxWidth = 657;
    const menuMaxHeight = 640;
    const menuInitialHeight = 100;
    const iframePositionOffset = 20;
    const blockedElementsStyleID = 'abu-hide-elements-style-id';
    let cssText = null;
    let themeClass = THEME_CLASS_LIGHT;
    const views = {};
    views[assistant_settings.MenuItemsNames.SelectorMenu] = selectorMenu_namespaceObject;
    views[assistant_settings.MenuItemsNames.SliderMenu] = sliderMenu_namespaceObject;
    views[assistant_settings.MenuItemsNames.BlockPreview] = blockPreview_namespaceObject;
    if (window.innerWidth < menuMaxWidth) {
        menuMaxWidth = window.innerWidth;
    }
    const onCloseMenuListeners = [];
    const onShowMenuItemListeners = [];
    const onCloseMenu = {
        attach (listener) {
            onCloseMenuListeners.push(listener);
        },
        notify (args) {
            onCloseMenuListeners.forEach((fn)=>fn(args));
        }
    };
    const onShowMenuItem = {
        attach (listener) {
            onShowMenuItemListeners.push(listener);
        },
        notify (args) {
            onShowMenuItemListeners.forEach((fn)=>fn(args));
        }
    };
    /**
   * Loads compiled assistant CSS from the extension bundle.
   * Called once before any view is shown.
   */ const loadCss = async ()=>{
        await resolveTheme();
        await resolveDevLocale();
        if (cssText) {
            return;
        }
        try {
            const cssUrl = browser_polyfill.runtime.getURL('/pages/assistant.css');
            const response = await fetch(cssUrl);
            cssText = await response.text();
        } catch (e) {
            logger_logger.error('Failed to load assistant CSS:', e);
            cssText = '';
        }
    };
    /**
   * Resolves the assistant theme to match the options page. Requests the theme
   * mode from the background; falls back to the OS preference on failure
   * (see common/theme.js — `system` resolves via matchMedia).
   */ const resolveTheme = async ()=>{
        let themeMode = ThemeMode.System;
        try {
            themeMode = await Messenger.getThemeMode();
        } catch (e) {
            logger_logger.debug('Failed to resolve assistant theme mode, falling back to OS preference:', e);
        }
        themeClass = resolveThemeClass(themeMode);
    };
    /**
   * Applies the DEV UI locale override (if any) into this assistant bundle's
   * i18n module. The pack is served by the background — content scripts cannot
   * fetch `_locales` (not web-accessible).
   */ const resolveDevLocale = async ()=>{
        if (true) {
            return;
        }
        try {
            const state = await Messenger.getDevLocale();
            // Always apply so a cleared override clears a stale pack in this
            // long-lived content-script bundle.
            if (state) {
                applyDevLocale(state);
            }
        } catch (e) {
            logger_logger.debug('Failed to resolve DEV locale for assistant:', e);
        }
    };
    const createShadowRootElement = (iframeAnc)=>{
        const shadowRoot = iframeAnc.attachShadow({
            mode: 'closed'
        });
        const stylesElement = createStyleElement(cssText);
        if (stylesElement) {
            shadowRoot.appendChild(stylesElement);
        }
        return shadowRoot;
    };
    const createIframe = (onIframeLoadCallback)=>{
        logger_logger.debug('Creating assistant iframe');
        iframe = document.createElement('iframe');
        const attributes = {
            id: assistant_settings.Constants.IFRAME_ID,
            class: assistant_selector.ignoreClassName(),
            frameBorder: 0,
            allowTransparency: 'true'
        };
        Object.keys(attributes).forEach((item)=>{
            iframe.setAttribute(item, attributes[item]);
        });
        let iframeAlreadyLoaded = false;
        iframe.addEventListener('load', ()=>{
            if (iframeAlreadyLoaded) {
                return;
            }
            iframeAlreadyLoaded = true;
            onIframeLoadCallback();
        });
        if (checkShadowDomSupport()) {
            iframeAnchor = document.createElement('div');
            createShadowRootElement(iframeAnchor).appendChild(iframe);
        } else {
            iframeAnchor = iframe;
        }
        document.documentElement.appendChild(iframeAnchor);
        iframe.contentWindow.document.body.style.margin = 0;
    };
    const getIframePosition = ()=>({
            left: iframe.offsetLeft <= 0 ? window.innerWidth : iframe.offsetLeft,
            top: parseInt(iframe.style.top, 10) || iframePositionOffset
        });
    const specifyIframePosition = ()=>{
        const viewPort = ui_validation_utils.getViewPort();
        if (iframe.offsetLeft + iframe.offsetWidth > viewPort.width) {
            iframe.style.left = `${Math.max(0, viewPort.width - iframe.offsetWidth - iframePositionOffset)}px`;
        }
        if (iframe.offsetLeft < 0) {
            iframe.style.left = `${iframePositionOffset}px`;
        }
        if (iframe.offsetTop + iframe.offsetHeight > viewPort.height) {
            iframe.style.top = `${Math.max(0, viewPort.height - iframe.offsetHeight - iframePositionOffset)}px`;
        }
        if (iframe.offsetHeight < 0) {
            iframe.style.top = `${iframePositionOffset}px`;
        }
    };
    const appendContent = (view)=>{
        const { body } = iframe.contentDocument;
        for(let i = 0; i < body.children.length; i += 1){
            body.removeChild(body.children[i]);
        }
        body.appendChild(view);
    };
    const localize = ()=>{
        translateUi(iframe.contentDocument);
    };
    const resizeIframe = (width, height)=>{
        const frame = iframe;
        let calculatedHeight = height;
        if (height === 'auto' || !height) {
            const contentElement = frame.contentWindow.document.body.querySelector('.abu-assistant');
            // Shared fit logic (border included + buffer); falls back to the max
            // height when the view isn't measurable yet.
            calculatedHeight = getCardFitHeight(contentElement) ?? iframeMaxHeight + IFRAME_HEIGHT_BUFFER_PX;
        }
        if (width) {
            frame.width = width;
            frame.style.setProperty('width', `${width}px`, 'important');
        }
        if (calculatedHeight) {
            frame.height = calculatedHeight;
            frame.style.setProperty('height', `${calculatedHeight}px`, 'important');
        }
    };
    const showMenuItem = (viewName, controller, width, height, options)=>{
        logger_logger.debug(`Showing menu item: ${viewName}`);
        if (currentItem === viewName) {
            return;
        }
        const onIframeLoad = ()=>{
            const frameElement = iframe;
            const view = createElementFromHtml(views[viewName]);
            view.classList.add(themeClass);
            const stylesElement = createStyleElement(cssText);
            if (stylesElement) {
                view.appendChild(stylesElement);
            }
            appendContent(view);
            localize();
            const opts = options || {};
            opts.iframeAnchor = iframeAnchor;
            controller.init(frameElement, opts);
            currentItem = viewName;
            onShowMenuItem.notify();
            if (opts.dragElement) {
                ui_utils.makeIframeDraggable(iframe, iframe.contentDocument.querySelector(opts.dragElement));
            }
            resizeIframe(width, height);
            const iframePosition = getIframePosition(opts.maxHeight || iframeMaxHeight);
            iframe.style.left = `${iframePosition.left}px`;
            iframe.style.top = `${iframePosition.top}px`;
            specifyIframePosition();
        };
        if (!iframe) {
            const adgStylesSelector = createStyleElement(cssText, 'adg-styles-selector');
            if (adgStylesSelector) {
                document.documentElement.appendChild(adgStylesSelector);
            }
            createIframe(onIframeLoad);
            return;
        }
        onIframeLoad();
    };
    const removeIframe = (e)=>{
        if (e && e.isTrusted === false) {
            return false;
        }
        if (!iframeAnchor) {
            return false;
        }
        document.removeEventListener('click', removeIframe);
        document.documentElement.removeChild(iframeAnchor);
        iframe = null;
        iframeAnchor = null;
        currentItem = null;
        assistant_selector.close();
        onCloseMenu.notify();
        return undefined;
    };
    const setCloseEventIfNotHitIframe = (setEvent)=>{
        document.removeEventListener('click', removeIframe);
        if (setEvent) {
            window.setTimeout(()=>{
                document.addEventListener('click', removeIframe);
            }, 150);
        }
    };
    const showSelectorMenu = ()=>{
        const controller = new SelectorMenuController(self);
        const options = {
            dragElement: '.draggable',
            includeSvgIcons: true,
            maxHeight: menuMaxHeight
        };
        showMenuItem(assistant_settings.MenuItemsNames.SelectorMenu, controller, menuMaxWidth, menuInitialHeight, options);
        setCloseEventIfNotHitIframe(false);
    };
    const showSliderMenu = (initElement, currentElement, path, optionsState)=>{
        const controller = new SliderMenuController(addRuleCallback, self);
        const options = {
            path,
            currentElement,
            element: initElement,
            dragElement: '.draggable',
            options: optionsState,
            includeSvgIcons: true,
            maxHeight: menuMaxHeight
        };
        showMenuItem(assistant_settings.MenuItemsNames.SliderMenu, controller, menuMaxWidth, 'auto', options);
        setCloseEventIfNotHitIframe(true);
    };
    const showBlockPreview = (initElement, path, currentElement, optionsState)=>{
        const controller = new BlockPreviewController(addRuleCallback, self);
        const options = {
            path,
            currentElement,
            element: initElement,
            dragElement: '.draggable',
            options: optionsState,
            includeSvgIcons: true,
            maxHeight: menuMaxHeight
        };
        showMenuItem(assistant_settings.MenuItemsNames.BlockPreview, controller, menuMaxWidth, 'auto', options);
        setCloseEventIfNotHitIframe(true);
    };
    const resizeSliderMenuToAdvanced = ()=>{
        resizeIframe(null, null);
    };
    const resizeSliderMenuToNormal = ()=>{
        resizeIframe(null, null);
    };
    const hideElementsByPath = (selectedPath, styleID)=>{
        if (!selectedPath) {
            return false;
        }
        let slctr;
        let style;
        if (selectedPath.indexOf('://') > 0) {
            slctr = `[src*="${selectedPath.split('$domain=')[0]}"]`;
        } else {
            slctr = selectedPath.split('##')[1];
        }
        if (slctr) {
            style = `${slctr}{display:none!important}`;
        } else {
            logger_logger.error('Can`t block element: `selector` path is empty');
            return false;
        }
        const id = styleID || blockedElementsStyleID;
        const stylesElement = document.documentElement.querySelector(`#${id}`);
        if (stylesElement) {
            setElementHtml(stylesElement, `${stylesElement.innerHTML} ${style}`);
        } else {
            document.documentElement.appendChild(createStyleElement(style, id));
        }
        if (iframeAnchor) {
            iframeAnchor.style.setProperty('display', 'block', 'important');
        }
        return undefined;
    };
    const showHiddenElements = (styleID)=>{
        const id = styleID || blockedElementsStyleID;
        const stylesElement = document.documentElement.querySelector(`#${id}`);
        if (stylesElement) {
            stylesElement.parentNode.removeChild(stylesElement);
        }
    };
    const blockElement = (path, addRule)=>{
        if (!addRule) {
            logger_logger.error('Callback function `addRule` can\'t be undefined!');
        }
        addRule(path);
        removeIframe();
        hideElementsByPath(path);
    };
    // Will be set by `setAddRuleCallback` before any view is shown
    let addRuleCallback = null;
    const setAddRuleCallback = (callback)=>{
        addRuleCallback = callback;
    };
    const self = {
        loadCss,
        showSelectorMenu,
        showSliderMenu,
        showBlockPreview,
        onCloseMenu,
        onShowMenuItem,
        removeIframe,
        resizeSliderMenuToAdvanced,
        resizeSliderMenuToNormal,
        resizeIframe,
        hideElementsByPath,
        showHiddenElements,
        blockElement,
        setAddRuleCallback
    };
    return self;
}
/* harmony default export */ const iframe_controller = (IframeController);

;// ./src/pages/assistant/embedded.js

/**
 * Creates an assistant instance that exposes `start()` and `close()` methods.
 * This is the public API consumed by tswebextension via `window.adguardAssistant`.
 */ function abuAssistant() {
    const iframeController = new iframe_controller();
    return {
        async start (element, callback) {
            iframeController.setAddRuleCallback(callback.bind(this));
            await iframeController.loadCss();
            if (element) {
                iframeController.showSelectorMenu();
                iframeController.showSliderMenu(element);
            } else {
                iframeController.showSelectorMenu();
            }
        },
        close () {
            iframeController.removeIframe();
        }
    };
}

;// ./src/pages/assistant/index.js


if (!window.adguardAssistant) {
    window.adguardAssistant = abuAssistant();
}

})();

/******/ })()
;