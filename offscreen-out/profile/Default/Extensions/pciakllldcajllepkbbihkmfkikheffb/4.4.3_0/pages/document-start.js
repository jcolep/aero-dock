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

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__(6277);
// EXTERNAL MODULE: ./node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(61934);
;// ./node_modules/@adguard/tswebextension/dist/common/message-constants.js
/**
 * @file
 * This file contains constants for communication between background and content scripts.
 * This constants are separated from message.ts to reduce bundle size,
 * because rollup cannot tree-shake tswebextension library code.
 */ /**
 * Name of the message handler.
 * It is needed for determining specific tswebextension message from other messages.
 */ const MESSAGE_HANDLER_NAME = 'tsWebExtension';
/**
 * Message types for communication between background and content scripts.
 */ var MessageType;
(function(MessageType) {
    MessageType["ProcessShouldCollapse"] = "processShouldCollapse";
    MessageType["GetCosmeticData"] = "getCosmeticData";
    MessageType["GetCookieRules"] = "getCookieRules";
    MessageType["SaveCookieLogEvent"] = "saveCookieLogEvent";
    MessageType["InitAssistant"] = "initAssistant";
    MessageType["CloseAssistant"] = "closeAssistant";
    MessageType["AssistantCreateRule"] = "assistantCreateRule";
    MessageType["SaveCssHitsStats"] = "saveCssHitsStats";
})(MessageType || (MessageType = {}));


// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(92588);
;// ./node_modules/@adguard/logger/dist/es/index.mjs
/**
 * Checks if error has message.
 *
 * @param error Error object.
 *
 * @returns True if error has message.
 */
function isErrorWithMessage(error) {
    return (typeof error === 'object'
        && error !== null
        && 'message' in error
        && typeof error.message === 'string');
}
/**
 * Converts error to the error with a message.
 *
 * @param maybeError Possible error.
 *
 * @returns Error with a message.
 */
function toErrorWithMessage(maybeError) {
    if (isErrorWithMessage(maybeError)) {
        return maybeError;
    }
    try {
        return new Error(JSON.stringify(maybeError));
    }
    catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references, for example.
        return new Error(String(maybeError));
    }
}
/**
 * Converts an error object to an error with a message. This method might be helpful to handle thrown errors.
 *
 * @param error Error object.
 *
 * @returns Message of the error.
 */
function getErrorMessage(error) {
    return toErrorWithMessage(error).message;
}

/**
 * Pads a number with leading zeros.
 *
 * @param num The number to pad.
 * @param size The number of digits to pad to.
 *
 * @returns The padded number.
 */
const pad = (num, size = 2) => {
    return num.toString().padStart(size, '0');
};
/**
 * Formats a date into an ISO 8601-like string with milliseconds.
 *
 * @param {Date|number} date The date object or timestamp to format.
 *
 * @returns {string} The formatted date string.
 */
const formatTime = (date) => {
    const d = (date instanceof Date) ? date : new Date(date);
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1); // Months are 0-based
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    const second = pad(d.getSeconds());
    const millisecond = pad(d.getMilliseconds(), 3); // Milliseconds are 3 digits
    return `${year}-${month}-${day}T${hour}:${minute}:${second}:${millisecond}`;
};

/**
 * String presentation of log levels, for convenient users usage.
 * Ordered in the same way as LogLevelNumeric.
 *
 * First three levels will be shown to users, and the last two are for developers.
 */
var LogLevel;
(function (LogLevel) {
    /**
     * For errors.
     */
    LogLevel["Error"] = "error";
    /**
     * For not critical errors.
     */
    LogLevel["Warn"] = "warn";
    /**
     * For important information.
     * Use for general operational messages.
     */
    LogLevel["Info"] = "info";
    /**
     * For debugging purposes, e.g. Inside conditions, loops or some edge cases.
     */
    LogLevel["Debug"] = "debug";
    /**
     * For ultra-detailed, step-by-step traces (like stack traces or flow tracking).
     */
    LogLevel["Verbose"] = "verbose";
})(LogLevel || (LogLevel = {}));
/**
 * Log levels map, which maps number level to string level.
 * Ordered in the same way as LogLevelNumeric.
 */
const levelMapNumToString = {
    [1 /* LogLevelNumeric.Error */]: LogLevel.Error,
    [2 /* LogLevelNumeric.Warn */]: LogLevel.Warn,
    [3 /* LogLevelNumeric.Info */]: LogLevel.Info,
    [4 /* LogLevelNumeric.Debug */]: LogLevel.Debug,
    [5 /* LogLevelNumeric.Verbose */]: LogLevel.Verbose,
};
/**
 * Log levels map, which maps string level to number level.
 */
const levelMapStringToNum = Object.entries(levelMapNumToString)
    .reduce((acc, [key, value]) => {
    // Here, key is originally a string since Object.entries() returns [string, string][].
    // We need to cast the key to LogLevelNumeric correctly without causing type mismatches.
    const numericKey = Number(key);
    if (!Number.isNaN(numericKey)) {
        acc[value] = numericKey;
    }
    return acc;
}, {});
/**
 * Methods supported by console. Used to manage levels.
 * Ordered in the same way as LogLevelNumeric.
 */
var LogMethod;
(function (LogMethod) {
    LogMethod["Error"] = "error";
    LogMethod["Warn"] = "warn";
    LogMethod["Info"] = "info";
    LogMethod["Debug"] = "debug";
    LogMethod["Trace"] = "trace";
})(LogMethod || (LogMethod = {}));
/**
 * Simple logger with log levels.
 */
class Logger {
    currentLevelValue = 3 /* LogLevelNumeric.Info */;
    writer;
    /**
     * Constructor.
     *
     * @param writer Writer object.
     */
    constructor(writer = console) {
        this.writer = writer;
        // bind the logging methods to avoid losing context
        this.error = this.error.bind(this);
        this.warn = this.warn.bind(this);
        this.info = this.info.bind(this);
        this.debug = this.debug.bind(this);
        this.trace = this.trace.bind(this);
    }
    /**
     * Print error messages.
     * Use when something went wrong.
     *
     * @param args Printed arguments.
     */
    error(...args) {
        this.print(1 /* LogLevelNumeric.Error */, LogMethod.Error, args);
    }
    /**
     * Print warn messages.
     * Use when Something might go wrong.
     *
     * @param args Printed arguments.
     */
    warn(...args) {
        this.print(2 /* LogLevelNumeric.Warn */, LogMethod.Warn, args);
    }
    /**
     * Print messages you want to disclose to users.
     * Use for general operational messages.
     *
     * @param args Printed arguments.
     */
    info(...args) {
        this.print(3 /* LogLevelNumeric.Info */, LogMethod.Info, args);
    }
    /**
     * Print debug messages. Usually used for technical information.
     *
     * @param args Printed arguments.
     */
    debug(...args) {
        this.print(4 /* LogLevelNumeric.Debug */, LogMethod.Debug, args);
    }
    /**
     * Print trace messages.
     * Ultra-detailed, step-by-step traces (like stack traces or flow tracking).
     *
     * @param args Printed arguments.
     */
    trace(...args) {
        this.print(5 /* LogLevelNumeric.Verbose */, LogMethod.Trace, args);
    }
    /**
     * Getter for log level.
     *
     * @returns Logger level.
     */
    get currentLevel() {
        return levelMapNumToString[this.currentLevelValue];
    }
    /**
     * Setter for log level. With this method log level can be updated dynamically.
     *
     * @param logLevel Logger level.
     *
     * @throws Error if log level is not supported.
     */
    set currentLevel(logLevel) {
        const level = levelMapStringToNum[logLevel];
        if (level === undefined) {
            throw new Error(`Logger supports only the following levels: ${[Object.values(LogLevel).join(', ')]}`);
        }
        this.currentLevelValue = level;
    }
    /**
     * Converts error to string, and adds stack trace.
     *
     * @param error Error to print.
     *
     * @returns Error message.
     */
    static errorToString(error) {
        const message = getErrorMessage(error);
        return `${message}\nStack trace:\n${error.stack}`;
    }
    /**
     * Prints error message with stack trace.
     * It prints the message with the stack trace in a collapsed group.
     * This is useful for debugging purposes, as it allows to see the stack trace
     * without cluttering the console with too many messages.
     *
     * @param formattedTime Formatted time.
     * @param formattedArgs Formatted arguments.
     */
    printWithStackTrace(formattedTime, formattedArgs) {
        // If grouping is not supported, print just expanded trace, but this
        // leads to a lot of dirty logs in the console, since the stack trace
        // will be printed for every message.
        if (!this.writer.groupCollapsed || !this.writer.groupEnd) {
            // Print expanded trace
            this.writer.trace(formattedTime, ...formattedArgs);
            return;
        }
        // Print collapsed trace to make logs more readable and access to stack
        // trace by clicking on the group.
        this.writer.groupCollapsed(formattedTime, ...formattedArgs);
        this.writer.trace();
        this.writer.groupEnd();
    }
    /**
     * Wrapper over log methods.
     *
     * @param level Logger level.
     * @param method Logger method.
     * @param args Printed arguments.
     */
    print(level, method, args) {
        // Skip writing if the basic conditions are not met.
        if (this.currentLevelValue < level) {
            return;
        }
        // Do not print if no arguments are passed.
        if (!args || args.length === 0 || !args[0]) {
            return;
        }
        const formattedArgs = args.map((value) => {
            if (value instanceof Error) {
                return Logger.errorToString(value);
            }
            if (value && typeof value.message === 'string') {
                return value.message;
            }
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value);
            }
            return String(value);
        });
        const formattedTime = `${formatTime(new Date())}:`;
        /**
         * If current log level is Debug or Verbose, print all channels with stack
         * trace via using writer.trace method to help identify the location of the
         * log.
         *
         * Exception is Error method, because it is already contains build-in
         * stack trace.
         */
        if (this.currentLevelValue >= levelMapStringToNum[LogLevel.Debug]
            && method !== LogMethod.Error) {
            this.printWithStackTrace(formattedTime, formattedArgs);
            return;
        }
        // Otherwise just print with requested method of writer.
        this.writer[method](formattedTime, ...formattedArgs);
    }
}



;// ./node_modules/@adguard/tswebextension/dist/common/logger.js


/**
 * Export logger implementation.
 */ const logger = new Logger(console);
/**
 * Stringify object via JSON.stringify without specified keys.
 *
 * @param obj Object to stringify.
 * @param excludedKeys Keys to exclude.
 *
 * @returns Stringified object without excludedKeys (checking nested keys too).
 */ const stringifyObjectWithoutKeys = (obj, excludedKeys)=>{
    return JSON.stringify(obj, (key, value)=>excludedKeys.includes(key) ? undefined : value, 2);
};


;// ./node_modules/@adguard/tswebextension/dist/common/send-app-message.js


// TODO check if we can return typed message here
/**
 * Sends message to the background page.
 *
 * @param message Message to send.
 * @param message.payload Payload of the message.
 * @param message.type Message type.
 *
 * @returns Promise resolved with response from the background page.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendAppMessage = async (message)=>{
    return browser_polyfill.runtime.sendMessage({
        handlerName: MESSAGE_HANDLER_NAME,
        ...message
    });
};


;// ./node_modules/@adguard/tswebextension/dist/common/cookie-controller.js
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





/**
 * @file Contains simple type guards to prevent bundle zod library, because
 * content-script should be as tiny as possible to fastest injection.
 */ /**
 * Checks if the given message has a 'type' field.
 *
 * @param message The message to check.
 *
 * @returns `true` if the message is an object with a 'type' field, otherwise `false`.
 */ const hasTypeField = (message)=>{
    return typeof message === 'object' && message !== null && 'type' in message;
};
/**
 * @file
 * In the content script, we need access to @adguard/assistant only when
 * the user clicks 'block ad manually'.
 * Therefore, we exclude @adguard/assistant from the bundled content-script code
 * and load it on-demand. We also added a required field to the configuration
 * object to ensure the assistant is bundled inside the final extension,
 * allowing tswebextension to load it on-demand.
 *
 * Schema:
 * - Buildtime:
 *  -- [tswebext]  Script to inject assistant from the URL provided by the extension.
 *  -- [tswebext]  Assistant management script for interacting with the assistant.
 *  -- [tswebext]  Assistant messages listener on the content-script side. <--- current file.
 *  -- [extension] Entry point script for injecting the assistant
 * - Runtime:
 *  -- [tswebext] Content script injects into every new tab without the assistant.
 *  -- [tswebext] On-demand content script dynamically injects the assistant.
 *  -- [tswebext] After injection, the content script interacts with the assistant.
 *
 * Reference code: ASSISTANT_INJECT.
 */ const customWindow = window;
