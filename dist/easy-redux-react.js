(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('redux'), require('react-redux')) :
            typeof define === 'function' && define.amd ? define(['react', 'redux', 'react-redux'], factory) :
            (global = global || self, global.EasyReduxReact = factory(global.React, global.Redux, global.ReactRedux));
}(this, function (React, redux, reactRedux) { 'use strict';

            React = React && React.hasOwnProperty('default') ? React['default'] : React;

            var global$1 = (typeof global !== "undefined" ? global :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {});

            if (typeof global$1.setTimeout === 'function') ;
            if (typeof global$1.clearTimeout === 'function') ;

            // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
            var performance = global$1.performance || {};
            var performanceNow =
              performance.now        ||
              performance.mozNow     ||
              performance.msNow      ||
              performance.oNow       ||
              performance.webkitNow  ||
              function(){ return (new Date()).getTime() };

            var invariant = function(condition, format, a, b, c, d, e, f) {
              {
                if (format === undefined) {
                  throw new Error('invariant requires an error message argument');
                }
              }

              if (!condition) {
                var error;
                if (format === undefined) {
                  error = new Error(
                    'Minified exception occurred; use the non-minified dev environment ' +
                    'for the full error message and additional helpful warnings.'
                  );
                } else {
                  var args = [a, b, c, d, e, f];
                  var argIndex = 0;
                  error = new Error(
                    format.replace(/%s/g, function() { return args[argIndex++]; })
                  );
                  error.name = 'Invariant Violation';
                }

                error.framesToPop = 1; // we don't care about invariant's own frame
                throw error;
              }
            };

            var invariant_1 = invariant;

            var isFunction = (function (value) {
              return typeof value === 'function';
            });

            var toString = (function (value) {
              return value.toString();
            });

            var DEFAULT_NAMESPACE = '/';
            var ACTION_TYPE_DELIMITER = '||';

            var identity = (function (value) {
              return value;
            });

            var isNull = (function (value) {
              return value === null;
            });

            function createAction(type, payloadCreator, metaCreator) {
              if (payloadCreator === void 0) {
                payloadCreator = identity;
              }

              invariant_1(isFunction(payloadCreator) || isNull(payloadCreator), 'Expected payloadCreator to be a function, undefined or null');
              var finalPayloadCreator = isNull(payloadCreator) || payloadCreator === identity ? identity : function (head) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                return head instanceof Error ? head : payloadCreator.apply(void 0, [head].concat(args));
              };
              var hasMeta = isFunction(metaCreator);
              var typeString = type.toString();

              var actionCreator = function actionCreator() {
                var payload = finalPayloadCreator.apply(void 0, arguments);
                var action = {
                  type: type
                };

                if (payload instanceof Error) {
                  action.error = true;
                }

                if (payload !== undefined) {
                  action.payload = payload;
                }

                if (hasMeta) {
                  action.meta = metaCreator.apply(void 0, arguments);
                }

                return action;
              };

              actionCreator.toString = function () {
                return typeString;
              };

              return actionCreator;
            }

            var isPlainObject = (function (value) {
              if (typeof value !== 'object' || value === null) return false;
              var proto = value;

              while (Object.getPrototypeOf(proto) !== null) {
                proto = Object.getPrototypeOf(proto);
              }

              return Object.getPrototypeOf(value) === proto;
            });

            var isNil = (function (value) {
              return value === null || value === undefined;
            });

            /**
             * Export.
             */

            var isMap = (function (value) {
              return typeof Map !== 'undefined' && value instanceof Map;
            });

            function ownKeys(object) {
              if (isMap(object)) {
                // We are using loose transforms in babel. Here we are trying to convert an
                // interable to an array. Loose mode expects everything to already be an
                // array. The problem is that our eslint rules encourage us to prefer
                // spread over Array.from.
                //
                // Instead of disabling loose mode we simply disable the warning.
                // eslint-disable-next-line unicorn/prefer-spread
                return Array.from(object.keys());
              }

              if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
                return Reflect.ownKeys(object);
              }

              var keys = Object.getOwnPropertyNames(object);

              if (typeof Object.getOwnPropertySymbols === 'function') {
                keys = keys.concat(Object.getOwnPropertySymbols(object));
              }

              return keys;
            }

            function get(key, x) {
              return isMap(x) ? x.get(key) : x[key];
            }

            var flattenWhenNode = (function (predicate) {
              return function flatten(map, _temp, partialFlatMap, partialFlatActionType) {
                var _ref = _temp === void 0 ? {} : _temp,
                    _ref$namespace = _ref.namespace,
                    namespace = _ref$namespace === void 0 ? DEFAULT_NAMESPACE : _ref$namespace,
                    prefix = _ref.prefix;

                if (partialFlatMap === void 0) {
                  partialFlatMap = {};
                }

                if (partialFlatActionType === void 0) {
                  partialFlatActionType = '';
                }

                function connectNamespace(type) {
                  var _ref2;

                  if (!partialFlatActionType) return type;
                  var types = type.toString().split(ACTION_TYPE_DELIMITER);
                  var partials = partialFlatActionType.split(ACTION_TYPE_DELIMITER);
                  return (_ref2 = []).concat.apply(_ref2, partials.map(function (p) {
                    return types.map(function (t) {
                      return "" + p + namespace + t;
                    });
                  })).join(ACTION_TYPE_DELIMITER);
                }

                function connectPrefix(type) {
                  if (partialFlatActionType || !prefix || prefix && new RegExp("^" + prefix + namespace).test(type)) {
                    return type;
                  }

                  return "" + prefix + namespace + type;
                }

                ownKeys(map).forEach(function (type) {
                  var nextNamespace = connectPrefix(connectNamespace(type));
                  var mapValue = get(type, map);

                  if (predicate(mapValue)) {
                    flatten(mapValue, {
                      namespace: namespace,
                      prefix: prefix
                    }, partialFlatMap, nextNamespace);
                  } else {
                    partialFlatMap[nextNamespace] = mapValue;
                  }
                });
                return partialFlatMap;
              };
            });

            var isUndefined = (function (value) {
              return value === undefined;
            });

            function handleAction(type, reducer, defaultState) {
              if (reducer === void 0) {
                reducer = identity;
              }

              var types = toString(type).split(ACTION_TYPE_DELIMITER);
              invariant_1(!isUndefined(defaultState), "defaultState for reducer handling " + types.join(', ') + " should be defined");
              invariant_1(isFunction(reducer) || isPlainObject(reducer), 'Expected reducer to be a function or object with next and throw reducers');

              var _ref = isFunction(reducer) ? [reducer, reducer] : [reducer.next, reducer.throw].map(function (aReducer) {
                return isNil(aReducer) ? identity : aReducer;
              }),
                  nextReducer = _ref[0],
                  throwReducer = _ref[1];

              return function (state, action) {
                if (state === void 0) {
                  state = defaultState;
                }

                var actionType = action.type;

                if (!actionType || types.indexOf(toString(actionType)) === -1) {
                  return state;
                }

                return (action.error === true ? throwReducer : nextReducer)(state, action);
              };
            }

            var reduceReducers = (function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              var initialState = typeof args[args.length - 1] !== 'function' && args.pop();
              var reducers = args;

              if (typeof initialState === 'undefined') {
                throw new TypeError('The initial state may not be undefined. If you do not want to set a value for this reducer, you can use null instead of undefined.');
              }

              return function (prevState, value) {
                for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                  args[_key2 - 2] = arguments[_key2];
                }

                var prevStateIsUndefined = typeof prevState === 'undefined';
                var valueIsUndefined = typeof value === 'undefined';

                if (prevStateIsUndefined && valueIsUndefined && initialState) {
                  return initialState;
                }

                return reducers.reduce(function (newState, reducer) {
                  return reducer.apply(undefined, [newState, value].concat(args));
                }, prevStateIsUndefined && !valueIsUndefined && initialState ? initialState : prevState);
              };
            });

            function hasGeneratorInterface(handler) {
              var keys = ownKeys(handler);
              var hasOnlyInterfaceNames = keys.every(function (ownKey) {
                return ownKey === 'next' || ownKey === 'throw';
              });
              return keys.length && keys.length <= 2 && hasOnlyInterfaceNames;
            }

            var flattenReducerMap = flattenWhenNode(function (node) {
              return (isPlainObject(node) || isMap(node)) && !hasGeneratorInterface(node);
            });

            function handleActions(handlers, defaultState, options) {
              if (options === void 0) {
                options = {};
              }

              invariant_1(isPlainObject(handlers) || isMap(handlers), 'Expected handlers to be a plain object.');
              var flattenedReducerMap = flattenReducerMap(handlers, options);
              var reducers = ownKeys(flattenedReducerMap).map(function (type) {
                return handleAction(type, get(type, flattenedReducerMap), defaultState);
              });
              var reducer = reduceReducers.apply(void 0, reducers.concat([defaultState]));
              return function (state, action) {
                if (state === void 0) {
                  state = defaultState;
                }

                return reducer(state, action);
              };
            }

            var class2type = {};
            "Array Date RegExp Object Error".split(" ").forEach(function (e) { return class2type["[object " + e + "]"] = e.toLowerCase(); });
            /**
             * 类型检测
             * @export string
             * @param { any } obj
             */
            var type = function (obj) {
                if (obj == null)
                    return String(obj);
                return typeof obj === "object" ? class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj;
            };
            // 对象循环
            var forin = function (obj, fn) {
                for (var k in obj)
                    obj.hasOwnProperty(k) && fn(obj[k], k);
            };
            // 全大写下划线 转 驼峰
            var toHump = function (name) {
                return name.toLowerCase().replace(/\_(\w)/g, function (all, letter) { return letter.toUpperCase(); });
            };

            var OUTPUT = {
                _pre: "[easy-redux-react]",
                warn: function (msg) {
                    console.warn(OUTPUT._pre + "warn: " + msg);
                },
                error: function (msg) {
                    throw new Error(OUTPUT._pre + "error: " + msg + ".");
                },
            };
            var EasyReduxReact = /** @class */ (function () {
                function EasyReduxReact(options) {
                    this.hydrateData = null;
                    var reduxConfig = options.reduxConfig, _a = options.hydrateData, hydrateData = _a === void 0 ? null : _a, _b = options.checkRes, checkRes = _b === void 0 ? function () { return true; } : _b, _c = options.handleRes, handleRes = _c === void 0 ? function (res) { return res; } : _c;
                    this.reduxConfig = reduxConfig;
                    this.hydrateData = hydrateData;
                    this.checkRes = checkRes;
                    this.handleRes = handleRes;
                    this.connect = reactRedux.connect;
                    this.Provider = reactRedux.Provider;
                    this.init();
                }
                EasyReduxReact.prototype.init = function () {
                    this.initReducers()
                        .createStore();
                };
                // 创建 store
                EasyReduxReact.prototype.createStore = function () {
                    this.store = redux.createStore(this.reducers);
                };
                // 通过 reduxConfig 转换成 reducers
                EasyReduxReact.prototype.initReducers = function () {
                    var _this = this;
                    var _reducers = {};
                    forin(this.reduxConfig, function (_a, stateKey) {
                        var initValue = _a.initValue, actions = _a.actions;
                        var reducerMap = {};
                        var value = (_this.hydrateData && _this.hydrateData[stateKey]) || initValue;
                        forin(actions, function (reducer, action) { return reducerMap[action] = reducer; });
                        _reducers[stateKey] = handleActions(reducerMap, value);
                    });
                    this.reducers = redux.combineReducers(_reducers);
                    return this;
                };
                // 连接属性
                EasyReduxReact.prototype.connectState = function (stateKeys) {
                    return function (state) {
                        var _o = {};
                        stateKeys.map(function (v) { return _o[v] = state[v]; });
                        return _o;
                    };
                };
                // 连接方法
                EasyReduxReact.prototype.connectDispatch = function (dispatchMap) {
                    var _this = this;
                    return function (dispatch) {
                        var _o = {};
                        forin(dispatchMap, function (v, k) {
                            _o[k] = function () {
                                var data = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    data[_i] = arguments[_i];
                                }
                                var typeV = type(v);
                                if (typeV === 'string') {
                                    dispatch(createAction(v).apply(void 0, data));
                                }
                                else if (typeV === 'object') {
                                    if (type(v.fetch) === 'function') {
                                        return v.fetch.apply(v, data).then(function (res) {
                                            if (_this.checkRes(res)) {
                                                if (v.success) {
                                                    dispatch(createAction(v.success)(_this.handleRes(res)));
                                                    OUTPUT.warn('the dispatchMap item should have a success action.');
                                                }
                                                return res;
                                            }
                                            else {
                                                return Promise.reject(res);
                                            }
                                        }).catch(function (err) {
                                            v.error && dispatch(createAction(v.error)(err));
                                            return Promise.reject(err);
                                        });
                                    }
                                    else if (type(v.action) === 'string') {
                                        dispatch(createAction(v.action).apply(void 0, data));
                                    }
                                    else {
                                        OUTPUT.error('dispatchMap error!');
                                    }
                                }
                            };
                        });
                        return _o;
                    };
                };
                EasyReduxReact.prototype.getDefaultDispatchMap = function (stateKeys) {
                    var _this = this;
                    var dispatchMap = {};
                    stateKeys.map(function (key) {
                        var actions = _this.reduxConfig[key].actions;
                        Object.keys(actions).map(function (actionName) {
                            var propsName = toHump(actionName);
                            dispatchMap[propsName] = actionName;
                        });
                    });
                    return dispatchMap;
                };
                // 获取 store
                EasyReduxReact.prototype.getStore = function () {
                    !this.store && this.init();
                    return this.store;
                };
                // 获取 reducers
                EasyReduxReact.prototype.getReducers = function () {
                    !this.reducers && this.initReducers();
                    return this.reducers;
                };
                // 连接组件
                EasyReduxReact.prototype.connectTo = function (module, stateKeys, dispatchMap) {
                    if (stateKeys === void 0) { stateKeys = Object.keys(this.reduxConfig); }
                    if (dispatchMap === void 0) { dispatchMap = this.getDefaultDispatchMap(stateKeys); }
                    if (!module) {
                        OUTPUT.error("the first parameter must be a react component to connect");
                    }
                    var stateConnect = this.connectState(stateKeys);
                    var dispatchConnect = this.connectDispatch(dispatchMap);
                    return this.connect(stateConnect, dispatchConnect)(module);
                };
                EasyReduxReact.prototype.getProvider = function () {
                    var _this = this;
                    var Provider = this.Provider;
                    return function (props) { return (React.createElement(Provider, { store: _this.getStore() }, props.children)); };
                };
                return EasyReduxReact;
            }());

            return EasyReduxReact;

}));
//# sourceMappingURL=easy-redux-react.js.map