/**
 * Creates handlers for assistant messages.
 */ const createAssistantMessageListener = ()=>{
    // Check, that script executed in the top frame
    if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
        return;
    }
    // Create assistant message listener only once.
    if (customWindow.isAssistantInitiated) {
        return;
    }
    browser_polyfill.runtime.onMessage.addListener(async (message)=>{
        if (!hasTypeField(message)) {
            logger.warn('[tsweb.assistant-listener]: message do not contain required field "type": ', message);
            return;
        }
        switch(message.type){
            case MessageType.InitAssistant:
                {
                    // If there is no assistant on the window after execute
                    // loading script - throw error.
                    if (window.adguardAssistant === undefined) {
                        throw new Error('adguardAssistant not found in the window object.');
                    } else {
                        window.adguardAssistant.close();
                    }
                    window.adguardAssistant.start(null, async (ruleText)=>{
                        const res = await sendAppMessage({
                            type: MessageType.AssistantCreateRule,
                            payload: {
                                ruleText
                            }
                        });
                        if (!res) {
                            logger.warn(`[tsweb.assistant-listener]: rule '${ruleText}' has not been applied.`);
                        }
                    });
                    break;
                }
            case MessageType.CloseAssistant:
                {
                    if (window.adguardAssistant) {
                        window.adguardAssistant.close();
                    }
                    break;
                }
            default:
                {
                    logger.error(`[tsweb.assistant-listener]: not found handler for message type '${message.type}'`);
                }
        }
    });
    customWindow.isAssistantInitiated = true;
};
/**
 * This class applies cookie rules in page context.
 *
 * - Removes cookies matching rules
 * - Listens to new cookies, then tries to apply rules to them.
 */ let CookieController$1 = class CookieController {
    /**
     * Applies rules.
     *
     * @param rules Rules to apply.
     */ apply(rules) {
        this.applyRules(rules);
        let lastCookie = document.cookie;
        this.listenCookieChange((oldValue, newValue)=>{
            if (newValue === lastCookie) {
                // Skip changes made by this class
                return;
            }
            this.applyRules(rules);
            lastCookie = document.cookie;
        });
        window.addEventListener('beforeunload', ()=>{
            this.applyRules(rules);
        });
    }
    /**
     * Polling document cookie.
     *
     * @param callback Callback to be called periodically.
     * @param interval Polling interval.
     */ listenCookieChange(callback, interval = this.DEFAULT_COOKIE_POLLING_INTERVAL_MS) {
        let lastCookie = document.cookie;
        setInterval(()=>{
            const { cookie } = document;
            if (cookie !== lastCookie) {
                try {
                    callback(lastCookie, cookie);
                } finally{
                    lastCookie = cookie;
                }
            }
        }, interval);
    }
    /**
     * Checks if current context is third-party.
     *
     * @returns True if current context is third-party.
     */ // eslint-disable-next-line class-methods-use-this
    isThirdPartyFrame() {
        try {
            return window.self !== window.top && document.location.hostname !== window.parent.location.hostname;
        } catch (e) {
            return true;
        }
    }
    /**
     * Applies rules to document cookies.
     *
     * Inspired by remove-cookie scriptlet.
     *
     * @see {@link https://github.com/AdguardTeam/Scriptlets/blob/master/src/scriptlets/remove-cookie.js}
     *
     * @param rules Rules to apply.
     */ applyRules(rules) {
        document.cookie.split(';').forEach((cookieStr)=>{
            const pos = cookieStr.indexOf('=');
            if (pos === -1) {
                return;
            }
            const cookieName = cookieStr.slice(0, pos).trim();
            const cookieValue = cookieStr.slice(pos + 1).trim();
            const matchingRules = rules.filter((r)=>{
                if (this.isThirdPartyContext !== r.isThirdParty) {
                    return false;
                }
                const regex = r.match ? CookieController.toRegExp(r.match) : CookieController.toRegExp('/.?/');
                return regex.test(cookieName);
            });
            const importantRules = matchingRules.filter((r)=>r.isImportant);
            if (importantRules.length > 0) {
                importantRules.forEach((rule)=>{
                    this.applyRule(rule, cookieName, cookieValue);
                });
            } else {
                const allowlistRules = matchingRules.filter((r)=>r.isAllowlist);
                if (allowlistRules.length > 0) {
                    allowlistRules.forEach((rule)=>{
                        this.applyRule(rule, cookieName, cookieValue);
                    });
                } else {
                    matchingRules.forEach((rule)=>{
                        this.applyRule(rule, cookieName, cookieValue);
                    });
                }
            }
        });
    }
    /**
     * Applies rule.
     *
     * @param rule Rule to apply.
     * @param cookieName Cookie name.
     * @param cookieValue Cookie value.
     */ applyRule(rule, cookieName, cookieValue) {
        if (!rule.isAllowlist) {
            const hostParts = document.location.hostname.split('.');
            for(let i = 0; i <= hostParts.length - 1; i += 1){
                const hostName = hostParts.slice(i).join('.');
                if (hostName) {
                    CookieController.removeCookieFromHost(cookieName, hostName);
                }
            }
        }
        this.onRuleAppliedCallback({
            cookieName,
            cookieValue,
            cookieDomain: document.location.hostname,
            thirdParty: rule.isThirdParty,
            filterId: rule.filterId,
            ruleIndex: rule.ruleIndex,
            isAllowlist: rule.isAllowlist,
            isImportant: rule.isImportant,
            isDocumentLevel: rule.isDocumentLevel,
            isCsp: false,
            isCookie: true,
            advancedModifier: null
        });
    }
    /**
     * Removes cookie for host.
     *
     * @param cookieName Cookie name.
     * @param hostName Host name.
     */ static removeCookieFromHost(cookieName, hostName) {
        const cookieSpec = `${cookieName}=`;
        const domain1 = `; domain=${hostName}`;
        const domain2 = `; domain=.${hostName}`;
        const path = '; path=/';
        const expiration = '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = cookieSpec + expiration;
        document.cookie = cookieSpec + domain1 + expiration;
        document.cookie = cookieSpec + domain2 + expiration;
        document.cookie = cookieSpec + path + expiration;
        document.cookie = cookieSpec + domain1 + path + expiration;
        document.cookie = cookieSpec + domain2 + path + expiration;
    }
    /**
     * Converts cookie rule match to regular expression.
     *
     * @param str String to convert.
     *
     * @returns Regular expression.
     */ static toRegExp(str) {
        if (str[0] === '/' && str[str.length - 1] === '/') {
            return new RegExp(str.slice(1, -1));
        }
        const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^${escaped}$`);
    }
    /**
     * Constructor.
     *
     * @param callback On rule applied callback.
     */ constructor(callback){
        /**
     * Default cookie polling interval.
     */ _define_property(this, "DEFAULT_COOKIE_POLLING_INTERVAL_MS", 1000);
        /**
     * On rule applied callback.
     */ _define_property(this, "onRuleAppliedCallback", void 0);
        /**
     * Is current context third-party.
     */ _define_property(this, "isThirdPartyContext", false);
        this.onRuleAppliedCallback = callback;
        this.isThirdPartyContext = this.isThirdPartyFrame();
    }
};


;// ./node_modules/@adguard/extended-css/dist/extended-css.esm.js
/**
 * @adguard/extended-css - v2.2.1 - Wed Aug 05 2026
 * https://github.com/AdGuardSoftwareLimited/ext-extended-css#readme
 * Copyright (c) 2026 AdGuard. Licensed GPL-3.0
 */
const EXTENDED_CSS_VERSION = '2.2.1';
const LEFT_SQUARE_BRACKET = '[';
const RIGHT_SQUARE_BRACKET = ']';
const LEFT_PARENTHESIS = '(';
const RIGHT_PARENTHESIS = ')';
const LEFT_CURLY_BRACKET = '{';
const RIGHT_CURLY_BRACKET = '}';
const BRACKET = {
  SQUARE: {
    LEFT: LEFT_SQUARE_BRACKET,
    RIGHT: RIGHT_SQUARE_BRACKET
  },
  PARENTHESES: {
    LEFT: LEFT_PARENTHESIS,
    RIGHT: RIGHT_PARENTHESIS
  },
  CURLY: {
    LEFT: LEFT_CURLY_BRACKET,
    RIGHT: RIGHT_CURLY_BRACKET
  }
};
const SLASH = '/';
const BACKSLASH = '\\';
const SPACE = ' ';
const COMMA = ',';
const DOT = '.';
const SEMICOLON = ';';
const COLON = ':';
const SINGLE_QUOTE = '\'';
const DOUBLE_QUOTE = '"';

// do not consider hyphen `-` as separated mark
// to avoid pseudo-class names splitting
// e.g. 'matches-css' or 'if-not'

const CARET = '^';
const DOLLAR_SIGN = '$';
const EQUAL_SIGN = '=';
const TAB = '\t';
const CARRIAGE_RETURN = '\r';
const LINE_FEED = '\n';
const FORM_FEED = '\f';
const WHITE_SPACE_CHARACTERS = [SPACE, TAB, CARRIAGE_RETURN, LINE_FEED, FORM_FEED];

// for universal selector and attributes
const ASTERISK = '*';
const ID_MARKER = '#';
const CLASS_MARKER = DOT;
const DESCENDANT_COMBINATOR = SPACE;
const CHILD_COMBINATOR = '>';
const NEXT_SIBLING_COMBINATOR = '+';
const SUBSEQUENT_SIBLING_COMBINATOR = '~';
const COMBINATORS = [DESCENDANT_COMBINATOR, CHILD_COMBINATOR, NEXT_SIBLING_COMBINATOR, SUBSEQUENT_SIBLING_COMBINATOR];
const SUPPORTED_SELECTOR_MARKS = [LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET, SLASH, BACKSLASH, SEMICOLON, COLON, COMMA, SINGLE_QUOTE, DOUBLE_QUOTE, CARET, DOLLAR_SIGN, ASTERISK, ID_MARKER, CLASS_MARKER, DESCENDANT_COMBINATOR, CHILD_COMBINATOR, NEXT_SIBLING_COMBINATOR, SUBSEQUENT_SIBLING_COMBINATOR, TAB, CARRIAGE_RETURN, LINE_FEED, FORM_FEED];
const SUPPORTED_STYLE_DECLARATION_MARKS = [
// divider between property and value in declaration
COLON,
// divider between declarations
SEMICOLON,
// sometimes is needed for value wrapping
// e.g. 'content: "-"'
SINGLE_QUOTE, DOUBLE_QUOTE,
// needed for quote escaping inside the same-type quotes
BACKSLASH,
// whitespaces
SPACE, TAB, CARRIAGE_RETURN, LINE_FEED, FORM_FEED];

// absolute:
const CONTAINS_PSEUDO = 'contains';
const HAS_TEXT_PSEUDO = 'has-text';
const ABP_CONTAINS_PSEUDO = '-abp-contains';
const MATCHES_CSS_PSEUDO = 'matches-css';
const MATCHES_CSS_BEFORE_PSEUDO = 'matches-css-before';
const MATCHES_CSS_AFTER_PSEUDO = 'matches-css-after';
const MATCHES_ATTR_PSEUDO_CLASS_MARKER = 'matches-attr';
const MATCHES_PROPERTY_PSEUDO_CLASS_MARKER = 'matches-property';
const XPATH_PSEUDO_CLASS_MARKER = 'xpath';
const NTH_ANCESTOR_PSEUDO_CLASS_MARKER = 'nth-ancestor';
const CONTAINS_PSEUDO_NAMES = [CONTAINS_PSEUDO, HAS_TEXT_PSEUDO, ABP_CONTAINS_PSEUDO];

/**
 * Pseudo-class :upward() can get number or selector arg
 * and if the arg is selector it should be standard, not extended
 * so :upward pseudo-class is always absolute.
 */
const UPWARD_PSEUDO_CLASS_MARKER = 'upward';

/**
 * Pseudo-class `:remove()` and pseudo-property `remove`
 * are used for element actions, not for element selecting.
 *
 * Selector text should not contain the pseudo-class
 * so selector parser should consider it as invalid
 * and both are handled by stylesheet parser.
 */
const REMOVE_PSEUDO_MARKER = 'remove';

// relative:
const HAS_PSEUDO_CLASS_MARKER = 'has';
const ABP_HAS_PSEUDO_CLASS_MARKER = '-abp-has';
const HAS_PSEUDO_CLASS_MARKERS = [HAS_PSEUDO_CLASS_MARKER, ABP_HAS_PSEUDO_CLASS_MARKER];
const IS_PSEUDO_CLASS_MARKER = 'is';
const NOT_PSEUDO_CLASS_MARKER = 'not';

// standalone (no-argument pseudo-classes that test the element
// itself, not a selector-list of related elements):
const EMPTY_TRIMMED_PSEUDO_CLASS_MARKER = 'empty-trimmed';
const STANDALONE_PSEUDO_CLASSES = [EMPTY_TRIMMED_PSEUDO_CLASS_MARKER];
const ABSOLUTE_PSEUDO_CLASSES = [CONTAINS_PSEUDO, HAS_TEXT_PSEUDO, ABP_CONTAINS_PSEUDO, MATCHES_CSS_PSEUDO, MATCHES_CSS_BEFORE_PSEUDO, MATCHES_CSS_AFTER_PSEUDO, MATCHES_ATTR_PSEUDO_CLASS_MARKER, MATCHES_PROPERTY_PSEUDO_CLASS_MARKER, XPATH_PSEUDO_CLASS_MARKER, NTH_ANCESTOR_PSEUDO_CLASS_MARKER, UPWARD_PSEUDO_CLASS_MARKER];
const RELATIVE_PSEUDO_CLASSES = [...HAS_PSEUDO_CLASS_MARKERS, IS_PSEUDO_CLASS_MARKER, NOT_PSEUDO_CLASS_MARKER];
const SUPPORTED_PSEUDO_CLASSES = [...ABSOLUTE_PSEUDO_CLASSES, ...RELATIVE_PSEUDO_CLASSES, ...STANDALONE_PSEUDO_CLASSES];

// these pseudo-classes should be part of RegularSelector value
// if its arg does not contain extended selectors.
// the ast will be checked after the selector is completely parsed
const OPTIMIZATION_PSEUDO_CLASSES = [NOT_PSEUDO_CLASS_MARKER, IS_PSEUDO_CLASS_MARKER];

/**
 * ':scope' is used for extended pseudo-class :has(), if-not(), :is() and :not().
 */
const SCOPE_CSS_PSEUDO_CLASS = ':scope';

/**
 * ':after' and ':before' are needed for :matches-css() pseudo-class
 * all other are needed for :has() limitation after regular pseudo-elements.
 *
 * @see {@link https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c54} [case 3]
 */
const REGULAR_PSEUDO_ELEMENTS = {
  AFTER: 'after',
  BACKDROP: 'backdrop',
  BEFORE: 'before',
  CUE: 'cue',
  CUE_REGION: 'cue-region',
  FIRST_LETTER: 'first-letter',
  FIRST_LINE: 'first-line',
  FILE_SELECTION_BUTTON: 'file-selector-button',
  GRAMMAR_ERROR: 'grammar-error',
  MARKER: 'marker',
  PART: 'part',
  PLACEHOLDER: 'placeholder',
  SELECTION: 'selection',
  SLOTTED: 'slotted',
  SPELLING_ERROR: 'spelling-error',
  TARGET_TEXT: 'target-text'
};

// ExtendedCss does not support at-rules
// https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
const AT_RULE_MARKER = '@';
const CONTENT_CSS_PROPERTY = 'content';
const PSEUDO_PROPERTY_POSITIVE_VALUE = 'true';
const DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE = 'global';
const STANDALONE_ERROR_PREFIX = {
  NO_ARGUMENTS: 'Standalone pseudo-class does not accept arguments'
};
const NO_SELECTOR_ERROR_PREFIX = 'Selector should be defined';
const STYLE_ERROR_PREFIX = {
  NO_STYLE: 'No style declaration found',
  NO_SELECTOR: `${NO_SELECTOR_ERROR_PREFIX} before style declaration in stylesheet`,
  INVALID_STYLE: 'Invalid style declaration',
  UNCLOSED_STYLE: 'Unclosed style declaration',
  NO_PROPERTY: 'Missing style property in declaration',
  NO_VALUE: 'Missing style value in declaration',
  NO_STYLE_OR_REMOVE: 'Style should be declared or :remove() pseudo-class should used',
  NO_COMMENT: 'Comments are not supported'
};
const NO_AT_RULE_ERROR_PREFIX = 'At-rules are not supported';
const REMOVE_ERROR_PREFIX = {
  INVALID_REMOVE: 'Invalid :remove() pseudo-class in selector',
  NO_TARGET_SELECTOR: `${NO_SELECTOR_ERROR_PREFIX} before :remove() pseudo-class`,
  MULTIPLE_USAGE: 'Pseudo-class :remove() appears more than once in selector',
  INVALID_POSITION: 'Pseudo-class :remove() should be at the end of selector'
};
const MATCHING_ELEMENT_ERROR_PREFIX = 'Error while matching element';
const MAX_STYLE_PROTECTION_COUNT = 50;

/**
 * Regexp that matches backward compatible syntaxes.
 */
const REGEXP_VALID_OLD_SYNTAX = /\[-(?:ext)-([a-z-_]+)=(["'])((?:(?=(\\?))\4.)*?)\2\]/g;

/**
 * Marker for checking invalid selector after old-syntax normalizing by selector converter.
 */
const INVALID_OLD_SYNTAX_MARKER = '[-ext-';

/**
 * Complex replacement function.
 * Undo quote escaping inside of an extended selector.
 *
 * @param match     Whole matched string.
 * @param name      Group 1.
 * @param quoteChar Group 2.
 * @param rawValue  Group 3.
 *
 * @returns Converted string.
 */
const evaluateMatch = (match, name, quoteChar, rawValue) => {
  // Unescape quotes
  const re = new RegExp(`([^\\\\]|^)\\\\${quoteChar}`, 'g');
  const value = rawValue.replace(re, `$1${quoteChar}`);
  return `:${name}(${value})`;
};

// ':scope' pseudo may be at start of :has() argument
// but ExtCssDocument.querySelectorAll() already use it for selecting exact element descendants
const SCOPE_MARKER_REGEXP = /\(:scope >/g;
const SCOPE_REPLACER = '(>';
const MATCHES_CSS_PSEUDO_ELEMENT_REGEXP = /(:matches-css)-(before|after)\(/g;
const convertMatchesCss = (match, extendedPseudoClass, regularPseudoElement) => {
  // ':matches-css-before('  -->  ':matches-css(before, '
  // ':matches-css-after('   -->  ':matches-css(after, '
  return `${extendedPseudoClass}${BRACKET.PARENTHESES.LEFT}${regularPseudoElement}${COMMA}`;
};

/**
 * Handles old syntax and :scope inside :has().
 *
 * @param selector Trimmed selector to normalize.
 *
 * @returns Normalized selector.
 * @throws An error on invalid old extended syntax selector.
 */
const normalize = selector => {
  const normalizedSelector = selector.replace(REGEXP_VALID_OLD_SYNTAX, evaluateMatch).replace(SCOPE_MARKER_REGEXP, SCOPE_REPLACER).replace(MATCHES_CSS_PSEUDO_ELEMENT_REGEXP, convertMatchesCss);

  // validate old syntax after normalizing
  // e.g. '[-ext-matches-css-before=\'content:  /^[A-Z][a-z]'
  if (normalizedSelector.includes(INVALID_OLD_SYNTAX_MARKER)) {
    throw new Error(`Invalid extended-css old syntax selector: '${selector}'`);
  }
  return normalizedSelector;
};

/**
 * Prepares the rawSelector before tokenization:
 * 1. Trims it.
 * 2. Converts old syntax `[-ext-pseudo-class="..."]` to new one `:pseudo-class(...)`.
 * 3. Handles :scope pseudo inside :has() pseudo-class arg.
 *
 * @param rawSelector Selector with no style declaration.
 * @returns Prepared selector with no style declaration.
 */
const convert = rawSelector => {
  const trimmedSelector = rawSelector.trim();
  return normalize(trimmedSelector);
};

/**
 * Possible token types.
 *
 * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
 * during ExtendedCss import into other libraries.
 */
const TOKEN_TYPE = {
  MARK: 'mark',
  WORD: 'word'
};
/**
 * Splits `input` string into tokens.
 *
 * @param input Input string to tokenize.
 * @param supportedMarks Array of supported marks to considered as `TOKEN_TYPE.MARK`;
 * all other will be considered as `TOKEN_TYPE.WORD`.
 *
 * @returns Array of tokens.
 */
const tokenize = (input, supportedMarks) => {
  // buffer is needed for words collecting while iterating
  let wordBuffer = '';
  // result collection
  const tokens = [];
  const selectorSymbols = input.split('');
  // iterate through selector chars and collect tokens
  selectorSymbols.forEach(symbol => {
    if (supportedMarks.includes(symbol)) {
      // if anything was collected to the buffer before
      if (wordBuffer.length > 0) {
        // now it is time to stop buffer collecting and save is as "word"
        tokens.push({
          type: TOKEN_TYPE.WORD,
          value: wordBuffer
        });
        // reset the buffer
        wordBuffer = '';
      }
      // save current symbol as "mark"
      tokens.push({
        type: TOKEN_TYPE.MARK,
        value: symbol
      });
      return;
    }
    // otherwise collect symbol to the buffer
    wordBuffer += symbol;
  });

  // save the last collected word
  if (wordBuffer.length > 0) {
    tokens.push({
      type: TOKEN_TYPE.WORD,
      value: wordBuffer
    });
  }
  return tokens;
};

/**
 * Prepares `rawSelector` and splits it into tokens.
 *
 * @param rawSelector Raw css selector.
 *
 * @returns Array of tokens supported for selector.
 */
const tokenizeSelector = rawSelector => {
  const selector = convert(rawSelector);
  return tokenize(selector, SUPPORTED_SELECTOR_MARKS);
};

/**
 * Splits `attribute` into tokens.
 *
 * @param attribute Input attribute.
 *
 * @returns Array of tokens supported for attribute.
 */
const tokenizeAttribute = attribute => {
  // equal sigh `=` in attribute is considered as `TOKEN_TYPE.MARK`
  return tokenize(attribute, [...SUPPORTED_SELECTOR_MARKS, EQUAL_SIGN]);
};

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

/**
 * Possible ast node types.
 *
 * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
 * during ExtendedCss import into other libraries.
 */
const NODE = {
  SELECTOR_LIST: 'SelectorList',
  SELECTOR: 'Selector',
  REGULAR_SELECTOR: 'RegularSelector',
  EXTENDED_SELECTOR: 'ExtendedSelector',
  ABSOLUTE_PSEUDO_CLASS: 'AbsolutePseudoClass',
  RELATIVE_PSEUDO_CLASS: 'RelativePseudoClass'
};

/**
 * Universal interface for all node types.
 */

/**
 * Class needed for creating ast nodes while selector parsing.
 * Used for SelectorList, Selector, ExtendedSelector.
 */
class AnySelectorNode {
  /**
   * Creates new ast node.
   *
   * @param type Ast node type.
   */
  constructor(type) {
    _defineProperty(this, "children", []);
    this.type = type;
  }

  /**
   * Adds child node to children array.
   *
   * @param child Ast node.
   */
  addChild(child) {
    this.children.push(child);
  }
}

/**
 * Class needed for creating RegularSelector ast node while selector parsing.
 */
class RegularSelectorNode extends AnySelectorNode {
  /**
   * Creates RegularSelector ast node.
   *
   * @param value Value of RegularSelector node.
   */
  constructor(value) {
    super(NODE.REGULAR_SELECTOR);
    this.value = value;
  }
}

/**
 * Class needed for creating RelativePseudoClass ast node while selector parsing.
 */
class RelativePseudoClassNode extends AnySelectorNode {
  /**
   * Creates RegularSelector ast node.
   *
   * @param name Name of RelativePseudoClass node.
   */
  constructor(name) {
    super(NODE.RELATIVE_PSEUDO_CLASS);
    this.name = name;
  }
}

/**
 * Class needed for creating AbsolutePseudoClass ast node while selector parsing.
 */
class AbsolutePseudoClassNode extends AnySelectorNode {
  /**
   * Creates AbsolutePseudoClass ast node.
   *
   * @param name Name of AbsolutePseudoClass node.
   */
  constructor(name) {
    super(NODE.ABSOLUTE_PSEUDO_CLASS);
    _defineProperty(this, "value", '');
    this.name = name;
  }
}

/* eslint-disable jsdoc/require-description-complete-sentence */

/**
 * Root node.
 *
 * SelectorList
 *   : Selector
 *     ...
 *   ;
 */

/**
 * Selector node.
 *
 * Selector
 *   : RegularSelector
 *   | ExtendedSelector
 *     ...
 *   ;
 */

/**
 * Regular selector node.
 * It can be selected by querySelectorAll().
 *
 * RegularSelector
 *   : type
 *   : value
 *   ;
 */

/**
 * Extended selector node.
 *
 * ExtendedSelector
 *   : AbsolutePseudoClass
 *   | RelativePseudoClass
 *   ;
 */

/**
 * Absolute extended pseudo-class node,
 * i.e. none-selector args.
 *
 * AbsolutePseudoClass
 *   : type
 *   : name
 *   : value
 *   ;
 */

/**
 * Relative extended pseudo-class node
 * i.e. selector as arg.
 *
 * RelativePseudoClass
 *   : type
 *   : name
 *   : SelectorList
 *   ;
 */

//
//  ast example
//
//  div.banner > div:has(span, p), a img.ad
//
//  SelectorList - div.banner > div:has(span, p), a img.ad
//      Selector - div.banner > div:has(span, p)
//          RegularSelector - div.banner > div
//          ExtendedSelector - :has(span, p)
//              PseudoClassSelector - :has
//              SelectorList - span, p
//                  Selector - span
//                      RegularSelector - span
//                  Selector - p
//                      RegularSelector - p
//      Selector - a img.ad
//          RegularSelector - a img.ad
//

/**
 * Some browsers do not support Array.prototype.flat()
 * e.g. Opera 42 which is used for browserstack tests.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat}
 *
 * @param input Array needed to be flatten.
 *
 * @returns Flatten array.
 * @throws An error if array cannot be flatten.
 */
const flatten = input => {
  const stack = [];
  input.forEach(el => stack.push(el));
  const res = [];
  while (stack.length) {
    // pop value from stack
    const next = stack.pop();
    if (!next) {
      throw new Error('Unable to make array flat');
    }
    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      next.forEach(el => stack.push(el));
    } else {
      res.push(next);
    }
  }
  // reverse to restore input order
  return res.reverse();
};

/**
 * Returns first item from `array`.
 *
 * @param array Input array.
 *
 * @returns First array item, or `undefined` if there is no such item.
 */
const getFirst = array => {
  return array[0];
};

/**
 * Returns last item from array.
 *
 * @param array Input array.
 *
 * @returns Last array item, or `undefined` if there is no such item.
 */
const getLast = array => {
  return array[array.length - 1];
};

/**
 * Returns array item which is previous to the last one
 * e.g. for `[5, 6, 7, 8]` returns `7`.
 *
 * @param array Input array.
 *
 * @returns Previous to last array item, or `undefined` if there is no such item.
 */
const getPrevToLast = array => {
  return array[array.length - 2];
};

/**
 * Takes array of ast node `children` and returns the child by the `index`.
 *
 * @param array Array of ast node children.
 * @param index Index of needed child in the array.
 * @param errorMessage Optional error message to throw.
 *
 * @returns Array item at `index` position.
 * @throws An error if there is no child with specified `index` in array.
 */
const getItemByIndex = (array, index, errorMessage) => {
  const indexChild = array[index];
  if (!indexChild) {
    throw new Error(errorMessage || `No array item found by index ${index}`);
  }
  return indexChild;
};

const NO_REGULAR_SELECTOR_ERROR = 'At least one of Selector node children should be RegularSelector';

/**
 * Checks whether the type of `astNode` is SelectorList.
 *
 * @param astNode Ast node.
 *
 * @returns True if astNode.type === SelectorList.
 */
const isSelectorListNode = astNode => {
  return (astNode === null || astNode === void 0 ? void 0 : astNode.type) === NODE.SELECTOR_LIST;
};

/**
 * Checks whether the type of `astNode` is Selector.
 *
 * @param astNode Ast node.
 *
 * @returns True if astNode.type === Selector.
 */
const isSelectorNode = astNode => {
  return (astNode === null || astNode === void 0 ? void 0 : astNode.type) === NODE.SELECTOR;
};

/**
 * Checks whether the type of `astNode` is RegularSelector.
 *
 * @param astNode Ast node.
 *
 * @returns True if astNode.type === RegularSelector.
 */
const isRegularSelectorNode = astNode => {
  return (astNode === null || astNode === void 0 ? void 0 : astNode.type) === NODE.REGULAR_SELECTOR;
};

/**
 * Checks whether the type of `astNode` is ExtendedSelector.
 *
 * @param astNode Ast node.
 *
 * @returns True if astNode.type === ExtendedSelector.
 */
const isExtendedSelectorNode = astNode => {
  return astNode.type === NODE.EXTENDED_SELECTOR;
};

/**
 * Checks whether the type of `astNode` is AbsolutePseudoClass.
 *
 * @param astNode Ast node.
 *
 * @returns True if astNode.type === AbsolutePseudoClass.
 */
const isAbsolutePseudoClassNode = astNode => {
  return (astNode === null || astNode === void 0 ? void 0 : astNode.type) === NODE.ABSOLUTE_PSEUDO_CLASS;
};

/**
 * Checks whether the type of `astNode` is RelativePseudoClass.
 *
 * @param astNode Ast node.
 *
 * @returns True if astNode.type === RelativePseudoClass.
 */
const isRelativePseudoClassNode = astNode => {
  return (astNode === null || astNode === void 0 ? void 0 : astNode.type) === NODE.RELATIVE_PSEUDO_CLASS;
};

/**
 * Returns name of `astNode`.
 *
 * @param astNode AbsolutePseudoClass or RelativePseudoClass node.
 *
 * @returns Name of `astNode`.
 * @throws An error on unsupported ast node or no name found.
 */
const getNodeName = astNode => {
  if (astNode === null) {
    throw new Error('Ast node should be defined');
  }
  if (!isAbsolutePseudoClassNode(astNode) && !isRelativePseudoClassNode(astNode)) {
    throw new Error('Only AbsolutePseudoClass or RelativePseudoClass ast node can have a name');
  }
  if (!astNode.name) {
    throw new Error('Extended pseudo-class should have a name');
  }
  return astNode.name;
};

/**
 * Returns value of `astNode`.
 *
 * @param astNode RegularSelector or AbsolutePseudoClass node.
 * @param errorMessage Optional error message if no value found.
 *
 * @returns Value of `astNode`.
 * @throws An error on unsupported ast node or no value found.
 */
const getNodeValue = (astNode, errorMessage) => {
  if (astNode === null) {
    throw new Error('Ast node should be defined');
  }
  if (!isRegularSelectorNode(astNode) && !isAbsolutePseudoClassNode(astNode)) {
    throw new Error('Only RegularSelector ot AbsolutePseudoClass ast node can have a value');
  }
  if (!astNode.value) {
    throw new Error(errorMessage || 'Ast RegularSelector ot AbsolutePseudoClass node should have a value');
  }
  return astNode.value;
};

/**
 * Returns only RegularSelector nodes from `children`.
 *
 * @param children Array of ast node children.
 *
 * @returns Array of RegularSelector nodes.
 */
const getRegularSelectorNodes = children => {
  return children.filter(isRegularSelectorNode);
};

/**
 * Returns the first RegularSelector node from `children`.
 *
 * @param children Array of ast node children.
 * @param errorMessage Optional error message if no value found.
 *
 * @returns Ast RegularSelector node.
 * @throws An error if no RegularSelector node found.
 */
const getFirstRegularChild = (children, errorMessage) => {
  const regularSelectorNodes = getRegularSelectorNodes(children);
  const firstRegularSelectorNode = getFirst(regularSelectorNodes);
  if (!firstRegularSelectorNode) {
    throw new Error(errorMessage || NO_REGULAR_SELECTOR_ERROR);
  }
  return firstRegularSelectorNode;
};

/**
 * Returns the last RegularSelector node from `children`.
 *
 * @param children Array of ast node children.
 *
 * @returns Ast RegularSelector node.
 * @throws An error if no RegularSelector node found.
 */
const getLastRegularChild = children => {
  const regularSelectorNodes = getRegularSelectorNodes(children);
  const lastRegularSelectorNode = getLast(regularSelectorNodes);
  if (!lastRegularSelectorNode) {
    throw new Error(NO_REGULAR_SELECTOR_ERROR);
  }
  return lastRegularSelectorNode;
};

/**
 * Returns the only child of `node`.
 *
 * @param node Ast node.
 * @param errorMessage Error message.
 *
 * @returns The only child of ast node.
 * @throws An error if none or more than one child found.
 */
const getNodeOnlyChild = (node, errorMessage) => {
  if (node.children.length !== 1) {
    throw new Error(errorMessage);
  }
  const onlyChild = getFirst(node.children);
  if (!onlyChild) {
    throw new Error(errorMessage);
  }
  return onlyChild;
};

/**
 * Takes ExtendedSelector node and returns its only child.
 *
 * @param extendedSelectorNode ExtendedSelector ast node.
 *
 * @returns AbsolutePseudoClass or RelativePseudoClass.
 * @throws An error if there is no specific pseudo-class ast node.
 */
const getPseudoClassNode = extendedSelectorNode => {
  return getNodeOnlyChild(extendedSelectorNode, 'Extended selector should be specified');
};

/**
 * Takes RelativePseudoClass node and returns its only child
 * which is relative SelectorList node.
 *
 * @param pseudoClassNode RelativePseudoClass.
 *
 * @returns Relative SelectorList node.
 * @throws An error if no selector list found.
 */
const getRelativeSelectorListNode = pseudoClassNode => {
  if (!isRelativePseudoClassNode(pseudoClassNode)) {
    throw new Error('Only RelativePseudoClass node can have relative SelectorList node as child');
  }
  return getNodeOnlyChild(pseudoClassNode, `Missing arg for :${getNodeName(pseudoClassNode)}() pseudo-class`);
};

const ATTRIBUTE_CASE_INSENSITIVE_FLAG = 'i';

/**
 * Limited list of available symbols before slash `/`
 * to check whether it is valid regexp pattern opening.
 */
const POSSIBLE_MARKS_BEFORE_REGEXP = {
  COMMON: [
  // e.g. ':matches-attr(/data-/)'
  BRACKET.PARENTHESES.LEFT,
  // e.g. `:matches-attr('/data-/')`
  SINGLE_QUOTE,
  // e.g. ':matches-attr("/data-/")'
  DOUBLE_QUOTE,
  // e.g. ':matches-attr(check=/data-v-/)'
  EQUAL_SIGN,
  // e.g. ':matches-property(inner./_test/=null)'
  DOT,
  // e.g. ':matches-css(height:/20px/)'
  COLON,
  // ':matches-css-after( content  :   /(\\d+\\s)*me/  )'
  SPACE],
  CONTAINS: [
  // e.g. ':contains(/text/)'
  BRACKET.PARENTHESES.LEFT,
  // e.g. `:contains('/text/')`
  SINGLE_QUOTE,
  // e.g. ':contains("/text/")'
  DOUBLE_QUOTE]
};

/**
 * Checks whether the passed token is supported extended pseudo-class.
 *
 * @param tokenValue Token value to check.
 *
 * @returns True if `tokenValue` is one of supported extended pseudo-class names.
 */
const isSupportedPseudoClass = tokenValue => {
  return SUPPORTED_PSEUDO_CLASSES.includes(tokenValue);
};

/**
 * Checks whether the passed pseudo-class `name` should be optimized,
 * i.e. :not() and :is().
 *
 * @param name Pseudo-class name.
 *
 * @returns True if `name` is one if pseudo-class which should be optimized.
 */
const isOptimizationPseudoClass = name => {
  return OPTIMIZATION_PSEUDO_CLASSES.includes(name);
};

/**
 * Checks whether next to "space" token is a continuation of regular selector being processed.
 *
 * @param nextTokenType Type of token next to current one.
 * @param nextTokenValue Value of token next to current one.
 *
 * @returns True if next token seems to be a part of current regular selector.
 */
const doesRegularContinueAfterSpace = (nextTokenType, nextTokenValue) => {
  // regular selector does not continues after the current token
  if (!nextTokenType || !nextTokenValue) {
    return false;
  }
  return COMBINATORS.includes(nextTokenValue) || nextTokenType === TOKEN_TYPE.WORD
  // e.g. '#main *:has(> .ad)'
  || nextTokenValue === ASTERISK || nextTokenValue === ID_MARKER || nextTokenValue === CLASS_MARKER
  // e.g. 'div :where(.content)'
  || nextTokenValue === COLON
  // e.g. "div[class*=' ']"
  || nextTokenValue === SINGLE_QUOTE
  // e.g. 'div[class*=" "]'
  || nextTokenValue === DOUBLE_QUOTE || nextTokenValue === BRACKET.SQUARE.LEFT;
};

/**
 * Checks whether the regexp pattern for pseudo-class arg starts.
 * Needed for `context.isRegexpOpen` flag.
 *
 * @param context Selector parser context.
 * @param prevTokenValue Value of previous token.
 * @param bufferNodeValue Value of bufferNode.
 *
 * @returns True if current token seems to be a start of regexp pseudo-class arg pattern.
 * @throws An error on invalid regexp pattern.
 */
const isRegexpOpening = (context, prevTokenValue, bufferNodeValue) => {
  const lastExtendedPseudoClassName = getLast(context.extendedPseudoNamesStack);
  if (!lastExtendedPseudoClassName) {
    throw new Error('Regexp pattern allowed only in arg of extended pseudo-class');
  }
  // for regexp pattens the slash should not be escaped
  // const isRegexpPatternSlash = prevTokenValue !== BACKSLASH;
  // regexp pattern can be set as arg of pseudo-class
  // which means limited list of available symbols before slash `/`;
  // for :contains() pseudo-class regexp pattern should be at the beginning of arg
  if (CONTAINS_PSEUDO_NAMES.includes(lastExtendedPseudoClassName)) {
    return POSSIBLE_MARKS_BEFORE_REGEXP.CONTAINS.includes(prevTokenValue);
  }
  if (prevTokenValue === SLASH && lastExtendedPseudoClassName !== XPATH_PSEUDO_CLASS_MARKER) {
    const rawArgDesc = bufferNodeValue ? `in arg part: '${bufferNodeValue}'` : 'arg';
    throw new Error(`Invalid regexp pattern for :${lastExtendedPseudoClassName}() pseudo-class ${rawArgDesc}`);
  }

  // for other pseudo-classes regexp pattern can be either the whole arg or its part
  return POSSIBLE_MARKS_BEFORE_REGEXP.COMMON.includes(prevTokenValue);
};

/**
 * Checks whether the attribute starts.
 *
 * @param tokenValue Value of current token.
 * @param prevTokenValue Previous token value.
 *
 * @returns True if combination of current and previous token seems to be **a start** of attribute.
 */
const isAttributeOpening = (tokenValue, prevTokenValue) => {
  return tokenValue === BRACKET.SQUARE.LEFT && prevTokenValue !== BACKSLASH;
};

/**
 * Checks whether the attribute ends.
 *
 * @param context Selector parser context.
 *
 * @returns True if combination of current and previous token seems to be **an end** of attribute.
 * @throws An error on invalid attribute.
 */
const isAttributeClosing = context => {
  var _getPrevToLast;
  if (!context.isAttributeBracketsOpen) {
    return false;
  }
  // valid attributes may have extra spaces inside.
  // we get rid of them just to simplify the checking and they are skipped only here:
  //   - spaces will be collected to the ast with spaces as they were declared is selector
  //   - extra spaces in attribute are not relevant to attribute syntax validity
  //     e.g. 'a[ title ]' is the same as 'a[title]'
  //          'div[style *= "MARGIN" i]' is the same as 'div[style*="MARGIN"i]'
  const noSpaceAttr = context.attributeBuffer.split(SPACE).join('');
  // tokenize the prepared attribute string
  const attrTokens = tokenizeAttribute(noSpaceAttr);
  const firstAttrToken = getFirst(attrTokens);
  const firstAttrTokenType = firstAttrToken === null || firstAttrToken === void 0 ? void 0 : firstAttrToken.type;
  const firstAttrTokenValue = firstAttrToken === null || firstAttrToken === void 0 ? void 0 : firstAttrToken.value;
  // signal an error on any mark-type token except backslash
  // e.g. '[="margin"]'
  if (firstAttrTokenType === TOKEN_TYPE.MARK
  // backslash is allowed at start of attribute
  // e.g. '[\\:data-service-slot]'
  && firstAttrTokenValue !== BACKSLASH) {
    // eslint-disable-next-line max-len
    throw new Error(`'[${context.attributeBuffer}]' is not a valid attribute due to '${firstAttrTokenValue}' at start of it`);
  }
  const lastAttrToken = getLast(attrTokens);
  const lastAttrTokenType = lastAttrToken === null || lastAttrToken === void 0 ? void 0 : lastAttrToken.type;
  const lastAttrTokenValue = lastAttrToken === null || lastAttrToken === void 0 ? void 0 : lastAttrToken.value;
  if (lastAttrTokenValue === EQUAL_SIGN) {
    // e.g. '[style=]'
    throw new Error(`'[${context.attributeBuffer}]' is not a valid attribute due to '${EQUAL_SIGN}'`);
  }
  const equalSignIndex = attrTokens.findIndex(token => {
    return token.type === TOKEN_TYPE.MARK && token.value === EQUAL_SIGN;
  });
  const prevToLastAttrTokenValue = (_getPrevToLast = getPrevToLast(attrTokens)) === null || _getPrevToLast === void 0 ? void 0 : _getPrevToLast.value;
  if (equalSignIndex === -1) {
    // if there is no '=' inside attribute,
    // it must be just attribute name which means the word-type token before closing bracket
    // e.g. 'div[style]'
    if (lastAttrTokenType === TOKEN_TYPE.WORD) {
      return true;
    }
    return prevToLastAttrTokenValue === BACKSLASH
    // some weird attribute are valid too
    // e.g. '[class\\"ads-article\\"]'
    && (lastAttrTokenValue === DOUBLE_QUOTE
    // e.g. "[class\\'ads-article\\']"
    || lastAttrTokenValue === SINGLE_QUOTE);
  }

  // get the value of token next to `=`
  const nextToEqualSignToken = getItemByIndex(attrTokens, equalSignIndex + 1);
  const nextToEqualSignTokenValue = nextToEqualSignToken.value;
  // check whether the attribute value wrapper in quotes
  const isAttrValueQuote = nextToEqualSignTokenValue === SINGLE_QUOTE || nextToEqualSignTokenValue === DOUBLE_QUOTE;

  // for no quotes after `=` the last token before `]` should be a word-type one
  // e.g. 'div[style*=margin]'
  //      'div[style*=MARGIN i]'
  if (!isAttrValueQuote) {
    if (lastAttrTokenType === TOKEN_TYPE.WORD) {
      return true;
    }
    // otherwise signal an error
    // e.g. 'table[style*=border: 0px"]'
    throw new Error(`'[${context.attributeBuffer}]' is not a valid attribute`);
  }

  // otherwise if quotes for value are present
  // the last token before `]` can still be word-type token
  // e.g. 'div[style*="MARGIN" i]'
  if (lastAttrTokenType === TOKEN_TYPE.WORD && (lastAttrTokenValue === null || lastAttrTokenValue === void 0 ? void 0 : lastAttrTokenValue.toLocaleLowerCase()) === ATTRIBUTE_CASE_INSENSITIVE_FLAG) {
    return prevToLastAttrTokenValue === nextToEqualSignTokenValue;
  }

  // eventually if there is quotes for attribute value and last token is not a word,
  // the closing mark should be the same quote as opening one
  return lastAttrTokenValue === nextToEqualSignTokenValue;
};

/**
 * Checks whether the `tokenValue` is a whitespace character.
 *
 * @param tokenValue Token value.
 *
 * @returns True if `tokenValue` is a whitespace character.
 */
const isWhiteSpaceChar = tokenValue => {
  if (!tokenValue) {
    return false;
  }
  return WHITE_SPACE_CHARACTERS.includes(tokenValue);
};

/**
 * Checks whether the passed `str` is a name of supported absolute extended pseudo-class,
 * e.g. :contains(), :matches-css() etc.
 *
 * @param str Token value to check.
 *
 * @returns True if `str` is one of absolute extended pseudo-class names.
 */
const isAbsolutePseudoClass = str => {
  return ABSOLUTE_PSEUDO_CLASSES.includes(str);
};

/**
 * Checks whether the passed `str` is a name of supported relative extended pseudo-class,
 * e.g. :has(), :not() etc.
 *
 * @param str Token value to check.
 *
 * @returns True if `str` is one of relative extended pseudo-class names.
 */
const isRelativePseudoClass = str => {
  return RELATIVE_PSEUDO_CLASSES.includes(str);
};

/**
 * Checks whether the passed `str` is a name of standalone extended pseudo-class,
 * i.e. a no-argument pseudo-class that tests the element itself (e.g. :empty-trimmed).
 *
 * @param str Token value to check.
 *
 * @returns True if `str` is one of standalone pseudo-class names.
 */
const isStandalonePseudoClass = str => {
  return STANDALONE_PSEUDO_CLASSES.includes(str);
};

/**
 * Returns the node which is being collected
 * or null if there is no such one.
 *
 * @param context Selector parser context.
 *
 * @returns Buffer node or null.
 */
const getBufferNode = context => {
  if (context.pathToBufferNode.length === 0) {
    return null;
  }
  // buffer node is always the last in the pathToBufferNode stack
  return getLast(context.pathToBufferNode) || null;
};

/**
 * Returns the parent node to the 'buffer node' — which is the one being collected —
 * or null if there is no such one.
 *
 * @param context Selector parser context.
 *
 * @returns Parent node of buffer node or null.
 */
const getBufferNodeParent = context => {
  // at least two nodes should exist — the buffer node and its parent
  // otherwise return null
  if (context.pathToBufferNode.length < 2) {
    return null;
  }
  // since the buffer node is always the last in the pathToBufferNode stack
  // its parent is previous to it in the stack
  return getPrevToLast(context.pathToBufferNode) || null;
};

/**
 * Returns last RegularSelector ast node.
 * Needed for parsing of the complex selector with extended pseudo-class inside it.
 *
 * @param context Selector parser context.
 *
 * @returns Ast RegularSelector node.
 * @throws An error if:
 * - bufferNode is absent;
 * - type of bufferNode is unsupported;
 * - no RegularSelector in bufferNode.
 */
const getContextLastRegularSelectorNode = context => {
  const bufferNode = getBufferNode(context);
  if (!bufferNode) {
    throw new Error('No bufferNode found');
  }
  if (!isSelectorNode(bufferNode)) {
    throw new Error('Unsupported bufferNode type');
  }
  const lastRegularSelectorNode = getLastRegularChild(bufferNode.children);
  context.pathToBufferNode.push(lastRegularSelectorNode);
  return lastRegularSelectorNode;
};

/**
 * Updates needed buffer node value while tokens iterating.
 * For RegularSelector also collects token values to context.attributeBuffer
 * for proper attribute parsing.
 *
 * @param context Selector parser context.
 * @param tokenValue Value of current token.
 *
 * @throws An error if:
 * - no bufferNode;
 * - bufferNode.type is not RegularSelector or AbsolutePseudoClass.
 */
const updateBufferNode = (context, tokenValue) => {
  const bufferNode = getBufferNode(context);
  if (bufferNode === null) {
    throw new Error('No bufferNode to update');
  }
  if (isAbsolutePseudoClassNode(bufferNode)) {
    bufferNode.value += tokenValue;
  } else if (isRegularSelectorNode(bufferNode)) {
    bufferNode.value += tokenValue;
    if (context.isAttributeBracketsOpen) {
      context.attributeBuffer += tokenValue;
    }
  } else {
    // eslint-disable-next-line max-len
    throw new Error(`${bufferNode.type} node cannot be updated. Only RegularSelector and AbsolutePseudoClass are supported`);
  }
};

/**
 * Adds SelectorList node to context.ast at the start of ast collecting.
 *
 * @param context Selector parser context.
 */
const addSelectorListNode = context => {
  const selectorListNode = new AnySelectorNode(NODE.SELECTOR_LIST);
  context.ast = selectorListNode;
  context.pathToBufferNode.push(selectorListNode);
};

/**
 * Adds new node to buffer node children.
 * New added node will be considered as buffer node after it.
 *
 * @param context Selector parser context.
 * @param type Type of node to add.
 * @param tokenValue Optional, defaults to `''`, value of processing token.
 *
 * @throws An error if no bufferNode.
 */
const addAstNodeByType = function (context, type) {
  let tokenValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  const bufferNode = getBufferNode(context);
  if (bufferNode === null) {
    throw new Error('No buffer node');
  }
  let node;
  if (type === NODE.REGULAR_SELECTOR) {
    node = new RegularSelectorNode(tokenValue);
  } else if (type === NODE.ABSOLUTE_PSEUDO_CLASS) {
    node = new AbsolutePseudoClassNode(tokenValue);
  } else if (type === NODE.RELATIVE_PSEUDO_CLASS) {
    node = new RelativePseudoClassNode(tokenValue);
  } else {
    // SelectorList || Selector || ExtendedSelector
    node = new AnySelectorNode(type);
  }
  bufferNode.addChild(node);
  context.pathToBufferNode.push(node);
};

/**
 * The very beginning of ast collecting.
 *
 * @param context Selector parser context.
 * @param tokenValue Value of regular selector.
 */
const initAst = (context, tokenValue) => {
  addSelectorListNode(context);
  addAstNodeByType(context, NODE.SELECTOR);
  // RegularSelector node is always the first child of Selector node
  addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
};

/**
 * Inits selector list subtree for relative extended pseudo-classes, e.g. :has(), :not().
 *
 * @param context Selector parser context.
 * @param tokenValue Optional, defaults to `''`, value of inner regular selector.
 */
const initRelativeSubtree = function (context) {
  let tokenValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  addAstNodeByType(context, NODE.SELECTOR_LIST);
  addAstNodeByType(context, NODE.SELECTOR);
  addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
};

/**
 * Goes to closest parent specified by type.
 * Actually updates path to buffer node for proper ast collecting of selectors while parsing.
 *
 * @param context Selector parser context.
 * @param parentType Type of needed parent node in ast.
 */
const upToClosest = (context, parentType) => {
  for (let i = context.pathToBufferNode.length - 1; i >= 0; i -= 1) {
    var _context$pathToBuffer;
    if (((_context$pathToBuffer = context.pathToBufferNode[i]) === null || _context$pathToBuffer === void 0 ? void 0 : _context$pathToBuffer.type) === parentType) {
      context.pathToBufferNode = context.pathToBufferNode.slice(0, i + 1);
      break;
    }
  }
};

/**
 * Returns needed buffer node updated due to complex selector parsing.
 *
 * @param context Selector parser context.
 *
 * @returns Ast node for following selector parsing.
 * @throws An error if there is no upper SelectorNode is ast.
 */
const getUpdatedBufferNode = context => {
  // it may happen during the parsing of selector list
  // which is an argument of relative pseudo-class
  // e.g. '.banner:has(~span, ~p)'
  // parser position is here  ↑
  // so if after the comma the buffer node type is SelectorList and parent type is RelativePseudoClass
  // we should simply return the current buffer node
  const bufferNode = getBufferNode(context);
  if (bufferNode && isSelectorListNode(bufferNode) && isRelativePseudoClassNode(getBufferNodeParent(context))) {
    return bufferNode;
  }
  upToClosest(context, NODE.SELECTOR);
  const selectorNode = getBufferNode(context);
  if (!selectorNode) {
    throw new Error('No SelectorNode, impossible to continue selector parsing by ExtendedCss');
  }
  const lastSelectorNodeChild = getLast(selectorNode.children);
  const hasExtended = lastSelectorNodeChild && isExtendedSelectorNode(lastSelectorNodeChild)
  // parser position might be inside standard pseudo-class brackets which has space
  // e.g. 'div:contains(/а/):nth-child(100n + 2)'
  && context.standardPseudoBracketsStack.length === 0;
  const supposedPseudoClassNode = hasExtended && getFirst(lastSelectorNodeChild.children);
  let newNeededBufferNode = selectorNode;
  if (supposedPseudoClassNode) {
    // name of pseudo-class for last extended-node child for Selector node
    const lastExtendedPseudoName = hasExtended && supposedPseudoClassNode.name;
    const isLastExtendedNameRelative = lastExtendedPseudoName && isRelativePseudoClass(lastExtendedPseudoName);
    const isLastExtendedNameAbsolute = lastExtendedPseudoName && isAbsolutePseudoClass(lastExtendedPseudoName);
    const hasRelativeExtended = isLastExtendedNameRelative && context.extendedPseudoBracketsStack.length > 0 && context.extendedPseudoBracketsStack.length === context.extendedPseudoNamesStack.length;
    const hasAbsoluteExtended = isLastExtendedNameAbsolute && lastExtendedPseudoName === getLast(context.extendedPseudoNamesStack);
    if (hasRelativeExtended) {
      // return relative selector node to update later
      context.pathToBufferNode.push(lastSelectorNodeChild);
      newNeededBufferNode = supposedPseudoClassNode;
    } else if (hasAbsoluteExtended) {
      // return absolute selector node to update later
      context.pathToBufferNode.push(lastSelectorNodeChild);
      newNeededBufferNode = supposedPseudoClassNode;
    }
  } else if (hasExtended) {
    // return selector node to add new regular selector node later
    newNeededBufferNode = selectorNode;
  } else {
    // otherwise return last regular selector node to update later
    newNeededBufferNode = getContextLastRegularSelectorNode(context);
  }
  // update the path to buffer node properly
  context.pathToBufferNode.push(newNeededBufferNode);
  return newNeededBufferNode;
};

/**
 * Checks values of few next tokens on colon token `:` and:
 *  - updates buffer node for following standard pseudo-class;
 *  - adds extended selector ast node for following extended pseudo-class;
 *  - validates some cases of `:remove()` and `:has()` usage.
 *
 * @param context Selector parser context.
 * @param selector Selector.
 * @param tokenValue Value of current token.
 * @param nextTokenValue Value of token next to current one.
 * @param nextToNextTokenValue Value of token next to next to current one.
 *
 * @throws An error on :remove() pseudo-class in selector
 * or :has() inside regular pseudo limitation.
 */
const handleNextTokenOnColon = (context, selector, tokenValue, nextTokenValue, nextToNextTokenValue) => {
  if (!nextTokenValue) {
    throw new Error(`Invalid colon ':' at the end of selector: '${selector}'`);
  }
  if (!isSupportedPseudoClass(nextTokenValue.toLowerCase())) {
    if (nextTokenValue.toLowerCase() === REMOVE_PSEUDO_MARKER) {
      // :remove() pseudo-class should be handled before
      // as it is not about element selecting but actions with elements
      // e.g. 'body > div:empty:remove()'
      throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`);
    }
    // if following token is not an extended pseudo
    // the colon should be collected to value of RegularSelector
    // e.g. '.entry_text:nth-child(2)'
    updateBufferNode(context, tokenValue);
    // check the token after the pseudo and do balance parentheses later
    // only if it is functional pseudo-class (standard with brackets, e.g. ':lang()').
    // no brackets balance needed for such case,
    // parser position is on first colon after the 'div':
    // e.g. 'div:last-child:has(button.privacy-policy__btn)'
    if (nextToNextTokenValue && nextToNextTokenValue === BRACKET.PARENTHESES.LEFT
    // no brackets balance needed for parentheses inside attribute value
    // e.g. 'a[href="javascript:void(0)"]'   <-- parser position is on colon `:`
    // before `void`           ↑
    && !context.isAttributeBracketsOpen) {
      context.standardPseudoNamesStack.push(nextTokenValue);
    }
  } else {
    // it is supported extended pseudo-class.
    // Disallow :has() inside the pseudos accepting only compound selectors
    // https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c54 [2]
    if (HAS_PSEUDO_CLASS_MARKERS.includes(nextTokenValue) && context.standardPseudoNamesStack.length > 0) {
      // eslint-disable-next-line max-len
      throw new Error(`Usage of :${nextTokenValue}() pseudo-class is not allowed inside regular pseudo: '${getLast(context.standardPseudoNamesStack)}'`);
    } else {
      // stop RegularSelector value collecting
      upToClosest(context, NODE.SELECTOR);
      // add ExtendedSelector to Selector children
      addAstNodeByType(context, NODE.EXTENDED_SELECTOR);
    }
  }
};

// limit applying of wildcard :is() and :not() pseudo-class only to html children
// e.g. ':is(.page, .main) > .banner' or '*:not(span):not(p)'
const IS_OR_NOT_PSEUDO_SELECTING_ROOT = `html ${ASTERISK}`;

/**
 * Checks if there are any ExtendedSelector node in selector list.
 *
 * @param selectorList Ast SelectorList node.
 *
 * @returns True if `selectorList` has any inner ExtendedSelector node.
 */
const hasExtendedSelector = selectorList => {
  return selectorList.children.some(selectorNode => {
    return selectorNode.children.some(selectorNodeChild => {
      return isExtendedSelectorNode(selectorNodeChild);
    });
  });
};

/**
 * Converts selector list of RegularSelector nodes to string.
 *
 * @param selectorList Ast SelectorList node.
 *
 * @returns String representation for selector list of regular selectors.
 */
const selectorListOfRegularsToString = selectorList => {
  // if there is no ExtendedSelector in relative SelectorList
  // it means that each Selector node has single child — RegularSelector node
  // and their values should be combined to string
  const standardCssSelectors = selectorList.children.map(selectorNode => {
    const selectorOnlyChild = getNodeOnlyChild(selectorNode, 'Ast Selector node should have RegularSelector node');
    return getNodeValue(selectorOnlyChild);
  });
  return standardCssSelectors.join(`${COMMA}${SPACE}`);
};

/**
 * Updates children of `node` replacing them with `newChildren`.
 * Important: modifies input `node` which is passed by reference.
 *
 * @param node Ast node to update.
 * @param newChildren Array of new children for ast node.
 *
 * @returns Updated ast node.
 */
const updateNodeChildren = (node, newChildren) => {
  node.children = newChildren;
  return node;
};

/**
 * Recursively checks whether the ExtendedSelector node should be optimized.
 * It has to be recursive because RelativePseudoClass has inner SelectorList node.
 *
 * @param currExtendedSelectorNode Ast ExtendedSelector node.
 *
 * @returns True is ExtendedSelector should be optimized.
 */
const shouldOptimizeExtendedSelector = currExtendedSelectorNode => {
  if (currExtendedSelectorNode === null) {
    return false;
  }
  const extendedPseudoClassNode = getPseudoClassNode(currExtendedSelectorNode);
  const pseudoName = getNodeName(extendedPseudoClassNode);
  if (isAbsolutePseudoClass(pseudoName)) {
    return false;
  }
  // Standalone pseudo-classes (e.g. :empty-trimmed) do not have selector-list args.
  // They cannot be optimized and should remain as standalone ExtendedSelector nodes.
  if (isStandalonePseudoClass(pseudoName)) {
    return false;
  }
  const relativeSelectorList = getRelativeSelectorListNode(extendedPseudoClassNode);
  const innerSelectorNodes = relativeSelectorList.children;
  // simple checking for standard selectors in arg of :not() or :is() pseudo-class
  // e.g. 'div > *:is(div, a, span)'
  if (isOptimizationPseudoClass(pseudoName)) {
    const areAllSelectorNodeChildrenRegular = innerSelectorNodes.every(selectorNode => {
      try {
        const selectorOnlyChild = getNodeOnlyChild(selectorNode, 'Selector node should have RegularSelector');
        // it means that the only child is RegularSelector and it can be optimized
        return isRegularSelectorNode(selectorOnlyChild);
      } catch (e) {
        return false;
      }
    });
    if (areAllSelectorNodeChildrenRegular) {
      return true;
    }
  }
  // for other extended pseudo-classes than :not() and :is()
  return innerSelectorNodes.some(selectorNode => {
    return selectorNode.children.some(selectorNodeChild => {
      if (!isExtendedSelectorNode(selectorNodeChild)) {
        return false;
      }
      // check inner ExtendedSelector recursively
      // e.g. 'div:has(*:not(.header))'
      return shouldOptimizeExtendedSelector(selectorNodeChild);
    });
  });
};

/**
 * Returns optimized ExtendedSelector node if it can be optimized
 * or null if ExtendedSelector is fully optimized while function execution
 * which means that value of `prevRegularSelectorNode` is updated.
 *
 * @param currExtendedSelectorNode Current ExtendedSelector node to optimize.
 * @param prevRegularSelectorNode Previous RegularSelector node.
 *
 * @returns Ast node or null.
 */
const getOptimizedExtendedSelector = (currExtendedSelectorNode, prevRegularSelectorNode) => {
  if (!currExtendedSelectorNode) {
    return null;
  }
  const extendedPseudoClassNode = getPseudoClassNode(currExtendedSelectorNode);
  const relativeSelectorList = getRelativeSelectorListNode(extendedPseudoClassNode);
  const hasInnerExtendedSelector = hasExtendedSelector(relativeSelectorList);
  if (!hasInnerExtendedSelector) {
    // if there is no extended selectors for :not() or :is()
    // e.g. 'div:not(.content, .main)'
    const relativeSelectorListStr = selectorListOfRegularsToString(relativeSelectorList);
    const pseudoName = getNodeName(extendedPseudoClassNode);
    // eslint-disable-next-line max-len
    const optimizedExtendedStr = `${COLON}${pseudoName}${BRACKET.PARENTHESES.LEFT}${relativeSelectorListStr}${BRACKET.PARENTHESES.RIGHT}`;
    prevRegularSelectorNode.value = `${getNodeValue(prevRegularSelectorNode)}${optimizedExtendedStr}`;
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const optimizedRelativeSelectorList = optimizeSelectorListNode(relativeSelectorList);
  const optimizedExtendedPseudoClassNode = updateNodeChildren(extendedPseudoClassNode, [optimizedRelativeSelectorList]);
  return updateNodeChildren(currExtendedSelectorNode, [optimizedExtendedPseudoClassNode]);
};

/**
 * Combines values of `previous` and `current` RegularSelector nodes.
 * It may happen during the optimization when ExtendedSelector between RegularSelector node was optimized.
 *
 * @param current Current RegularSelector node.
 * @param previous Previous RegularSelector node.
 */
const optimizeCurrentRegularSelector = (current, previous) => {
  previous.value = `${getNodeValue(previous)}${SPACE}${getNodeValue(current)}`;
};

/**
 * Optimizes ast Selector node.
 *
 * @param selectorNode Ast Selector node.
 *
 * @returns Optimized ast node.
 * @throws An error while collecting optimized nodes.
 */
const optimizeSelectorNode = selectorNode => {
  // non-optimized list of SelectorNode children
  const rawSelectorNodeChildren = selectorNode.children;
  // for collecting optimized children list
  const optimizedChildrenList = [];
  let currentIndex = 0;
  // iterate through all children in non-optimized ast Selector node
  while (currentIndex < rawSelectorNodeChildren.length) {
    const currentChild = getItemByIndex(rawSelectorNodeChildren, currentIndex, 'currentChild should be specified');
    // no need to optimize the very first child which is always RegularSelector node
    if (currentIndex === 0) {
      optimizedChildrenList.push(currentChild);
    } else {
      const prevRegularChild = getLastRegularChild(optimizedChildrenList);
      if (isExtendedSelectorNode(currentChild)) {
        // start checking with point is null
        let optimizedExtendedSelector = null;
        // check whether the optimization is needed
        let isOptimizationNeeded = shouldOptimizeExtendedSelector(currentChild);
        // update optimizedExtendedSelector so it can be optimized recursively
        // i.e. `getOptimizedExtendedSelector(optimizedExtendedSelector)` below
        optimizedExtendedSelector = currentChild;
        while (isOptimizationNeeded) {
          // recursively optimize ExtendedSelector until no optimization needed
          // e.g. div > *:is(.banner:not(.block))
          optimizedExtendedSelector = getOptimizedExtendedSelector(optimizedExtendedSelector, prevRegularChild);
          isOptimizationNeeded = shouldOptimizeExtendedSelector(optimizedExtendedSelector);
        }
        // if it was simple :not() of :is() with standard selector arg
        // e.g. 'div:not([class][id])'
        // or   '.main > *:is([data-loaded], .banner)'
        // after the optimization the ExtendedSelector node become part of RegularSelector
        // so nothing to save eventually
        // otherwise the optimized ExtendedSelector should be saved
        // e.g. 'div:has(:not([class]))'
        if (optimizedExtendedSelector !== null) {
          optimizedChildrenList.push(optimizedExtendedSelector);
          // if optimization is not needed
          const optimizedPseudoClass = getPseudoClassNode(optimizedExtendedSelector);
          const optimizedPseudoName = getNodeName(optimizedPseudoClass);
          // parent element checking is used to apply :is() and :not() pseudo-classes as extended.
          // as there is no parentNode for root element (html)
          // so element selection should be limited to it's children
          // e.g. '*:is(:has(.page))' -> 'html *:is(has(.page))'
          // or   '*:not(:has(span))' -> 'html *:not(:has(span))'
          if (getNodeValue(prevRegularChild) === ASTERISK && isOptimizationPseudoClass(optimizedPseudoName)) {
            prevRegularChild.value = IS_OR_NOT_PSEUDO_SELECTING_ROOT;
          }
        }
      } else if (isRegularSelectorNode(currentChild)) {
        // in non-optimized ast, RegularSelector node may follow ExtendedSelector which should be optimized
        // for example, for 'div:not(.content) > .banner' schematically it looks like
        // non-optimized ast: [
        //   1. RegularSelector: 'div'
        //   2. ExtendedSelector: 'not(.content)'
        //   3. RegularSelector: '> .banner'
        // ]
        // which after the ExtendedSelector looks like
        // partly optimized ast: [
        //   1. RegularSelector: 'div:not(.content)'
        //   2. RegularSelector: '> .banner'
        // ]
        // so second RegularSelector value should be combined with first one
        // optimized ast: [
        //   1. RegularSelector: 'div:not(.content) > .banner'
        // ]
        // here we check **children of selectorNode** after previous optimization if it was
        const lastOptimizedChild = getLast(optimizedChildrenList) || null;
        if (isRegularSelectorNode(lastOptimizedChild)) {
          optimizeCurrentRegularSelector(currentChild, prevRegularChild);
        }
      }
    }
    currentIndex += 1;
  }
  return updateNodeChildren(selectorNode, optimizedChildrenList);
};

/**
 * Optimizes ast SelectorList node.
 *
 * @param selectorListNode SelectorList node.
 *
 * @returns Optimized ast node.
 */
const optimizeSelectorListNode = selectorListNode => {
  return updateNodeChildren(selectorListNode, selectorListNode.children.map(s => optimizeSelectorNode(s)));
};

/**
 * Optimizes ast:
 * If arg of :not() and :is() pseudo-classes does not contain extended selectors,
 * native Document.querySelectorAll() can be used to query elements.
 * It means that ExtendedSelector ast nodes can be removed
 * and value of relevant RegularSelector node should be updated accordingly.
 *
 * @param ast Non-optimized ast.
 *
 * @returns Optimized ast.
 */
const optimizeAst = ast => {
  // ast is basically the selector list of selectors
  return optimizeSelectorListNode(ast);
};

// limit applying of :xpath() pseudo-class to 'any' element
// https://github.com/AdguardTeam/ExtendedCss/issues/115
const XPATH_PSEUDO_SELECTING_ROOT = 'body';
const NO_WHITESPACE_ERROR_PREFIX = 'No white space is allowed before or after extended pseudo-class name in selector';

/**
 * Parses selector into ast for following element selection.
 *
 * @param selector Selector to parse.
 *
 * @returns Parsed ast.
 * @throws An error on invalid selector.
 */
const parse = selector => {
  const tokens = tokenizeSelector(selector);
  const context = {
    ast: null,
    pathToBufferNode: [],
    extendedPseudoNamesStack: [],
    extendedPseudoBracketsStack: [],
    standardPseudoNamesStack: [],
    standardPseudoBracketsStack: [],
    isAttributeBracketsOpen: false,
    attributeBuffer: '',
    isRegexpOpen: false,
    shouldOptimize: false
  };
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      break;
    }
    // Token to process
    const tokenType = token.type,
      tokenValue = token.value;

    // needed for SPACE and COLON tokens checking
    const nextToken = tokens[i + 1];
    const nextTokenType = nextToken === null || nextToken === void 0 ? void 0 : nextToken.type;
    const nextTokenValue = nextToken === null || nextToken === void 0 ? void 0 : nextToken.value;

    // needed for limitations
    // - :not() and :is() root element
    // - :has() usage
    // - white space before and after pseudo-class name
    const nextToNextToken = tokens[i + 2];
    const nextToNextTokenValue = nextToNextToken === null || nextToNextToken === void 0 ? void 0 : nextToNextToken.value;

    // needed for COLON token checking for none-specified regular selector before extended one
    // e.g. 'p, :hover'
    // or   '.banner, :contains(ads)'
    const previousToken = tokens[i - 1];
    const prevTokenType = previousToken === null || previousToken === void 0 ? void 0 : previousToken.type;
    const prevTokenValue = previousToken === null || previousToken === void 0 ? void 0 : previousToken.value;

    // needed for proper parsing of regexp pattern arg
    // e.g. ':matches-css(background-image: /^url\(https:\/\/example\.org\//)'
    const previousToPreviousToken = tokens[i - 2];
    const prevToPrevTokenValue = previousToPreviousToken === null || previousToPreviousToken === void 0 ? void 0 : previousToPreviousToken.value;
    let bufferNode = getBufferNode(context);
    switch (tokenType) {
      case TOKEN_TYPE.WORD:
        if (bufferNode === null) {
          // there is no buffer node only in one case — no ast collecting has been started
          initAst(context, tokenValue);
        } else if (isSelectorListNode(bufferNode)) {
          // add new selector to selector list
          addAstNodeByType(context, NODE.SELECTOR);
          addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
        } else if (isRegularSelectorNode(bufferNode)) {
          updateBufferNode(context, tokenValue);
        } else if (isExtendedSelectorNode(bufferNode)) {
          // No white space is allowed between the name of extended pseudo-class
          // and its opening parenthesis
          // https://www.w3.org/TR/selectors-4/#pseudo-classes
          // e.g. 'span:contains (text)'
          if (isWhiteSpaceChar(nextTokenValue) && nextToNextTokenValue === BRACKET.PARENTHESES.LEFT) {
            throw new Error(`${NO_WHITESPACE_ERROR_PREFIX}: '${selector}'`);
          }
          const lowerCaseTokenValue = tokenValue.toLowerCase();
          const isStandalonePseudo = isStandalonePseudoClass(lowerCaseTokenValue);
          // save pseudo-class name for brackets balance checking only for functional pseudo-classes.
          if (!isStandalonePseudo) {
            context.extendedPseudoNamesStack.push(lowerCaseTokenValue);
          }
          // extended pseudo-class name are parsed in lower case
          // as they should be case-insensitive
          // https://www.w3.org/TR/selectors-4/#pseudo-classes
          if (isAbsolutePseudoClass(lowerCaseTokenValue)) {
            addAstNodeByType(context, NODE.ABSOLUTE_PSEUDO_CLASS, lowerCaseTokenValue);
          } else {
            // if it is not absolute pseudo-class, it must be relative one
            // add RelativePseudoClass with tokenValue as pseudo-class name to ExtendedSelector children
            addAstNodeByType(context, NODE.RELATIVE_PSEUDO_CLASS, lowerCaseTokenValue);
            // for :not() and :is() pseudo-classes parsed ast should be optimized later
            if (isOptimizationPseudoClass(lowerCaseTokenValue)) {
              context.shouldOptimize = true;
            }
            // standalone pseudo-class is complete right after its name.
            if (isStandalonePseudo) {
              // standalone pseudo-classes must not have arguments
              // check if next token is opening parenthesis
              if (nextTokenValue === BRACKET.PARENTHESES.LEFT) {
                // eslint-disable-next-line max-len
                throw new Error(`${STANDALONE_ERROR_PREFIX.NO_ARGUMENTS}: ':${lowerCaseTokenValue}'`);
              }
              upToClosest(context, NODE.SELECTOR);
            }
          }
        } else if (isAbsolutePseudoClassNode(bufferNode)) {
          // collect absolute pseudo-class arg
          updateBufferNode(context, tokenValue);
        } else if (isRelativePseudoClassNode(bufferNode)) {
          initRelativeSubtree(context, tokenValue);
        }
        break;
      case TOKEN_TYPE.MARK:
        switch (tokenValue) {
          case COMMA:
            if (!bufferNode || typeof bufferNode !== 'undefined' && !nextTokenValue) {
              // consider the selector is invalid if there is no bufferNode yet (e.g. ', a')
              // or there is nothing after the comma while bufferNode is defined (e.g. 'div, ')
              throw new Error(`'${selector}' is not a valid selector`);
            } else if (isRegularSelectorNode(bufferNode)) {
              if (context.isAttributeBracketsOpen) {
                // the comma might be inside element attribute value
                // e.g. 'div[data-comma="0,1"]'
                updateBufferNode(context, tokenValue);
              } else {
                // new Selector should be collected to upper SelectorList
                upToClosest(context, NODE.SELECTOR_LIST);
              }
            } else if (isAbsolutePseudoClassNode(bufferNode)) {
              // the comma inside arg of absolute extended pseudo
              // e.g. 'div:xpath(//h3[contains(text(),"Share it!")]/..)'
              updateBufferNode(context, tokenValue);
            } else if (isSelectorNode(bufferNode)) {
              // new Selector should be collected to upper SelectorList
              // if parser position is on Selector node
              upToClosest(context, NODE.SELECTOR_LIST);
            }
            break;
          case SPACE:
            // it might be complex selector with extended pseudo-class inside it
            // and the space is between that complex selector and following regular selector
            // parser position is on ` ` before `span` now:
            // e.g. 'div:has(img).banner span'
            // so we need to check whether the new ast node should be added (example above)
            // or previous regular selector node should be updated
            if (isRegularSelectorNode(bufferNode)
            // no need to update the buffer node if attribute value is being parsed
            // e.g. 'div:not([id])[style="position: absolute; z-index: 10000;"]'
            // parser position inside attribute    ↑
            && !context.isAttributeBracketsOpen) {
              bufferNode = getUpdatedBufferNode(context);
            }
            if (isRegularSelectorNode(bufferNode)) {
              // standard selectors with white space between colon and name of pseudo
              // are invalid for native document.querySelectorAll() anyway,
              // so throwing the error here is better
              // than proper parsing of invalid selector and passing it further.
              // first of all do not check attributes
              // e.g. div[style="text-align: center"]
              if (!context.isAttributeBracketsOpen
              // check the space after the colon and before the pseudo
              // e.g. '.block: nth-child(2)
              && (prevTokenValue === COLON && nextTokenType === TOKEN_TYPE.WORD
              // or after the pseudo and before the opening parenthesis
              // e.g. '.block:nth-child (2)
              || prevTokenType === TOKEN_TYPE.WORD && nextTokenValue === BRACKET.PARENTHESES.LEFT)) {
                throw new Error(`'${selector}' is not a valid selector`);
              }
              // collect current tokenValue to value of RegularSelector
              // if it is the last token or standard selector continues after the space.
              // otherwise it will be skipped
              if (!nextTokenValue || doesRegularContinueAfterSpace(nextTokenType, nextTokenValue)
              // we also should collect space inside attribute value
              // e.g. `[onclick^="window.open ('https://example.com/share?url="]`
              // parser position             ↑
              || context.isAttributeBracketsOpen) {
                updateBufferNode(context, tokenValue);
              }
            }
            if (isAbsolutePseudoClassNode(bufferNode)) {
              // space inside extended pseudo-class arg
              // e.g. 'span:contains(some text)'
              updateBufferNode(context, tokenValue);
            }
            if (isRelativePseudoClassNode(bufferNode)) {
              // init with empty value RegularSelector
              // as the space is not needed for selector value
              // e.g. 'p:not( .content )'
              initRelativeSubtree(context);
            }
            if (isSelectorNode(bufferNode)) {
              // do NOT add RegularSelector if parser position on space BEFORE the comma in selector list
              // e.g. '.block:has(> img) , .banner)'
              if (doesRegularContinueAfterSpace(nextTokenType, nextTokenValue)) {
                // regular selector might be after the extended one.
                // extra space before combinator or selector should not be collected
                // e.g. '.banner:upward(2) .block'
                //      '.banner:upward(2) > .block'
                // so no tokenValue passed to addAnySelectorNode()
                addAstNodeByType(context, NODE.REGULAR_SELECTOR);
              }
            }
            break;
          case DESCENDANT_COMBINATOR:
          case CHILD_COMBINATOR:
          case NEXT_SIBLING_COMBINATOR:
          case SUBSEQUENT_SIBLING_COMBINATOR:
          case SEMICOLON:
          case SLASH:
          case BACKSLASH:
          case SINGLE_QUOTE:
          case DOUBLE_QUOTE:
          case CARET:
          case DOLLAR_SIGN:
          case BRACKET.CURLY.LEFT:
          case BRACKET.CURLY.RIGHT:
          case ASTERISK:
          case ID_MARKER:
          case CLASS_MARKER:
          case BRACKET.SQUARE.LEFT:
            // it might be complex selector with extended pseudo-class inside it
            // and the space is between that complex selector and following regular selector
            // e.g. 'div:has(img).banner'   // parser position is on `.` before `banner` now
            //      'div:has(img)[attr]'    // parser position is on `[` before `attr` now
            // so we need to check whether the new ast node should be added (example above)
            // or previous regular selector node should be updated
            if (COMBINATORS.includes(tokenValue)) {
              if (bufferNode === null) {
                // cases where combinator at very beginning of a selector
                // e.g. '> div'
                // or   '~ .banner'
                // or even '+js(overlay-buster)' which not a selector at all
                // but may be validated by FilterCompiler so error message should be appropriate
                throw new Error(`'${selector}' is not a valid selector`);
              }
              bufferNode = getUpdatedBufferNode(context);
            }
            if (bufferNode === null) {
              // no ast collecting has been started
              // e.g. '.banner > p'
              // or   '#top > div.ad'
              // or   '[class][style][attr]'
              // or   '*:not(span)'
              initAst(context, tokenValue);
              if (isAttributeOpening(tokenValue, prevTokenValue)) {
                // e.g. '[class^="banner-"]'
                context.isAttributeBracketsOpen = true;
              }
            } else if (isRegularSelectorNode(bufferNode)) {
              if (tokenValue === BRACKET.CURLY.LEFT && !(context.isAttributeBracketsOpen || context.isRegexpOpen)) {
                // e.g. 'div { content: "'
                throw new Error(`'${selector}' is not a valid selector`);
              }
              // collect the mark to the value of RegularSelector node
              updateBufferNode(context, tokenValue);
              if (isAttributeOpening(tokenValue, prevTokenValue)) {
                // needed for proper handling element attribute value with comma
                // e.g. 'div[data-comma="0,1"]'
                context.isAttributeBracketsOpen = true;
              }
            } else if (isAbsolutePseudoClassNode(bufferNode)) {
              // collect the mark to the arg of AbsolutePseudoClass node
              updateBufferNode(context, tokenValue);
              // 'isRegexpOpen' flag is needed for brackets balancing inside extended pseudo-class arg
              if (tokenValue === SLASH && context.extendedPseudoNamesStack.length > 0) {
                if (prevTokenValue === SLASH && prevToPrevTokenValue === BACKSLASH) {
                  // it may be specific url regexp pattern in arg of pseudo-class
                  // e.g. ':matches-css(background-image: /^url\(https:\/\/example\.org\//)'
                  // parser position is on final slash before `)`                        ↑
                  context.isRegexpOpen = false;
                } else if (prevTokenValue && prevTokenValue !== BACKSLASH) {
                  if (isRegexpOpening(context, prevTokenValue, getNodeValue(bufferNode))) {
                    context.isRegexpOpen = !context.isRegexpOpen;
                  } else {
                    // otherwise force `isRegexpOpen` flag to `false`
                    context.isRegexpOpen = false;
                  }
                }
              }
            } else if (isRelativePseudoClassNode(bufferNode)) {
              // add SelectorList to children of RelativePseudoClass node
              initRelativeSubtree(context, tokenValue);
              if (isAttributeOpening(tokenValue, prevTokenValue)) {
                // besides of creating the relative subtree
                // opening square bracket means start of attribute
                // e.g. 'div:not([class="content"])'
                //      'div:not([href*="window.print()"])'
                context.isAttributeBracketsOpen = true;
              }
            } else if (isSelectorNode(bufferNode)) {
              // after the extended pseudo closing parentheses
              // parser position is on Selector node
              // and regular selector can be after the extended one
              // e.g. '.banner:upward(2)> .block'
              // or   '.inner:nth-ancestor(1)~ .banner'
              if (COMBINATORS.includes(tokenValue)) {
                addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
              } else if (!context.isRegexpOpen) {
                // it might be complex selector with extended pseudo-class inside it.
                // parser position is on `.` now:
                // e.g. 'div:has(img).banner'
                // so we need to get last regular selector node and update its value
                bufferNode = getContextLastRegularSelectorNode(context);
                updateBufferNode(context, tokenValue);
                if (isAttributeOpening(tokenValue, prevTokenValue)) {
                  // handle attribute in compound selector after extended pseudo-class
                  // e.g. 'div:not(.top)[style="z-index: 10000;"]'
                  // parser position    ↑
                  context.isAttributeBracketsOpen = true;
                }
              }
            } else if (isSelectorListNode(bufferNode)) {
              // add Selector to SelectorList
              addAstNodeByType(context, NODE.SELECTOR);
              // and RegularSelector as it is always the first child of Selector
              addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
              if (isAttributeOpening(tokenValue, prevTokenValue)) {
                // handle simple attribute selector in selector list
                // e.g. '.banner, [class^="ad-"]'
                context.isAttributeBracketsOpen = true;
              }
            }
            break;
          case BRACKET.SQUARE.RIGHT:
            if (isRegularSelectorNode(bufferNode)) {
              // unescaped `]` in regular selector allowed only inside attribute value
              if (!context.isAttributeBracketsOpen && prevTokenValue !== BACKSLASH) {
                // e.g. 'div]'
                // eslint-disable-next-line max-len
                throw new Error(`'${selector}' is not a valid selector due to '${tokenValue}' after '${getNodeValue(bufferNode)}'`);
              }
              // needed for proper parsing regular selectors after the attributes with comma
              // e.g. 'div[data-comma="0,1"] > img'
              if (isAttributeClosing(context)) {
                context.isAttributeBracketsOpen = false;
                // reset attribute buffer on closing `]`
                context.attributeBuffer = '';
              }
              // collect the bracket to the value of RegularSelector node
              updateBufferNode(context, tokenValue);
            }
            if (isAbsolutePseudoClassNode(bufferNode)) {
              // :xpath() expended pseudo-class arg might contain square bracket
              // so it should be collected
              // e.g. 'div:xpath(//h3[contains(text(),"Share it!")]/..)'
              updateBufferNode(context, tokenValue);
            }
            break;
          case COLON:
            // No white space is allowed between the colon and the following name of the pseudo-class
            // https://www.w3.org/TR/selectors-4/#pseudo-classes
            // e.g. 'span: contains(text)'
            if (isWhiteSpaceChar(nextTokenValue) && nextToNextTokenValue && SUPPORTED_PSEUDO_CLASSES.includes(nextToNextTokenValue)) {
              throw new Error(`${NO_WHITESPACE_ERROR_PREFIX}: '${selector}'`);
            }
            if (bufferNode === null) {
              // no ast collecting has been started
              if (nextTokenValue === XPATH_PSEUDO_CLASS_MARKER) {
                // limit applying of "naked" :xpath pseudo-class
                // https://github.com/AdguardTeam/ExtendedCss/issues/115
                initAst(context, XPATH_PSEUDO_SELECTING_ROOT);
              } else if (nextTokenValue === UPWARD_PSEUDO_CLASS_MARKER || nextTokenValue === NTH_ANCESTOR_PSEUDO_CLASS_MARKER) {
                // selector should be specified before :nth-ancestor() or :upward()
                // e.g. ':nth-ancestor(3)'
                // or   ':upward(span)'
                throw new Error(`${NO_SELECTOR_ERROR_PREFIX} before :${nextTokenValue}() pseudo-class`);
              } else {
                // make it more obvious if selector starts with pseudo with no tag specified
                // e.g. ':has(a)' -> '*:has(a)'
                // or   ':empty'  -> '*:empty'
                initAst(context, ASTERISK);
              }

              // bufferNode should be updated for following checking
              bufferNode = getBufferNode(context);
            }
            if (isSelectorListNode(bufferNode)) {
              // bufferNode is SelectorList after comma has been parsed.
              // parser position is on colon now:
              // e.g. 'img,:not(.content)'
              addAstNodeByType(context, NODE.SELECTOR);
              // add empty value RegularSelector anyway as any selector should start with it
              // and check previous token on the next step
              addAstNodeByType(context, NODE.REGULAR_SELECTOR);
              // bufferNode should be updated for following checking
              bufferNode = getBufferNode(context);
            }
            if (isRegularSelectorNode(bufferNode)) {
              // it can be extended or standard pseudo
              // e.g. '#share, :contains(share it)'
              // or   'div,:hover'
              // of   'div:has(+:contains(text))'  // position is after '+'
              if (prevTokenValue && COMBINATORS.includes(prevTokenValue) || prevTokenValue === COMMA) {
                // case with colon at the start of string - e.g. ':contains(text)'
                // is covered by 'bufferNode === null' above at start of COLON checking
                updateBufferNode(context, ASTERISK);
              }
              handleNextTokenOnColon(context, selector, tokenValue, nextTokenValue, nextToNextTokenValue);
            }
            if (isSelectorNode(bufferNode)) {
              // e.g. 'div:contains(text):'
              if (!nextTokenValue) {
                throw new Error(`Invalid colon ':' at the end of selector: '${selector}'`);
              }
              // after the extended pseudo closing parentheses
              // parser position is on Selector node
              // and there is might be another extended selector.
              // parser position is on colon before 'upward':
              // e.g. 'p:contains(PR):upward(2)'
              if (isSupportedPseudoClass(nextTokenValue.toLowerCase())) {
                // if supported extended pseudo-class is next to colon
                // add ExtendedSelector to Selector children
                addAstNodeByType(context, NODE.EXTENDED_SELECTOR);
              } else if (nextTokenValue.toLowerCase() === REMOVE_PSEUDO_MARKER) {
                // :remove() pseudo-class should be handled before
                // as it is not about element selecting but actions with elements
                // e.g. '#banner:upward(2):remove()'
                throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`);
              } else {
                // otherwise it is standard pseudo after extended pseudo-class in complex selector
                // and colon should be collected to value of previous RegularSelector
                // e.g. 'body *:not(input)::selection'
                //      'input:matches-css(padding: 10):checked'
                bufferNode = getContextLastRegularSelectorNode(context);
                handleNextTokenOnColon(context, selector, tokenValue, nextTokenType, nextToNextTokenValue);
              }
            }
            if (isAbsolutePseudoClassNode(bufferNode)) {
              // :xpath() pseudo-class should be the last of extended pseudo-classes
              if (getNodeName(bufferNode) === XPATH_PSEUDO_CLASS_MARKER && nextTokenValue && SUPPORTED_PSEUDO_CLASSES.includes(nextTokenValue) && nextToNextTokenValue === BRACKET.PARENTHESES.LEFT) {
                throw new Error(`:xpath() pseudo-class should be the last in selector: '${selector}'`);
              }
              // collecting arg for absolute pseudo-class
              // e.g. 'div:matches-css(width:400px)'
              updateBufferNode(context, tokenValue);
            }
            if (isRelativePseudoClassNode(bufferNode)) {
              if (!nextTokenValue) {
                // e.g. 'div:has(:'
                throw new Error(`Invalid pseudo-class arg at the end of selector: '${selector}'`);
              }
              // make it more obvious if selector starts with pseudo with no tag specified
              // parser position is on colon inside :has() arg
              // e.g. 'div:has(:contains(text))'
              // or   'div:not(:empty)'
              initRelativeSubtree(context, ASTERISK);
              if (!isSupportedPseudoClass(nextTokenValue.toLowerCase())) {
                // collect the colon to value of RegularSelector
                // e.g. 'div:not(:empty)'
                updateBufferNode(context, tokenValue);
                // parentheses should be balanced only for functional pseudo-classes
                // e.g. '.yellow:not(:nth-child(3))'
                if (nextToNextTokenValue === BRACKET.PARENTHESES.LEFT) {
                  context.standardPseudoNamesStack.push(nextTokenValue);
                }
              } else {
                // add ExtendedSelector to Selector children
                // e.g. 'div:has(:contains(text))'
                upToClosest(context, NODE.SELECTOR);
                addAstNodeByType(context, NODE.EXTENDED_SELECTOR);
              }
            }
            break;
          case BRACKET.PARENTHESES.LEFT:
            // start of pseudo-class arg
            if (isAbsolutePseudoClassNode(bufferNode)) {
              // no brackets balancing needed inside
              // 1. :xpath() extended pseudo-class arg
              // 2. regexp arg for other extended pseudo-classes
              if (getNodeName(bufferNode) !== XPATH_PSEUDO_CLASS_MARKER && context.isRegexpOpen) {
                // if the parentheses is escaped it should be part of regexp
                // collect it to arg of AbsolutePseudoClass
                // e.g. 'div:matches-css(background-image: /^url\\("data:image\\/gif;base64.+/)'
                updateBufferNode(context, tokenValue);
              } else {
                // otherwise brackets should be balanced
                // e.g. 'div:xpath(//h3[contains(text(),"Share it!")]/..)'
                context.extendedPseudoBracketsStack.push(tokenValue);
                // eslint-disable-next-line max-len
                if (context.extendedPseudoBracketsStack.length > context.extendedPseudoNamesStack.length) {
                  updateBufferNode(context, tokenValue);
                }
              }
            }
            if (isRegularSelectorNode(bufferNode)) {
              // continue RegularSelector value collecting for standard pseudo-classes
              // e.g. '.banner:where(div)'
              if (context.standardPseudoNamesStack.length > 0) {
                updateBufferNode(context, tokenValue);
                context.standardPseudoBracketsStack.push(tokenValue);
              }
              // parentheses inside attribute value should be part of RegularSelector value
              // e.g. 'div:not([href*="window.print()"])'   <-- parser position
              // is on the `(` after `print`       ↑
              if (context.isAttributeBracketsOpen) {
                updateBufferNode(context, tokenValue);
              }
            }
            if (isRelativePseudoClassNode(bufferNode)) {
              // save opening bracket for balancing
              // e.g. 'div:not()'  // position is on `(`
              context.extendedPseudoBracketsStack.push(tokenValue);
            }
            break;
          case BRACKET.PARENTHESES.RIGHT:
            if (isAbsolutePseudoClassNode(bufferNode)) {
              // no brackets balancing needed inside
              // 1. :xpath() extended pseudo-class arg
              // 2. regexp arg for other extended pseudo-classes
              if (getNodeName(bufferNode) !== XPATH_PSEUDO_CLASS_MARKER && context.isRegexpOpen) {
                // if closing bracket is part of regexp
                // simply save it to pseudo-class arg
                updateBufferNode(context, tokenValue);
              } else {
                // remove stacked open parentheses for brackets balance
                // e.g. 'h3:contains((Ads))'
                // or   'div:xpath(//h3[contains(text(),"Share it!")]/..)'
                context.extendedPseudoBracketsStack.pop();
                if (getNodeName(bufferNode) !== XPATH_PSEUDO_CLASS_MARKER) {
                  // for all other absolute pseudo-classes except :xpath()
                  // remove stacked name of extended pseudo-class
                  context.extendedPseudoNamesStack.pop();
                  // eslint-disable-next-line max-len
                  if (context.extendedPseudoBracketsStack.length > context.extendedPseudoNamesStack.length) {
                    // if brackets stack is not empty yet,
                    // save tokenValue to arg of AbsolutePseudoClass
                    // parser position on first closing bracket after 'Ads':
                    // e.g. 'h3:contains((Ads))'
                    updateBufferNode(context, tokenValue);
                  } else if (context.extendedPseudoBracketsStack.length >= 0 && context.extendedPseudoNamesStack.length >= 0) {
                    // assume it is combined extended pseudo-classes
                    // parser position on first closing bracket after 'advert':
                    // e.g. 'div:has(.banner, :contains(advert))'
                    upToClosest(context, NODE.SELECTOR);
                  }
                } else {
                  // for :xpath()
                  // eslint-disable-next-line max-len
                  if (context.extendedPseudoBracketsStack.length < context.extendedPseudoNamesStack.length) {
                    // remove stacked name of extended pseudo-class
                    // if there are less brackets than pseudo-class names
                    // with means last removes bracket was closing for pseudo-class
                    context.extendedPseudoNamesStack.pop();
                  } else {
                    // otherwise the bracket is part of arg
                    updateBufferNode(context, tokenValue);
                  }
                }
              }
            }
            if (isRegularSelectorNode(bufferNode)) {
              if (context.isAttributeBracketsOpen) {
                // parentheses inside attribute value should be part of RegularSelector value
                // e.g. 'div:not([href*="window.print()"])'   <-- parser position
                // is on the `)` after `print(`       ↑
                updateBufferNode(context, tokenValue);
              } else if (context.standardPseudoNamesStack.length > 0 && context.standardPseudoBracketsStack.length > 0) {
                // standard pseudo-class was processing.
                // collect the closing bracket to value of RegularSelector
                // parser position is on bracket after 'class' now:
                // e.g. 'div:where(.class)'
                updateBufferNode(context, tokenValue);
                // remove bracket and pseudo name from stacks
                context.standardPseudoBracketsStack.pop();
                const lastStandardPseudo = context.standardPseudoNamesStack.pop();
                if (!lastStandardPseudo) {
                  // standard pseudo should be in standardPseudoNamesStack
                  // as related to standardPseudoBracketsStack
                  throw new Error(`Parsing error. Invalid selector: ${selector}`);
                }
                // Disallow :has() after regular pseudo-elements
                // https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c54 [3]
                if (Object.values(REGULAR_PSEUDO_ELEMENTS).includes(lastStandardPseudo)
                // check token which is next to closing parentheses and token after it
                // parser position is on bracket after 'foo' now:
                // e.g. '::part(foo):has(.a)'
                && nextTokenValue === COLON && nextToNextTokenValue && HAS_PSEUDO_CLASS_MARKERS.includes(nextToNextTokenValue)) {
                  // eslint-disable-next-line max-len
                  throw new Error(`Usage of :${nextToNextTokenValue}() pseudo-class is not allowed after any regular pseudo-element: '${lastStandardPseudo}'`);
                }
              } else {
                // extended pseudo-class was processing.
                // e.g. 'div:has(h3)'
                // remove bracket and pseudo name from stacks
                context.extendedPseudoBracketsStack.pop();
                context.extendedPseudoNamesStack.pop();
                upToClosest(context, NODE.EXTENDED_SELECTOR);
                // go to upper selector for possible selector continuation after extended pseudo-class
                // e.g. 'div:has(h3) > img'
                upToClosest(context, NODE.SELECTOR);
              }
            }
            if (isSelectorNode(bufferNode)) {
              // after inner extended pseudo-class bufferNode is Selector.
              // parser position is on last bracket now:
              // e.g. 'div:has(.banner, :contains(ads))'
              context.extendedPseudoBracketsStack.pop();
              context.extendedPseudoNamesStack.pop();
              upToClosest(context, NODE.EXTENDED_SELECTOR);
              upToClosest(context, NODE.SELECTOR);
            }
            if (isRelativePseudoClassNode(bufferNode)) {
              // save opening bracket for balancing
              // e.g. 'div:not()'  // position is on `)`
              // context.extendedPseudoBracketsStack.push(tokenValue);
              if (context.extendedPseudoNamesStack.length > 0 && context.extendedPseudoBracketsStack.length > 0) {
                context.extendedPseudoBracketsStack.pop();
                context.extendedPseudoNamesStack.pop();
              }
            }
            break;
          case LINE_FEED:
          case FORM_FEED:
          case CARRIAGE_RETURN:
            // such characters at start and end of selector should be trimmed
            // so is there is one them among tokens, it is not valid selector
            throw new Error(`'${selector}' is not a valid selector`);
          case TAB:
            // allow tab only inside attribute value
            // as there are such valid rules in filter lists
            // e.g. 'div[style^="margin-right: auto;	text-align: left;',
            // parser position                      ↑
            if (isRegularSelectorNode(bufferNode) && context.isAttributeBracketsOpen) {
              updateBufferNode(context, tokenValue);
            } else {
              // otherwise not valid
              throw new Error(`'${selector}' is not a valid selector`);
            }
        }
        break;
      // no default statement for Marks as they are limited to SUPPORTED_SELECTOR_MARKS
      // and all other symbol combinations are tokenized as Word
      // so error for invalid Word will be thrown later while element selecting by parsed ast
      default:
        throw new Error(`Unknown type of token: '${tokenValue}'`);
    }
    i += 1;
  }
  if (context.ast === null) {
    throw new Error(`'${selector}' is not a valid selector`);
  }
  if (context.extendedPseudoNamesStack.length > 0 || context.extendedPseudoBracketsStack.length > 0) {
    // eslint-disable-next-line max-len
    throw new Error(`Unbalanced brackets for extended pseudo-class: '${getLast(context.extendedPseudoNamesStack)}'`);
  }
  if (context.isAttributeBracketsOpen) {
    throw new Error(`Unbalanced attribute brackets in selector: '${selector}'`);
  }
  return context.shouldOptimize ? optimizeAst(context.ast) : context.ast;
};

const natives = {
  MutationObserver: window.MutationObserver || window.WebKitMutationObserver
};

/**
 * Class NativeTextContent is needed to intercept and save the native Node textContent getter
 * for proper work of :contains() pseudo-class as it may be mocked.
 *
 * @see {@link https://github.com/AdguardTeam/ExtendedCss/issues/127}
 */
class NativeTextContent {
  /**
   * Native Node.
   */

  /**
   * Native Node textContent getter.
   */

  /**
   * Stores native node.
   */
  constructor() {
    this.nativeNode = window.Node || Node;
  }

  /**
   * Sets native Node textContext getter to `getter` class field.
   */
  setGetter() {
    var _Object$getOwnPropert;
    this.getter = (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(this.nativeNode.prototype, 'textContent')) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.get;
  }
}
const nativeTextContent = new NativeTextContent();

/**
 * Returns textContent of passed domElement.
 *
 * @param domElement DOM element.
 *
 * @returns DOM element textContent.
 */
const getNodeTextContent = domElement => {
  if (nativeTextContent.getter) {
    return nativeTextContent.getter.apply(domElement);
  }
  // if ExtendedCss.init() has not been executed and there is no nodeTextContentGetter,
  // use simple approach, especially when init() is not really needed, e.g. local tests
  return domElement.textContent || '';
};

/**
 * Returns element selector text based on it's tagName and attributes.
 *
 * @param element DOM element.
 *
 * @returns String representation of `element`.
 */
const getElementSelectorDesc = element => {
  let selectorText = element.tagName.toLowerCase();
  selectorText += Array.from(element.attributes).map(attr => {
    return `[${attr.name}="${element.getAttribute(attr.name)}"]`;
  }).join('');
  return selectorText;
};

/**
 * Returns path to a DOM element as a selector string.
 *
 * @param inputEl Input element.
 *
 * @returns String path to a DOM element.
 * @throws An error if `inputEl` in not instance of `Element`.
 */
const getElementSelectorPath = inputEl => {
  if (!(inputEl instanceof Element)) {
    throw new Error('Function received argument with wrong type');
  }
  let el;
  el = inputEl;
  const path = [];
  // we need to check '!!el' first because it is possible
  // that some ancestor of the inputEl was removed before it
  while (!!el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.id && typeof el.id === 'string') {
      selector += `#${el.id}`;
      path.unshift(selector);
      break;
    }
    let sibling = el;
    let nth = 1;
    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling;
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName.toLowerCase() === selector) {
        nth += 1;
      }
    }
    if (nth !== 1) {
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(' > ');
};

/**
 * Checks whether the element is instance of HTMLElement.
 *
 * @param element Element to check.
 *
 * @returns True if `element` is HTMLElement.
 */
const isHtmlElement = element => {
  return element instanceof HTMLElement;
};

/**
 * Takes `element` and returns its parent element.
 *
 * @param element Element.
 * @param errorMessage Optional error message to throw.
 *
 * @returns Parent of `element`.
 * @throws An error if element has no parent element.
 */
const getParent = (element, errorMessage) => {
  const parentElement = element.parentElement;
  if (!parentElement) {
    throw new Error(errorMessage || 'Element does no have parent element');
  }
  return parentElement;
};

/**
 * Checks whether the `error` has `message` property which type is string.
 *
 * @param error Error object.
 *
 * @returns True if `error` has message.
 */
const extended_css_esm_isErrorWithMessage = error => {
  return typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string';
};

/**
 * Converts `maybeError` to error object with message.
 *
 * @param maybeError Possible error.
 *
 * @returns Error object with defined `message` property.
 */
const extended_css_esm_toErrorWithMessage = maybeError => {
  if (extended_css_esm_isErrorWithMessage(maybeError)) {
    return maybeError;
  }
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case if there is an error happened during the maybeError stringifying
    // like with circular references for example
    return new Error(String(maybeError));
  }
};

/**
 * Returns error message from `error`.
 * May be helpful to handle caught errors.
 *
 * @param error Error object.
 *
 * @returns Message of `error`.
 */
const extended_css_esm_getErrorMessage = error => {
  return extended_css_esm_toErrorWithMessage(error).message;
};

const extended_css_esm_logger = {
  /**
   * Safe console.error version.
   */
  error: typeof console !== 'undefined' && console.error && console.error.bind ? console.error.bind(window.console) : console.error,
  /**
   * Safe console.info version.
   */
  info: typeof console !== 'undefined' && console.info && console.info.bind ? console.info.bind(window.console) : console.info
};

/**
 * Returns string without suffix.
 *
 * @param str Input string.
 * @param suffix Needed to remove.
 *
 * @returns String without suffix.
 */
const removeSuffix = (str, suffix) => {
  const index = str.indexOf(suffix, str.length - suffix.length);
  if (index >= 0) {
    return str.substring(0, index);
  }
  return str;
};

/**
 * Replaces all `pattern`s with `replacement` in `input` string.
 * String.replaceAll() polyfill because it is not supported by old browsers, e.g. Chrome 55.
 *
 * @see {@link https://caniuse.com/?search=String.replaceAll}
 *
 * @param input Input string to process.
 * @param pattern Find in the input string.
 * @param replacement Replace the pattern with.
 *
 * @returns Modified string.
 */
const replaceAll = (input, pattern, replacement) => {
  if (!input) {
    return input;
  }
  return input.split(pattern).join(replacement);
};

/**
 * Converts string pattern to regular expression.
 *
 * @param str String to convert.
 *
 * @returns Regular expression converted from pattern `str`.
 */
const toRegExp = str => {
  if (str.startsWith(SLASH) && str.endsWith(SLASH)) {
    return new RegExp(str.slice(1, -1));
  }
  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped);
};

/**
 * Converts any simple type value to string type,
 * e.g. `undefined` -> `'undefined'`.
 *
 * @param value Any type value.
 *
 * @returns String representation of `value`.
 */
const convertTypeIntoString = value => {
  let output;
  switch (value) {
    case undefined:
      output = 'undefined';
      break;
    case null:
      output = 'null';
      break;
    default:
      output = value.toString();
  }
  return output;
};

/**
 * Converts instance of string value into other simple types,
 * e.g. `'null'` -> `null`, `'true'` -> `true`.
 *
 * @param value String-type value.
 *
 * @returns Its own type representation of string-type `value`.
 */
const convertTypeFromString = value => {
  const numValue = Number(value);
  let output;
  if (!Number.isNaN(numValue)) {
    output = numValue;
  } else {
    switch (value) {
      case 'undefined':
        output = undefined;
        break;
      case 'null':
        output = null;
        break;
      case 'true':
        output = true;
        break;
      case 'false':
        output = false;
        break;
      default:
        output = value;
    }
  }
  return output;
};

const SAFARI_USER_AGENT_REGEXP = /\sVersion\/(\d{2}\.\d)(.+\s|\s)(Safari)\//;
const isSafariBrowser = SAFARI_USER_AGENT_REGEXP.test(navigator.userAgent);

/**
 * Checks whether the browser userAgent is supported.
 *
 * @param userAgent User agent of browser.
 *
 * @returns False only for Internet Explorer.
 */
const isUserAgentSupported = userAgent => {
  // do not support Internet Explorer
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
    return false;
  }
  return true;
};

/**
 * Checks whether the current browser is supported.
 *
 * @returns False for Internet Explorer, otherwise true.
 */
const isBrowserSupported = () => {
  return isUserAgentSupported(navigator.userAgent);
};

/**
 * CSS_PROPERTY is needed for style values normalization.
 *
 * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
 * during ExtendedCss import into other libraries.
 */
const CSS_PROPERTY = {
  BACKGROUND: 'background',
  BACKGROUND_IMAGE: 'background-image',
  CONTENT: 'content',
  OPACITY: 'opacity'
};
const REGEXP_ANY_SYMBOL = '.*';
const REGEXP_WITH_FLAGS_REGEXP = /^\s*\/.*\/[gmisuy]*\s*$/;
/**
 * Removes quotes for specified content value.
 *
 * For example, content style declaration with `::before` can be set as '-' (e.g. unordered list)
 * which displayed as simple dash `-` with no quotes.
 * But CSSStyleDeclaration.getPropertyValue('content') will return value
 * wrapped into quotes, e.g. '"-"', which should be removed
 * because filters maintainers does not use any quotes in real rules.
 *
 * @param str Input string.
 *
 * @returns String with no quotes for content value.
 */
const removeContentQuotes = str => {
  return str.replace(/^(["'])([\s\S]*)\1$/, '$2');
};

/**
 * Adds quotes for specified background url value.
 *
 * If background-image is specified **without** quotes:
 * e.g. 'background: url(data:image/gif;base64,R0lGODlhAQA7)'.
 *
 * CSSStyleDeclaration.getPropertyValue('background-image') may return value **with** quotes:
 * e.g. 'background: url("data:image/gif;base64,R0lGODlhAQA7")'.
 *
 * So we add quotes for compatibility since filters maintainers might use quotes in real rules.
 *
 * @param str Input string.
 *
 * @returns String with unified quotes for background url value.
 */
const addUrlPropertyQuotes = str => {
  if (!str.includes('url("')) {
    const re = /url\((.*?)\)/g;
    return str.replace(re, 'url("$1")');
  }
  return str;
};

/**
 * Adds quotes to url arg for consistent property value matching.
 */
const addUrlQuotesTo = {
  regexpArg: str => {
    // e.g. /^url\\([a-z]{4}:[a-z]{5}/
    // or /^url\\(data\\:\\image\\/gif;base64.+/
    const re = /(\^)?url(\\)?\\\((\w|\[\w)/g;
    return str.replace(re, '$1url$2\\(\\"?$3');
  },
  noneRegexpArg: addUrlPropertyQuotes
};

/**
 * Escapes regular expression string.
 *
 * @see {@link https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp}
 *
 * @param str Input string.
 *
 * @returns Escaped regular expression string.
 */
const escapeRegExp = str => {
  // should be escaped . * + ? ^ $ { } ( ) | [ ] / \
  // except of * | ^
  const specials = ['.', '+', '?', '$', '{', '}', '(', ')', '[', ']', '\\', '/'];
  const specialsRegex = new RegExp(`[${specials.join('\\')}]`, 'g');
  return str.replace(specialsRegex, '\\$&');
};

/**
 * Converts :matches-css() arg property value match to regexp.
 *
 * @param rawValue Style match value pattern.
 *
 * @returns Arg of :matches-css() converted to regular expression.
 */
const convertStyleMatchValueToRegexp = rawValue => {
  let value;
  if (rawValue.startsWith(SLASH) && rawValue.endsWith(SLASH)) {
    // For regex patterns double quotes `"` and backslashes `\` should be escaped
    value = addUrlQuotesTo.regexpArg(rawValue);
    value = value.slice(1, -1);
  } else {
    // For non-regex patterns parentheses `(` `)` and square brackets `[` `]`
    // should be unescaped, because their escaping in filter rules is required
    value = addUrlQuotesTo.noneRegexpArg(rawValue);
    value = value.replace(/\\([\\()[\]"])/g, '$1');
    value = escapeRegExp(value);
    // e.g. div:matches-css(background-image: url(data:*))
    value = replaceAll(value, ASTERISK, REGEXP_ANY_SYMBOL);
  }
  return new RegExp(value, 'i');
};

/**
 * Makes some properties values compatible.
 *
 * @param propertyName Name of style property.
 * @param propertyValue Value of style property.
 *
 * @returns Normalized values for some CSS properties.
 */
const normalizePropertyValue = (propertyName, propertyValue) => {
  let normalized = '';
  switch (propertyName) {
    case CSS_PROPERTY.BACKGROUND:
    case CSS_PROPERTY.BACKGROUND_IMAGE:
      // sometimes url property does not have quotes
      // so we add them for consistent matching
      normalized = addUrlPropertyQuotes(propertyValue);
      break;
    case CSS_PROPERTY.CONTENT:
      normalized = removeContentQuotes(propertyValue);
      break;
    case CSS_PROPERTY.OPACITY:
      // https://bugs.webkit.org/show_bug.cgi?id=93445
      normalized = isSafariBrowser ? (Math.round(parseFloat(propertyValue) * 100) / 100).toString() : propertyValue;
      break;
    default:
      normalized = propertyValue;
  }
  return normalized;
};

/**
 * Returns domElement style property value
 * by css property name and standard pseudo-element.
 *
 * @param domElement DOM element.
 * @param propertyName CSS property name.
 * @param regularPseudoElement Standard pseudo-element — '::before', '::after' etc.
 *
 * @returns String containing the value of a specified CSS property.
 */
const getComputedStylePropertyValue = (domElement, propertyName, regularPseudoElement) => {
  const style = window.getComputedStyle(domElement, regularPseudoElement);
  const propertyValue = style.getPropertyValue(propertyName);
  return normalizePropertyValue(propertyName, propertyValue);
};
/**
 * Parses arg of absolute pseudo-class into 'name' and 'value' if set.
 *
 * Used for :matches-css() - with COLON as separator,
 * for :matches-attr() and :matches-property() - with EQUAL_SIGN as separator.
 *
 * @param pseudoArg Arg of pseudo-class.
 * @param separator Divider symbol.
 *
 * @returns Parsed 'matches' pseudo-class arg data.
 */
const getPseudoArgData = (pseudoArg, separator) => {
  const index = pseudoArg.indexOf(separator);
  let name;
  let value;
  if (index > -1) {
    name = pseudoArg.substring(0, index).trim();
    value = pseudoArg.substring(index + 1).trim();
  } else {
    name = pseudoArg;
  }
  return {
    name,
    value
  };
};
/**
 * Parses :matches-css() pseudo-class arg
 * where regular pseudo-element can be a part of arg
 * e.g. 'div:matches-css(before, color: rgb(255, 255, 255))'    <-- obsolete `:matches-css-before()`.
 *
 * @param pseudoName Pseudo-class name.
 * @param rawArg Pseudo-class arg.
 *
 * @returns Parsed :matches-css() pseudo-class arg data.
 * @throws An error on invalid `rawArg`.
 */
const parseStyleMatchArg = (pseudoName, rawArg) => {
  const _getPseudoArgData = getPseudoArgData(rawArg, COMMA),
    name = _getPseudoArgData.name,
    value = _getPseudoArgData.value;
  let regularPseudoElement = name;
  let styleMatchArg = value;

  // check whether the string part before the separator is valid regular pseudo-element,
  // otherwise `regularPseudoElement` is null, and `styleMatchArg` is rawArg
  if (!Object.values(REGULAR_PSEUDO_ELEMENTS).includes(name)) {
    regularPseudoElement = null;
    styleMatchArg = rawArg;
  }
  if (!styleMatchArg) {
    throw new Error(`Required style property argument part is missing in :${pseudoName}() arg: '${rawArg}'`);
  }

  // if regularPseudoElement is not `null`
  if (regularPseudoElement) {
    // pseudo-element should have two colon marks for Window.getComputedStyle() due to the syntax:
    // https://www.w3.org/TR/selectors-4/#pseudo-element-syntax
    // ':matches-css(before, content: ads)' ->> '::before'
    regularPseudoElement = `${COLON}${COLON}${regularPseudoElement}`;
  }
  return {
    regularPseudoElement,
    styleMatchArg
  };
};

/**
 * Checks whether the domElement is matched by :matches-css() arg.
 *
 * @param argsData Pseudo-class name, arg, and dom element to check.
 *
 @returns True if DOM element is matched.
 * @throws An error on invalid pseudo-class arg.
 */
const isStyleMatched = argsData => {
  const pseudoName = argsData.pseudoName,
    pseudoArg = argsData.pseudoArg,
    domElement = argsData.domElement;
  const _parseStyleMatchArg = parseStyleMatchArg(pseudoName, pseudoArg),
    regularPseudoElement = _parseStyleMatchArg.regularPseudoElement,
    styleMatchArg = _parseStyleMatchArg.styleMatchArg;
  const _getPseudoArgData2 = getPseudoArgData(styleMatchArg, COLON),
    matchName = _getPseudoArgData2.name,
    matchValue = _getPseudoArgData2.value;
  if (!matchName || !matchValue) {
    throw new Error(`Required property name or value is missing in :${pseudoName}() arg: '${styleMatchArg}'`);
  }
  let valueRegexp;
  try {
    valueRegexp = convertStyleMatchValueToRegexp(matchValue);
  } catch (e) {
    extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
    throw new Error(`Invalid argument of :${pseudoName}() pseudo-class: '${styleMatchArg}'`);
  }
  const value = getComputedStylePropertyValue(domElement, matchName, regularPseudoElement);
  return valueRegexp && valueRegexp.test(value);
};

/**
 * Validates string arg for :matches-attr() and :matches-property().
 *
 * @param arg Pseudo-class arg.
 *
 * @returns True if 'matches' pseudo-class string arg is valid.
 */
const validateStrMatcherArg = arg => {
  if (arg.includes(SLASH)) {
    return false;
  }
  if (!/^[\w-]+$/.test(arg)) {
    return false;
  }
  return true;
};

/**
 * Returns valid arg for :matches-attr() and :matcher-property().
 *
 * @param rawArg Arg pattern.
 * @param isWildcardAllowed Flag for wildcard (`*`) using as pseudo-class arg (defaults to false).
 *
 * @returns Valid arg for :matches-attr() and :matcher-property().
 * @throws An error on invalid `rawArg`.
 */
const getValidMatcherArg = function (rawArg) {
  let isWildcardAllowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // if rawArg is missing for pseudo-class
  // e.g. :matches-attr()
  // error will be thrown before getValidMatcherArg() is called:
  // name or arg is missing in AbsolutePseudoClass

  let arg;
  if (rawArg.length > 1 && rawArg.startsWith(DOUBLE_QUOTE) && rawArg.endsWith(DOUBLE_QUOTE)) {
    rawArg = rawArg.slice(1, -1);
  }
  if (rawArg === '') {
    // e.g. :matches-property("")
    throw new Error('Argument should be specified. Empty arg is invalid.');
  }
  if (rawArg.startsWith(SLASH) && rawArg.endsWith(SLASH)) {
    // e.g. :matches-property("//")
    if (rawArg.length > 2) {
      arg = toRegExp(rawArg);
    } else {
      throw new Error(`Invalid regexp: '${rawArg}'`);
    }
  } else if (rawArg.includes(ASTERISK)) {
    if (rawArg === ASTERISK && !isWildcardAllowed) {
      // e.g. :matches-attr(*)
      throw new Error(`Argument should be more specific than ${rawArg}`);
    }
    arg = replaceAll(rawArg, ASTERISK, REGEXP_ANY_SYMBOL);
    arg = new RegExp(arg);
  } else {
    if (!validateStrMatcherArg(rawArg)) {
      throw new Error(`Invalid argument: '${rawArg}'`);
    }
    arg = rawArg;
  }
  return arg;
};
/**
 * Parses pseudo-class argument and returns parsed data.
 *
 * @param pseudoName Extended pseudo-class name.
 * @param pseudoArg Extended pseudo-class argument.
 *
 * @returns Parsed pseudo-class argument data.
 * @throws An error if attribute name is missing in pseudo-class arg.
 */
const getRawMatchingData = (pseudoName, pseudoArg) => {
  const _getPseudoArgData3 = getPseudoArgData(pseudoArg, EQUAL_SIGN),
    rawName = _getPseudoArgData3.name,
    rawValue = _getPseudoArgData3.value;
  if (!rawName) {
    throw new Error(`Required attribute name is missing in :${pseudoName} arg: ${pseudoArg}`);
  }
  return {
    rawName,
    rawValue
  };
};

/**
 * Checks whether the domElement is matched by :matches-attr() arg.
 *
 * @param argsData Pseudo-class name, arg, and dom element to check.
 *
 @returns True if DOM element is matched.
 * @throws An error on invalid arg of pseudo-class.
 */
const isAttributeMatched = argsData => {
  const pseudoName = argsData.pseudoName,
    pseudoArg = argsData.pseudoArg,
    domElement = argsData.domElement;
  const elementAttributes = domElement.attributes;
  // no match if dom element has no attributes
  if (elementAttributes.length === 0) {
    return false;
  }
  const _getRawMatchingData = getRawMatchingData(pseudoName, pseudoArg),
    rawAttrName = _getRawMatchingData.rawName,
    rawAttrValue = _getRawMatchingData.rawValue;
  let attrNameMatch;
  try {
    attrNameMatch = getValidMatcherArg(rawAttrName);
  } catch (e) {
    const errorMessage = extended_css_esm_getErrorMessage(e);
    extended_css_esm_logger.error(errorMessage);
    throw new SyntaxError(errorMessage);
  }
  let isMatched = false;
  let i = 0;
  while (i < elementAttributes.length && !isMatched) {
    const attr = elementAttributes[i];
    if (!attr) {
      break;
    }
    const isNameMatched = attrNameMatch instanceof RegExp ? attrNameMatch.test(attr.name) : attrNameMatch === attr.name;
    if (!rawAttrValue) {
      // for rules with no attribute value specified
      // e.g. :matches-attr("/regex/") or :matches-attr("attr-name")
      isMatched = isNameMatched;
    } else {
      let attrValueMatch;
      try {
        attrValueMatch = getValidMatcherArg(rawAttrValue);
      } catch (e) {
        const errorMessage = extended_css_esm_getErrorMessage(e);
        extended_css_esm_logger.error(errorMessage);
        throw new SyntaxError(errorMessage);
      }
      const isValueMatched = attrValueMatch instanceof RegExp ? attrValueMatch.test(attr.value) : attrValueMatch === attr.value;
      isMatched = isNameMatched && isValueMatched;
    }
    i += 1;
  }
  return isMatched;
};

/**
 * Parses raw :matches-property() arg which may be chain of properties.
 *
 * @param input Argument of :matches-property().
 *
 * @returns Arg of :matches-property() as array of strings or regular expressions.
 * @throws An error on invalid chain.
 */
const parseRawPropChain = input => {
  if (input.length > 1 && input.startsWith(DOUBLE_QUOTE) && input.endsWith(DOUBLE_QUOTE)) {
    input = input.slice(1, -1);
  }
  const chainChunks = input.split(DOT);
  const chainPatterns = [];
  let patternBuffer = '';
  let isRegexpPattern = false;
  let i = 0;
  while (i < chainChunks.length) {
    const chunk = getItemByIndex(chainChunks, i, `Invalid pseudo-class arg: '${input}'`);
    if (chunk.startsWith(SLASH) && chunk.endsWith(SLASH) && chunk.length > 2) {
      // regexp pattern with no dot in it, e.g. /propName/
      chainPatterns.push(chunk);
    } else if (chunk.startsWith(SLASH)) {
      // if chunk is a start of regexp pattern
      isRegexpPattern = true;
      patternBuffer += chunk;
    } else if (chunk.endsWith(SLASH)) {
      isRegexpPattern = false;
      // restore dot removed while splitting
      // e.g. testProp./.{1,5}/
      patternBuffer += `.${chunk}`;
      chainPatterns.push(patternBuffer);
      patternBuffer = '';
    } else {
      // if there are few dots in regexp pattern
      // so chunk might be in the middle of it
      if (isRegexpPattern) {
        patternBuffer += chunk;
      } else {
        // otherwise it is string pattern
        chainPatterns.push(chunk);
      }
    }
    i += 1;
  }
  if (patternBuffer.length > 0) {
    throw new Error(`Invalid regexp property pattern '${input}'`);
  }
  const chainMatchPatterns = chainPatterns.map(pattern => {
    if (pattern.length === 0) {
      // e.g. '.prop.id' or 'nested..test'
      throw new Error(`Empty pattern '${pattern}' is invalid in chain '${input}'`);
    }
    let validPattern;
    try {
      validPattern = getValidMatcherArg(pattern, true);
    } catch (e) {
      extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
      throw new Error(`Invalid property pattern '${pattern}' in property chain '${input}'`);
    }
    return validPattern;
  });
  return chainMatchPatterns;
};
/**
 * Checks if the property exists in the base object (recursively).
 *
 * @param base Element to check.
 * @param chain Array of objects - parsed string property chain.
 * @param output Result accumulator (defaults to []).
 *
 * @returns Array of parsed data — representation of `base`-related `chain`.
 */
const filterRootsByRegexpChain = function (base, chain) {
  let output = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const tempProp = getFirst(chain);
  if (chain.length === 1) {
    let key;
    for (key in base) {
      if (tempProp instanceof RegExp) {
        if (tempProp.test(key)) {
          output.push({
            base,
            prop: key,
            value: base[key]
          });
        }
      } else if (tempProp === key) {
        output.push({
          base,
          prop: tempProp,
          value: base[key]
        });
      }
    }
    return output;
  }

  // if there is a regexp prop in input chain
  // e.g. 'unit./^ad.+/.src' for 'unit.ad-1gf2.src unit.ad-fgd34.src'),
  // every base keys should be tested by regexp and it can be more that one results
  if (tempProp instanceof RegExp) {
    const nextProp = chain.slice(1);
    const baseKeys = [];
    for (const key in base) {
      if (tempProp.test(key)) {
        baseKeys.push(key);
      }
    }
    baseKeys.forEach(key => {
      var _Object$getOwnPropert;
      const item = (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(base, key)) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.value;
      filterRootsByRegexpChain(item, nextProp, output);
    });
  }
  if (base && typeof tempProp === 'string') {
    var _Object$getOwnPropert2;
    const nextBase = (_Object$getOwnPropert2 = Object.getOwnPropertyDescriptor(base, tempProp)) === null || _Object$getOwnPropert2 === void 0 ? void 0 : _Object$getOwnPropert2.value;
    chain = chain.slice(1);
    if (nextBase !== undefined) {
      filterRootsByRegexpChain(nextBase, chain, output);
    }
  }
  return output;
};

/**
 * Checks whether the domElement is matched by :matches-property() arg.
 *
 * @param argsData Pseudo-class name, arg, and dom element to check.
 *
 @returns True if DOM element is matched.
 * @throws An error on invalid prop in chain.
 */
const isPropertyMatched = argsData => {
  const pseudoName = argsData.pseudoName,
    pseudoArg = argsData.pseudoArg,
    domElement = argsData.domElement;
  const _getRawMatchingData2 = getRawMatchingData(pseudoName, pseudoArg),
    rawPropertyName = _getRawMatchingData2.rawName,
    rawPropertyValue = _getRawMatchingData2.rawValue;

  // chained property name cannot include '/' or '.'
  // so regex prop names with such escaped characters are invalid
  if (rawPropertyName.includes('\\/') || rawPropertyName.includes('\\.')) {
    throw new Error(`Invalid :${pseudoName} name pattern: ${rawPropertyName}`);
  }
  let propChainMatches;
  try {
    propChainMatches = parseRawPropChain(rawPropertyName);
  } catch (e) {
    const errorMessage = extended_css_esm_getErrorMessage(e);
    extended_css_esm_logger.error(errorMessage);
    throw new SyntaxError(errorMessage);
  }
  const ownerObjArr = filterRootsByRegexpChain(domElement, propChainMatches);
  if (ownerObjArr.length === 0) {
    return false;
  }
  let isMatched = true;
  if (rawPropertyValue) {
    let propValueMatch;
    try {
      propValueMatch = getValidMatcherArg(rawPropertyValue);
    } catch (e) {
      const errorMessage = extended_css_esm_getErrorMessage(e);
      extended_css_esm_logger.error(errorMessage);
      throw new SyntaxError(errorMessage);
    }
    if (propValueMatch) {
      for (let i = 0; i < ownerObjArr.length; i += 1) {
        var _ownerObjArr$i;
        const realValue = (_ownerObjArr$i = ownerObjArr[i]) === null || _ownerObjArr$i === void 0 ? void 0 : _ownerObjArr$i.value;
        if (propValueMatch instanceof RegExp) {
          isMatched = propValueMatch.test(convertTypeIntoString(realValue));
        } else {
          // handle 'null' and 'undefined' property values set as string
          if (realValue === 'null' || realValue === 'undefined') {
            isMatched = propValueMatch === realValue;
            break;
          }
          isMatched = convertTypeFromString(propValueMatch) === realValue;
        }
        if (isMatched) {
          break;
        }
      }
    }
  }
  return isMatched;
};

/**
 * Checks whether the textContent is matched by :contains arg.
 *
 * @param argsData Pseudo-class name, arg, and dom element to check.
 *
 @returns True if DOM element is matched.
 * @throws An error on invalid arg of pseudo-class.
 */
const isTextMatched = argsData => {
  const pseudoName = argsData.pseudoName,
    pseudoArg = argsData.pseudoArg,
    domElement = argsData.domElement;
  const textContent = getNodeTextContent(domElement);
  let isTextContentMatched;
  let pseudoArgToMatch = pseudoArg;
  if (pseudoArgToMatch.startsWith(SLASH) && REGEXP_WITH_FLAGS_REGEXP.test(pseudoArgToMatch)) {
    // regexp arg
    const flagsIndex = pseudoArgToMatch.lastIndexOf('/');
    const flagsStr = pseudoArgToMatch.substring(flagsIndex + 1);
    pseudoArgToMatch = pseudoArgToMatch.substring(0, flagsIndex + 1).slice(1, -1).replace(/\\([\\"])/g, '$1');
    let regex;
    try {
      regex = new RegExp(pseudoArgToMatch, flagsStr);
    } catch (e) {
      throw new Error(`Invalid argument of :${pseudoName}() pseudo-class: ${pseudoArg}`);
    }
    isTextContentMatched = regex.test(textContent);
  } else {
    // none-regexp arg
    pseudoArgToMatch = pseudoArgToMatch.replace(/\\([\\()[\]"])/g, '$1');
    isTextContentMatched = textContent.includes(pseudoArgToMatch);
  }
  return isTextContentMatched;
};

/**
 * Validates number arg for :nth-ancestor() and :upward() pseudo-classes.
 *
 * @param rawArg Raw arg of pseudo-class.
 * @param pseudoName Pseudo-class name.
 *
 * @returns Valid number arg for :nth-ancestor() and :upward().
 * @throws An error on invalid `rawArg`.
 */
const getValidNumberAncestorArg = (rawArg, pseudoName) => {
  const deep = Number(rawArg);
  if (Number.isNaN(deep) || deep < 1 || deep >= 256) {
    throw new Error(`Invalid argument of :${pseudoName} pseudo-class: '${rawArg}'`);
  }
  return deep;
};

/**
 * Returns nth ancestor by 'deep' number arg OR undefined if ancestor range limit exceeded.
 *
 * @param domElement DOM element to find ancestor for.
 * @param nth Depth up to needed ancestor.
 * @param pseudoName Pseudo-class name.
 *
 * @returns Ancestor element found in DOM, or null if not found.
 * @throws An error on invalid `nth` arg.
 */
const getNthAncestor = (domElement, nth, pseudoName) => {
  let ancestor = null;
  let i = 0;
  while (i < nth) {
    ancestor = domElement.parentElement;
    if (!ancestor) {
      throw new Error(`Out of DOM: Argument of :${pseudoName}() pseudo-class is too big — '${nth}'.`);
    }
    domElement = ancestor;
    i += 1;
  }
  return ancestor;
};

/**
 * Validates standard CSS selector.
 *
 * @param selector Standard selector.
 *
 * @returns True if standard CSS selector is valid.
 */
const validateStandardSelector = selector => {
  let isValid;
  try {
    document.querySelectorAll(selector);
    isValid = true;
  } catch (e) {
    isValid = false;
  }
  return isValid;
};

/**
 * Wrapper to run matcher `callback` with `args`
 * and throw error with `errorMessage` if `callback` run fails.
 *
 * @param callback Matcher callback.
 * @param argsData Args needed for matcher callback.
 * @param errorMessage Error message.
 *
 * @returns True if `callback` returns true.
 * @throws An error if `callback` fails.
 */
const matcherWrapper = (callback, argsData, errorMessage) => {
  let isMatched;
  try {
    isMatched = callback(argsData);
  } catch (e) {
    extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
    throw new Error(errorMessage);
  }
  return isMatched;
};

/**
 * Generates common error message to throw while matching element `propDesc`.
 *
 * @param propDesc Text to describe what element 'prop' pseudo-class is trying to match.
 * @param pseudoName Pseudo-class name.
 * @param pseudoArg Pseudo-class arg.
 *
 * @returns Generated error message string.
 */
const getAbsolutePseudoError = (propDesc, pseudoName, pseudoArg) => {
  // eslint-disable-next-line max-len
  return `${MATCHING_ELEMENT_ERROR_PREFIX} ${propDesc}, may be invalid :${pseudoName}() pseudo-class arg: '${pseudoArg}'`;
};

/**
 * Checks whether the domElement is matched by absolute extended pseudo-class argument.
 *
 * @param domElement Page element.
 * @param pseudoName Pseudo-class name.
 * @param pseudoArg Pseudo-class arg.
 *
 * @returns True if `domElement` is matched by absolute pseudo-class.
 * @throws An error on unknown absolute pseudo-class.
 */
const isMatchedByAbsolutePseudo = (domElement, pseudoName, pseudoArg) => {
  let argsData;
  let errorMessage;
  let callback;
  switch (pseudoName) {
    case CONTAINS_PSEUDO:
    case HAS_TEXT_PSEUDO:
    case ABP_CONTAINS_PSEUDO:
      callback = isTextMatched;
      argsData = {
        pseudoName,
        pseudoArg,
        domElement
      };
      errorMessage = getAbsolutePseudoError('text content', pseudoName, pseudoArg);
      break;
    case MATCHES_CSS_PSEUDO:
    case MATCHES_CSS_AFTER_PSEUDO:
    case MATCHES_CSS_BEFORE_PSEUDO:
      callback = isStyleMatched;
      argsData = {
        pseudoName,
        pseudoArg,
        domElement
      };
      errorMessage = getAbsolutePseudoError('style', pseudoName, pseudoArg);
      break;
    case MATCHES_ATTR_PSEUDO_CLASS_MARKER:
      callback = isAttributeMatched;
      argsData = {
        domElement,
        pseudoName,
        pseudoArg
      };
      errorMessage = getAbsolutePseudoError('attributes', pseudoName, pseudoArg);
      break;
    case MATCHES_PROPERTY_PSEUDO_CLASS_MARKER:
      callback = isPropertyMatched;
      argsData = {
        domElement,
        pseudoName,
        pseudoArg
      };
      errorMessage = getAbsolutePseudoError('properties', pseudoName, pseudoArg);
      break;
    default:
      throw new Error(`Unknown absolute pseudo-class :${pseudoName}()`);
  }
  return matcherWrapper(callback, argsData, errorMessage);
};
const findByAbsolutePseudoPseudo = {
  /**
   * Returns list of nth ancestors relative to every dom node from domElements list.
   *
   * @param domElements DOM elements.
   * @param rawPseudoArg Number arg of :nth-ancestor() or :upward() pseudo-class.
   * @param pseudoName Pseudo-class name.
   *
   * @returns Array of ancestor DOM elements.
   */
  nthAncestor: (domElements, rawPseudoArg, pseudoName) => {
    const deep = getValidNumberAncestorArg(rawPseudoArg, pseudoName);
    const ancestors = domElements.map(domElement => {
      let ancestor = null;
      try {
        ancestor = getNthAncestor(domElement, deep, pseudoName);
      } catch (e) {
        extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
      }
      return ancestor;
    }).filter(isHtmlElement);
    return ancestors;
  },
  /**
   * Returns list of elements by xpath expression, evaluated on every dom node from domElements list.
   *
   * @param domElements DOM elements.
   * @param rawPseudoArg Arg of :xpath() pseudo-class.
   *
   * @returns Array of DOM elements matched by xpath expression.
   */
  xpath: (domElements, rawPseudoArg) => {
    const foundElements = domElements.map(domElement => {
      const result = [];
      let xpathResult;
      try {
        xpathResult = document.evaluate(rawPseudoArg, domElement, null, window.XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      } catch (e) {
        extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
        throw new Error(`Invalid argument of :xpath() pseudo-class: '${rawPseudoArg}'`);
      }
      let node = xpathResult.iterateNext();
      while (node) {
        if (isHtmlElement(node)) {
          result.push(node);
        }
        node = xpathResult.iterateNext();
      }
      return result;
    });
    return flatten(foundElements);
  },
  /**
   * Returns list of closest ancestors relative to every dom node from domElements list.
   *
   * @param domElements DOM elements.
   * @param rawPseudoArg Standard selector arg of :upward() pseudo-class.
   *
   * @returns Array of closest ancestor DOM elements.
   * @throws An error if `rawPseudoArg` is not a valid standard selector.
   */
  upward: (domElements, rawPseudoArg) => {
    if (!validateStandardSelector(rawPseudoArg)) {
      throw new Error(`Invalid argument of :upward pseudo-class: '${rawPseudoArg}'`);
    }
    const closestAncestors = domElements.map(domElement => {
      // closest to parent element should be found
      // otherwise `.base:upward(.base)` will return itself too, not only ancestor
      const parent = domElement.parentElement;
      if (!parent) {
        return null;
      }
      return parent.closest(rawPseudoArg);
    }).filter(isHtmlElement);
    return closestAncestors;
  }
};

/**
 * Calculated selector text which is needed to :has(), :is() and :not() pseudo-classes.
 * Contains calculated part (depends on the processed element)
 * and value of RegularSelector which is next to selector by.
 *
 * Native Document.querySelectorAll() does not select exact descendant elements
 * but match all page elements satisfying the selector,
 * so extra specification is needed for proper descendants selection
 * e.g. 'div:has(> img)'.
 *
 * Its calculation depends on extended selector.
 */

/**
 * Combined `:scope` pseudo-class and **child** combinator — `:scope>`.
 */
const scopeDirectChildren = `${SCOPE_CSS_PSEUDO_CLASS}${CHILD_COMBINATOR}`;

/**
 * Combined `:scope` pseudo-class and **descendant** combinator — `:scope `.
 */
const scopeAnyChildren = `${SCOPE_CSS_PSEUDO_CLASS}${DESCENDANT_COMBINATOR}`;

/**
 * Type for relative pseudo-class helpers args.
 */

/**
 * Returns the first of RegularSelector child node for `selectorNode`.
 *
 * @param selectorNode Ast Selector node.
 * @param pseudoName Name of relative pseudo-class.
 *
 * @returns Ast RegularSelector node.
 */
const getFirstInnerRegularChild = (selectorNode, pseudoName) => {
  return getFirstRegularChild(selectorNode.children, `RegularSelector is missing for :${pseudoName}() pseudo-class`);
};

// TODO: fix for <forgiving-relative-selector-list>
// https://github.com/AdguardTeam/ExtendedCss/issues/154
/**
 * Checks whether the element has all relative elements specified by pseudo-class arg.
 * Used for :has() pseudo-class.
 *
 * @param argsData Relative pseudo-class helpers args data.
 *
 * @returns True if **all selectors** from argsData.relativeSelectorList is **matched** for argsData.element.
 */
const hasRelativesBySelectorList = argsData => {
  const element = argsData.element,
    relativeSelectorList = argsData.relativeSelectorList,
    pseudoName = argsData.pseudoName;
  return relativeSelectorList.children
  // Array.every() is used here as each Selector node from SelectorList should exist on page
  .every(selectorNode => {
    // selectorList.children always starts with regular selector as any selector generally
    const relativeRegularSelector = getFirstInnerRegularChild(selectorNode, pseudoName);
    let specifiedSelector = '';
    let rootElement = null;
    const regularSelector = getNodeValue(relativeRegularSelector);
    if (regularSelector.startsWith(NEXT_SIBLING_COMBINATOR) || regularSelector.startsWith(SUBSEQUENT_SIBLING_COMBINATOR)) {
      /**
       * For matching the element by "element:has(+ next-sibling)" and "element:has(~ sibling)"
       * we check whether the element's parentElement has specific direct child combination,
       * e.g. 'h1:has(+ .share)' -> `h1Node.parentElement.querySelectorAll(':scope > h1 + .share')`.
       *
       * @see {@link https://www.w3.org/TR/selectors-4/#relational}
       */
      rootElement = element.parentElement;
      const elementSelectorText = getElementSelectorDesc(element);
      specifiedSelector = `${scopeDirectChildren}${elementSelectorText}${regularSelector}`;
    } else if (regularSelector === ASTERISK) {
      /**
       * :scope specification is needed for proper descendants selection
       * as native element.querySelectorAll() does not select exact element descendants
       * e.g. 'a:has(> img)' -> `aNode.querySelectorAll(':scope > img')`.
       *
       * For 'any selector' as arg of relative simplicity should be set for all inner elements
       * e.g. 'div:has(*)' -> `divNode.querySelectorAll(':scope *')`
       * which means empty div with no child element.
       */
      rootElement = element;
      specifiedSelector = `${scopeAnyChildren}${ASTERISK}`;
    } else {
      /**
       * As it described above, inner elements should be found using `:scope` pseudo-class
       * e.g. 'a:has(> img)' -> `aNode.querySelectorAll(':scope > img')`
       * OR '.block(div > span)' -> `blockClassNode.querySelectorAll(':scope div > span')`.
       */
      specifiedSelector = `${scopeAnyChildren}${regularSelector}`;
      rootElement = element;
    }
    if (!rootElement) {
      throw new Error(`Selection by :${pseudoName}() pseudo-class is not possible`);
    }
    let relativeElements;
    try {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      relativeElements = getElementsForSelectorNode(selectorNode, rootElement, specifiedSelector);
    } catch (e) {
      extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
      // fail for invalid selector
      throw new Error(`Invalid selector for :${pseudoName}() pseudo-class: '${regularSelector}'`);
    }
    return relativeElements.length > 0;
  });
};

/**
 * Checks whether the element is an any element specified by pseudo-class arg.
 * Used for :is() pseudo-class.
 *
 * @param argsData Relative pseudo-class helpers args data.
 *
 * @returns True if **any selector** from argsData.relativeSelectorList is **matched** for argsData.element.
 */
const isAnyElementBySelectorList = argsData => {
  const element = argsData.element,
    relativeSelectorList = argsData.relativeSelectorList,
    pseudoName = argsData.pseudoName;
  return relativeSelectorList.children
  // Array.some() is used here as any selector from selector list should exist on page
  .some(selectorNode => {
    // selectorList.children always starts with regular selector
    const relativeRegularSelector = getFirstInnerRegularChild(selectorNode, pseudoName);

    /**
     * For checking the element by 'div:is(.banner)'
     * we check whether the element's parentElement has any specific direct child.
     */
    const rootElement = getParent(element, `Selection by :${pseudoName}() pseudo-class is not possible`);

    /**
     * So we calculate the element "description" by it's tagname and attributes for targeting
     * and use it to specify the selection
     * e.g. `div:is(.banner)` --> `divNode.parentElement.querySelectorAll(':scope > .banner')`.
     */
    const specifiedSelector = `${scopeDirectChildren}${getNodeValue(relativeRegularSelector)}`;
    let anyElements;
    try {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      anyElements = getElementsForSelectorNode(selectorNode, rootElement, specifiedSelector);
    } catch (e) {
      // do not fail on invalid selectors for :is()
      return false;
    }

    // TODO: figure out how to handle complex selectors with extended pseudo-classes
    // (check readme - extended-css-is-limitations)
    // because `element` and `anyElements` may be from different DOM levels
    return anyElements.includes(element);
  });
};

/**
 * Checks whether the element is not an element specified by pseudo-class arg.
 * Used for :not() pseudo-class.
 *
 * @param argsData Relative pseudo-class helpers args data.
 *
 * @returns True if **any selector** from argsData.relativeSelectorList is **not matched** for argsData.element.
 */
const notElementBySelectorList = argsData => {
  const element = argsData.element,
    relativeSelectorList = argsData.relativeSelectorList,
    pseudoName = argsData.pseudoName;
  return relativeSelectorList.children
  // Array.every() is used here as element should not be selected by any selector from selector list
  .every(selectorNode => {
    // selectorList.children always starts with regular selector
    const relativeRegularSelector = getFirstInnerRegularChild(selectorNode, pseudoName);

    /**
     * For checking the element by 'div:not([data="content"])
     * we check whether the element's parentElement has any specific direct child.
     */
    const rootElement = getParent(element, `Selection by :${pseudoName}() pseudo-class is not possible`);

    /**
     * So we calculate the element "description" by it's tagname and attributes for targeting
     * and use it to specify the selection
     * e.g. `div:not(.banner)` --> `divNode.parentElement.querySelectorAll(':scope > .banner')`.
     */
    const specifiedSelector = `${scopeDirectChildren}${getNodeValue(relativeRegularSelector)}`;
    let anyElements;
    try {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      anyElements = getElementsForSelectorNode(selectorNode, rootElement, specifiedSelector);
    } catch (e) {
      // fail on invalid selectors for :not()
      extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
      // eslint-disable-next-line max-len
      throw new Error(`Invalid selector for :${pseudoName}() pseudo-class: '${getNodeValue(relativeRegularSelector)}'`);
    }

    // TODO: figure out how to handle up-looking pseudo-classes inside :not()
    // (check readme - extended-css-not-limitations)
    // because `element` and `anyElements` may be from different DOM levels
    return !anyElements.includes(element);
  });
};

/**
 * Selects dom elements by value of RegularSelector.
 *
 * @param regularSelectorNode RegularSelector node.
 * @param root Root DOM element.
 * @param specifiedSelector {@link SpecifiedSelector}.
 *
 * @returns Array of DOM elements.
 * @throws An error if RegularSelector node value is an invalid selector.
 */
const getByRegularSelector = (regularSelectorNode, root, specifiedSelector) => {
  const selectorText = specifiedSelector ? specifiedSelector : getNodeValue(regularSelectorNode);
  let selectedElements = [];
  try {
    selectedElements = Array.from(root.querySelectorAll(selectorText));
  } catch (e) {
    throw new Error(`Error: unable to select by '${selectorText}' — ${extended_css_esm_getErrorMessage(e)}`);
  }
  return selectedElements;
};

/**
 * Returns list of dom elements filtered or selected by ExtendedSelector node.
 *
 * @param domElements Array of DOM elements.
 * @param extendedSelectorNode ExtendedSelector node.
 *
 * @returns Array of DOM elements.
 * @throws An error on unknown pseudo-class,
 * absent or invalid arg of extended pseudo-class, etc.
 */
const getByExtendedSelector = (domElements, extendedSelectorNode) => {
  let foundElements = [];
  const extendedPseudoClassNode = getPseudoClassNode(extendedSelectorNode);
  const pseudoName = getNodeName(extendedPseudoClassNode);
  if (isAbsolutePseudoClass(pseudoName)) {
    // absolute extended pseudo-classes should have an argument
    const absolutePseudoArg = getNodeValue(extendedPseudoClassNode, `Missing arg for :${pseudoName}() pseudo-class`);
    if (pseudoName === NTH_ANCESTOR_PSEUDO_CLASS_MARKER) {
      // :nth-ancestor()
      foundElements = findByAbsolutePseudoPseudo.nthAncestor(domElements, absolutePseudoArg, pseudoName);
    } else if (pseudoName === XPATH_PSEUDO_CLASS_MARKER) {
      // :xpath()
      try {
        document.createExpression(absolutePseudoArg, null);
      } catch (e) {
        throw new Error(`Invalid argument of :${pseudoName}() pseudo-class: '${absolutePseudoArg}'`);
      }
      foundElements = findByAbsolutePseudoPseudo.xpath(domElements, absolutePseudoArg);
    } else if (pseudoName === UPWARD_PSEUDO_CLASS_MARKER) {
      // :upward()
      if (Number.isNaN(Number(absolutePseudoArg))) {
        // so arg is selector, not a number
        foundElements = findByAbsolutePseudoPseudo.upward(domElements, absolutePseudoArg);
      } else {
        foundElements = findByAbsolutePseudoPseudo.nthAncestor(domElements, absolutePseudoArg, pseudoName);
      }
    } else {
      // all other absolute extended pseudo-classes
      // e.g. contains, matches-attr, etc.
      foundElements = domElements.filter(element => {
        return isMatchedByAbsolutePseudo(element, pseudoName, absolutePseudoArg);
      });
    }
  } else if (isRelativePseudoClass(pseudoName)) {
    const relativeSelectorList = getRelativeSelectorListNode(extendedPseudoClassNode);
    let relativePredicate;
    switch (pseudoName) {
      case HAS_PSEUDO_CLASS_MARKER:
      case ABP_HAS_PSEUDO_CLASS_MARKER:
        relativePredicate = element => hasRelativesBySelectorList({
          element,
          relativeSelectorList,
          pseudoName
        });
        break;
      case IS_PSEUDO_CLASS_MARKER:
        relativePredicate = element => isAnyElementBySelectorList({
          element,
          relativeSelectorList,
          pseudoName
        });
        break;
      case NOT_PSEUDO_CLASS_MARKER:
        relativePredicate = element => notElementBySelectorList({
          element,
          relativeSelectorList,
          pseudoName
        });
        break;
      default:
        throw new Error(`Unknown relative pseudo-class: '${pseudoName}'`);
    }
    foundElements = domElements.filter(relativePredicate);
  } else if (isStandalonePseudoClass(pseudoName)) {
    let standalonePredicate;
    switch (pseudoName) {
      case EMPTY_TRIMMED_PSEUDO_CLASS_MARKER:
        standalonePredicate = element => {
          const textContent = element.textContent ?? '';
          // String.prototype.trim() removes all Unicode whitespace per the ECMAScript spec,
          // including \u00A0 (non-breaking space / &nbsp;).
          // See https://tc39.es/ecma262/#sec-string.prototype.trim
          return textContent.trim().length === 0;
        };
        break;
      default:
        throw new Error(`Unknown standalone pseudo-class: '${pseudoName}'`);
    }
    foundElements = domElements.filter(standalonePredicate);
  } else {
    // extra check is parser missed something
    throw new Error(`Unknown extended pseudo-class: '${pseudoName}'`);
  }
  return foundElements;
};

/**
 * Returns list of dom elements which is selected by RegularSelector value.
 *
 * @param domElements Array of DOM elements.
 * @param regularSelectorNode RegularSelector node.
 *
 * @returns Array of DOM elements.
 * @throws An error if RegularSelector has not value.
 */
const getByFollowingRegularSelector = (domElements, regularSelectorNode) => {
  // array of arrays because of Array.map() later
  let foundElements = [];
  const value = getNodeValue(regularSelectorNode);
  if (value.startsWith(CHILD_COMBINATOR)) {
    // e.g. div:has(> img) > .banner
    foundElements = domElements.map(root => {
      const specifiedSelector = `${SCOPE_CSS_PSEUDO_CLASS}${value}`;
      return getByRegularSelector(regularSelectorNode, root, specifiedSelector);
    });
  } else if (value.startsWith(NEXT_SIBLING_COMBINATOR) || value.startsWith(SUBSEQUENT_SIBLING_COMBINATOR)) {
    // e.g. div:has(> img) + .banner
    // or   div:has(> img) ~ .banner
    foundElements = domElements.map(element => {
      const rootElement = element.parentElement;
      if (!rootElement) {
        // do not throw error if there in no parent for element
        // e.g. '*:contains(text)' selects `html` which has no parentElement
        return [];
      }
      const elementSelectorText = getElementSelectorDesc(element);
      const specifiedSelector = `${scopeDirectChildren}${elementSelectorText}${value}`;
      const selected = getByRegularSelector(regularSelectorNode, rootElement, specifiedSelector);
      return selected;
    });
  } else {
    // space-separated regular selector after extended one
    // e.g. div:has(> img) .banner
    foundElements = domElements.map(root => {
      const specifiedSelector = `${scopeAnyChildren}${getNodeValue(regularSelectorNode)}`;
      return getByRegularSelector(regularSelectorNode, root, specifiedSelector);
    });
  }
  // foundElements should be flattened
  // as getByRegularSelector() returns elements array, and Array.map() collects them to array
  return flatten(foundElements);
};

/**
 * Returns elements nodes for Selector node.
 * As far as any selector always starts with regular part,
 * it selects by RegularSelector first and checks found elements later.
 *
 * Relative pseudo-classes has it's own subtree so getElementsForSelectorNode is called recursively.
 *
 * 'specifiedSelector' is needed for :has(), :is(), and :not() pseudo-classes
 * as native querySelectorAll() does not select exact element descendants even if it is called on 'div'
 * e.g. ':scope' specification is needed for proper descendants selection for 'div:has(> img)'.
 * So we check `divNode.querySelectorAll(':scope > img').length > 0`.
 *
 * @param selectorNode Selector node.
 * @param root Root DOM element.
 * @param specifiedSelector Needed element specification.
 *
 * @returns Array of DOM elements.
 * @throws An error if there is no selectorNodeChild.
 */
const getElementsForSelectorNode = (selectorNode, root, specifiedSelector) => {
  let selectedElements = [];
  let i = 0;
  while (i < selectorNode.children.length) {
    const selectorNodeChild = getItemByIndex(selectorNode.children, i, 'selectorNodeChild should be specified');
    if (i === 0) {
      // any selector always starts with regular selector
      selectedElements = getByRegularSelector(selectorNodeChild, root, specifiedSelector);
    } else if (isExtendedSelectorNode(selectorNodeChild)) {
      // filter previously selected elements by next selector nodes
      selectedElements = getByExtendedSelector(selectedElements, selectorNodeChild);
    } else if (isRegularSelectorNode(selectorNodeChild)) {
      selectedElements = getByFollowingRegularSelector(selectedElements, selectorNodeChild);
    }
    i += 1;
  }
  return selectedElements;
};

/**
 * Selects elements by ast.
 *
 * @param ast Ast of parsed selector.
 * @param doc Document.
 *
 * @returns Array of DOM elements.
 */
const selectElementsByAst = function (ast) {
  let doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  const selectedElements = [];
  // ast root is SelectorList node;
  // it has Selector nodes as children which should be processed separately
  ast.children.forEach(selectorNode => {
    selectedElements.push(...getElementsForSelectorNode(selectorNode, doc));
  });
  // selectedElements should be flattened as it is array of arrays with elements
  const uniqueElements = [...new Set(flatten(selectedElements))];
  return uniqueElements;
};

/**
 * Class of ExtCssDocument is needed for caching.
 * For making cache related to each new instance of class, not global.
 */
class ExtCssDocument {
  /**
   * Cache with selectors and their AST parsing results.
   */

  /**
   * Creates new ExtCssDocument and inits new `astCache`.
   */
  constructor() {
    this.astCache = new Map();
  }

  /**
   * Saves selector and it's ast to cache.
   *
   * @param selector Standard or extended selector.
   * @param ast Selector ast.
   */
  saveAstToCache(selector, ast) {
    this.astCache.set(selector, ast);
  }

  /**
   * Returns ast from cache for given selector.
   *
   * @param selector Standard or extended selector.
   *
   * @returns Previously parsed ast found in cache, or null if not found.
   */
  getAstFromCache(selector) {
    const cachedAst = this.astCache.get(selector) || null;
    return cachedAst;
  }

  /**
   * Returns selector ast:
   * - if cached ast exists — returns it;
   * - if no cached ast — saves newly parsed ast to cache and returns it.
   *
   * @param selector Standard or extended selector.
   *
   * @returns Ast for `selector`.
   */
  getSelectorAst(selector) {
    let ast = this.getAstFromCache(selector);
    if (!ast) {
      ast = parse(selector);
    }
    this.saveAstToCache(selector, ast);
    return ast;
  }

  /**
   * Selects elements by selector.
   *
   * @param selector Standard or extended selector.
   *
   * @returns Array of DOM elements.
   */
  querySelectorAll(selector) {
    const ast = this.getSelectorAst(selector);
    return selectElementsByAst(ast);
  }
}
const extCssDocument = new ExtCssDocument();

function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}

/**
 * Converts array of `entries` to object.
 * Object.fromEntries() polyfill because it is not supported by old browsers, e.g. Chrome 55.
 * Only first two elements of `entries` array matter, other will be skipped silently.
 *
 * @see {@link https://caniuse.com/?search=Object.fromEntries}
 *
 * @param entries Array of pairs.
 *
 * @returns Object converted from `entries`.
 */
const getObjectFromEntries = entries => {
  const object = {};
  entries.forEach(el => {
    const _el = _slicedToArray(el, 2),
      key = _el[0],
      value = _el[1];
    object[key] = value;
  });
  return object;
};

const DEBUG_PSEUDO_PROPERTY_KEY = 'debug';

/**
 * Checks the presence of :remove() pseudo-class and validates it while parsing the selector part of css rule.
 *
 * @param rawSelector Selector which may contain :remove() pseudo-class.
 *
 * @returns Parsed selector data with selector and styles.
 * @throws An error on invalid :remove() position.
 */
const parseRemoveSelector = rawSelector => {
  /**
   * No error will be thrown on invalid selector as it will be validated later
   * so it's better to explicitly specify 'any' selector for :remove() pseudo-class by '*',
   * e.g. '.banner > *:remove()' instead of '.banner > :remove()'.
   */

  // ':remove()'
  // eslint-disable-next-line max-len
  const VALID_REMOVE_MARKER = `${COLON}${REMOVE_PSEUDO_MARKER}${BRACKET.PARENTHESES.LEFT}${BRACKET.PARENTHESES.RIGHT}`;
  // ':remove(' - needed for validation rules like 'div:remove(2)'
  const INVALID_REMOVE_MARKER = `${COLON}${REMOVE_PSEUDO_MARKER}${BRACKET.PARENTHESES.LEFT}`;
  let selector;
  let shouldRemove = false;
  const firstIndex = rawSelector.indexOf(VALID_REMOVE_MARKER);
  if (firstIndex === 0) {
    // e.g. ':remove()'
    throw new Error(`${REMOVE_ERROR_PREFIX.NO_TARGET_SELECTOR}: '${rawSelector}'`);
  } else if (firstIndex > 0) {
    if (firstIndex !== rawSelector.lastIndexOf(VALID_REMOVE_MARKER)) {
      // rule with more than one :remove() pseudo-class is invalid
      // e.g. '.block:remove() > .banner:remove()'
      throw new Error(`${REMOVE_ERROR_PREFIX.MULTIPLE_USAGE}: '${rawSelector}'`);
    } else if (firstIndex + VALID_REMOVE_MARKER.length < rawSelector.length) {
      // remove pseudo-class should be last in the rule
      // e.g. '.block:remove():upward(2)'
      throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_POSITION}: '${rawSelector}'`);
    } else {
      // valid :remove() pseudo-class position
      selector = rawSelector.substring(0, firstIndex);
      shouldRemove = true;
    }
  } else if (rawSelector.includes(INVALID_REMOVE_MARKER)) {
    // it is not valid if ':remove()' is absent in rule but just ':remove(' is present
    // e.g. 'div:remove(0)'
    throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${rawSelector}'`);
  } else {
    // there is no :remove() pseudo-class in rule
    selector = rawSelector;
  }
  const stylesOfSelector = shouldRemove ? [{
    property: REMOVE_PSEUDO_MARKER,
    value: PSEUDO_PROPERTY_POSITIVE_VALUE
  }] : [];
  return {
    selector,
    stylesOfSelector
  };
};

/**
 * Parses cropped selector part found before `{`.
 *
 * @param selectorBuffer Buffered selector to parse.
 * @param extCssDoc Needed for caching of selector ast.
 *
 * @returns Parsed validation data for cropped part of stylesheet which may be a selector.
 * @throws An error on unsupported CSS features, e.g. at-rules.
 */
const parseSelectorRulePart = (selectorBuffer, extCssDoc) => {
  let selector = selectorBuffer.trim();
  if (selector.startsWith(AT_RULE_MARKER)) {
    throw new Error(`${NO_AT_RULE_ERROR_PREFIX}: '${selector}'.`);
  }
  let removeSelectorData;
  try {
    removeSelectorData = parseRemoveSelector(selector);
  } catch (e) {
    extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
    throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`);
  }
  let stylesOfSelector = [];
  let success = false;
  let ast;
  try {
    selector = removeSelectorData.selector;
    stylesOfSelector = removeSelectorData.stylesOfSelector;
    // validate found selector by parsing it to ast
    // so if it is invalid error will be thrown
    ast = extCssDoc.getSelectorAst(selector);
    success = true;
  } catch (e) {
    success = false;
  }
  return {
    success,
    selector,
    ast,
    stylesOfSelector
  };
};

/**
 * Creates a map for storing raw results of css rules parsing.
 * Used for merging styles for same selector.
 *
 * @returns Map where **key** is `selector`
 * and **value** is object with `ast` and `styles`.
 */
const createRawResultsMap = () => {
  return new Map();
};

/**
 * Saves rules data for unique selectors.
 *
 * @param rawResults Previously collected results of parsing.
 * @param rawRuleData Parsed rule data.
 *
 * @throws An error if there is no rawRuleData.styles or rawRuleData.ast.
 */
const saveToRawResults = (rawResults, rawRuleData) => {
  const selector = rawRuleData.selector,
    ast = rawRuleData.ast,
    rawStyles = rawRuleData.rawStyles;
  if (!rawStyles) {
    throw new Error(`No style declaration for selector: '${selector}'`);
  }
  if (!ast) {
    throw new Error(`No ast parsed for selector: '${selector}'`);
  }
  const storedRuleData = rawResults.get(selector);
  if (!storedRuleData) {
    rawResults.set(selector, {
      ast,
      styles: rawStyles
    });
  } else {
    storedRuleData.styles.push(...rawStyles);
  }
};

/**
 * Checks whether the 'remove' property positively set in styles
 * with only one positive value - 'true'.
 *
 * @param styles Array of styles.
 *
 * @returns True if there is 'remove' property with 'true' value in `styles`.
 */
const isRemoveSetInStyles = styles => {
  return styles.some(s => {
    return s.property === REMOVE_PSEUDO_MARKER && s.value === PSEUDO_PROPERTY_POSITIVE_VALUE;
  });
};

/**
 * Returns 'debug' property value which is set in styles.
 *
 * @param styles Array of styles.
 *
 * @returns Value of 'debug' property if it is set in `styles`,
 * or `undefined` if the property is not found.
 */
const getDebugStyleValue = styles => {
  const debugStyle = styles.find(s => {
    return s.property === DEBUG_PSEUDO_PROPERTY_KEY;
  });
  return debugStyle === null || debugStyle === void 0 ? void 0 : debugStyle.value;
};

/**
 * Prepares final RuleData.
 * Handles `debug` and `remove` in raw rule data styles.
 *
 * @param rawRuleData Raw data of selector css rule parsing.
 *
 * @returns Parsed ExtendedCss rule data.
 * @throws An error if rawRuleData.ast or rawRuleData.rawStyles not defined.
 */
const prepareRuleData = rawRuleData => {
  const selector = rawRuleData.selector,
    ast = rawRuleData.ast,
    rawStyles = rawRuleData.rawStyles;
  if (!ast) {
    throw new Error(`AST should be parsed for selector: '${selector}'`);
  }
  if (!rawStyles) {
    throw new Error(`Styles should be parsed for selector: '${selector}'`);
  }
  const ruleData = {
    selector,
    ast
  };
  const debugValue = getDebugStyleValue(rawStyles);
  const shouldRemove = isRemoveSetInStyles(rawStyles);
  let styles = rawStyles;
  if (debugValue) {
    // get rid of 'debug' from styles
    styles = rawStyles.filter(s => s.property !== DEBUG_PSEUDO_PROPERTY_KEY);
    // and set it as separate property only if its value is valid
    // which is 'true' or 'global'
    if (debugValue === PSEUDO_PROPERTY_POSITIVE_VALUE || debugValue === DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE) {
      ruleData.debug = debugValue;
    }
  }
  if (shouldRemove) {
    // no other styles are needed to apply if 'remove' is set
    ruleData.style = {
      [REMOVE_PSEUDO_MARKER]: PSEUDO_PROPERTY_POSITIVE_VALUE
    };

    /**
     * 'content' property is needed for ExtCssConfiguration.beforeStyleApplied().
     *
     * Search `BeforeStyleAppliedCallback` for more details.
     */
    const contentStyle = styles.find(s => s.property === CONTENT_CSS_PROPERTY);
    if (contentStyle) {
      ruleData.style[CONTENT_CSS_PROPERTY] = contentStyle.value;
    }
  } else {
    // otherwise all styles should be applied.
    // every style property will be unique because of their converting into object
    if (styles.length > 0) {
      const stylesAsEntries = styles.map(style => {
        const property = style.property,
          value = style.value;
        return [property, value];
      });
      const preparedStyleData = getObjectFromEntries(stylesAsEntries);
      ruleData.style = preparedStyleData;
    }
  }
  return ruleData;
};

/**
 * Combines previously parsed css rules data objects
 * into rules which are ready to apply.
 *
 * @param rawResults Previously parsed css rules data objects.
 *
 * @returns Parsed ExtendedCss rule data.
 */
const combineRulesData = rawResults => {
  const results = [];
  rawResults.forEach((value, key) => {
    const selector = key;
    const ast = value.ast,
      rawStyles = value.styles;
    results.push(prepareRuleData({
      selector,
      ast,
      rawStyles
    }));
  });
  return results;
};

/**
 * Trims `rawStyle` and splits it into tokens.
 *
 * @param rawStyle Style declaration block content inside curly bracket — `{` and `}` —
 * can be a single style declaration or a list of declarations.
 *
 * @returns Array of tokens supported for style declaration block.
 */
const tokenizeStyleBlock = rawStyle => {
  const styleDeclaration = rawStyle.trim();
  return tokenize(styleDeclaration, SUPPORTED_STYLE_DECLARATION_MARKS);
};

/**
 * Describes possible style declaration parts.
 *
 * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
 * during ExtendedCss import into other libraries.
 */
const DECLARATION_PART = {
  PROPERTY: 'property',
  VALUE: 'value'
};

/**
 * Interface for style declaration parser context.
 */

/**
 * Checks whether the quotes has been opened for style value.
 *
 * @param context Style block parser context.
 *
 * @returns True if style value has already opened quotes.
 */
const isValueQuotesOpen = context => {
  return context.bufferValue !== '' && context.valueQuoteMark !== null;
};

/**
 * Saves parsed property and value to collection of parsed styles.
 * Prunes context buffers for property and value.
 *
 * @param context Style block parser context.
 */
const collectStyle = context => {
  context.styles.push({
    property: context.bufferProperty.trim(),
    value: context.bufferValue.trim()
  });
  // reset buffers
  context.bufferProperty = '';
  context.bufferValue = '';
};

/**
 * Handles token which is supposed to be a part of style **property**.
 *
 * @param context Style block parser context.
 * @param styleBlock Whole style block which is being parsed.
 * @param token Current token.
 *
 * @throws An error on invalid token.
 */
const processPropertyToken = (context, styleBlock, token) => {
  const tokenValue = token.value;
  switch (token.type) {
    case TOKEN_TYPE.WORD:
      if (context.bufferProperty.length > 0) {
        // e.g. 'padding top: 0;' - current tokenValue is 'top' which is not valid
        throw new Error(`Invalid style property in style block: '${styleBlock}'`);
      }
      context.bufferProperty += tokenValue;
      break;
    case TOKEN_TYPE.MARK:
      // only colon and whitespaces are allowed while style property parsing
      if (tokenValue === COLON) {
        if (context.bufferProperty.trim().length === 0) {
          // e.g. such style block: '{ : none; }'
          throw new Error(`Missing style property before ':' in style block: '${styleBlock}'`);
        }
        // the property successfully collected
        context.bufferProperty = context.bufferProperty.trim();
        // prepare for value collecting
        context.processing = DECLARATION_PART.VALUE;
        // the property buffer shall be reset after the value is successfully collected
      } else if (WHITE_SPACE_CHARACTERS.includes(tokenValue)) ; else {
        // if after the property there is anything other than ':' except whitespace, this is a parse error
        // https://www.w3.org/TR/css-syntax-3/#consume-declaration
        throw new Error(`Invalid style declaration in style block: '${styleBlock}'`);
      }
      break;
    default:
      throw new Error(`Unsupported style property character: '${tokenValue}' in style block: '${styleBlock}'`);
  }
};

/**
 * Handles token which is supposed to be a part of style **value**.
 *
 * @param context Style block parser context.
 * @param styleBlock Whole style block which is being parsed.
 * @param token Current token.
 *
 * @throws An error on invalid token.
 */
const processValueToken = (context, styleBlock, token) => {
  const tokenValue = token.value;
  if (token.type === TOKEN_TYPE.WORD) {
    // simply collect to buffer
    context.bufferValue += tokenValue;
  } else {
    // otherwise check the mark
    switch (tokenValue) {
      case COLON:
        // the ':' character inside of the value should be inside of quotes
        // otherwise the value is not valid
        // e.g. 'content: display: none'
        // parser is here        ↑
        if (!isValueQuotesOpen(context)) {
          // eslint-disable-next-line max-len
          throw new Error(`Invalid style value for property '${context.bufferProperty}' in style block: '${styleBlock}'`);
        }
        // collect the colon inside quotes
        // e.g. 'content: "test:123"'
        // parser is here      ↑
        context.bufferValue += tokenValue;
        break;
      case SEMICOLON:
        if (isValueQuotesOpen(context)) {
          // ';' inside quotes is part of style value
          // e.g. 'content: "test;"'
          context.bufferValue += tokenValue;
        } else {
          // otherwise the value is successfully collected
          // save parsed style
          collectStyle(context);
          // prepare for value collecting
          context.processing = DECLARATION_PART.PROPERTY;
        }
        break;
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
        // if quotes are not open
        if (context.valueQuoteMark === null) {
          // save the opening quote mark for later comparison
          context.valueQuoteMark = tokenValue;
        } else if (!context.bufferValue.endsWith(BACKSLASH)
        // otherwise a quote appeared in the value earlier,
        // and non-escaped quote should be checked whether it is a closing quote
        && context.valueQuoteMark === tokenValue) {
          context.valueQuoteMark = null;
        }
        // always save the quote to the buffer
        // but after the context.bufferValue is checked for BACKSLASH above
        // e.g. 'content: "test:123"'
        //      'content: "\""'
        context.bufferValue += tokenValue;
        break;
      case BACKSLASH:
        if (!isValueQuotesOpen(context)) {
          // eslint-disable-next-line max-len
          throw new Error(`Invalid style value for property '${context.bufferProperty}' in style block: '${styleBlock}'`);
        }
        // collect the backslash inside quotes
        // e.g. ' content: "\"" '
        // parser is here   ↑
        context.bufferValue += tokenValue;
        break;
      case SPACE:
      case TAB:
      case CARRIAGE_RETURN:
      case LINE_FEED:
      case FORM_FEED:
        // whitespace should be collected only if the value collecting started
        // which means inside of the value
        // e.g. 'width: 100% !important'
        // parser is here   ↑
        if (context.bufferValue.length > 0) {
          context.bufferValue += tokenValue;
        }
        // otherwise it can be omitted
        // e.g. 'width:  100% !important'
        // here        ↑
        break;
      default:
        throw new Error(`Unknown style declaration token: '${tokenValue}'`);
    }
  }
};

/**
 * Parses css rule style block.
 *
 * @param rawStyleBlock Style block to parse.
 *
 * @returns Array of style declarations.
 * @throws An error on invalid style block.
 */
const parseStyleBlock = rawStyleBlock => {
  const styleBlock = rawStyleBlock.trim();
  const tokens = tokenizeStyleBlock(styleBlock);
  const context = {
    // style declaration parsing always starts with 'property'
    processing: DECLARATION_PART.PROPERTY,
    styles: [],
    bufferProperty: '',
    bufferValue: '',
    valueQuoteMark: null
  };
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      break;
    }
    if (context.processing === DECLARATION_PART.PROPERTY) {
      processPropertyToken(context, styleBlock, token);
    } else if (context.processing === DECLARATION_PART.VALUE) {
      processValueToken(context, styleBlock, token);
    } else {
      throw new Error('Style declaration parsing failed');
    }
    i += 1;
  }

  // unbalanced value quotes
  // e.g. 'content: "test} '
  if (isValueQuotesOpen(context)) {
    throw new Error(`Unbalanced style declaration quotes in style block: '${styleBlock}'`);
  }

  // collected property and value have not been saved to styles;
  // it is possible for style block with no semicolon at the end
  // e.g. such style block: '{ display: none }'
  if (context.bufferProperty.length > 0) {
    if (context.bufferValue.length === 0) {
      // e.g. such style blocks:
      //   '{ display:  }'
      //   '{ remove }'
      // eslint-disable-next-line max-len
      throw new Error(`Missing style value for property '${context.bufferProperty}' in style block '${styleBlock}'`);
    }
    collectStyle(context);
  }

  // rule with empty style block
  // e.g. 'div { }'
  if (context.styles.length === 0) {
    throw new Error(STYLE_ERROR_PREFIX.NO_STYLE);
  }
  return context.styles;
};

/**
 * Returns array of positions of `{` in `cssRule`.
 *
 * @param cssRule CSS rule.
 *
 * @returns Array of left curly bracket indexes.
 */
const getLeftCurlyBracketIndexes = cssRule => {
  const indexes = [];
  for (let i = 0; i < cssRule.length; i += 1) {
    if (cssRule[i] === BRACKET.CURLY.LEFT) {
      indexes.push(i);
    }
  }
  return indexes;
};

// TODO: use `extCssDoc` for caching of style block parser results
/**
 * Parses CSS rule into rules data object:
 * 1. Find the last `{` mark in the rule
 *    which supposed to be a divider between selector and style block.
 * 2. Validates found string part before the `{` via selector parser; and if:
 *  - parsing failed – get the previous `{` in the rule,
 *    and validates a new rule part again [2];
 *  - parsing successful — saves a found rule part as selector and parses the style block.
 *
 * @param rawCssRule Single CSS rule to parse.
 * @param extCssDoc ExtCssDocument which is used for selector ast caching.
 *
 * @returns Array of rules data which contains:
 *   - selector as string;
 *   - ast to query elements by;
 *   - map of styles to apply.
 * @throws An error on invalid css rule syntax:
 *   - unsupported CSS features – comments and at-rules
 *   - invalid selector or style block.
 */
const parseRule = (rawCssRule, extCssDoc) => {
  var _rawRuleData$selector;
  const cssRule = rawCssRule.trim();
  if (cssRule.includes(`${SLASH}${ASTERISK}`) && cssRule.includes(`${ASTERISK}${SLASH}`)) {
    throw new Error(STYLE_ERROR_PREFIX.NO_COMMENT);
  }
  const leftCurlyBracketIndexes = getLeftCurlyBracketIndexes(cssRule);

  // rule with style block but no selector
  // e.g. '{ display: none; }'
  if (getFirst(leftCurlyBracketIndexes) === 0) {
    throw new Error(NO_SELECTOR_ERROR_PREFIX);
  }
  let selectorData;

  // if rule has `{` but there is no `}`
  if (leftCurlyBracketIndexes.length > 0 && !cssRule.includes(BRACKET.CURLY.RIGHT)) {
    throw new Error(`${STYLE_ERROR_PREFIX.NO_STYLE} OR ${STYLE_ERROR_PREFIX.UNCLOSED_STYLE}`);
  }
  if (
  // if rule has no `{`
  leftCurlyBracketIndexes.length === 0
  // or `}`
  || !cssRule.includes(BRACKET.CURLY.RIGHT)) {
    try {
      // the whole css rule considered as "selector part"
      // which may contain :remove() pseudo-class
      selectorData = parseSelectorRulePart(cssRule, extCssDoc);
      if (selectorData.success) {
        var _selectorData$stylesO;
        // rule with no style block has valid :remove() pseudo-class
        // which is parsed into "styles"
        // e.g. 'div:remove()'
        // but also it can be just selector with no styles
        // e.g. 'div'
        // which should not be considered as valid css rule
        if (((_selectorData$stylesO = selectorData.stylesOfSelector) === null || _selectorData$stylesO === void 0 ? void 0 : _selectorData$stylesO.length) === 0) {
          throw new Error(STYLE_ERROR_PREFIX.NO_STYLE_OR_REMOVE);
        }
        return {
          selector: selectorData.selector.trim(),
          ast: selectorData.ast,
          rawStyles: selectorData.stylesOfSelector
        };
      } else {
        // not valid selector
        throw new Error('Invalid selector');
      }
    } catch (e) {
      throw new Error(extended_css_esm_getErrorMessage(e));
    }
  }
  let selectorBuffer;
  let styleBlockBuffer;
  const rawRuleData = {
    selector: ''
  };

  // css rule should be parsed from its end
  for (let i = leftCurlyBracketIndexes.length - 1; i > -1; i -= 1) {
    const index = leftCurlyBracketIndexes[i];
    if (!index) {
      throw new Error(`Impossible to continue, no '{' to process for rule: '${cssRule}'`);
    }
    // selector is before `{`, style block is after it
    selectorBuffer = cssRule.slice(0, index);
    // skip curly brackets
    styleBlockBuffer = cssRule.slice(index + 1, cssRule.length - 1);
    selectorData = parseSelectorRulePart(selectorBuffer, extCssDoc);
    if (selectorData.success) {
      var _rawRuleData$rawStyle;
      // selector successfully parsed
      rawRuleData.selector = selectorData.selector.trim();
      rawRuleData.ast = selectorData.ast;
      rawRuleData.rawStyles = selectorData.stylesOfSelector;
      // style block should be parsed
      // TODO: add cache for style block parsing
      const parsedStyles = parseStyleBlock(styleBlockBuffer);
      (_rawRuleData$rawStyle = rawRuleData.rawStyles) === null || _rawRuleData$rawStyle === void 0 || _rawRuleData$rawStyle.push(...parsedStyles);
      // stop rule parsing
      break;
    } else {
      // if selector was not parsed successfully
      // continue with next index of `{`
      continue;
    }
  }
  if (((_rawRuleData$selector = rawRuleData.selector) === null || _rawRuleData$selector === void 0 ? void 0 : _rawRuleData$selector.length) === 0) {
    // skip the rule as selector
    throw new Error('Selector in not valid');
  }
  return rawRuleData;
};

/**
 * Parses array of CSS rules into array of rules data objects.
 * Invalid rules are skipped and not applied,
 * and the errors are logged.
 *
 * @param rawCssRules Array of rules to parse.
 * @param extCssDoc Needed for selector ast caching.
 *
 * @returns Array of parsed valid rules data.
 */
const parseRules = (rawCssRules, extCssDoc) => {
  const rawResults = createRawResultsMap();
  const warnings = [];
  // trim all rules and find unique ones
  const uniqueRules = [...new Set(rawCssRules.map(r => r.trim()))];
  uniqueRules.forEach(rule => {
    try {
      saveToRawResults(rawResults, parseRule(rule, extCssDoc));
    } catch (e) {
      // skip the invalid rule
      const errorMessage = extended_css_esm_getErrorMessage(e);
      warnings.push(`'${rule}' - error: '${errorMessage}'`);
    }
  });

  // log info about skipped invalid rules
  if (warnings.length > 0) {
    extended_css_esm_logger.info(`Invalid rules:\n  ${warnings.join('\n  ')}`);
  }
  return combineRulesData(rawResults);
};

const REGEXP_DECLARATION_END = /[;}]/g;
const REGEXP_DECLARATION_DIVIDER = /[;:}]/g;
const REGEXP_NON_WHITESPACE = /\S/g;

/**
 * Interface for stylesheet parser context.
 */

/**
 * Resets rule data buffer to init value after rule successfully collected.
 *
 * @param context Stylesheet parser context.
 */
const restoreRuleAcc = context => {
  context.rawRuleData = {
    selector: ''
  };
};

/**
 * Parses cropped selector part found before `{` previously.
 *
 * @param context Stylesheet parser context.
 * @param extCssDoc Needed for caching of selector ast.
 *
 * @returns Parsed validation data for cropped part of stylesheet which may be a selector.
 * @throws An error on unsupported CSS features, e.g. at-rules.
 */
const parseSelectorPart = (context, extCssDoc) => {
  let selector = context.selectorBuffer.trim();
  if (selector.startsWith(AT_RULE_MARKER)) {
    throw new Error(`${NO_AT_RULE_ERROR_PREFIX}: '${selector}'.`);
  }
  let removeSelectorData;
  try {
    removeSelectorData = parseRemoveSelector(selector);
  } catch (e) {
    extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
    throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`);
  }
  if (context.nextIndex === -1) {
    if (selector === removeSelectorData.selector) {
      // rule should have style or pseudo-class :remove()
      throw new Error(`${STYLE_ERROR_PREFIX.NO_STYLE_OR_REMOVE}: '${context.cssToParse}'`);
    }
    // stop parsing as there is no style declaration and selector parsed fine
    context.cssToParse = '';
  }
  let stylesOfSelector = [];
  let success = false;
  let ast;
  try {
    selector = removeSelectorData.selector;
    stylesOfSelector = removeSelectorData.stylesOfSelector;
    // validate found selector by parsing it to ast
    // so if it is invalid error will be thrown
    ast = extCssDoc.getSelectorAst(selector);
    success = true;
  } catch (e) {
    success = false;
  }
  if (context.nextIndex > 0) {
    // slice found valid selector part off
    // and parse rest of stylesheet later
    context.cssToParse = context.cssToParse.slice(context.nextIndex);
  }
  return {
    success,
    selector,
    ast,
    stylesOfSelector
  };
};

/**
 * Recursively parses style declaration string into `Style`s.
 *
 * @param context Stylesheet parser context.
 * @param styles Array of styles.
 *
 * @throws An error on invalid style declaration.
 * @returns A number index of the next `}` in `this.cssToParse`.
 */
const parseUntilClosingBracket = (context, styles) => {
  // Expects ":", ";", and "}".
  REGEXP_DECLARATION_DIVIDER.lastIndex = context.nextIndex;
  let match = REGEXP_DECLARATION_DIVIDER.exec(context.cssToParse);
  if (match === null) {
    throw new Error(`${STYLE_ERROR_PREFIX.INVALID_STYLE}: '${context.cssToParse}'`);
  }
  let matchPos = match.index;
  let matched = match[0];
  if (matched === BRACKET.CURLY.RIGHT) {
    const declarationChunk = context.cssToParse.slice(context.nextIndex, matchPos);
    if (declarationChunk.trim().length === 0) {
      // empty style declaration
      // e.g. 'div { }'
      if (styles.length === 0) {
        throw new Error(`${STYLE_ERROR_PREFIX.NO_STYLE}: '${context.cssToParse}'`);
      }
      // else valid style parsed before it
      // e.g. '{ display: none; }' -- position is after ';'
    } else {
      // closing curly bracket '}' is matched before colon ':'
      // trimmed declarationChunk is not a space, between ';' and '}',
      // e.g. 'visible }' in style '{ display: none; visible }' after part before ';' is parsed
      throw new Error(`${STYLE_ERROR_PREFIX.INVALID_STYLE}: '${context.cssToParse}'`);
    }
    return matchPos;
  }
  if (matched === COLON) {
    const colonIndex = matchPos;
    // Expects ";" and "}".
    REGEXP_DECLARATION_END.lastIndex = colonIndex;
    match = REGEXP_DECLARATION_END.exec(context.cssToParse);
    if (match === null) {
      throw new Error(`${STYLE_ERROR_PREFIX.UNCLOSED_STYLE}: '${context.cssToParse}'`);
    }
    matchPos = match.index;
    matched = match[0];
    // Populates the `styleMap` key-value map.
    const property = context.cssToParse.slice(context.nextIndex, colonIndex).trim();
    if (property.length === 0) {
      throw new Error(`${STYLE_ERROR_PREFIX.NO_PROPERTY}: '${context.cssToParse}'`);
    }
    const value = context.cssToParse.slice(colonIndex + 1, matchPos).trim();
    if (value.length === 0) {
      throw new Error(`${STYLE_ERROR_PREFIX.NO_VALUE}: '${context.cssToParse}'`);
    }
    styles.push({
      property,
      value
    });
    // finish style parsing if '}' is found
    // e.g. '{ display: none }' -- no ';' at the end of declaration
    if (matched === BRACKET.CURLY.RIGHT) {
      return matchPos;
    }
  }
  // matchPos is the position of the next ';'
  // crop 'cssToParse' and re-run the loop
  context.cssToParse = context.cssToParse.slice(matchPos + 1);
  context.nextIndex = 0;
  return parseUntilClosingBracket(context, styles); // Should be a subject of tail-call optimization.
};

/**
 * Parses next style declaration part in stylesheet.
 *
 * @param context Stylesheet parser context.
 *
 * @returns Array of style data objects.
 */
const parseNextStyle = context => {
  const styles = [];
  const styleEndPos = parseUntilClosingBracket(context, styles);

  // find next rule after the style declaration
  REGEXP_NON_WHITESPACE.lastIndex = styleEndPos + 1;
  const match = REGEXP_NON_WHITESPACE.exec(context.cssToParse);
  if (match === null) {
    context.cssToParse = '';
    return styles;
  }
  const matchPos = match.index;

  // cut out matched style declaration for previous selector
  context.cssToParse = context.cssToParse.slice(matchPos);
  return styles;
};

/**
 * Parses stylesheet of rules into rules data objects (non-recursively):
 * 1. Iterates through stylesheet string.
 * 2. Finds first `{` which can be style declaration start or part of selector.
 * 3. Validates found string part via selector parser; and if:
 *  - it throws error — saves string part to buffer as part of selector,
 *    slice next stylesheet part to `{` [2] and validates again [3];
 *  - no error — saves found string part as selector and starts to parse styles (recursively).
 *
 * @param rawStylesheet Raw stylesheet as string.
 * @param extCssDoc ExtCssDocument which uses cache while selectors parsing.
 * @throws An error on unsupported CSS features, e.g. comments or invalid stylesheet syntax.
 * @returns Array of rules data which contains:
 * - selector as string;
 * - ast to query elements by;
 * - map of styles to apply.
 */
const parseStylesheet = (rawStylesheet, extCssDoc) => {
  const stylesheet = rawStylesheet.trim();
  if (stylesheet.includes(`${SLASH}${ASTERISK}`) && stylesheet.includes(`${ASTERISK}${SLASH}`)) {
    throw new Error(`${STYLE_ERROR_PREFIX.NO_COMMENT} in stylesheet: '${stylesheet}'`);
  }
  const context = {
    // any stylesheet should start with selector
    isSelector: true,
    // init value of parser position
    nextIndex: 0,
    // init value of cssToParse
    cssToParse: stylesheet,
    // buffer for collecting selector part
    selectorBuffer: '',
    // accumulator for rules
    rawRuleData: {
      selector: ''
    }
  };
  const rawResults = createRawResultsMap();
  let selectorData;

  // context.cssToParse is going to be cropped while its parsing
  while (context.cssToParse) {
    if (context.isSelector) {
      // find index of first opening curly bracket
      // which may mean start of style part and end of selector one
      context.nextIndex = context.cssToParse.indexOf(BRACKET.CURLY.LEFT);
      // rule should not start with style, selector is required
      // e.g. '{ display: none; }'
      if (context.selectorBuffer.length === 0 && context.nextIndex === 0) {
        throw new Error(`${STYLE_ERROR_PREFIX.NO_SELECTOR}: '${context.cssToParse}'`);
      }
      if (context.nextIndex === -1) {
        // no style declaration in rule
        // but rule still may contain :remove() pseudo-class
        context.selectorBuffer = context.cssToParse;
      } else {
        // collect string parts before opening curly bracket
        // until valid selector collected
        context.selectorBuffer += context.cssToParse.slice(0, context.nextIndex);
      }
      selectorData = parseSelectorPart(context, extCssDoc);
      if (selectorData.success) {
        // selector successfully parsed
        context.rawRuleData.selector = selectorData.selector.trim();
        context.rawRuleData.ast = selectorData.ast;
        context.rawRuleData.rawStyles = selectorData.stylesOfSelector;
        context.isSelector = false;
        // save rule data if there is no style declaration
        if (context.nextIndex === -1) {
          saveToRawResults(rawResults, context.rawRuleData);
          // clean up ruleContext
          restoreRuleAcc(context);
        } else {
          // skip the opening curly bracket at the start of style declaration part
          context.nextIndex = 1;
          context.selectorBuffer = '';
        }
      } else {
        // if selector was not successfully parsed parseSelectorPart(), continue stylesheet parsing:
        // save the found bracket to buffer and proceed to next loop iteration
        context.selectorBuffer += BRACKET.CURLY.LEFT;
        // delete `{` from cssToParse
        context.cssToParse = context.cssToParse.slice(1);
      }
    } else {
      var _context$rawRuleData$;
      // style declaration should be parsed
      const parsedStyles = parseNextStyle(context);

      // styles can be parsed from selector part if it has :remove() pseudo-class
      // e.g. '.banner:remove() { debug: true; }'
      (_context$rawRuleData$ = context.rawRuleData.rawStyles) === null || _context$rawRuleData$ === void 0 || _context$rawRuleData$.push(...parsedStyles);

      // save rule data to results
      saveToRawResults(rawResults, context.rawRuleData);
      context.nextIndex = 0;

      // clean up ruleContext
      restoreRuleAcc(context);

      // parse next rule selector after style successfully parsed
      context.isSelector = true;
    }
  }
  return combineRulesData(rawResults);
};

/**
 * Checks whether passed `arg` is number type.
 *
 * @param arg Value to check.
 *
 * @returns True if `arg` is number and not NaN.
 */
const isNumber = arg => {
  return typeof arg === 'number' && !Number.isNaN(arg);
};

/**
 * The purpose of ThrottleWrapper is to throttle calls of the function
 * that applies ExtendedCss rules. The reasoning here is that the function calls
 * are triggered by MutationObserver and there may be many mutations in a short period of time.
 * We do not want to apply rules on every mutation so we use this helper to make sure
 * that there is only one call in the given amount of time.
 */
class ThrottleWrapper {
  /**
   * Creates new ThrottleWrapper.
   * The {@link callback} should be executed not more often than {@link ThrottleWrapper.THROTTLE_DELAY_MS}.
   *
   * @param callback The callback.
   */
  constructor(callback) {
    this.callback = callback;
    this.executeCallback = this.executeCallback.bind(this);
  }

  /**
   * Calls the `this.callback` function and update bounded throttle wrapper properties.
   */
  executeCallback() {
    this.lastRunTime = performance.now();
    if (isNumber(this.timerId)) {
      clearTimeout(this.timerId);
      delete this.timerId;
    }
    this.callback();
  }

  /**
   * Schedules the {@link executeCallback} function execution via setTimeout.
   * It may triggered by MutationObserver job which may occur too ofter, so we limit the function execution:
   *
   * 1. If {@link timerId} is set, ignore the call, because the function is already scheduled to be executed;
   *
   * 2. If {@link lastRunTime} is set, we need to check the time elapsed time since the last call. If it is
   * less than {@link ThrottleWrapper.THROTTLE_DELAY_MS}, we schedule the function execution after the remaining time.
   *
   * Otherwise, we execute the function asynchronously to ensure that it is executed
   * in the correct order with respect to DOM events, by deferring its execution until after
   * those tasks have completed.
   */
  run() {
    if (isNumber(this.timerId)) {
      // there is a pending execution scheduled
      return;
    }
    if (isNumber(this.lastRunTime)) {
      const elapsedTime = performance.now() - this.lastRunTime;
      if (elapsedTime < ThrottleWrapper.THROTTLE_DELAY_MS) {
        this.timerId = window.setTimeout(this.executeCallback, ThrottleWrapper.THROTTLE_DELAY_MS - elapsedTime);
        return;
      }
    }

    /**
     * We use `setTimeout` instead `requestAnimationFrame`
     * here because requestAnimationFrame can be delayed for a long time
     * when the browser saves battery or the engine is heavily loaded.
     */
    this.timerId = window.setTimeout(this.executeCallback);
  }
}
_defineProperty(ThrottleWrapper, "THROTTLE_DELAY_MS", 150);

const LAST_EVENT_TIMEOUT_MS = 10;
const IGNORED_EVENTS = ['mouseover', 'mouseleave', 'mouseenter', 'mouseout'];
const SUPPORTED_EVENTS = [
// keyboard events
'keydown', 'keypress', 'keyup',
// mouse events
'auxclick', 'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup', 'pointerlockchange', 'pointerlockerror', 'select', 'wheel'];

// 'wheel' event makes scrolling in Safari twitchy
// https://github.com/AdguardTeam/ExtendedCss/issues/120
const SAFARI_PROBLEMATIC_EVENTS = ['wheel'];

/**
 * We use EventTracker to track the event that is likely to cause the mutation.
 * The problem is that we cannot use `window.event` directly from the mutation observer call
 * as we're not in the event handler context anymore.
 */
class EventTracker {
  /**
   * Creates new EventTracker.
   */
  constructor() {
    _defineProperty(this, "getLastEventType", () => this.lastEventType);
    _defineProperty(this, "getTimeSinceLastEvent", () => {
      if (!this.lastEventTime) {
        return null;
      }
      return Date.now() - this.lastEventTime;
    });
    this.trackedEvents = isSafariBrowser ? SUPPORTED_EVENTS.filter(event => !SAFARI_PROBLEMATIC_EVENTS.includes(event)) : SUPPORTED_EVENTS;
    this.trackedEvents.forEach(eventName => {
      document.documentElement.addEventListener(eventName, this.trackEvent, true);
    });
  }

  /**
   * Callback for event listener for events tracking.
   *
   * @param event Any event.
   */
  trackEvent(event) {
    this.lastEventType = event.type;
    this.lastEventTime = Date.now();
  }
  /**
   * Checks whether the last caught event should be ignored.
   *
   * @returns True if event should be ignored.
   */
  isIgnoredEventType() {
    const lastEventType = this.getLastEventType();
    const sinceLastEventTime = this.getTimeSinceLastEvent();
    return !!lastEventType && IGNORED_EVENTS.includes(lastEventType) && !!sinceLastEventTime && sinceLastEventTime < LAST_EVENT_TIMEOUT_MS;
  }

  /**
   * Stops event tracking by removing event listener.
   */
  stopTracking() {
    this.trackedEvents.forEach(eventName => {
      document.documentElement.removeEventListener(eventName, this.trackEvent, true);
    });
  }
}

/**
 * We are trying to limit the number of callback calls by not calling it on all kind of "hover" events.
 * The rationale behind this is that "hover" events often cause attributes modification,
 * but re-applying extCSS rules will be useless as these attribute changes are usually transient.
 *
 * @param mutations DOM elements mutation records.
 * @returns True if all mutations are about attributes changes, otherwise false.
 */
function shouldIgnoreMutations(mutations) {
  // ignore if all mutations are about attributes changes
  return !mutations.some(m => m.type !== 'attributes');
}

/**
 * Adds new `context.domMutationObserver` instance and connect it to document.
 * 
 * @param context ExtendedCss context.
 */
function observeDocument(context) {
  if (context.isDomObserved) {
    return;
  }

  // enable dynamically added elements handling
  context.isDomObserved = true;
  context.domMutationObserver = new natives.MutationObserver(mutations => {
    if (!mutations || mutations.length === 0) {
      return;
    }
    const eventTracker = new EventTracker();
    if (eventTracker.isIgnoredEventType() && shouldIgnoreMutations(mutations)) {
      return;
    }
    // save instance of EventTracker to context
    // for removing its event listeners on disconnectDocument() while mainDisconnect()
    context.eventTracker = eventTracker;
    context.scheduler.run();
  });
  context.domMutationObserver.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['id', 'class']
  });
}

/**
 * Disconnect from `context.domMutationObserver`.
 * 
 * @param context ExtendedCss context.
 */
function disconnectDocument(context) {
  if (!context.isDomObserved) {
    return;
  }

  // disable dynamically added elements handling
  context.isDomObserved = false;
  if (context.domMutationObserver) {
    context.domMutationObserver.disconnect();
  }

  // clean up event listeners
  if (context.eventTracker) {
    context.eventTracker.stopTracking();
  }
}

// added by tsurlfilter's CssHitsCounter
const CONTENT_ATTR_PREFIX_REGEXP = /^("|')adguard.+?/;

/**
 * Removes affectedElement.node from DOM.
 *
 * @param context ExtendedCss context.
 * @param affectedElement Affected element.
 */
const removeElement = (context, affectedElement) => {
  const node = affectedElement.node;
  affectedElement.removed = true;
  const elementSelector = getElementSelectorPath(node);

  // check if the element has been already removed earlier
  const elementRemovalsCounter = context.removalsStatistic[elementSelector] || 0;

  // if removals attempts happened more than specified we do not try to remove node again
  if (elementRemovalsCounter > MAX_STYLE_PROTECTION_COUNT) {
    extended_css_esm_logger.error(`ExtendedCss: infinite loop protection for selector: '${elementSelector}'`);
    return;
  }
  if (node.parentElement) {
    node.parentElement.removeChild(node);
    context.removalsStatistic[elementSelector] = elementRemovalsCounter + 1;
  }
};

/**
 * Sets style to the specified DOM node.
 *
 * @param node DOM element.
 * @param style Style to set.
 */
const setStyleToElement = (node, style) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }
  Object.keys(style).forEach(prop => {
    // Apply this style only to existing properties
    // We cannot use hasOwnProperty here (does not work in FF)
    if (typeof node.style.getPropertyValue(prop.toString()) !== 'undefined') {
      let value = style[prop];
      if (!value) {
        return;
      }
      // do not apply 'content' style given by tsurlfilter
      // which is needed only for BeforeStyleAppliedCallback
      if (prop === CONTENT_CSS_PROPERTY && value.match(CONTENT_ATTR_PREFIX_REGEXP)) {
        return;
      }
      // First we should remove !important attribute (or it won't be applied')
      value = removeSuffix(value.trim(), '!important').trim();
      node.style.setProperty(prop, value, 'important');
    }
  });
};

/**
 * Checks the required properties of `affectedElement`
 * **before** `beforeStyleApplied()` execution.
 *
 * @param affectedElement Affected element.
 *
 * @returns False if there is no `node` or `rules`
 * or `rules` is not an array.
 */
const isIAffectedElement = affectedElement => {
  return 'node' in affectedElement && 'rules' in affectedElement && affectedElement.rules instanceof Array;
};

/**
 * Checks the required properties of `affectedElement`
 * **after** `beforeStyleApplied()` execution.
 * These properties are needed for proper internal usage.
 *
 * @param affectedElement Affected element.
 *
 * @returns False if there is no `node` or `rules`
 * or `rules` is not an array.
 */
const isAffectedElement = affectedElement => {
  return 'node' in affectedElement && 'originalStyle' in affectedElement && 'rules' in affectedElement && affectedElement.rules instanceof Array;
};

/**
 * Applies style to the specified DOM node.
 *
 * @param context ExtendedCss context.
 * @param rawAffectedElement Object containing DOM node and rule to be applied.
 *
 * @throws An error if affectedElement has no style to apply.
 */
const applyStyle = (context, rawAffectedElement) => {
  if (rawAffectedElement.protectionObserver) {
    // style is already applied and protected by the observer
    return;
  }
  let affectedElement;
  if (context.beforeStyleApplied) {
    if (!isIAffectedElement(rawAffectedElement)) {
      throw new Error("Returned IAffectedElement should have 'node' and 'rules' properties");
    }
    affectedElement = context.beforeStyleApplied(rawAffectedElement);
    if (!affectedElement) {
      throw new Error("Callback 'beforeStyleApplied' should return IAffectedElement");
    }
  } else {
    affectedElement = rawAffectedElement;
  }
  if (!isAffectedElement(affectedElement)) {
    throw new Error("Returned IAffectedElement should have 'node' and 'rules' properties");
  }
  const _affectedElement = affectedElement,
    node = _affectedElement.node,
    rules = _affectedElement.rules;
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];
    const selector = rule === null || rule === void 0 ? void 0 : rule.selector;
    const style = rule === null || rule === void 0 ? void 0 : rule.style;
    const debug = rule === null || rule === void 0 ? void 0 : rule.debug;
    // rule may not have style to apply
    // e.g. 'div:has(> a) { debug: true }' -> means no style to apply, and enable debug mode
    if (style) {
      if (style[REMOVE_PSEUDO_MARKER] === PSEUDO_PROPERTY_POSITIVE_VALUE) {
        removeElement(context, affectedElement);
        return;
      }
      setStyleToElement(node, style);
    } else if (!debug) {
      // but rule should not have both style and debug properties
      throw new Error(`No style declaration in rule for selector: '${selector}'`);
    }
  }
};

/**
 * Reverts style for the affected object.
 *
 * @param affectedElement Affected element.
 */
const revertStyle = affectedElement => {
  if (affectedElement.protectionObserver) {
    affectedElement.protectionObserver.disconnect();
  }
  affectedElement.node.style.cssText = affectedElement.originalStyle;
};

/**
 * ExtMutationObserver is a wrapper over regular MutationObserver with one additional function:
 * it keeps track of the number of times we called the "ProtectionCallback".
 *
 * We use an instance of this to monitor styles added by ExtendedCss
 * and to make sure these styles are recovered if the page script attempts to modify them.
 *
 * However, we want to avoid endless loops of modification if the page script repeatedly modifies the styles.
 * So we keep track of the number of calls and observe() makes a decision
 * whether to continue recovering the styles or not.
 */
class ExtMutationObserver {
  /**
   * Extra property for keeping 'style fix counts'.
   */

  /**
   * Creates new ExtMutationObserver.
   *
   * @param protectionCallback Callback which execution should be counted.
   */
  constructor(protectionCallback) {
    this.styleProtectionCount = 0;
    this.observer = new natives.MutationObserver(mutations => {
      if (!mutations.length) {
        return;
      }
      this.styleProtectionCount += 1;
      protectionCallback(mutations, this);
    });
  }

  /**
   * Starts to observe target element,
   * prevents infinite loop of observing due to the limited number of times of callback runs.
   *
   * @param target Target to observe.
   * @param options Mutation observer options.
   */
  observe(target, options) {
    if (this.styleProtectionCount < MAX_STYLE_PROTECTION_COUNT) {
      this.observer.observe(target, options);
    } else {
      extended_css_esm_logger.error('ExtendedCss: infinite loop protection for style');
    }
  }

  /**
   * Stops ExtMutationObserver from observing any mutations.
   * Until the `observe()` is used again, `protectionCallback` will not be invoked.
   */
  disconnect() {
    this.observer.disconnect();
  }
}

const PROTECTION_OBSERVER_OPTIONS = {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ['style']
};

/**
 * Creates MutationObserver protection callback.
 *
 * @param styles Styles data object.
 *
 * @returns Callback for styles protection.
 */
const createProtectionCallback = styles => {
  const protectionCallback = (mutations, extObserver) => {
    if (!mutations[0]) {
      return;
    }
    const target = mutations[0].target;
    extObserver.disconnect();
    styles.forEach(style => {
      setStyleToElement(target, style);
    });
    extObserver.observe(target, PROTECTION_OBSERVER_OPTIONS);
  };
  return protectionCallback;
};

/**
 * Sets up a MutationObserver which protects style attributes from changes.
 *
 * @param node DOM node.
 * @param rules Rule data objects.
 * @returns Mutation observer used to protect attribute or null if there's nothing to protect.
 */
const protectStyleAttribute = (node, rules) => {
  if (!natives.MutationObserver) {
    return null;
  }
  const styles = [];
  rules.forEach(ruleData => {
    const style = ruleData.style;
    // some rules might have only debug property in style declaration
    // e.g. 'div:has(> a) { debug: true }' -> parsed to boolean `ruleData.debug`
    // so no style is fine, and here we should collect only valid styles to protect
    if (style) {
      styles.push(style);
    }
  });
  const protectionObserver = new ExtMutationObserver(createProtectionCallback(styles));
  protectionObserver.observe(node, PROTECTION_OBSERVER_OPTIONS);
  return protectionObserver;
};

const STATS_DECIMAL_DIGITS_COUNT = 4;
/**
 * A helper class for applied rule stats.
 */
class TimingStats {
  /**
   * Creates new TimingStats.
   */
  constructor() {
    this.appliesTimings = [];
    this.appliesCount = 0;
    this.timingsSum = 0;
    this.meanTiming = 0;
    this.squaredSum = 0;
    this.standardDeviation = 0;
  }

  /**
   * Observe target element and mark observer as active.
   *
   * @param elapsedTimeMs Time in ms.
   */
  push(elapsedTimeMs) {
    this.appliesTimings.push(elapsedTimeMs);
    this.appliesCount += 1;
    this.timingsSum += elapsedTimeMs;
    this.meanTiming = this.timingsSum / this.appliesCount;
    this.squaredSum += elapsedTimeMs * elapsedTimeMs;
    this.standardDeviation = Math.sqrt(this.squaredSum / this.appliesCount - Math.pow(this.meanTiming, 2));
  }
}
/**
 * Makes the timestamps more readable.
 *
 * @param timestamp Raw timestamp.
 *
 * @returns Fine-looking timestamps.
 */
const beautifyTimingNumber = timestamp => {
  return Number(timestamp.toFixed(STATS_DECIMAL_DIGITS_COUNT));
};

/**
 * Improves timing stats readability.
 *
 * @param rawTimings Collected timings with raw timestamp.
 *
 * @returns Fine-looking timing stats.
 */
const beautifyTimings = rawTimings => {
  return {
    appliesTimings: rawTimings.appliesTimings.map(t => beautifyTimingNumber(t)),
    appliesCount: beautifyTimingNumber(rawTimings.appliesCount),
    timingsSum: beautifyTimingNumber(rawTimings.timingsSum),
    meanTiming: beautifyTimingNumber(rawTimings.meanTiming),
    standardDeviation: beautifyTimingNumber(rawTimings.standardDeviation)
  };
};

/**
 * Prints timing information if debugging mode is enabled.
 *
 * @param context ExtendedCss context.
 */
const printTimingInfo = context => {
  if (context.areTimingsPrinted) {
    return;
  }
  context.areTimingsPrinted = true;
  const timingsLogData = {};
  context.parsedRules.forEach(ruleData => {
    if (ruleData.timingStats) {
      const selector = ruleData.selector,
        style = ruleData.style,
        debug = ruleData.debug,
        matchedElements = ruleData.matchedElements;
      // style declaration for some rules is parsed to debug property and no style to apply
      // e.g. 'div:has(> a) { debug: true }'
      if (!style && !debug) {
        throw new Error(`Rule should have style declaration for selector: '${selector}'`);
      }
      const selectorData = {
        selectorParsed: selector,
        timings: beautifyTimings(ruleData.timingStats)
      };
      // `ruleData.style` may contain `remove` pseudo-property
      // and make logs look better
      if (style && style[REMOVE_PSEUDO_MARKER] === PSEUDO_PROPERTY_POSITIVE_VALUE) {
        selectorData.removed = true;
        // no matchedElements for such case as they are removed after ExtendedCss applied
      } else {
        selectorData.styleApplied = style || null;
        selectorData.matchedElements = matchedElements;
      }
      timingsLogData[selector] = selectorData;
    }
  });
  if (Object.keys(timingsLogData).length === 0) {
    return;
  }
  // add location.href to the message to distinguish frames
  extended_css_esm_logger.info('[ExtendedCss] Timings in milliseconds for %o:\n%o', window.location.href, timingsLogData);
};

/**
 * Finds affectedElement object for the specified DOM node.
 *
 * @param affElements Array of affected elements — context.affectedElements.
 * @param domNode DOM node.
 * @returns Found affectedElement or undefined.
 */
const findAffectedElement = (affElements, domNode) => {
  return affElements.find(affEl => affEl.node === domNode);
};

/**
 * Applies specified rule and returns list of elements affected.
 *
 * @param context ExtendedCss context.
 * @param ruleData Rule to apply.
 * @returns List of elements affected by the rule.
 */
const applyRule = (context, ruleData) => {
  // debugging mode can be enabled in two ways:
  // 1. for separate rules - by `{ debug: true; }`
  // 2. for all rules simultaneously by:
  //   - `{ debug: global; }` in any rule
  //   - positive `debug` property in ExtCssConfiguration
  const isDebuggingMode = !!ruleData.debug || context.debug;
  let startTime;
  if (isDebuggingMode) {
    startTime = performance.now();
  }
  const ast = ruleData.ast;
  const nodes = [];
  // selector can be successfully parser into ast with no error
  // but its applying by native Document.querySelectorAll() still may throw an error
  // e.g. 'div[..banner]'
  try {
    nodes.push(...selectElementsByAst(ast));
  } catch (e) {
    // log the error only in debug mode
    if (context.debug) {
      extended_css_esm_logger.error(extended_css_esm_getErrorMessage(e));
    }
  }
  nodes.forEach(node => {
    let affectedElement = findAffectedElement(context.affectedElements, node);
    if (affectedElement) {
      affectedElement.rules.push(ruleData);
      applyStyle(context, affectedElement);
    } else {
      // Applying style first time
      const originalStyle = node.style.cssText;
      affectedElement = {
        node,
        // affected DOM node
        rules: [ruleData],
        // rule to be applied
        originalStyle,
        // original node style
        protectionObserver: null // style attribute observer
      };
      applyStyle(context, affectedElement);
      context.affectedElements.push(affectedElement);
    }
  });
  if (isDebuggingMode && startTime) {
    const elapsedTimeMs = performance.now() - startTime;
    if (!ruleData.timingStats) {
      ruleData.timingStats = new TimingStats();
    }
    ruleData.timingStats.push(elapsedTimeMs);
  }
  return nodes;
};

/**
 * Applies filtering rules.
 *
 * @param context ExtendedCss context.
 */
const applyRules = context => {
  const newSelectedElements = [];
  // some rules could make call - selector.querySelectorAll() temporarily to change node id attribute
  // this caused MutationObserver to call recursively
  // https://github.com/AdguardTeam/ExtendedCss/issues/81
  disconnectDocument(context);
  context.parsedRules.forEach(ruleData => {
    const nodes = applyRule(context, ruleData);
    Array.prototype.push.apply(newSelectedElements, nodes);
    // save matched elements to ruleData as linked to applied rule
    // only for debugging purposes
    if (ruleData.debug) {
      ruleData.matchedElements = nodes;
    }
  });
  // Now revert styles for elements which are no more affected
  let affLength = context.affectedElements.length;
  // do nothing if there is no elements to process
  while (affLength) {
    const affectedElement = context.affectedElements[affLength - 1];
    if (!affectedElement) {
      break;
    }
    if (!newSelectedElements.includes(affectedElement.node)) {
      // Time to revert style
      revertStyle(affectedElement);
      context.affectedElements.splice(affLength - 1, 1);
    } else if (!affectedElement.removed) {
      // Add style protection observer
      // Protect "style" attribute from changes
      if (!affectedElement.protectionObserver) {
        affectedElement.protectionObserver = protectStyleAttribute(affectedElement.node, affectedElement.rules);
      }
    }
    affLength -= 1;
  }
  // After styles are applied we can start observe again
  observeDocument(context);
  printTimingInfo(context);
};

/**
 * Result of selector validation.
 */

/**
 * Interface for ExtendedCss constructor argument. Needed to create the instance of ExtendedCss.
 *
 * ExtendedCss configuration may contain:
 * - `styleSheet` — CSS stylesheet of rules to apply;
 * - `cssRules` — list of separated CSS rules instead of or additionally to the CSS stylesheet;
 * - `beforeStyleApplied` — the callback for matched elements;
 * - `debug` — flag for global logging which is useful for selectors debugging.
 *
 * > Both `styleSheet` and `cssRules` are optional but at least one of them should be set.
 *
 * > If both `styleSheet` and `cssRules` are set, both of them are to be applied.
 *
 * CSS stylesheet and list of CSS rules can contain not just extended selectors
 * but standard ones, and all of them will be applied by the lib.
 *
 * CSS comments and at-rules are not supported.
 */

/**
 * Main class of ExtendedCss lib.
 *
 * Parses css stylesheet with any selectors (passed to its argument as styleSheet),
 * and guarantee its applying as mutation observer is used to prevent the restyling of needed elements by other scripts.
 * This style protection is limited to 50 times to avoid infinite loop (MAX_STYLE_PROTECTION_COUNT).
 * Our own ThrottleWrapper is used for styles applying to avoid too often lib reactions on page mutations.
 *
 * Constructor creates the instance of class which should be run be `apply()` method to apply the rules,
 * and the applying can be stopped by `dispose()`.
 *
 * Can be used to select page elements by selector with `query()` method (similar to `Document.querySelectorAll()`),
 * which does not require instance creating.
 */
class ExtendedCss {
  /**
   * Creates new ExtendedCss.
   *
   * @param configuration ExtendedCss configuration.
   */
  constructor(configuration) {
    if (!configuration) {
      throw new Error('ExtendedCss configuration should be provided.');
    }
    this.applyRulesCallbackListener = this.applyRulesCallbackListener.bind(this);
    this.context = {
      beforeStyleApplied: configuration.beforeStyleApplied,
      debug: false,
      affectedElements: [],
      isDomObserved: false,
      removalsStatistic: {},
      parsedRules: [],
      scheduler: new ThrottleWrapper(this.applyRulesCallbackListener)
    };

    // TODO: throw an error instead of logging and handle it in related products.
    if (!isBrowserSupported()) {
      extended_css_esm_logger.error('Browser is not supported by ExtendedCss');
      return;
    }

    // at least 'styleSheet' or 'cssRules' should be provided
    if (!configuration.styleSheet && !configuration.cssRules) {
      throw new Error("ExtendedCss configuration should have 'styleSheet' or 'cssRules' defined.");
    }

    // 'styleSheet' and 'cssRules' are optional
    // and both can be provided at the same time
    // so both should be parsed and applied in such case
    if (configuration.styleSheet) {
      // stylesheet parsing can fail on some invalid selectors
      try {
        this.context.parsedRules.push(...parseStylesheet(configuration.styleSheet, extCssDocument));
      } catch (e) {
        // eslint-disable-next-line max-len
        throw new Error(`Pass the rules as configuration.cssRules since configuration.styleSheet cannot be parsed because of: '${extended_css_esm_getErrorMessage(e)}'`);
      }
    }
    if (configuration.cssRules) {
      this.context.parsedRules.push(...parseRules(configuration.cssRules, extCssDocument));
    }

    // true if set in configuration
    // or any rule in styleSheet has `debug: global`
    this.context.debug = configuration.debug || this.context.parsedRules.some(ruleData => {
      return ruleData.debug === DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE;
    });
    if (this.context.beforeStyleApplied && typeof this.context.beforeStyleApplied !== 'function') {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid configuration. Type of 'beforeStyleApplied' should be a function, received: '${typeof this.context.beforeStyleApplied}'`);
    }
  }

  /**
   * Invokes {@link applyRules} function with current app context.
   * 
   * This method is bound to the class instance in the constructor because it is called
   * in {@link ThrottleWrapper} and on the DOMContentLoaded event.
   */
  applyRulesCallbackListener() {
    applyRules(this.context);
  }

  /**
   * Initializes ExtendedCss.
   *
   * Should be executed on page ASAP,
   * otherwise the :contains() pseudo-class may work incorrectly.
   */
  init() {
    /**
     * Native Node textContent getter must be intercepted as soon as possible,
     * and stored as it is needed for proper work of :contains() pseudo-class
     * because DOM Node prototype 'textContent' property may be mocked.
     *
     * @see {@link https://github.com/AdguardTeam/ExtendedCss/issues/127}
     */
    nativeTextContent.setGetter();
  }

  /**
   * Applies stylesheet rules on page.
   */
  apply() {
    applyRules(this.context);
    if (document.readyState !== 'complete') {
      document.addEventListener('DOMContentLoaded', this.applyRulesCallbackListener, false);
    }
  }

  /**
   * Disposes ExtendedCss and removes our styles from matched elements.
   */
  dispose() {
    disconnectDocument(this.context);
    this.context.affectedElements.forEach(el => {
      revertStyle(el);
    });
    document.removeEventListener('DOMContentLoaded', this.applyRulesCallbackListener, false);
  }

  /**
   * Exposed for testing purposes only.
   *
   * @returns Array of AffectedElement data objects.
   */
  getAffectedElements() {
    return this.context.affectedElements;
  }

  /**
   * Returns a list of the document's elements that match the specified selector.
   * Uses ExtCssDocument.querySelectorAll().
   *
   * @param selector Selector text.
   * @param noTiming If true, do not print the timings to the console (defaults to true).
   *
   * @throws An error if selector is not valid.
   * @returns A list of elements that match the selector.
   */
  static query(selector) {
    let noTiming = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (typeof selector !== 'string') {
      throw new Error('Selector should be defined as a string.');
    }
    const start = performance.now();
    try {
      return extCssDocument.querySelectorAll(selector);
    } finally {
      const end = performance.now();
      if (!noTiming) {
        extended_css_esm_logger.info(`[ExtendedCss] Elapsed: ${Math.round((end - start) * 1000)} μs.`);
      }
    }
  }

  /**
   * Validates selector.
   *
   * @param inputSelector Selector text to validate.
   *
   * @returns Result of selector validation.
   */
  static validate(inputSelector) {
    try {
      // ExtendedCss in general supports :remove() in selector
      // but ExtendedCss.query() does not support it as it should be parsed by stylesheet parser.
      // so for validation we have to handle selectors with `:remove()` in it
      const _parseRemoveSelector = parseRemoveSelector(inputSelector),
        selector = _parseRemoveSelector.selector;
      ExtendedCss.query(selector);
      return {
        ok: true,
        error: null
      };
    } catch (e) {
      // not valid input `selector` should be logged eventually
      const error = `Error: Invalid selector: '${inputSelector}' -- ${extended_css_esm_getErrorMessage(e)}`;
      return {
        ok: false,
        error
      };
    }
  }
}



// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69529);
;// ./node_modules/@adguard/tswebextension/dist/common/constants.js
/**
 * Filter ID which is used for User rules.
 */ const USER_FILTER_ID = 0;
/**
 * Filter ID which is used for Allowlist.
 */ const ALLOWLIST_FILTER_ID = 100;
/**
 * Custom filters identifiers starts from this number.
 */ const CUSTOM_FILTERS_START_ID = 1000;
/**
 * Filter ID which is used for temporarily disabled rules (as trusted)
 * for the blocking page triggered by rules.
 */ const BLOCKING_TRUSTED_FILTER_ID = (/* unused pure expression or super */ null && (-10));
/**
 * Tab ID for background page.
 */ const BACKGROUND_TAB_ID = (/* unused pure expression or super */ null && (-1));
/**
 * Line feed character.
 */ const LF = '\n';
/**
 * Semicolon character.
 */ const constants_SEMICOLON = ';';
/**
 * Timeout used for deletion of request context data and frame context data from the storage.
 */ const FRAME_DELETION_TIMEOUT_MS = 3000;
/**
 * Document level frame id.
 */ const MAIN_FRAME_ID = 0;
/**
 * Value of the parent frame id if no parent frame exists.
 *
 * @see {@link https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#parentframeid}
 */ const NO_PARENT_FRAME_ID = (/* unused pure expression or super */ null && (-1));


;// ./node_modules/@adguard/tswebextension/dist/css-hits-counter.js
function css_hits_counter_define_property(obj, key, value) {
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



// TODO remove the comment turning off the rule
/* eslint-disable @typescript-eslint/no-explicit-any */ /**
 * This storage is used to keep track of counted rules received from node elements.
 */ class HitsStorage {
    /**
     * Checks if element is counted.
     *
     * @param element Html element.
     * @param rule Rule text.
     *
     * @returns True if element is counted.
     */ isCounted(element, rule) {
        const hitAddress = element[this.randomKey];
        if (hitAddress) {
            const countedHit = this.map.get(hitAddress);
            if (countedHit) {
                return countedHit.element === element && countedHit.rule === rule;
            }
        }
        return false;
    }
    /**
     * Stores rule-element info in storage.
     *
     * @param element Html element.
     * @param rule Rule text.
     */ setCounted(element, rule) {
        const counter = this.getCounter();
        // eslint-disable-next-line no-param-reassign
        element[this.randomKey] = counter;
        this.map.set(counter, {
            element,
            rule
        });
    }
    /**
     * Returns current counter value and increments it.
     *
     * @returns Count number.
     */ getCounter() {
        this.counter += 1;
        return this.counter;
    }
    // TODO replace with nanoid
    /**
     * Random id generator.
     *
     * @returns Random key with 10 characters length.
     */ static generateRandomKey() {
        const keyLength = 10;
        const possibleValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for(let i = 0; i < keyLength; i += 1){
            result += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
        }
        return result;
    }
    constructor(){
        /**
     * Start count number.
     */ css_hits_counter_define_property(this, "counter", 0);
        /**
     * Storage random identificator.
     */ css_hits_counter_define_property(this, "randomKey", HitsStorage.generateRandomKey());
        /**
     * Map storage.
     */ css_hits_counter_define_property(this, "map", new Map());
    }
}
/**
 * Utils class.
 */ class ElementUtils {
    /**
     * Serialize HTML element.
     *
     * @param element Element to serialize.
     *
     * @returns String representation of the element.
     */ static elementToString(element) {
        const s = [];
        s.push('<');
        s.push(element.localName);
        const { attributes } = element;
        for(let i = 0; i < attributes.length; i += 1){
            const attr = attributes[i];
            s.push(' ');
            s.push(attr.name);
            s.push('="');
            const value = attr.value === null ? '' : attr.value.replace(/"/g, '\\"');
            s.push(value);
            s.push('"');
        }
        s.push('>');
        return s.join('');
    }
    /**
     * Appends node children to the array.
     *
     * @param node Element whose children we would like to add.
     * @param arrayWithNodes Array where we add children.
     */ static appendChildren(node, arrayWithNodes) {
        const children = node.querySelectorAll('*');
        if (children && children.length > 0) {
            for(let i = 0; i < children.length; i += 1){
                arrayWithNodes.push(children[i]);
            }
        }
    }
    /**
     * Adds elements into array if they are not in the array yet.
     *
     * @param targetArray Array where we add elements.
     * @param sourceArray Array with elements.
     */ static addUnique(targetArray, sourceArray) {
        if (sourceArray.length > 0) {
            for(let i = 0; i < sourceArray.length; i += 1){
                const sourceElement = sourceArray[i];
                if (targetArray.indexOf(sourceElement) === -1) {
                    targetArray.push(sourceElement);
                }
            }
        }
    }
    /**
     * Removes all elements in array.
     *
     * @param elements Array with elements.
     */ static removeElements(elements) {
        for(let i = 0; i < elements.length; i += 1){
            const element = elements[i];
            element.remove();
        }
    }
    /**
     * Parses hits info from style content.
     *
     * @param content Style content.
     * @param attributeMarker Attribute marker.
     *
     * @returns Rule info or null.
     */ static parseInfo(content, attributeMarker) {
        if (!content || content.indexOf(attributeMarker) < 0) {
            return null;
        }
        let filterIdAndRuleText = decodeURIComponent(content);
        // 'content' value may include open and close quotes.
        filterIdAndRuleText = ElementUtils.removeQuotes(filterIdAndRuleText);
        // Remove prefix
        filterIdAndRuleText = filterIdAndRuleText.substring(attributeMarker.length);
        // Attribute 'content' in css looks like: {content: 'adguard{filterId};{ruleIndex}'}
        const index = filterIdAndRuleText.indexOf(';');
        if (index < 0) {
            return null;
        }
        const filterId = Number.parseInt(filterIdAndRuleText.slice(0, index), 10);
        if (Number.isNaN(filterId)) {
            return null;
        }
        const ruleIndex = Number.parseInt(filterIdAndRuleText.slice(index + 1), 10);
        if (Number.isNaN(ruleIndex)) {
            return null;
        }
        return {
            filterId,
            ruleIndex
        };
    }
    /**
     * Parses hits info from style content.
     *
     * @param content Style.
     * @param attributeMarker Attribute marker.
     *
     * @returns Rule info or null.
     */ static parseExtendedStyleInfo(content, attributeMarker) {
        const important = '!important';
        const indexOfImportant = content.lastIndexOf(important);
        if (indexOfImportant === -1) {
            return ElementUtils.parseInfo(content, attributeMarker);
        }
        const contentWithoutImportant = content.substring(0, indexOfImportant).trim();
        return ElementUtils.parseInfo(contentWithoutImportant, attributeMarker);
    }
    /**
     * Unquotes specified value.
     *
     * @param value Value to unquote.
     *
     * @returns Unquoted value.
     */ static removeQuotes(value) {
        if (value.length > 1 && (value[0] === '"' && value[value.length - 1] === '"' || value[0] === '\'' && value[value.length - 1] === '\'')) {
            // Remove double-quotes or single-quotes
            return value.substring(1, value.length - 1);
        }
        return value;
    }
}
const DEFAULT_ELEMENT_TO_STRING = true;
/**
 * Class represents collecting css style hits process.
 *
 * During applying css styles to element we add special 'content:' attribute
 *  e.g.: ".selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}".
 * After the style is applied we parse this "content" attribute and call provided via constructor callback function.
 */ class CssHitsCounter {
    /**
     * Stops css hits counting process.
     */ stop() {
        this.onCssHitsFoundCallback = ()=>{};
        if (this.observer) {
            this.observer.disconnect();
        }
    }
    /**
     * Callback used to collect statistics of elements affected by extended css rules.
     *
     * @param affectedEl Affected element.
     *
     * @returns Affected element.
     */ countAffectedByExtendedCss(affectedEl) {
        if (affectedEl && affectedEl.rules && affectedEl.rules.length > 0) {
            const result = [];
            for (const rule of affectedEl.rules){
                if (rule.style && rule.style.content) {
                    const ruleInfo = ElementUtils.parseExtendedStyleInfo(rule.style.content, CssHitsCounter.CONTENT_ATTR_PREFIX);
                    if (ruleInfo === null) {
                        continue;
                    }
                    const { filterId, ruleIndex } = ruleInfo;
                    if (filterId !== undefined && ruleIndex !== undefined) {
                        const element = this.elementToString ? ElementUtils.elementToString(affectedEl.node) : affectedEl.node;
                        result.push({
                            filterId,
                            ruleIndex,
                            element
                        });
                        // clear style content to avoid duplicate counting
                        rule.style.content = '';
                    }
                }
            }
            this.onCssHitsFoundCallback(result);
        }
        return affectedEl;
    }
    /**
     * Starts counting process.
     */ startCounter() {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            this.countCssHits();
            document.removeEventListener('readystatechange', this.startCounter);
        }
    }
    /**
     * Counts css hits.
     */ countCssHits() {
        this.countAllCssHits();
        this.countCssHitsForMutations();
    }
    /**
     * Counts css hits for already affected elements.
     */ countAllCssHits() {
        // we don't start counting again all css hits till previous count process wasn't finished
        if (this.countIsWorking) {
            return;
        }
        this.countIsWorking = true;
        const elements = document.querySelectorAll('*');
        this.countCssHitsBatch(elements, 0, CssHitsCounter.CSS_HITS_BATCH_SIZE, CssHitsCounter.CSS_HITS_BATCH_SIZE, [], (result)=>{
            if (result.length > 0) {
                this.onCssHitsFoundCallback(result);
            }
            this.countIsWorking = false;
        });
    }
    /**
     * Main calculation function.
     * 1. Selects sub collection from elements.
     * 2. For each element from sub collection: retrieves calculated css 'content'
     * attribute and if it contains 'adguard'
     * marker then retrieves rule text and filter identifier.
     * 3. Starts next task with some delay.
     *
     * @param elements Collection of all elements.
     * @param start Start of batch.
     * @param end End of batch.
     * @param step Size of batch.
     * @param result Collection for save result.
     * @param callback Finish callback.
     */ // eslint-disable-next-line max-len
    countCssHitsBatch(elements, start, end, step, result, callback) {
        const length = Math.min(end, elements.length);
        result = result.concat(this.countCssHitsForElements(elements, start, length));
        if (length === elements.length) {
            callback(result);
            return;
        }
        start = end;
        end += step;
        // Start next task with some delay
        window.setTimeout(()=>{
            this.countCssHitsBatch(elements, start, end, step, result, callback);
        }, CssHitsCounter.COUNT_CSS_HITS_BATCH_DELAY);
    }
    /**
     * Counts css hits for array of elements.
     *
     * @param elements Array of elements.
     * @param start Start of batch.
     * @param length Length of batch.
     *
     * @returns Data with information about rule and element.
     */ countCssHitsForElements(elements, start, length) {
        start = start || 0;
        length = length || elements.length;
        const result = [];
        for(let i = start; i < length; i += 1){
            const element = elements[i];
            const cssHitData = CssHitsCounter.getCssHitData(element);
            if (!cssHitData) {
                continue;
            }
            const { filterId, ruleIndex } = cssHitData;
            const ruleAndFilterString = filterId + constants_SEMICOLON + ruleIndex;
            if (this.hitsStorage.isCounted(element, ruleAndFilterString)) {
                continue;
            }
            this.hitsStorage.setCounted(element, ruleAndFilterString);
            result.push({
                filterId,
                ruleIndex,
                element: this.elementToString ? ElementUtils.elementToString(element) : element
            });
        }
        return result;
    }
    /**
     * Counts css hits for mutations.
     */ countCssHitsForMutations() {
        // eslint-disable-next-line prefer-destructuring
        const MutationObserver = window.MutationObserver;
        if (!MutationObserver) {
            return;
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        /**
         * To avoid cases where two css hits counters try to append and remove the
         * same elements one after the other, we do not append already met nodes.
         */ const probesWeakSet = new WeakSet();
        let timeoutId = null;
        this.observer = new MutationObserver((mutationRecords)=>{
            // Collect probe elements, count them, then remove from their targets
            const probeElements = [];
            const childrenOfProbeElements = [];
            const potentialProbeElements = [];
            mutationRecords.forEach((mutationRecord)=>{
                if (mutationRecord.addedNodes.length === 0) {
                    return;
                }
                for(let i = 0; i < mutationRecord.addedNodes.length; i += 1){
                    const node = mutationRecord.addedNodes[i];
                    if (!(node instanceof Element) || CssHitsCounter.isIgnoredNodeTag(node.tagName)) {
                        continue;
                    }
                    const { target } = mutationRecord;
                    if (!node.parentNode && target) {
                        // If this node has been appended to the DOM and counted once, do not add
                        // it again.
                        if (probesWeakSet.has(node)) {
                            return;
                        }
                        // Most likely this is a "probe" element that was added and then
                        // immediately removed from DOM.
                        // We re-add it and check if any rule matched it
                        probeElements.push(node);
                        // To ensure that this "probe" node has only been added once to the DOM,
                        // we add it to the weak set.
                        probesWeakSet.add(node);
                        // CSS rules could be applied to the nodes inside probe element
                        // that's why we get all child elements of added node
                        ElementUtils.appendChildren(node, childrenOfProbeElements);
                        if (this.observer) {
                            this.observer.disconnect();
                        }
                        mutationRecord.target.appendChild(node);
                    } else if (node.parentNode && target) {
                        // Sometimes probe elements are appended to the DOM
                        potentialProbeElements.push(node);
                        ElementUtils.appendChildren(node, potentialProbeElements);
                    }
                }
            });
            // If the list of potential probe elements is relatively small,
            // we can count CSS hits immediately
            if (potentialProbeElements.length > 0 && potentialProbeElements.length <= CssHitsCounter.CSS_HITS_BATCH_SIZE) {
                const result = this.countCssHitsForElements(potentialProbeElements, 0, null);
                if (result.length > 0) {
                    this.onCssHitsFoundCallback(result);
                }
            }
            const allProbeElements = [];
            ElementUtils.addUnique(allProbeElements, childrenOfProbeElements);
            ElementUtils.addUnique(allProbeElements, probeElements);
            if (allProbeElements.length > 0) {
                const result = this.countCssHitsForElements(allProbeElements, 0, null);
                if (result.length > 0) {
                    this.onCssHitsFoundCallback(result);
                }
                /**
                 * Don't remove child elements of probe elements
                 * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1096.
                 */ ElementUtils.removeElements(probeElements);
                this.startObserver();
            }
            // debounce counting all css hits when mutation record fires
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(()=>{
                this.countAllCssHits();
                window.clearTimeout(timeoutId);
            }, CssHitsCounter.COUNT_ALL_CSS_HITS_TIMEOUT_MS);
        });
        this.startObserver();
    }
    /**
     * Starts mutation observer.
     */ startObserver() {
        if (this.observer) {
            // TODO: Check, maybe we should observer for 'characterData' and
            // 'characterDataOldValue' like it was in the old extension code
            this.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    }
    /**
     * Function retrieves css hits data from element style content attribute contains data injected with AdGuard.
     *
     * @param element Element to check.
     *
     * @returns Basic rule info (filterId and ruleIndex only) or null.
     */ static getCssHitData(element) {
        const style = getComputedStyle(element);
        return ElementUtils.parseInfo(style.content, CssHitsCounter.CONTENT_ATTR_PREFIX);
    }
    /**
     * Checks if tag is ignored.
     *
     * @param nodeTag Tag name to check.
     *
     * @returns True if tag is ignored.
     */ static isIgnoredNodeTag(nodeTag) {
        const ignoredTags = [
            'script'
        ];
        return ignoredTags.includes(nodeTag.toLowerCase());
    }
    /**
     * This function prepares calculation of css hits.
     * We are waiting for 'load' event and start calculation.
     *
     * @param callback Which receives {@link ICountedElement} and handles counted css hits.
     * @param options CssHitsCounter options.
     */ constructor(callback, options){
        /**
     * Callback function for counted css hits handling.
     */ css_hits_counter_define_property(this, "onCssHitsFoundCallback", void 0);
        /**
     * Hits storage.
     */ css_hits_counter_define_property(this, "hitsStorage", new HitsStorage());
        /**
     * Mutation observer.
     */ css_hits_counter_define_property(this, "observer", null);
        /**
     * Counting on process flag.
     */ css_hits_counter_define_property(this, "countIsWorking", false);
        /**
     * Flag determining if we should convert elements to string, or not.
     *
     * @private
     */ css_hits_counter_define_property(this, "elementToString", DEFAULT_ELEMENT_TO_STRING);
        if (options) {
            const { elementToString } = options;
            this.elementToString = elementToString;
        }
        this.onCssHitsFoundCallback = callback;
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.countCssHits();
        } else {
            document.addEventListener('readystatechange', this.startCounter.bind(this));
        }
    }
}
/**
     * We split CSS hits counting into smaller batches of elements and schedule them one by one using setTimeout.
     */ css_hits_counter_define_property(CssHitsCounter, "COUNT_CSS_HITS_BATCH_DELAY", 5);
/**
     * Size of small batches of elements we count.
     */ css_hits_counter_define_property(CssHitsCounter, "CSS_HITS_BATCH_SIZE", 25);
/**
     * In order to find elements hidden by AdGuard we look for a `:content` pseudo-class
     * with values starting with this prefix. Filter information will be
     * encoded in this value as well.
     */ css_hits_counter_define_property(CssHitsCounter, "CONTENT_ATTR_PREFIX", 'adguard');
/**
     * We delay countAllCssHits function if it was called too frequently from mutationObserver.
     */ css_hits_counter_define_property(CssHitsCounter, "COUNT_ALL_CSS_HITS_TIMEOUT_MS", 500);


;// ./node_modules/@adguard/tswebextension/dist/content-script.mv3.js
function content_script_mv3_define_property(obj, key, value) {
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









/**
 * This class applies cookie rules in page context.
 *
 * Steps:
 * - content script requests matching cookie rules for the frame
 *   (in which this script is executed)
 * - service returns matching set of rules data to content script
 * - the rules are applied with {@link CookieController}
 * - filtering log receives callback with applied rules data.
 *
 * The important point is: there is no way to run cookie controller script via
 * browser.tabs.executeScript cause one only could be executed for all frames or
 * main frame only. But it's not correct cause there should be different rules
 * for each frame.
 */ class CookieController {
    /**
     * Init cookie rules processing.
     */ init() {
        this.process();
    }
    /**
     * Sends {@link MessageType.GetCosmeticData} message to background and process response.
     */ async process() {
        const response = await sendAppMessage({
            type: MessageType.GetCookieRules,
            payload: {
                documentUrl: document.location.href
            }
        });
        if (response) {
            this.applyCookieRules(response);
        }
    }
    /**
     * Creates new {@link CookieController} instance.
     */ constructor(){
        /**
     * Number of {@link MessageType.GetCookieRules} requests.
     */ content_script_mv3_define_property(this, "tries", 0);
        /**
     * Process {@link MessageType.ContentScriptCookieRulesData} response from background.
     *
     * If {@link response.isAppStarted} is false, retry
     * request after {@link GET_COOKIE_RULES_RETRY_TIMEOUT_MS} milliseconds.
     * Else apply cookie rules from {@link response.cookieRules}.
     *
     * @param response Response cookie rules data from background.
     */ content_script_mv3_define_property(this, "applyCookieRules", async (response)=>{
            const { isAppStarted, cookieRules } = response;
            if (!isAppStarted && this.tries <= CookieController.MAX_GET_COOKIE_RULES_TRIES) {
                this.tries += 1;
                setTimeout(this.process, CookieController.GET_COOKIE_RULES_RETRY_TIMEOUT_MS);
                return;
            }
            if (!response || cookieRules === undefined || cookieRules.length === 0) {
                return;
            }
            try {
                const onRuleApplied = (data)=>{
                    sendAppMessage({
                        type: MessageType.SaveCookieLogEvent,
                        payload: data
                    });
                };
                const cookieController = new CookieController$1(onRuleApplied);
                cookieController.apply(cookieRules);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            /**
             * Content script injected on in every frame, but document cookie API in
             * iframes can be blocked by website CSP policy. We ignore this cases.
             * Content script matching defined in browser extension.
             * TODO: move error handling to it.
             */ }
        });
        this.process = this.process.bind(this);
    }
}
/**
     * Retry timeout for {@link MessageType.GetCookieRules} request to background in milliseconds.
     */ content_script_mv3_define_property(CookieController, "GET_COOKIE_RULES_RETRY_TIMEOUT_MS", 100);
/**
     * Max {@link MessageType.GetCookieRules} request limit.
     */ content_script_mv3_define_property(CookieController, "MAX_GET_COOKIE_RULES_TRIES", 200);
/**
 * This class applies cosmetic rules in page context.
 */ class CosmeticController {
    /**
     * Init cosmetic processing.
     */ init() {
        this.process();
    }
    /**
     * Sends {@link MessageType.GetCosmeticData} message to background and process response.
     */ async process() {
        const res = await sendAppMessage({
            type: MessageType.GetCosmeticData,
            payload: {
                documentUrl: window.location.href
            }
        });
        if (res) {
            this.applyExtendedCss(res);
        }
    }
    /**
     * Process {@link MessageType.GetCosmeticData} response from background.
     *
     * If {@link cosmeticData.isAppStarted} is false, retry
     * request after {@link GET_COSMETIC_DATA_RETRY_TIMEOUT_MS} milliseconds.
     * Else apply extended css rules from {@link cosmeticData.extCssText}
     * and enable {@link CssHitsCounter} if {@link cosmeticData.areHitsStatsCollected} is true.
     *
     * @param cosmeticData Response cosmetic data from background.
     */ applyExtendedCss(cosmeticData) {
        const { isAppStarted, extCssRules, areHitsStatsCollected } = cosmeticData;
        if (!isAppStarted && this.tries <= CosmeticController.MAX_GET_COSMETIC_DATA_TRIES) {
            this.tries += 1;
            setTimeout(this.process, CosmeticController.GET_COSMETIC_DATA_RETRY_TIMEOUT_MS);
            return;
        }
        if (areHitsStatsCollected) {
            this.cssHitsCounter = CosmeticController.createCssHitsCounter();
        }
        if (!extCssRules || extCssRules.length === 0) {
            return;
        }
        const extendedCssConfig = {
            cssRules: extCssRules
        };
        if (areHitsStatsCollected) {
            extendedCssConfig.beforeStyleApplied = this.beforeStyleApplied;
        }
        const extendedCss = new ExtendedCss(extendedCssConfig);
        extendedCss.apply();
    }
    /**
     * Preprocess {@link IAffectedElement} for {@link ExtendedCss} instance.
     *
     * @param el Record with required 'content' style property in rules.
     *
     * @returns Affected element record.
     */ beforeStyleApplied(el) {
        if (!this.cssHitsCounter) {
            return el;
        }
        return this.cssHitsCounter.countAffectedByExtendedCss(el);
    }
    /**
     * Create new {@link CssHitsCounter} instance.
     *
     * @returns CssHitsCounter instance.
     */ static createCssHitsCounter() {
        return new CssHitsCounter((stats)=>{
            sendAppMessage({
                type: MessageType.SaveCssHitsStats,
                payload: stats
            });
        });
    }
    /**
     * Creates new {@link CosmeticController} instance.
     */ constructor(){
        /**
     * Number of {@link MessageType.GetCosmeticData} requests.
     */ content_script_mv3_define_property(this, "tries", 0);
        /**
     * Module that collects statistics about the usage of CSS rules.
     */ content_script_mv3_define_property(this, "cssHitsCounter", void 0);
        this.process = this.process.bind(this);
        this.beforeStyleApplied = this.beforeStyleApplied.bind(this);
    }
}
/**
     * Retry timeout for {@link MessageType.GetCosmeticData} request to background in milliseconds.
     */ content_script_mv3_define_property(CosmeticController, "GET_COSMETIC_DATA_RETRY_TIMEOUT_MS", 100);
/**
     * Max {@link MessageType.GetCosmeticData} request limit.
     */ content_script_mv3_define_property(CosmeticController, "MAX_GET_COSMETIC_DATA_TRIES", 200);
const cosmeticController = new CosmeticController();
cosmeticController.init();
const cookieController = new CookieController();
cookieController.init();
createAssistantMessageListener();

;// ./src/common/messages/constants.js
const constants_APP_MESSAGE_HANDLER_NAME = 'app';
const constants_MessageType = {
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
function logger_getErrorMessage(error) {
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


;// ./src/common/messages/message-handler.js
function message_handler_define_property(obj, key, value) {
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
        browser_polyfill.runtime.onMessage.addListener(this.handleMessage);
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
                logger_logger.error('An error occurred while handling message:', message, 'error:', e);
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
        message_handler_define_property(this, "listeners", new Map());
        this.handleMessage = this.handleMessage.bind(this);
        this.customHandler = customHandler;
    }
}

;// ./src/content-script/content-utils/message-handler.js
function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) return descriptor.get.call(receiver);
    return descriptor.value;
}
function _class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function _class_check_private_static_field_descriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _class_static_private_field_spec_get(receiver, classConstructor, descriptor) {
    _class_check_private_static_access(receiver, classConstructor);
    _class_check_private_static_field_descriptor(descriptor, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_static_private_method_get(receiver, classConstructor, method) {
    _class_check_private_static_access(receiver, classConstructor);
    return method;
}



class ContentScriptMessageHandler extends MessageHandler {
    handleMessage(message, sender) {
        // Check type.
        if (!ContentScriptMessageHandler.isValidMessageType(message)) {
            // Do not print errors for internal assistant messages.
            if (!_class_static_private_method_get(ContentScriptMessageHandler, ContentScriptMessageHandler, isInternalAssistantMessage).call(ContentScriptMessageHandler, message)) {
                logger_logger.error('[ext.ContentScriptMessageHandler.handleMessage]: invalid message:', message);
            }
            return;
        }
        const listener = this.listeners.get(message.type);
        if (listener) {
            return Promise.resolve(listener(message, sender));
        }
    }
}
/**
   * For these messages we have separate handlers in the content script,
   * provided from tswebextension.
   */ var _ExcludedAssistantMessages = {
    writable: true,
    value: new Set([
        MessageType.InitAssistant,
        MessageType.CloseAssistant
    ])
};
// Checks if the message is internal assistant message.
function isInternalAssistantMessage(message) {
    return _class_static_private_field_spec_get(ContentScriptMessageHandler, ContentScriptMessageHandler, _ExcludedAssistantMessages).has(message.type);
}
const messageHandler = new ContentScriptMessageHandler();

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
 */ const unwrapErrorResponse = (response)=>{
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
        const response = await browser_polyfill.runtime.sendMessage({
            handlerName: constants_APP_MESSAGE_HANDLER_NAME,
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

;// ./src/common/messages/index.js
/**
 * Since exports from './constants' are: the MessageType enum and a lot of types,
 * and imports there are types only, so it should not affect bundle size
 */ // eslint-disable-next-line no-restricted-syntax





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

;// ./src/content-script/content-utils/elements.js
function elements_class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function elements_class_static_private_method_get(receiver, classConstructor, method) {
    elements_class_check_private_static_access(receiver, classConstructor);
    return method;
}
const MAX_Z_INDEX = '2147483647';
class Elements {
    static createStyleElement(css) {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(css));
        return styleElement;
    }
    static appendIframe({ target, html, styles, themeClass, uiDir: uiDir1 }) {
        const dir = elements_class_static_private_method_get(Elements, Elements, uiDir).call(Elements, uiDir1);
        const styleElement = Elements.createStyleElement(styles);
        // Build a full document so the theme class can live on the root <html>,
        // letting theme-tokens.css `.abu-theme-dark` resolve inside the iframe.
        const rootClass = themeClass ? ` class="${themeClass}"` : '';
        const prependedHtml = `<!doctype html><html${rootClass} dir="${dir}"><head>${styleElement.outerHTML}</head><body>${html}</body></html>`;
        const iframe = document.createElement('iframe');
        iframe.src = 'about:blank';
        iframe.dir = dir;
        iframe.style.position = 'fixed';
        iframe.style.zIndex = MAX_Z_INDEX;
        iframe.srcdoc = prependedHtml;
        target.insertAdjacentElement('afterbegin', iframe);
        return iframe;
    }
    static appendDiv({ target, html, themeClass, uiDir: uiDir1 }) {
        const div = document.createElement('div');
        div.dir = elements_class_static_private_method_get(Elements, Elements, uiDir).call(Elements, uiDir1);
        if (themeClass) {
            div.className = themeClass;
        }
        div.innerHTML = html;
        target.insertAdjacentElement('afterbegin', div);
        div.style.zIndex = MAX_Z_INDEX;
        return div;
    }
}
function uiDir(uiDir) {
    return uiDir === 'rtl' ? 'rtl' : 'ltr';
}

;// ./src/content-script/content-utils/alerts.js

class Alerts {
    static appendAlertElement(props) {
        const { target, html, isExtensionTab, alertStyles, alertContainerStyles, themeClass, uiDir } = props;
        const alertContainerElement = Elements.createStyleElement(alertContainerStyles);
        document.body.insertAdjacentElement('afterbegin', alertContainerElement);
        if (isExtensionTab) {
            return Elements.appendDiv({
                target,
                html,
                themeClass,
                uiDir
            });
        }
        return Elements.appendIframe({
            target,
            html,
            styles: alertStyles,
            themeClass,
            uiDir
        });
    }
    static genAlertHtml(props) {
        const { title, text, icon } = props;
        const iconBlock = icon ? `<img class="popup-alert__icon" src="${icon}" alt="">` : '';
        let descBlock = '';
        if (text && text.length > 0) {
            descBlock = `<div class="popup-alert__desc">
                            ${text}
                        </div>`;
        }
        // don't show description text if it is same as title or if it is equal to undefined
        if (title === text || text === 'undefined') {
            descBlock = '';
        }
        let titleBlock = '';
        if (title && title.length > 0) {
            titleBlock = `<div class="popup-alert__title">
                            ${title}
                        </div>`;
        }
        return `<div class="popup-alert">
                    ${iconBlock}
                    <div class="popup-alert__content">
                        ${titleBlock}
                        ${descBlock}
                    </div>
                </div>`;
    }
}

;// ./src/content-script/content-utils/popups.js
function popups_class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) return descriptor.get.call(receiver);
    return descriptor.value;
}
function popups_class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function popups_class_check_private_static_field_descriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function popups_class_static_private_field_spec_get(receiver, classConstructor, descriptor) {
    popups_class_check_private_static_access(receiver, classConstructor);
    popups_class_check_private_static_field_descriptor(descriptor, "get");
    return popups_class_apply_descriptor_get(receiver, descriptor);
}
function popups_class_static_private_method_get(receiver, classConstructor, method) {
    popups_class_check_private_static_access(receiver, classConstructor);
    return method;
}





class Popups {
    static showAlertPopup({ data }) {
        const { text, title, icon, isExtensionTab, alertStyles, alertContainerStyles, themeMode, uiDir } = data;
        if (!title && !text) {
            return;
        }
        let messages = [];
        if (Array.isArray(text)) {
            messages = text;
        } else {
            messages = [
                text
            ];
        }
        let fullText = '';
        for(let i = 0; i < messages.length; i += 1){
            if (i > 0) {
                fullText += ', ';
            }
            fullText += messages[i];
        }
        const html = Alerts.genAlertHtml({
            title,
            text: fullText,
            icon
        });
        popups_class_static_private_method_get(Popups, Popups, appendAlertPopup).call(Popups, 0, {
            html,
            isExtensionTab,
            alertStyles,
            alertContainerStyles,
            themeClass: resolveThemeClass(themeMode),
            uiDir
        });
    }
    static showRuleLimitsAlert({ data }) {
        const { isExtensionTab, mainText, linkText, closeText, alertStyles, alertContainerStyles, themeMode, uiDir } = data;
        const iframeHtml = `
            <div id="rules-limits-popup" class="rules-limits-popup">
                <div class="rules-limits-popup__info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                </div>
                <div class="rules-limits-popup__content">
                    <p>${mainText} <button id="open-rule-limits-link" type="button">${linkText}</button></p>
                </div>
                <button
                    aria-label="${closeText || ''}"
                    type="button"
                    class="rules-limits-popup__close close-iframe"
                ></button>
            </div>
        `;
        popups_class_static_private_method_get(Popups, Popups, appendPopup).call(Popups, 0, {
            iframeHtml,
            iframeStyles: alertContainerStyles,
            iframeClassName: 'rules-limits-iframe',
            alertStyles,
            isExtensionTab,
            themeClass: resolveThemeClass(themeMode),
            uiDir,
            onIframeInjected: (iframe)=>{
                const isListening = popups_class_static_private_method_get(Popups, Popups, handleOpenRulesLimitsPage).call(Popups, iframe);
                if (!isListening) {
                    iframe.addEventListener('load', ()=>{
                        popups_class_static_private_method_get(Popups, Popups, handleOpenRulesLimitsPage).call(Popups, iframe);
                    });
                }
                // iframe should be hidden after some time
                const removeTimeout = setTimeout(()=>{
                    iframe.parentNode?.removeChild(iframe);
                }, popups_class_static_private_field_spec_get(Popups, Popups, _RULES_LIMITS_HIDE_TIMEOUT_MS));
                /**
         * Mouseover event listener:
         * - clear timeout to prevent iframe from closing if user hovers over the iframe;
         * - remove event listener after first hover.
         */ const focusListener = ()=>{
                    clearTimeout(removeTimeout);
                    iframe.removeEventListener('mouseover', focusListener);
                };
                iframe.addEventListener('mouseover', focusListener);
            }
        });
        return true;
    }
    static showRateUsPopup({ data }) {
        const { alertStyles, alertContainerStyles, strings, images, rateExtensionUrl, isExtensionTab, themeMode, uiDir } = data;
        if (!alertStyles || !alertContainerStyles || !strings || !images || !rateExtensionUrl) {
            return;
        }
        const s = strings;
        const themeClass = resolveThemeClass(themeMode);
        // `logoDark` is the light (white) logo for the dark surface; `logoLight`
        // is its counterpart for the light surface. Images are inlined data URIs.
        const logoSrc = themeClass === THEME_CLASS_DARK ? images.logoDark : images.logoLight;
        const iframeHtml = `
<div class="rate-us-popup js-rate-us-popup">
  <button type="button" class="close-btn js-close-btn" aria-label="${s.close || ''}">×</button>
  <div class="screen current prompt js-screen js-screen-prompt">
    <img class="logo" src="${logoSrc}" alt="">
    <h2 class="heading">${s.rate_us_hooray}</h2>
    <h2 class="subheading">${s.rate_us_adfree_browsing_achieved}</h2>
    <img class="bochko" src="${images.mascot}" alt="">
    <h2 class="question">${s.options_do_you_like_abu}</h2>
    <div class="actions">
      <button type="button" class="js-btn-yes">${s.yes}</button>
      <button type="button" class="js-btn-no">${s.no}</button>
    </div>
  </div>
  <div class="screen answer answer-yes js-screen js-screen-answer-yes">
    <div class="stars">${popups_class_static_private_field_spec_get(Popups, Popups, _STAR_SVG).repeat(5)}</div>
    <h2 class="heading">${s.rate_us_prompt}</h2>
    <a href="${rateExtensionUrl}" target="_blank" rel="noopener noreferrer" class="btn js-close-btn">${s.rate_us_button}</a>
    <button type="button" class="no-btn js-close-btn">${s.rate_us_no_thanks}</button>
  </div>
  <div class="screen answer answer-no js-screen js-screen-answer-no">
    <h2 class="heading">${s.rate_us_tell_how_to_improve}</h2>
    <form class="form js-feedback-form">
      <textarea class="message-field" name="message" placeholder="${s.rate_us_message}" required></textarea>
      <input class="email-field" type="email" name="email" placeholder="${s.rate_us_email}" required>
      <button type="submit" class="btn">${s.rate_us_send_feedback}</button>
    </form>
    <div class="thank-you-msg">
      <h1 class="heading">${s.rate_us_thank_you}</h1>
    </div>
  </div>
</div>`;
        popups_class_static_private_method_get(Popups, Popups, appendPopup).call(Popups, 0, {
            iframeHtml,
            iframeStyles: alertContainerStyles,
            iframeClassName: 'rate-us-iframe',
            alertStyles,
            isExtensionTab,
            themeClass,
            uiDir,
            onIframeInjected: (iframe)=>{
                const isReady = popups_class_static_private_method_get(Popups, Popups, handleRateUsIframe).call(Popups, iframe);
                if (!isReady) {
                    iframe.addEventListener('load', ()=>{
                        popups_class_static_private_method_get(Popups, Popups, handleRateUsIframe).call(Popups, iframe);
                    });
                }
            }
        });
    }
}
var _triesCount = {
    writable: true,
    value: 10
};
// Lucide `star` icon, inlined and filled (`fill="currentColor"`, no stroke) so it
// renders as a solid rating star. Color is set on `.stars` in rate-us-popup.css.
var _STAR_SVG = {
    writable: true,
    value: '<svg class="star" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
};
var _HIDE_TIMEOUT_MS = {
    writable: true,
    value: 1000 * 4
};
var _RULES_LIMITS_HIDE_TIMEOUT_MS = {
    writable: true,
    value: 1000 * 6
};
var _retryTimeoutMs = {
    writable: true,
    value: 500
};
/**
   * Remove iframe after click event fire on link
   * NOTICE: if here is used value equal to 0,
   * then iframe is closed early than link is clicked
   */ var _removeFrameTimeoutMs = {
    writable: true,
    value: 10
};
/**
   * Sizes an injected iframe to the rendered height of its content card
   * (border included, plus a small buffer — see common/iframe-fit.js), so
   * container CSS only fixes the width and long localizations grow the popup
   * instead of being clipped. No-op if the document isn't accessible yet.
   *
   * @param {HTMLIFrameElement} iframe
   */ function fitIframeToContent(iframe) {
    const height = getCardFitHeight(iframe.contentDocument?.body?.firstElementChild);
    if (height) {
        iframe.style.height = `${height}px`;
    }
}
function appendAlertPopup(count, props) {
    if (count >= popups_class_static_private_field_spec_get(Popups, Popups, _triesCount)) {
        return;
    }
    if (document.body) {
        const alertElement = Alerts.appendAlertElement({
            ...props,
            target: document.body
        });
        alertElement.classList.add('alert-iframe');
        if (alertElement.tagName === 'IFRAME') {
            alertElement.onload = ()=>{
                popups_class_static_private_method_get(Popups, Popups, fitIframeToContent).call(Popups, alertElement);
                alertElement.style.visibility = 'visible';
            };
        } else {
            // Extension tabs get a plain div (no `load` event), and it needs no
            // sizing or flash guard — reveal it immediately.
            alertElement.style.visibility = 'visible';
        }
        setTimeout(()=>{
            if (alertElement && alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
        }, popups_class_static_private_field_spec_get(Popups, Popups, _HIDE_TIMEOUT_MS));
    } else {
        setTimeout(()=>{
            popups_class_static_private_method_get(Popups, Popups, appendAlertPopup).call(Popups, count + 1, props);
        }, popups_class_static_private_field_spec_get(Popups, Popups, _retryTimeoutMs));
    }
}
function appendPopup(count, props) {
    if (count >= popups_class_static_private_field_spec_get(Popups, Popups, _triesCount)) {
        return;
    }
    const { isExtensionTab, iframeStyles, iframeClassName, iframeHtml, alertStyles, onIframeInjected, themeClass, uiDir } = props;
    if (document.body && !isExtensionTab) {
        const iframeCss = Elements.createStyleElement(iframeStyles);
        document.body.insertAdjacentElement('afterbegin', iframeCss);
        const iframe = Elements.appendIframe({
            target: document.body,
            html: iframeHtml,
            styles: alertStyles,
            themeClass,
            uiDir
        });
        iframe.classList.add(iframeClassName);
        // The container CSS keeps the iframe hidden until its document is ready,
        // so the unstyled canvas (white/black depending on browser theme) never flashes.
        iframe.addEventListener('load', ()=>{
            popups_class_static_private_method_get(Popups, Popups, fitIframeToContent).call(Popups, iframe);
            iframe.style.visibility = 'visible';
        });
        const isListening = popups_class_static_private_method_get(Popups, Popups, handleCloseIframe).call(Popups, iframe);
        if (!isListening) {
            iframe.addEventListener('load', ()=>{
                popups_class_static_private_method_get(Popups, Popups, handleCloseIframe).call(Popups, iframe);
            });
        }
        if (onIframeInjected) {
            onIframeInjected(iframe);
        }
    } else {
        setTimeout(()=>{
            popups_class_static_private_method_get(Popups, Popups, appendPopup).call(Popups, count + 1, props);
        }, 500);
    }
}
function handleCloseIframe(iframe) {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
        return false;
    }
    const closeElements = iframeDocument.querySelectorAll('.close-iframe');
    if (closeElements.length === 0) {
        return false;
    }
    closeElements.forEach((element)=>{
        element.addEventListener('click', ()=>{
            setTimeout(()=>{
                iframe.parentNode?.removeChild(iframe);
            }, popups_class_static_private_field_spec_get(Popups, Popups, _removeFrameTimeoutMs));
        });
    });
    return true;
}
function handleOpenRulesLimitsPage(iframe) {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
        return false;
    }
    const link = iframeDocument.querySelector('#open-rule-limits-link');
    if (!link) {
        return false;
    }
    const clickHandler = ()=>{
        // Open rules limits settings page.
        sendMessage({
            type: constants_MessageType.OpenRulesLimitsTab
        });
        // After redirect to settings page, close iframe.
        const removeTimeout = setTimeout(()=>{
            iframe.parentNode?.removeChild(iframe);
            clearTimeout(removeTimeout);
        }, popups_class_static_private_field_spec_get(Popups, Popups, _removeFrameTimeoutMs));
        link.removeEventListener('click', clickHandler);
    };
    link.addEventListener('click', clickHandler);
    return true;
}
function handleRateUsIframe(iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
        return false;
    }
    const popup = doc.querySelector('.js-rate-us-popup');
    const btnYes = doc.querySelector('.js-btn-yes');
    const btnNo = doc.querySelector('.js-btn-no');
    const form = doc.querySelector('.js-feedback-form');
    const closeBtns = doc.querySelectorAll('.js-close-btn');
    if (!popup || !btnYes || !btnNo || !form) {
        return false;
    }
    const showScreen = (selector)=>{
        doc.querySelectorAll('.js-screen').forEach((el)=>el.classList.remove('current'));
        const screen = doc.querySelector(selector);
        if (screen) {
            screen.classList.add('current');
        }
    };
    const removeIframe = ()=>{
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    };
    const handleClose = ()=>{
        popup.classList.remove('opaque');
    };
    const handleTransitionEnd = (e)=>{
        if (e.target === popup && !popup.classList.contains('opaque')) {
            removeIframe();
        }
    };
    btnYes.addEventListener('click', ()=>showScreen('.js-screen-answer-yes'));
    btnNo.addEventListener('click', ()=>showScreen('.js-screen-answer-no'));
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const message = formData.get('message');
        const email = formData.get('email');
        sendMessage({
            type: constants_MessageType.SendFeedback,
            data: {
                message,
                email
            }
        });
        doc.querySelector('.js-screen-answer-no')?.classList.add('sent');
        setTimeout(removeIframe, 1500);
    });
    popup.addEventListener('transitionend', handleTransitionEnd);
    closeBtns.forEach((btn)=>btn.addEventListener('click', handleClose));
    setTimeout(()=>popup.classList.add('opaque'), 1500);
    return true;
}

;// ./src/content-script/content-utils/main.js



class ContentUtils {
    /**
   * IMPORTANT! It is intentionally async so it can be called without await
   * to not slow down frames loading in Firefox.
   */ static async init() {
        if (window !== window.top) {
            return;
        }
        if (!(document instanceof Document)) {
            return;
        }
        messageHandler.init();
        messageHandler.addListener(constants_MessageType.ShowAlertPopup, Popups.showAlertPopup);
        messageHandler.addListener(constants_MessageType.ShowRuleLimitsAlert, Popups.showRuleLimitsAlert);
        messageHandler.addListener(constants_MessageType.ShowRateUsPopup, Popups.showRateUsPopup);
    }
}

;// ./src/content-script/subscribe-to-scriptlets.js
function subscribe_to_scriptlets_class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) return descriptor.get.call(receiver);
    return descriptor.value;
}
function subscribe_to_scriptlets_class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function subscribe_to_scriptlets_class_check_private_static_field_descriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function subscribe_to_scriptlets_class_static_private_field_spec_get(receiver, classConstructor, descriptor) {
    subscribe_to_scriptlets_class_check_private_static_access(receiver, classConstructor);
    subscribe_to_scriptlets_class_check_private_static_field_descriptor(descriptor, "get");
    return subscribe_to_scriptlets_class_apply_descriptor_get(receiver, descriptor);
}
function subscribe_to_scriptlets_class_static_private_method_get(receiver, classConstructor, method) {
    subscribe_to_scriptlets_class_check_private_static_access(receiver, classConstructor);
    return method;
}

// Loaded on content script start to ensure the fastest load
class SubscribeToScriptlets {
    /**
   * IMPORTANT! It is intentionally async so it can be called without await
   * to not slow down frames loading in Firefox.
   */ static init() {
        subscribe_to_scriptlets_class_static_private_method_get(SubscribeToScriptlets, SubscribeToScriptlets, subscribeToCloseWindow).call(SubscribeToScriptlets);
    }
}
var _removeListenerTimeoutMs = {
    writable: true,
    value: 1000
};
var _closeWindowEventName = {
    writable: true,
    value: 'adguard:scriptlet-close-window'
};
var _subscribedToCloseWindowEventName = {
    writable: true,
    value: 'adguard:subscribed-to-close-window'
};
/**
   * Subscribe to close-window scriptlet's event
   * window.close() usage is restricted in Chrome so we use tabs API to do that
   */ function subscribeToCloseWindow() {
    // Events may be passed differently in MV3
    window.addEventListener(subscribe_to_scriptlets_class_static_private_field_spec_get(SubscribeToScriptlets, SubscribeToScriptlets, _closeWindowEventName), subscribe_to_scriptlets_class_static_private_method_get(SubscribeToScriptlets, SubscribeToScriptlets, closeWindowHandler));
    setTimeout(()=>{
        window.removeEventListener(subscribe_to_scriptlets_class_static_private_field_spec_get(SubscribeToScriptlets, SubscribeToScriptlets, _closeWindowEventName), subscribe_to_scriptlets_class_static_private_method_get(SubscribeToScriptlets, SubscribeToScriptlets, closeWindowHandler));
    }, subscribe_to_scriptlets_class_static_private_field_spec_get(SubscribeToScriptlets, SubscribeToScriptlets, _removeListenerTimeoutMs));
    // Scriptlet is loaded first so we notify it that content script is ready
    dispatchEvent(new Event(subscribe_to_scriptlets_class_static_private_field_spec_get(SubscribeToScriptlets, SubscribeToScriptlets, _subscribedToCloseWindowEventName)));
}
function closeWindowHandler() {
    sendMessage({
        type: constants_MessageType.ScriptletCloseWindow
    });
}

;// ./src/content-script/document-start-mv3.js



/**
 * Following methods are async BUT called without await **intentionally*
 * because if they are called as sync, they can slow down frames loading in Firefox.
 */ ContentUtils.init();
SubscribeToScriptlets.init();

})();

/******/ })()
;