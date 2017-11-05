/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * basic types
 */

let truth = () => true;

let isUndefined = v => v === undefined;

let isNull = v => v === null;

let isFalsy = v => !v;

let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

let isArray = v => Array.isArray(v);

let isString = v => typeof v === 'string';

let isObject = v => !!(v && typeof v === 'object');

let isFunction = v => typeof v === 'function';

let isNumber = v => typeof v === 'number' && !isNaN(v);

let isBool = v => typeof v === 'boolean';

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

let isRegExp = v => v instanceof RegExp;

let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

/**
 * check type
 *
 * types = [typeFun]
 */
let funType = (fun, types = []) => {
    if (!isFunction(fun)) {
        throw new TypeError(typeErrorText(fun, 'function'));
    }

    if (!likeArray(types)) {
        throw new TypeError(typeErrorText(types, 'array'));
    }

    for (let i = 0; i < types.length; i++) {
        let typeFun = types[i];
        if (typeFun) {
            if (!isFunction(typeFun)) {
                throw new TypeError(typeErrorText(typeFun, 'function'));
            }
        }
    }

    return function() {
        // check type
        for (let i = 0; i < types.length; i++) {
            let typeFun = types[i];
            let arg = arguments[i];
            if (typeFun && !typeFun(arg)) {
                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
            }
        }
        // result
        return fun.apply(this, arguments);
    };
};

let and = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (!typeFun(v)) {
                return false;
            }
        }
        return true;
    };
};

let or = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }

    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (typeFun(v)) {
                return true;
            }
        }
        return false;
    };
};

let not = (type) => {
    if (!isFunction(type)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => !type(v);
};

let any = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'list'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (!type(list[i])) {
            return false;
        }
    }
    return true;
};

let exist = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'array'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (type(list[i])) {
            return true;
        }
    }
    return false;
};

let mapType = (map) => {
    if (!isObject(map)) {
        throw new TypeError(typeErrorText(map, 'obj'));
    }

    for (let name in map) {
        let type = map[name];
        if (!isFunction(type)) {
            throw new TypeError(typeErrorText(type, 'function'));
        }
    }

    return (v) => {
        if (!isObject(v)) {
            return false;
        }

        for (let name in map) {
            let type = map[name];
            let attr = v[name];
            if (!type(attr)) {
                return false;
            }
        }

        return true;
    };
};

let listType = (type) => {
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    return (list) => any(list, type);
};

let typeErrorText = (v, expect) => {
    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
};

module.exports = {
    isArray,
    likeArray,
    isString,
    isObject,
    isFunction,
    isNumber,
    isBool,
    isNode,
    isPromise,
    isNull,
    isUndefined,
    isFalsy,
    isRegExp,
    isReadableStream,
    isWritableStream,

    funType,
    any,
    exist,

    and,
    or,
    not,
    mapType,
    listType,
    truth
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(16);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(34);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let styles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects);
};

let isMapObject = (v) => {
    return v && typeof v === 'object' && !Array.isArray(v);
};

let deepMergeMap = (tar, def, path = '', options = {}) => {
    let blackList = options.blackList || [];
    if (blackList.findIndex((item) => item === path) !== -1) {
        return tar;
    }
    if (isMapObject(def)) {
        tar = tar || {};
        if (isMapObject(tar)) {
            for (let name in def) {
                tar[name] = deepMergeMap(tar[name], def[name], path === '' ? name : path + '.' + name, options);
            }
        }
        return tar;
    } else {
        if (tar === undefined) return def;
        return tar;
    }
};

let resolveFnValue = (fn, ...args) => {
    if (typeof fn === 'function') {
        return resolveFnValue(fn(...args));
    }

    return fn;
};

let get = (obj, key = '') => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');

    let partLen = parts.length;
    for (let i = 0; i < partLen; i++) {
        let part = parts[i].trim();
        if (part) {
            obj = obj[part];
        }
    }

    return obj;
};

let set = (obj, key = '', value) => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');
    if (!parts.length) return;
    let parent = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        part = part.trim();
        if (part) {
            let next = parent[part];
            if (!isObject(next)) {
                next = {};
                parent[part] = next;
            }
            parent = next;
        }
    }

    parent[parts[parts.length - 1]] = value;
    return obj;
};

let isObject = (v) => v && typeof v === 'object';

let likeArray = (v) => v && typeof v === 'object' && typeof v.length === 'number';

module.exports = {
    styles,
    isMapObject,
    deepMergeMap,
    resolveFnValue,
    get,
    set,
    isObject,
    likeArray
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(29);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(74);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(33);

/**
 * @readme-doc
 *
 * ## features
 *
 * - simple DOM DSL, construct dom tree quickly
 *
 * - data-driven view, include updating view by data
 *
 * - Just functions, easy to compose
 *
 * [readme-lang:zh]## 特征
 *
 * - 简单的DOM DSL，快速构建DOM结构
 *
 * - 数据驱动视图，包括通过数据更新视图
 *
 * - 以函数为核心，易于复合
 *
 */

/**
 * @readme-quick-run
 *
 * Using method n to construct dom node quickly.
 *
 * [readme-lang:zh]用方法n快速构造dom节点
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {n, mount} = kabanery;
 *
 * mount(n('div', {
 *   id: 'qu',
 *   style: {
 *      backgroundColor: 'red'
 *   }
 * }, [
 *      n('span class=go style="font-size:16px"', 'hello!')
 * ]), document.body);
 *
 * console.log(document.getElementById('qu').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'test1',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('test1').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(1);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(0);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        parent = parent[part];
        // avoid exception
        if (!isObject(parent)) return null;
    }

    parent[parts[parts.length - 1]] = value;
    return true;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    let v = fun && fun.apply(context, params);
    if (stopV && v === stopV) {
        return Promise.resolve(stopV);
    }
    return Promise.resolve(v).then(() => {
        return runSequence(list.slice(1), params, context, stopV);
    });
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=FSM
 *
 *
 * let {
 *     stateGraphDSL, fsm, WAIT, MATCH
 * } = FSM;
 *
 * let {
 *     g, c, union, range, sequence, circle, left, repeat
 * } = stateGraphDSL;
 *
 * let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));
 *
 * let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');
 *
 * let stringDFA = g(
 *     c('"', g('enter',
 *         c('\\', g(
 *             c(escapeSymbols, 'enter'),
 *             c('u',
 *                 g(repeat(hexDigit, 4, 'enter'))
 *             ))),
 *         c('"', 'accept'),
 *         c(left(), 'enter')
 *     )));
 *
 * let m = fsm(stringDFA);
 * console.log(m('"').type === WAIT);
 * console.log(m('a').type === WAIT);
 * console.log(m('b').type === WAIT);
 * console.log(m('"').type === MATCH);
 *
 **/
module.exports = __webpack_require__(62);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(1);
let {
    isObject, isNode
} = __webpack_require__(0);

let parseArgs = __webpack_require__(35);

let parseStyle = __webpack_require__(17);

const KABANERY_NODE = 'kabanery_node';

// TODO general proxy n way

let cn = (elementType) => {
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        if (isKabaneryNode(attributes)) {
            childs = [attributes];
            attributes = {};
        }

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        return {
            tagName,
            attrMap,
            eventMap,
            elementType,
            type: KABANERY_NODE, childNodes: childs,
        };
    };
};

let isKabaneryNode = (v) => isObject(v) && v.type === KABANERY_NODE;

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

// TODO svg
let toHTML = (node) => {
    if (isNode(node)) {
        return node.outerHTML;
    } else if (isKabaneryNode(node)) {
        let {
            tagName, attrMap, childNodes
        } = node;
        let attrStr = map(attrMap, (value, key) => `${key}="${value}"`).join(' ');
        attrStr = attrStr ? ' ' + attrStr : '';
        return `<${tagName}${attrStr}>${map(childNodes, toHTML).join('')}</${tagName}>`;
    } else {
        return node + '';
    }
};

module.exports = {
    n: cn('html'),
    svgn: cn('svg'),
    cn,
    bindPlugs,
    isKabaneryNode,
    toHTML,
    parseArgs,
    parseStyle
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(18);

let seed = uuidv4();

module.exports = {
    eventMapHook: `__eventMap_${seed}`,
    globalEventTypePrefix: `__event_type_id_${seed}_`,
    stopPropagationFlag: '__stopPropagation'
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement
} = __webpack_require__(49);

let {
    bindEvents
} = __webpack_require__(10);

let {
    map
} = __webpack_require__(1);

let {
    isKabaneryNode
} = __webpack_require__(7);

let reduceNode = (node) => {
    if (isKabaneryNode(node)) {
        let tarNode = null;
        if (node.elementType === 'html') {
            tarNode = createElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        } else {
            tarNode = createSvgElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        }

        bindEvents(tarNode, node.eventMap);
        return tarNode;
    } else {
        return node;
    }
};

module.exports = reduceNode;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(50);

let {
    eventMapHook
} = __webpack_require__(8);

let {
    listenEventType,
    clearEvents,
    attachDocument,
    dispatchEvent
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node[eventMapHook] = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let Signal = (type, data) => {
    return {
        type,
        data
    };
};

let isSignalType = (s, type) => {
    return s.type === type;
};

let onSignalType = (expectType, fn) => (signal, ...rest) => {
    if (isSignalType(signal, expectType)) {
        return fn(signal, ...rest);
    }
};

let deliver = (ctx, type, extra) => (sourceSignal, sourceData, sourceCtx) => {
    ctx.notify(Signal(type, {
        sourceType: 'delivered',
        sourceSignal,
        sourceData,
        sourceCtx,
        extra
    }));
};

module.exports = {
    Signal,
    onSignalType,
    isSignalType,
    deliver
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    WAIT: 2,
    MATCH: 1,
    QUIT: 0
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(3);

/**
 *
 * valide LR(1) item: LR(1) item [A→α.β, a] is valide for prefix ρ=δα, if exists:
 *      S *⇒ δAω ⇒ δαβω
 *
 * inference: if [A→α.Bβ,a] is valide for ρ=δα, and B→θ is a production, then for any b ϵ FIRST(βa), [B→.θ,b] is valide for predix ρ=δα
 *
 * LR(1) item: [head, body, dotPosition, [...forward]]
 *
 * important: when closure is builded, it's immutable
 */

let buildClosure = (items, grammer, LR1Grammer) => {
    let appendedItems = items;
    let itemsMap = {};
    let prefixMap = {};

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        itemsMap[item.serialize()] = true;
        prefixMap[item.serializePrefix()] = item;
    }

    while (true) { // eslint-disable-line
        let newAppendedItems = reduce(appendedItems, (prev, item) => {
            let newItems = LR1Grammer.expandItem(item);
            return prev.concat(newItems);
        }, []);

        let noRepeatedNewItems = [];

        for (let i = 0; i < newAppendedItems.length; i++) {
            let item = newAppendedItems[i];
            let itemId = item.serialize();

            if (!itemsMap[itemId]) {
                // add new item
                noRepeatedNewItems.push(item);
                itemsMap[item.serialize()] = true;
                let prefixCacheItem = prefixMap[item.serializePrefix()];
                if (prefixCacheItem) {
                    prefixMap[item.serializePrefix()] = prefixCacheItem.concatForwards(item.getForwards());
                } else {
                    prefixMap[item.serializePrefix()] = item;
                }
            }
        }

        if (!noRepeatedNewItems.length) break;

        items = items.concat(noRepeatedNewItems);
        appendedItems = noRepeatedNewItems;
    }

    let serializedText = JSON.stringify(Object.keys(itemsMap).sort());

    let result = [];

    for (let name in prefixMap) {
        result.push(prefixMap[name]);
    }

    return {
        items: result,
        serializedText
    };
};

let sameClosure = (closure1, closure2) => closure1.serializedText === closure2.serializedText;

module.exports = {
    buildClosure,
    sameClosure
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {
    P_PROGRAM: 'PROGRAM := EXPRESSION_LIST',

    P_EXPRESSION_LIST_0: 'EXPRESSION_LIST := EXPRESSION',
    P_EXPRESSION_LIST_1: 'EXPRESSION_LIST := EXPRESSION semicolon EXPRESSION_LIST',

    P_EXPRESSION_0: 'EXPRESSION := QUERY_EXPRESSION',
    P_EXPRESSION_1: 'EXPRESSION := UPDATE_EXPRESSION',
    P_EXPRESSION_2: 'EXPRESSION := ',

    P_UPDATE_EXPRESSION_0: 'UPDATE_EXPRESSION := PATH assign QUERY_EXPRESSION',
    P_UPDATE_EXPRESSION_1: 'UPDATE_EXPRESSION := delete PATH',
    P_UPDATE_EXPRESSION_2: 'UPDATE_EXPRESSION := append PATH assign QUERY_EXPRESSION',

    P_QUERY_EXPRESSION_0: 'QUERY_EXPRESSION := ATOM_DATA',
    P_QUERY_EXPRESSION_1: 'QUERY_EXPRESSION := variableName',
    P_QUERY_EXPRESSION_2: 'QUERY_EXPRESSION := PATH',
    P_QUERY_EXPRESSION_3: 'QUERY_EXPRESSION := variableName leftBracket rightBracket',
    P_QUERY_EXPRESSION_4: 'QUERY_EXPRESSION := variableName leftBracket QUERY_EXPRESSION_LIST rightBracket',

    P_QUERY_EXPRESSION_LIST_0: 'QUERY_EXPRESSION_LIST := QUERY_EXPRESSION',
    P_QUERY_EXPRESSION_LIST_1: 'QUERY_EXPRESSION_LIST := QUERY_EXPRESSION comma QUERY_EXPRESSION_LIST',

    P_PATH_0: 'PATH := nodeName',
    P_PATH_1: 'PATH := nodeName PATH',
    P_PATH_2: 'PATH := nodeNameVariable',
    P_PATH_3: 'PATH := nodeNameVariable PATH',

    P_ATOM_DATA_0: 'ATOM_DATA := true',
    P_ATOM_DATA_1: 'ATOM_DATA := false',
    P_ATOM_DATA_2: 'ATOM_DATA := null',
    P_ATOM_DATA_3: 'ATOM_DATA := string',
    P_ATOM_DATA_4: 'ATOM_DATA := number',

    T_ATOM: 'atom',
    T_PATH: 'path',
    T_FUNCTION: 'function',
    T_VARIABLE_NAME: 'variableName',
    T_ASSIGN: 'assign',
    T_DELETE: 'delete',
    T_APPEND: 'append',
    T_NODE_NAME: 'nodeName',
    T_NODE_NAME_VARIABLE: 'nodeNameVariable',

    A_DEFAULT: 'default'
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view
} = __webpack_require__(4);
let steadyTheme = __webpack_require__(52);
let {
    deepMergeMap,
    resolveFnValue
} = __webpack_require__(2);
let ClassTable = __webpack_require__(57);
let {
    Signal
} = __webpack_require__(11);
let JsonTree = __webpack_require__(21);
let {
    executeAST
} = __webpack_require__(22);

/**
 * define the general interface for lumine view
 *
 * 1. unify view data structure
 *
 *    view data = {
 *       // public data
 *       props,
 *       children // child views
 *    }
 *
 *    props.onsigal
 *    props.theme
 *
 * 2. onsignal interface
 *
 *    onsignal: (signal, data, ctx) -> Any
 */

module.exports = (viewFun) => ({
    defaultProps = {},
    defaultChildren = [],
    theme = steadyTheme,
    classTable
} = {}) => {
    let defaultStyle = defaultProps.style || {};

    let defaultStyleValue = resolveFnValue(defaultStyle, theme);
    let classTableValue = resolveFnValue(classTable, theme);

    let {
        appendStyle,
        getClassName,
        updateClassTable
    } = ClassTable(classTableValue);

    return view((viewData, ctx) => {
        viewData.props = viewData.props || {};
        viewData.children = (viewData.children && viewData.children.length) ? viewData.children : defaultChildren;
        viewData.props.theme = viewData.props.theme || theme;

        appendStyle();
        // TODO check view Data

        // update defaultStyleValue
        if (viewData.props.theme && typeof defaultStyle === 'function') {
            defaultStyleValue = resolveFnValue(defaultStyle, viewData.props.theme);
        }

        // update class table
        if (viewData.theme && typeof classTable === 'function') {
            classTableValue = resolveFnValue(classTable, viewData.props.theme);
            updateClassTable(classTableValue);
        }

        // merge props (deep merge)
        viewData.props.style = deepMergeMap(viewData.props.style, defaultStyleValue);
        viewData.props = deepMergeMap(viewData.props, defaultProps);

        // signal system
        let notify = (signal) => {
            viewData.props.onsignal && viewData.props.onsignal(signal, ctx.getData(), ctx);
        };

        let viewDataTree = JsonTree(viewData);

        // update with tree script
        let updateTree = ({
            ast,
            variableStub
        }, variableMap, signal) => {
            signal = signal || Signal('update-view-data');
            // update view data by running update script
            executeAST(ast, {
                queryByPath: viewDataTree.queryByPath,
                setByPath: viewDataTree.setByPath,
                removeByPath: viewDataTree.removeByPath,
                appendByPath: viewDataTree.appendByPath,
                variableMap,
                variableStub
            });
            updateWithNotify(signal);
        };

        let updateWithNotify = (signal, ...updateScript) => {
            signal = signal || Signal('update-view-data');
            ctx.update(...updateScript);
            // notify
            notify(signal);
        };

        ctx.notify = notify;
        ctx.updateWithNotify = updateWithNotify;
        ctx.updateTree = updateTree;
        ctx.getClassName = getClassName;

        return viewFun(viewData, ctx);
    });
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString,
    isObject
} = __webpack_require__(0);

module.exports = (attr = '', {
    keyWrapper,
    valueWrapper
} = {}) => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let styles = [];
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        if (keyWrapper) {
            key = keyWrapper(key, value);
        }

        if (valueWrapper) {
            value = valueWrapper(value, key);
        }

        styles.push(`${key}: ${value};`);
    }
    return styles.join('');
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(42);
var bytesToUuid = __webpack_require__(44);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(10);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(1);

let reduceNode = __webpack_require__(9);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);

    forEach(kabaneryRoots, (item) => {
        item = reduceNode(item);
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(2);

let container = {
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: 0,
    overflow: 'auto'
};

let fullParentHeight = {
    height: '100%'
};

let fullParentWidth = {
    width: '100%'
};

let fullWindow = styles(container, {
        position: 'fixed',
        left: 0,
        top: 0,
    },
    fullParentWidth, fullParentHeight);

let fullParent = styles(container, fullParentWidth, fullParentHeight);

let flat = {
    appearance: 'none',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    boxShadow: 'none',
    borderRadius: 'none',
    border: 0
};

module.exports = {
    fullWindow,
    fullParent,
    fullParentWidth,
    fullParentHeight,
    container,
    flat
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    autoId,
    isObject,

    modifySuccess,
    removeNoneExist,
    removeSuccess
} = __webpack_require__(58);

module.exports = (jsonData, {
    missingValue = undefined
} = {}) => {
    let queryByPath = (path) => {
        let cur = jsonData;
        for (let i = 0; i < path.length; i++) {
            if (!isObject(cur)) {
                return missingValue;
            } else {
                if (cur.hasOwnProperty(path[i])) {
                    cur = cur[path[i]];
                } else {
                    return missingValue;
                }
            }
        }

        return cur;
    };

    let setByPath = (path, value) => {
        let parent = jsonData;

        for (let i = 0; i < path.length - 1; i++) {
            let part = path[i];
            let next = parent[part];
            if (!isObject(next)) { // if is not object, just override to a empty object
                next = {}; // create a new middle node
                parent[part] = next;
            }
            parent = next;
        }

        parent[path[path.length - 1]] = value; // set value
        return modifySuccess(path, value);
    };

    return {
        queryByPath,

        setByPath,

        removeByPath: (path) => {
            let parentPath = path.slice(0, path.length - 1);
            let lastKey = path[path.length - 1];
            let parent = queryByPath(parentPath);
            if (parent === missingValue || !isObject(parent) || !parent.hasOwnProperty(lastKey)) {
                return removeNoneExist(path);
            } else {
                delete parent[lastKey];
                return removeSuccess(path);
            }
        },

        appendByPath: (path, value) => {
            return setByPath(path.concat([autoId()]), value);
        }
    };
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(59);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=streamTokenSpliter
 *
 * let {
 *     parser, WAIT, QUIT, MATCH
 * } = streamTokenSpliter;

 * let spliter = parser([{
 *     priority: 1,
 *     match: (prefix) => {
 *         if (/^\w*$/.test(prefix)) return MATCH;
 *         return QUIT;
 *     },
 *     name: 'word'
 * }, {
 *     priority: 0,
 *     match: (prefix) => {
 *         if (/^.$/.test(prefix)) return MATCH;
 *         return QUIT;
 *     },
 *     name: 'trash'
 * }]);
 *
 * let tokens1 = spliter('today=is __'); // chunk1
 * let tokens2 = spliter('a good day'); // chunk2
 * let tokens3 = spliter(null); // null means end of stream
 *
 * console.log(tokens1);
 * console.log('\n');
 * console.log(tokens2);
 * console.log('\n');
 * console.log(tokens3);
 */
module.exports = __webpack_require__(61);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject
} = __webpack_require__(0);

/**
 * basic action types and compose actions
 *
 * action = {
 *   actionType
 * }
 */

const __basic_action_type__ = '7e942534-ea8b-4c75-90fd-705aec328d00';

const LEFT_TYPE = 'left',
    RANGE_TYPE = 'range',
    UNION_TYPE = 'union',
    NORMAL_TYPE = 'normal',
    EPSILON_TYPE = 'epsilon';

let toAction = (v) => {
    if (isAction(v)) return v;
    if (v === null) return {
        content: v,
        actionType: EPSILON_TYPE,
        __basic_action_type__

    };
    return {
        content: v,
        actionType: NORMAL_TYPE,
        __basic_action_type__
    };
};

let left = () => {
    return {
        actionType: LEFT_TYPE,
        __basic_action_type__
    };
};

let range = (start, end) => {
    return {
        actionType: RANGE_TYPE,
        start,
        end,
        __basic_action_type__
    };
};

// union two actions to get a new action
let union = (...actions) => {
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (!isAction(action)) {
            actions[i] = toAction(action);
        }
    }

    return {
        actionType: UNION_TYPE,
        actions,
        __basic_action_type__
    };
};

let isAction = (v) => {
    return isObject(v) && v.__basic_action_type__ === __basic_action_type__;
};

let isLeftAction = (v) => isAction(v) && v.actionType === LEFT_TYPE;

let isRangeAction = (v) => isAction(v) && v.actionType === RANGE_TYPE;

let isUnionAction = (v) => isAction(v) && v.actionType === UNION_TYPE;

let isNormalAction = (v) => isAction(v) && v.actionType === NORMAL_TYPE;

let isEpsilonAction = (v) => isAction(v) && v.actionType === EPSILON_TYPE;

module.exports = {
    isAction,
    isLeftAction,
    isRangeAction,
    isUnionAction,
    isNormalAction,
    isEpsilonAction,

    left,
    range,
    toAction,
    union
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(26);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(66);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(0);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let assembleToken = (tokenType, prefix) => {
    return {
        tokenType,
        name: tokenType.name,
        text: prefix
    };
};

module.exports = {
    assembleToken
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    END_SYMBOL: '$',
    EXPAND_START_SYMBOL: 'S`',
    EPSILON: null
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(0);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

// ignore whitespace
let processTokens = (rawTokens) => {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let {
            text,
            tokenType
        } = rawTokens[i];

        let name = tokenType.name;

        if (name !== 'whitespace') { // ignore white space
            tokens.push({
                text,
                name
            });
        }
    }

    return tokens;
};

let isObject = v => v && typeof v === 'object';

let isFunction = v => typeof v === 'function';

let isString = v => typeof v === 'string';

module.exports = {
    getProductionId,
    processTokens,
    isObject,
    isFunction,
    isString
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const lumineView = __webpack_require__(32);
const {
    Signal,
    onSignalType
} = __webpack_require__(11);
const n = __webpack_require__(85);
const Button = __webpack_require__(86);
const {
    mount
} = __webpack_require__(4);
const {
    signalActionFlow
} = __webpack_require__(90);

const TestView = lumineView(({
    props
}, ctx) => {
    return n('div', [
        n('p', `count: ${props.count}`),

        n(Button, {
            onsignal: onSignalType('click', () => {
                ctx.updateWithNotify(Signal('submit'));
            })
        }, 'submit')
    ]);
}, {
    defaultProps: {
        count: 0
    }
});

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'updateState',
            content: '.viewState.props.count=add(.viewState.props.count, 1)',
            variableMap: {
                add: (a, b) => a + b
            }
        }]
    })
}), document.body);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineViewer = __webpack_require__(15);

module.exports = (viewFun, options) => lumineViewer(viewFun)(options);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    svgn,
    bindPlugs,
    toHTML,
    parseArgs,
    isKabaneryNode,
    cn,
    parseStyle
} = __webpack_require__(7);

let plugs = __webpack_require__(37);

let view = __webpack_require__(40);

let mount = __webpack_require__(19);

let N = __webpack_require__(51);

let reduceNode = __webpack_require__(9);

let {
    dispatchEvent,
    clearEvents
} = __webpack_require__(10);

module.exports = {
    n,
    isKabaneryNode,
    cn,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,
    toHTML,
    reduceNode,

    parseArgs,
    parseStyle,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(16);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parseAttribute = __webpack_require__(36);

let {
    isString,
    isObject,
    isNode,
    likeArray,
    isNumber,
    isBool
} = __webpack_require__(0);

let parseArgs = (args, {
    doParseStyle = true
} = {}) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr, {
        doParseStyle
    });

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    if (typeof str !== 'string') return [str];

    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();

    tagName = tagName.toLowerCase().trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp);
    }
    return ret;
};

module.exports = parseArgs;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString
} = __webpack_require__(0);

let parseStyle = __webpack_require__(17);

let {
    mergeMap
} = __webpack_require__(1);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr, {
    doParseStyle
}) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style && doParseStyle) {
        attributes.style = parseStyle(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = parseStyle(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

module.exports = parseAttribute;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(38);
let eventError = __webpack_require__(39);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(5);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(5);

let {
    isObject,
    isFunction,
    likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let replace = __webpack_require__(41);

let reduceNode = __webpack_require__(9);

let mount = __webpack_require__(19);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view,
            afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view,
                afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view,
    afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        updateData(...args);
        return replaceView();
    };

    let updateData = (...args) => {
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
        }
    };

    let appendView = (itemView) => {
        if (node) {
            mount(itemView, node);
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();
        newNode = reduceNode(newNode);

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        updateData,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        appendView,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(5);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let {
    eventMapHook
} = __webpack_require__(8);

let applyAttibutes = __webpack_require__(45);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // hacks for dom
    if (node.tagName === 'TEXTAREA') {
        node.value = newNode.textContent;
    }
    if (node.tagName === 'INPUT') {
        node.value = newNode.getAttribute('value');
    }

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode[eventMapHook]) {
        node[eventMapHook] = newNode[eventMapHook];
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(43)))

/***/ }),
/* 43 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(46);

let {
    hasOwnProperty
} = __webpack_require__(5);

let {
    forEach
} = __webpack_require__(1);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = __webpack_require__(47);

let startMomenter = __webpack_require__(48);

let getX = (elem) => {
    var x = 0;
    while (elem) {
        x = x + elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return x;
};

let getY = (elem) => {
    var y = 0;
    while (elem) {
        y = y + elem.offsetTop;
        elem = elem.offsetParent;
    }
    return y;
};

let getClientX = (elem) => {
    return getX(elem) - window.scrollX;
};

let getClientY = (elem) => {
    return getY(elem) - window.scrollY;
};

let removeChilds = (node) => {
    while (node && node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

let once = (node, type, handler, useCapture) => {
    let fun = function(e) {
        let ret = handler.apply(this, [e]);
        node.removeEventListener(type, fun, useCapture);
        return ret;
    };

    node.addEventListener(type, fun, useCapture);
};

let getAttributeMap = (attributes = []) => {
    let map = {};
    for (let i = 0; i < attributes.length; i++) {
        let {
            name, value
        } = attributes[i];
        map[name] = value;
    }
    return map;
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

module.exports = {
    getX,
    getY,
    getClientX,
    getClientY,
    removeChilds,
    once,
    shadowFrame,
    getAttributeMap,
    startMomenter,
    getClasses
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = () => {
    let div = document.createElement('div');
    let sr = div.createShadowRoot();
    sr.innerHTML = '<div id="shadow-page"></div>';

    let frame = null;

    let create = () => {
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(div);

        return sr.getElementById('shadow-page');
    };

    let start = () => {
        if (frame) {
            return frame;
        }
        frame = new Promise(resolve => {
            if (document.body) {
                resolve(create());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(create());
                });
            }
        });
        return frame;
    };

    let close = () => {
        frame.then(() => {
            let parent = div.parentNode;
            parent && parent.removeChild(div);
        });
    };

    return {
        start,
        close,
        sr,
        rootDiv: div
    };
};

module.exports = shadowFrame;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isDomReady = (doc) => doc.readyState === 'complete' ||
    (!doc.attachEvent && doc.readyState === 'interactive');

let startMomenter = (doc = document) => {
    let loadedFlag = false;

    let resolves = [];

    let docReady = () => {
        let ready = () => {
            if (loadedFlag) return;
            loadedFlag = true;
            for (let i = 0; i < resolves.length; i++) {
                resolves[i]();
            }
            resolves = [];
        };
        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', ready);
            doc.addEventListener('DOMContentLoaded', ready);
        } else {
            doc.attachEvent('onreadystatechange', () => {
                if (document.readyState === 'complete') {
                    ready();
                }
            });
        }
    };

    docReady();

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime = 0, startTimeout = 10000
    } = {}) => new Promise((resolve, reject) => {
        if (loadedFlag || isDomReady(doc)) { // already ready
            setTimeout(resolve, generalWaitTime);
        } else { // wait for ready
            resolves.push(resolve);
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNode
} = __webpack_require__(0);

const svgNS = 'http://www.w3.org/2000/svg';

let applyNode = (node, attributes, childs) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isNode(child)) {
            node.appendChild(child);
        } else {
            node.textContent = child + '';
        }
    }
};

let createElement = (tagName, attributes, childs) => {
    let node = document.createElement(tagName);
    applyNode(node, attributes, childs);
    return node;
};

let createSvgElement = (tagName, attributes, childs) => {
    let node = document.createElementNS(svgNS, tagName);
    applyNode(node, attributes, childs);
    return node;
};

module.exports = {
    createElement,
    createSvgElement
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(1);

let {
    eventMapHook,
    globalEventTypePrefix,
    stopPropagationFlag
} = __webpack_require__(8);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};
    let handlerMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times for the same type
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    addEventListenerToDoc(doc, type);
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            addEventListenerToDoc(doc, type);
        }
    };

    let addEventListenerToDoc = (doc, type) => {
        let handler = null;
        if (handlerMap[type]) {
            handler = handlerMap[type];
        } else {
            handler = listener(type);
            handlerMap[type] = handler;
        }
        doc.addEventListener(type, handler);
    };

    let clearEvents = () => {
        for (let type in eventTypeMap) {
            removeListenerType(type);
        }
    };

    let removeListenerType = (type) => {
        let handler = handlerMap[type];
        if (handler) {
            for (let i = 0; i < docs.length; i++) {
                let doc = docs[i];
                doc.removeEventListener(type, handler);
            }
            delete handlerMap[type];
            delete eventTypeMap[type];
        }
    };

    let getDocs = () => docs.slice(0);

    /**
     * e = {
     *  target,
     *  stopPropagation [optional]
     * }
     */
    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e[stopPropagationFlag] = true;
            return oldProp && oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target[eventMapHook];
        return eventMap && eventMap[type];
    };

    let dispatchEvent = (type, e) => {
        let handler = handlerMap[type];
        handler && handler(e);
    };

    return {
        listenEventType,
        clearEvents,
        removeListenerType,
        getDocs,
        attachDocument,
        dispatchEvent
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `${globalEventTypePrefix}${type}`;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(7);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(1);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let base = __webpack_require__(53);

module.exports = base({
    pageColor: 'white',
    hoverColor: '#90CAF9',
    blockColor: '#2196F3', // rgb(33,150,243)
    borderColor: '#1565C0',
    veilColor: 'rgba(125,125,125,0.6)',
    fontColor: 'white',
    noticeColor: 'rgb(2, 40, 51)',
    shadowColor: 'rgba(100,100,100,0.2)',

    // half
    halfBlockColor: 'rgba(33,150,243,0.5)',

    titleSize: 20,
    normalSize: 16,

    narrowPadding: '4 8 4 8',
    narrowPaddingTop: 4,
    narrowPaddingRight: 8,
    narrowPaddingBottom: 4,
    narrowPaddingLeft: 8,

    narrowMargin: '4 8 4 8',

    contrastBlockColor: 'white',
    contrastFontColor: 'black'
});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(2);

let layout = __webpack_require__(20);
let Bulk = __webpack_require__(54);
let Actions = __webpack_require__(55);
let Widget = __webpack_require__(56);

module.exports = (basics, custom = {}) => {
    let bulks = Bulk(basics);
    let actions = Actions(basics);
    let widgets = Widget(basics, layout, bulks);

    if (typeof custom === 'function') {
        custom = custom(basics, layout, bulks);
    }

    bulks = Object.assign(bulks, custom.bulks || {});
    actions = Object.assign(actions, custom.actions || {});
    widgets = Object.assign(widgets, custom.widgets || {});

    return Object.assign({
        basics,
        actions
    }, layout, bulks, actions, widgets);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(2);

let layout = __webpack_require__(20);

let {
    container
} = layout;

module.exports = (basics) => {
    let bulk = styles(container, {
        minWidth: 40,
        backgroundColor: basics.blockColor,
        color: basics.fontColor
    });

    let contrastBulk = styles(bulk, {
        backgroundColor: basics.contrastBlockColor,
        color: basics.contrastFontColor
    });

    let oneLineBulk = styles(bulk, {
        padding: basics.narrowPadding,
        fontSize: basics.normalSize,
        textAlign: 'center',
        lineHeight: 20,
        textDecoration: 'none',
        border: 'none',
        color: basics.fontColor
    });

    let flatOneLineBulk = styles(oneLineBulk, {
        display: 'inline-block',
        backgroundColor: basics.contrastBlockColor,
        color: basics.blockColor
    });

    let modalBulk = styles(oneLineBulk, contrastBulk, {
        display: 'inline-block',
        boxShadow: `3px 3px 5px ${basics.shadowColor}`
    });

    return {
        bulk,
        contrastBulk,
        oneLineBulk,
        modalBulk,
        flatOneLineBulk
    };
}


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = (basics) => {
    return {
        hover: {
            backgroundColor: basics.hoverColor
        },

        active: {
            backgroundColor: basics.hoverColor
        },

        focus: {
            outline: 'none'
        },

        flatHover: {
            color: basics.hoverColor
        },

        flatActive: {
            color: basics.hoverColor
        }
    }
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

let {
    styles
} = __webpack_require__(2);

module.exports = (basics, layout, bulks) => {
    let {
        contrastBulk
    } = bulks;
    let {
        flat
    } = layout;

    let cardBox = styles(contrastBulk, flat, {
        border: `1px solid ${basics.shadowColor}`,
        boxShadow: `3px 3px 5px ${basics.shadowColor}`,
        borderRadius: 2
    });

    let inputBox = styles(contrastBulk, flat, {
        width: 260,
        padding: basics.narrowPadding,
        backgroundColor: basics.fontColor
    });

    let textAreaBox = styles(inputBox, {
        width: 360,
        height: 200,
        outline: 'none',
        resize: 'none',
        overflow: 'auto',
        border: `1px solid ${basics.borderColor}`,
        borderRadius: 5,
        fontSize: 16
    });

    let underLineBorder = {
        border: 0,
        borderRadius: 0,
        'border-bottom': `1px solid ${basics.borderColor}`
    };

    let underLineFocus = {
        paddingBottom: basics.narrowPaddingBottom - 1,
        'border-bottom': `2px solid ${basics.blockColor}`
    };

    let flatRippleMask = {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 5,
        height: 5,
        backgroundColor: basics.halfBlockColor,
        opacity: '0',
        borderRadius: '100%',
        transform: 'scale(1, 1) translate(-50%)',
        transformOrigin: '50% 50%'
    };

    return {
        inputBox,
        textAreaBox,
        underLineBorder,
        underLineFocus,
        flatRippleMask,
        cardBox
    };
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isMapObject
} = __webpack_require__(2);

let {
    mount,
    n,
    parseStyle
} = __webpack_require__(4);

const VIEW_CLASS_PREFIX = 'kabanery-lumine';

let count = -1;

module.exports = (classTable) => {
    count++;

    let viewClassId = `${VIEW_CLASS_PREFIX}-${count}`;

    let getStyleRuleName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            return `${prev} ${viewClassId}-${next}`;
        } else {
            return `.${viewClassId}-${name}`;
        }
    };

    let appendStyle = () => {
        if (styleCssRules) {
            mount(n('style', {
                id: viewClassId
            }, styleCssRules), document.head);
            styleCssRules = null;
        }
    };

    let getClassName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            name = next;
        }

        return `${viewClassId}-${name.split(':')[0]}`;
    };

    let updateClassTable = (newClassTable) => {
        let node = document.getElementById(viewClassId);
        if (node) {
            node.parentNode.removeChild(node);
        }

        setStyleCssRules(newClassTable);
        appendStyle();
    };

    let styleCssRules = null;

    let setStyleCssRules = (classTable) => {
        if (isMapObject(classTable)) {
            styleCssRules = '';
            for (let name in classTable) {
                name = name.trim();
                let styleRuleName = getStyleRuleName(name);
                let classCnt = classTable[name];
                if (typeof classCnt === 'function') {
                    classCnt = classCnt({
                        getClassName
                    });
                }
                let styleRuleContent = parseStyle(classCnt, {
                    valueWrapper: (value) => `${value !== ''? value: '\'\''} !important`
                });
                styleCssRules += `\n${styleRuleName} {${styleRuleContent}}`;
            }
        }
    };

    setStyleCssRules(classTable);

    return {
        appendStyle,
        getClassName,
        updateClassTable
    };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(18);

let autoId = () => {
    let time = new Date().getTime(); // used to sort by time
    // generate id
    return `_gid_${time}_${uuidv4().replace(/-/g, '_')}`;
};

let isObject = v => v && typeof v === 'object';

const O_T_MODIFY = 'update';
const O_T_REMOVE = 'delete';
const T_SUCCESS = 'success';

const ERR_T_REMOVE_NONE_EXIST = 'remove_none_exist';

let modifySuccess = (path, value) => {
    return {
        operationType: O_T_MODIFY,
        resultType: T_SUCCESS,

        path,
        value: value && value.toString()
    };
};

let removeNoneExist = (path) => {
    return {
        operationType: O_T_REMOVE,
        resultType: ERR_T_REMOVE_NONE_EXIST,

        path
    };
};

let removeSuccess = (path) => {
    return {
        operationType: O_T_REMOVE,
        resultType: T_SUCCESS,

        path
    };
};

module.exports = {
    autoId,
    isObject,

    modifySuccess,
    removeNoneExist,
    removeSuccess
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parser = __webpack_require__(60);
let {
    checkAST,
    runTimeCheck,
    getVariable
} = __webpack_require__(84);

let {
    T_ATOM,
    T_PATH,
    T_ASSIGN,
    T_DELETE,
    T_APPEND,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_NODE_NAME,
    T_NODE_NAME_VARIABLE
} = __webpack_require__(14);

let executeAST = (ast, {
    queryByPath,
    setByPath,
    removeByPath,
    appendByPath,
    variableMap = {},
    variableStub = {},
    skipCheck = false
}) => {
    // TODO check params
    // check variableStub

    if (!skipCheck) {
        runTimeCheck(variableStub, variableMap);
    }

    let open = [];
    for (let i = 0; i < ast.length; i++) {
        open.unshift({
            node: ast[i],
            visited: false
        });
    }

    let valueStack = [];

    while (open.length) {
        let top = open[open.length - 1];
        let topNode = top.node;
        if (topNode.type === T_ATOM) {
            valueStack.push(topNode.value);
            open.pop();
        } else if (topNode.type === T_VARIABLE_NAME) { // pickup variable
            let variableName = topNode.value;
            let variableValue = getVariable(variableName, variableMap, variableStub);
            valueStack.push(variableValue);
            open.pop();
        } else if (topNode.type === T_PATH) {
            valueStack.push(queryByPath(resolvePath(topNode.value, variableMap)));
            open.pop();
        } else if (topNode.type === T_FUNCTION) {
            let {
                funName,
                params
            } = topNode.value;

            if (top.visited) {
                // get value from value stack
                let paramValues = [];
                for (let i = 0; i < params.length; i++) {
                    paramValues.push(valueStack.pop());
                }
                valueStack.push(variableMap[funName](...paramValues));
                open.pop();
            } else {
                top.visited = true;
                for (let i = 0; i < params.length; i++) {
                    open.push({
                        node: params[i],
                        visited: false
                    });
                }
            }
        } else if (topNode.type === T_ASSIGN) {
            let {
                path,
                value
            } = topNode.value;

            if (top.visited) {
                let assignValue = valueStack.pop();
                valueStack.push(setByPath(resolvePath(path.value, variableMap), assignValue));
                open.pop();
            } else {
                top.visited = true;
                open.push({
                    node: value,
                    visited: false
                });
            }
        } else if (topNode.type === T_DELETE) {
            let {
                path
            } = topNode.value;

            valueStack.push(removeByPath(resolvePath(path.value, variableMap)));
            open.pop();
        } else if (topNode.type === T_APPEND) {
            let {
                path,
                value
            } = topNode.value;

            if (top.visited) {
                let assignValue = valueStack.pop();
                valueStack.push(appendByPath(resolvePath(path.value, variableMap), assignValue));
                open.pop();
            } else {
                top.visited = true;
                open.push({
                    node: value,
                    visited: false
                });
            }
        }
    }

    return valueStack[valueStack.length - 1];
};

let resolvePath = (path, variableMap) => {
    let ret = [];
    for (let i = 0; i < path.length; i++) {
        let {
            type,
            value
        } = path[i];
        if (type === T_NODE_NAME) {
            ret.push(value);
        } else if (type === T_NODE_NAME_VARIABLE) {
            ret.push(variableMap[value]);
        }
    }

    return ret;
};

let parseStrToAst = (str) => {
    let handleChunk = parser();
    if (str) {
        handleChunk(str);
    }
    return handleChunk(null);
};

module.exports = {
    parser,
    parseStrToAst,
    executeAST,
    checkAST
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let streamTokenSpliter = __webpack_require__(23);
let {
    LR
} = __webpack_require__(70);
let {
    getProductionId,
    processTokens,
} = __webpack_require__(30);
let tokenTypes = __webpack_require__(81);
let {
    ACTION,
    GOTO
} = __webpack_require__(83);

let {
    P_PROGRAM,

    P_EXPRESSION_LIST_0,
    P_EXPRESSION_LIST_1,

    P_EXPRESSION_0,
    P_EXPRESSION_1,
    P_EXPRESSION_2,

    P_UPDATE_EXPRESSION_0,
    P_UPDATE_EXPRESSION_1,
    P_UPDATE_EXPRESSION_2,

    P_QUERY_EXPRESSION_0,
    P_QUERY_EXPRESSION_1,
    P_QUERY_EXPRESSION_2,
    P_QUERY_EXPRESSION_3,
    P_QUERY_EXPRESSION_4,

    P_QUERY_EXPRESSION_LIST_0,
    P_QUERY_EXPRESSION_LIST_1,

    P_PATH_0,
    P_PATH_1,
    P_PATH_2,
    P_PATH_3,

    P_ATOM_DATA_0,
    P_ATOM_DATA_1,
    P_ATOM_DATA_2,
    P_ATOM_DATA_3,
    P_ATOM_DATA_4,

    T_ATOM,
    T_PATH,
    T_ASSIGN,
    T_DELETE,
    T_APPEND,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_NODE_NAME,
    T_NODE_NAME_VARIABLE
} = __webpack_require__(14);

module.exports = () => {
    let tokenSpliter = streamTokenSpliter.parser(tokenTypes);

    // TODO optimization AST
    let lrParse = LR(ACTION, GOTO, {
        // when reduce prodcution, translate at the sametime
        reduceHandler: (production, midNode) => {
            switch (getProductionId(production)) {
                case P_PROGRAM:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_LIST_0:
                    midNode.value = midNode.children[0].value === null ? [] : [midNode.children[0].value];
                    break;

                case P_EXPRESSION_LIST_1:
                    midNode.value = (midNode.children[0].value === null ? [] : [midNode.children[0].value]).concat(midNode.children[2].value);
                    break;

                case P_EXPRESSION_0:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_1:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_EXPRESSION_2: // empty situation
                    midNode.value = null;
                    break;

                case P_UPDATE_EXPRESSION_0:
                    midNode.value = {
                        type: T_ASSIGN,
                        value: {
                            path: midNode.children[0].value,
                            value: midNode.children[2].value
                        }
                    };
                    break;

                case P_UPDATE_EXPRESSION_1:
                    midNode.value = {
                        type: T_DELETE,
                        value: {
                            path: midNode.children[1].value,
                        }
                    };
                    break;

                case P_UPDATE_EXPRESSION_2:
                    midNode.value = {
                        type: T_APPEND,
                        value: {
                            path: midNode.children[1].value,
                            value: midNode.children[3].value
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_0:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_QUERY_EXPRESSION_1:
                    midNode.value = {
                        type: T_VARIABLE_NAME,
                        value: midNode.children[0].token.text
                    };
                    break;

                case P_QUERY_EXPRESSION_2:
                    midNode.value = midNode.children[0].value;
                    break;

                case P_QUERY_EXPRESSION_3:
                    midNode.value = {
                        type: T_FUNCTION,
                        value: {
                            funName: midNode.children[0].token.text,
                            params: []
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_4:
                    midNode.value = {
                        type: 'function',
                        value: {
                            funName: midNode.children[0].token.text,
                            params: midNode.children[2].value
                        }
                    };
                    break;

                case P_QUERY_EXPRESSION_LIST_0:
                    midNode.value = [midNode.children[0].value];
                    break;

                case P_QUERY_EXPRESSION_LIST_1:
                    midNode.value = [midNode.children[0].value].concat(midNode.children[2].value);
                    break;

                case P_PATH_0:
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME,
                            value: midNode.children[0].token.text.substring(1)
                        }]
                    };
                    break;

                case P_PATH_1:
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME,
                            value: midNode.children[0].token.text.substring(1)
                        }].concat(midNode.children[1].value.value)
                    };
                    break;

                case P_PATH_2:
                    var nodeNameVarTxt = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME_VARIABLE,
                            value: nodeNameVarTxt.substring(2, nodeNameVarTxt.length - 1).trim()
                        }]
                    };
                    break;

                case P_PATH_3:
                    var nodeNameVarTxt2 = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_PATH,
                        value: [{
                            type: T_NODE_NAME_VARIABLE,
                            value: nodeNameVarTxt2.substring(2, nodeNameVarTxt2.length - 1).trim()
                        }].concat(midNode.children[1].value.value)
                    };
                    break;

                case P_ATOM_DATA_0:
                    midNode.value = {
                        type: T_ATOM,
                        value: true
                    };
                    break;

                case P_ATOM_DATA_1:
                    midNode.value = {
                        type: T_ATOM,
                        value: false
                    };
                    break;

                case P_ATOM_DATA_2:
                    midNode.value = {
                        type: T_ATOM,
                        value: null
                    };
                    break;

                case P_ATOM_DATA_3:
                    var text = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: JSON.parse(text)
                    };
                    break;

                case P_ATOM_DATA_4:
                    var numText = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: Number(numText)
                    };
                    break;
            }
        }
    });

    // handle chunk data
    return (chunk) => {
        let str = chunk && chunk.toString();
        let tokens = processTokens(tokenSpliter(str));

        for (let i = 0; i < tokens.length; i++) {
            lrParse(tokens[i]);
        }

        // means finished chunks
        if (chunk === null) {
            let ast = lrParse(null);
            return ast.children[0].value;
        }
    };
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, funType, listType, isFunction, mapType, isFalsy, isNumber, or
} = __webpack_require__(0);

let {
    WAIT, MATCH, QUIT
} = __webpack_require__(12);

let {
    stateGraphDSL
} = __webpack_require__(6);

let buildFSM = __webpack_require__(67);

let {
    map
} = __webpack_require__(1);

let {
    getMatch
} = __webpack_require__(68);

let {
    findToken,
    filterTypes
} = __webpack_require__(69);

let {
    assembleToken
} = __webpack_require__(27);

/**
 *
 * A token spliter used to split stream string.
 *
 * When accept a chunk, parsing it at the same time.
 *
 * ## options
 *
 * tokenTypes = [
 *  {
 *      name,
 *      priority,
 *      match
 *  }
 * ]
 *
 * - priority
 *
 *    When meets ambiguity, priority will be helpful.
 *
 *    Assume we got two types: \w*, \s. When split "today is a good day". If we set \s has a higher priority, we will get ["t", "o", "d", "a", "y", " ", "i", "s", " ", "a", " ", "g", "o", "o", "d", " ", "d", "a", "y"], just one token. If we set \w* has a higher priority, we will get ["today", " ", "is", " ", "a", " ", "good", " ", "day"].
 *
 * - match (letter, prefix) -> WAIT | MATCH | QUIT
 *
 *     Because we are handling chunks, we need to know finished a chunk or not.
 *
 * ## rules
 *
 * - priority rule
 *
 * - longest matching
 *
 * eg: four rules a(def, 1), b(default[s?], 2), c(/\w\w+/, 0), d(_, 2)
 *
 * ```
 * input     isPart     match
 * d         (a, b, c)  ()
 * de        (a, b, c)  (c:0)
 * def       (a, b, c)  (a:1, c:0)
 * defa      (b, c)     (c:0)
 * defau     (b, c)     (c:0)
 * defaul    (b, c)     (c:0)
 * default   (b, c)     (b:2, c:0)
 * defaults  (b, c)     (b:2, c:0)
 * defaults_ ()         ()
 * ```
 *
 * When empty situation happend, analysis the process.
 *
 * ```
 * 1. possible situations
 *    de        (a, b, c)  (c:0)
 *    def       (a, b, c)  (a:1, c:0)
 *    defa      (b, c)     (c:0)
 *    defau     (b, c)     (c:0)
 *    defaul    (b, c)     (c:0)
 *    default   (b, c)     (b:2, c:0)
 *    defaults  (b, c)     (b:2, c:0)
 *
 * 2. for any rule (a, b, c) only consider it's biggest matching situation. (longest matching rule)
 *    def       (a, b, c)  (a:1)            longest for a
 *    defaults  (b, c)     (b:2, c:0)       longest for b and c
 *
 * 3. choose the highest priority rule. (priority rule)
 *    defaults (b:2)
 * ```
 */

let parser = funType((tokenTypes) => {
    tokenTypes = map(tokenTypes, (tokenType) => {
        let {
            priority, name, independent, match
        } = tokenType;

        name = name || (match && match.toString());

        match = getMatch(match);

        if (!isFunction(match)) {
            throw new Error(`Error match in token type ${strTokenType(tokenType)}`);
        }

        return {
            priority: priority || 0,
            name: name,
            match,
            independent
        };
    });

    let stock = '';

    return (chunk) => {
        if (chunk === null) { // means finished
            let tokens = splitTokensToEnd(stock, tokenTypes);

            stock = '';
            return tokens;
        }
        stock += chunk.toString();
        let {
            rest, tokens
        } = splitTokens(stock, tokenTypes);

        stock = rest;

        return tokens;
    };
}, [
    listType(mapType({
        priority: or(isFalsy, isNumber),
        name: or(isFalsy, isString)
    }))
]);

let strTokenType = ({
    priority, match, name, independent
}) => {
    return `{
        priority: ${priority},
        match: ${match},
        name: ${name},
        independent: ${independent}
    }`;
};

parser.parse = (str, tokenTypes) => {
    let parse = parser(tokenTypes);
    return parse(str).concat(parse(null));
};

let splitTokensToEnd = (stock, tokenTypes) => {
    let {
        tokens
    } = splitTokens(stock, tokenTypes, 'end');
    return tokens;
};

let splitTokens = (stock, tokenTypes, type) => {
    let ret;
    let tokens = [];
    while (stock && (ret = getToken(stock, tokenTypes, type))) {
        let {
            token, rest
        } = ret;
        stock = rest;

        tokens.push(token);
    }

    return {
        tokens,
        rest: stock
    };
};

/**
 * type = 'mid' | 'end'
 *
 * get toke from stock based on tokenTypes
 */
let getToken = (stock, tokenTypes, type = 'mid') => {
    let next = stock;

    let prefix = ''; // used to store current prefix
    let retMatrix = [];

    let restTypes = tokenTypes;

    while (next) {
        let nextLetter = next[0];
        prefix += nextLetter;

        // shorten next
        next = next.substring(1);
        let [partTypes, matchTypes, independentType] = filterTypes(nextLetter, prefix, restTypes);

        restTypes = partTypes; // reduce types

        // see if there is a independent token type
        // find independent token

        if (independentType) {
            return splitTokenRet(
                assembleToken(independentType, prefix),
                stock
            );
        }

        // obey longest match rule
        // no matchs futher, means look forward more won't get any matchs
        if (!partTypes.length && !matchTypes.length) {
            return fetchToken(stock, retMatrix, prefix);
        } else {
            retMatrix.push({
                partTypes,
                matchTypes,
                prefix
            });
        }
    }

    // if this is end, fetchToken
    if (prefix === stock && type === 'end') { // match stop point
        return fetchToken(stock, retMatrix, prefix);
    }

    return null;
};

let fetchToken = (stock, retMatrix, prefix) => {
    // empty
    let token = findToken(retMatrix);
    if (!token) {
        throw new Error(`Can not find token from prefix "${prefix}". And prefix is not any part of token. stock is "${stock}".`);
    }
    return splitTokenRet(token, stock);
};

let splitTokenRet = (token, stock) => {
    return {
        token,
        rest: stock.substring(token.text.length)
    };
};

module.exports = {
    parser, WAIT, QUIT, MATCH, stateGraphDSL, buildFSM
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    QUIT, WAIT, MATCH
} = __webpack_require__(63);

let stateGraphDSL = __webpack_require__(64);

const START_STATE = '__start__state__';

let fsm = (stateMap) => {
    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)));

    let dfa = new DFA(transitions, acceptStateMap);

    // matching function
    return (letter) => {
        return dfa.transit(letter);
    };
};

let DFA = function(stateMap, acceptStateMap) {
    this.currentState = START_STATE;
    this.stateMap = stateMap;
    this.acceptStateMap = acceptStateMap;
};

let proto = DFA.prototype;

proto.transit = function(letter) {
    let subMap = this.stateMap[this.currentState];
    if (!subMap) return {
        type: QUIT,
        state: this.currentState
    };

    // transit to target state
    let targetState = subMap(letter);

    if (stateGraphDSL.isEpsilonTransition(targetState)) {
        this.currentState = targetState.state; // epsilon transition
        return this.transit(letter);
    }

    if (targetState === undefined) {
        return {
            type: QUIT,
            state: this.currentState
        };
    }

    this.currentState = targetState;
    if (this.acceptStateMap[targetState]) return {
        type: MATCH,
        state: this.currentState
    };

    return {
        type: WAIT,
        state: this.currentState
    };
};

module.exports = {
    fsm,
    stateGraphDSL,
    DFA,
    QUIT,
    WAIT,
    MATCH
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    WAIT: 2,
    MATCH: 1,
    QUIT: 0
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let actionDSL = __webpack_require__(24);

let {
    isNormalAction, isRangeAction, isUnionAction, isLeftAction, isEpsilonAction
} = actionDSL;

let {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
} = __webpack_require__(65);

let {
    mergeMap
} = __webpack_require__(25);

let transitionMaper = (graph) => {
    let transitions = {};
    let {
        transitionMap
    } = graph;

    let accepts = getEndStates(graph);

    let leftMap = getLeftActionMap(transitionMap);
    let epsilonMap = getEpsilonActionMap(transitionMap);

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];

        transitions[stateName] = (letter) => {
            for (let i = transitList.length - 1; i >= 0; i--) {
                let {
                    state, action
                } = transitList[i];

                if (matchAction(action, letter)) return state;
            }

            // check rest
            if (leftMap[stateName]) return leftMap[stateName];

            if (epsilonMap[stateName]) {
                return {
                    type: 'deliver',
                    state: epsilonMap[stateName]
                };
            }
        };
    }

    return {
        transitions,
        acceptStateMap: getAcceptStateMap(epsilonMap, accepts)
    };
};

/**
 * a end state's out-degree = 0
 */
let getEndStates = (graph) => {
    let outDegreeMap = getOutDegreeMap(graph);
    let ends = [];
    for (let name in outDegreeMap) {
        if (outDegreeMap[name] === 0) {
            ends.push(name);
        }
    }

    return ends;
};

let getOutDegreeMap = (graph) => {
    let outDegreeMap = {};
    let {
        transitionMap
    } = graph;
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        outDegreeMap[stateName] = transitList.length;
        for (let i = 0; i < transitList.length; i++) {
            let {
                state
            } = transitList[i];
            outDegreeMap[state] = outDegreeMap[state] || 0;
        }
    }

    return outDegreeMap;
};

/**
 * epsilon chain
 */
let getAcceptStateMap = (epsilonMap, accepts) => {
    let acceptStateMap = {};

    let reverseEpsilonMap = {};
    for (let name in epsilonMap) {
        let tar = epsilonMap[name];
        reverseEpsilonMap[tar] = reverseEpsilonMap[tar] || [];
        reverseEpsilonMap[tar].push(name);
    }

    for (let i = 0; i < accepts.length; i++) {
        let accept = accepts[i];
        acceptStateMap[accept] = true;
    }

    let count = 0;

    while (true) { // eslint-disable-line
        let prevCount = count;

        for (let name in acceptStateMap) {
            let list = reverseEpsilonMap[name];
            if (list) {
                for (let j = 0; j < list.length; j++) {
                    if (!acceptStateMap[list[j]]) {
                        acceptStateMap[list[j]] = true;
                        count++;
                    }
                }
            }
        }

        if (count === prevCount) { // no more
            break;
        }
    }

    return acceptStateMap;
};

let matchAction = (action, letter) => {
    if (isNormalAction(action) && action.content === letter) return true;
    if (isRangeAction(action) && action.start <= letter && letter <= action.end) return true;
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (matchAction(actions[i], letter)) return true;
        }
    }

    return false;
};

let getEpsilonActionMap = (transitionMap) => {
    let map = {};

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isEpsilonAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }

    return map;
};

let getLeftActionMap = (transitionMap) => {
    let map = {};
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isLeftAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }
    return map;
};

let findActionState = (transitList, type) => {
    for (let i = transitList.length - 1; i >= 0; i--) {
        let {
            action, state
        } = transitList[i];
        if (containActionType(action, type)) {
            return state;
        }
    }
};

let containActionType = (action, type) => {
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (containActionType(actions[i], type)) return true;
        }
    } else {
        return type(action);
    }

    return false;
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    transitionMaper,
    repeat,
    sequence,

    circle,

    isEpsilonTransition,

    g: graph, c: connect
});


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isObject
} = __webpack_require__(0);

let actionDSL = __webpack_require__(24);

let {
    toAction
} = actionDSL;

let {
    mergeMap
} = __webpack_require__(25);

/**
 * graph definition DSL
 *
 * state    action
 *
 * transition: (startState, action, nextState)
 *
 */

/**
 * graph(s1,
 *     connect(a1, graph(s2,
 *         connect(a3, s4),
 *         connect(a4, s5)
 *     )),
 *
 *     connect(a2, s3)
 *  )
 */

let count = 0;
let autoGraphState = () => {
    return `__auto_state_name_${count++}`;
};

/**
 * graph data = {
 *    transitions: [
 *      [action, nextGraph]
 *    ],
 *    state
 * }
 */
let graph = (...args) => {
    let state = null,
        lines = null;

    if (isString(args[0])) {
        state = args[0];
        lines = args.slice(1);
    } else {
        state = autoGraphState();
        lines = args;
    }

    let transitionMap = {};

    transitionMap[state] = [];

    for (let i = 0; i < lines.length; i++) {
        let {
            action, nextGraph
        } = lines[i];

        let nextState = isString(nextGraph) ? nextGraph : nextGraph.state;

        transitionMap[state].push({
            action,
            state: nextState
        });

        // merge transitionMap
        for (let name in nextGraph.transitionMap) {
            if (transitionMap[name]) {
                throw new Error(`repeated state name for different state, name is ${name}`);
            }
            transitionMap[name] = nextGraph.transitionMap[name];
        }
    }

    return {
        state,
        transitionMap
    };
};

let connect = (action, nextGraph) => {
    action = toAction(action);
    if(!nextGraph) nextGraph = autoGraphState();
    return {
        action,
        nextGraph
    };
};

/**
 * circle: repeat at least 0 times
 */
let circle = (action, nextGraph) => {
    let stateName = autoGraphState();

    return graph(stateName,
        connect(action, stateName),
        connect(null, nextGraph)
    );
};

let repeat = (action, times, nextGraph) => {
    let args = [];
    for (let i = 0; i < times; i++) {
        args.push(action);
    }
    args.push(nextGraph);

    return sequence(...args);
};

let sequence = (...args) => {
    let actions = args.slice(0, -1);
    let nextGraph = args[args.length - 1];
    let action = actions[0];
    if (actions.length <= 1) {
        return connect(action, nextGraph);
    }

    let nexts = actions.slice(1).concat([nextGraph]);

    return connect(action, graph(sequence(...nexts)));
};

let isEpsilonTransition = (v) => {
    return isObject(v) && v.type === 'deliver';
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
});


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(26);

let {
    isFunction
} = __webpack_require__(0);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const START_STATE = '__start__state__';

let {
    stateGraphDSL, DFA
} = __webpack_require__(6);

/**
 * build a fda to do the matching work
 *
 * transit: (currentState, letter) -> nextState
 */
module.exports = (stateMap, accepts) => {
    let m = null;

    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)),
        accepts);

    return (prefix, letter) => {
        if (prefix.length === 1) {
            m = new DFA(transitions, acceptStateMap);
            return m.transit(letter).type;
        } else {
            return m.transit(letter).type;
        }
    };
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isFunction
} = __webpack_require__(0);

let {
    MATCH, WAIT, QUIT
} = __webpack_require__(12);

let stringMatch = (word) => (prefix) => {
    if (word === prefix) return MATCH;
    if (word.indexOf(prefix) !== -1) return WAIT;
    return QUIT;
};

let getMatch = (match) => {
    if (isFunction(match)) return match;
    if (isString(match)) return stringMatch(match);
    // TODO analysis regular expression
};

module.exports = {
    getMatch
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    WAIT, MATCH
} = __webpack_require__(12);

let {
    assembleToken
} = __webpack_require__(27);

let filterTypes = (nextLetter, prefix, tokenTypes) => {
    let parts = [],
        matchs = [],
        independentType = null;

    let len = tokenTypes.length;

    for (let i = 0; i < len; i++) {
        let tokenType = tokenTypes[i];
        let ret = tokenType.match(prefix, nextLetter);

        if (ret === WAIT) {
            parts.push(tokenType);
        } else if (ret === MATCH) { // matched
            matchs.push(tokenType);
            parts.push(tokenType);
            if (!independentType && tokenType.independent) {
                independentType = tokenType;
            }
        }
    }

    return [parts, matchs, independentType];
};

let findToken = (retMatrix) => {
    let prev = null;

    for (let i = 0; i < retMatrix.length; i++) {
        let {
            prefix, matchTypes
        } = retMatrix[i];

        for (let j = 0; j < matchTypes.length; j++) {
            let tokenType = matchTypes[j];
            if (!prev ||
                tokenType.priority > prev.tokenType.priority ||
                (tokenType.priority === prev.tokenType.priority && prefix.length > prev.text.length)
            ) {
                prev = assembleToken(tokenType, prefix);
            }
        }
    }

    return prev;
};

module.exports = {
    findToken,
    filterTypes
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @readme-quick-run
 *
 * build LR1 table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table} = syntaxer;
 * let lr1Table = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * console.log(JSON.stringify(lr1Table, null, 4));
 */

/**
 * @readme-quick-run
 *
 * generate ast from LR table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table, LR} = syntaxer;
 * let {ACTION, GOTO} = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * let lrParse = LR(ACTION, GOTO);
 * lrParse({ // accept a token
 *   name: 'a',
 *   text: 'abc'
 * });
 * let ast = lrParse(null); // null as end symbol
 * console.log(JSON.stringify(ast, null, 4));
 */
module.exports = __webpack_require__(71);


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * syntax analysis
 *
 * background knowledge
 *
 * 1. context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *          left -> right
 * 2. shift-in reduce
 */

let LR = __webpack_require__(72);
let LR1Table = __webpack_require__(75);
let ctxFreeGrammer = __webpack_require__(80);
let {
    forEach
} = __webpack_require__(3);

/**
 * just used for testing
 */
let parse = (g, handlers) => {
    let {
        ACTION, GOTO
    } = LR1Table(ctxFreeGrammer(g));

    return (tokens) => {
        let parser = LR(ACTION, GOTO, handlers);
        forEach(tokens, parser);
        return parser(null);
    };
};

let buildLR1Table = (g) => {
    let grammer = ctxFreeGrammer(g);
    return LR1Table(grammer);
};

module.exports = {
    LR, LR1Table, parse, ctxFreeGrammer, buildLR1Table
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * LR ananlysis algorithm
 *
 * input: grammer G's analysis table and a string ω
 * output: if ω ϵ L(G), get the bottom-up analysis, otherwise error
 *
 * - init: (S₀, a₁a₂...an$)
 *
 * - assume current configuration is (S₀X₁S₁...Sm, aiai₊₁...an$)
 *
 *    (1) if action[Sm, ai] = shift S, S = GOTO[Sm, ai], then we got new configuration:
 *          (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
 *    (2) if action[Sm, ai] = reduce by A → β, |β| = r,then:
 *          S = GOTO[Sm₋r, A];
 *          (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
 *    (3) if action[Sm, ai] = accept, success
 *    (4) if action[Sm, ai] = error, error
 */

let {
    END_SYMBOL, EXPAND_START_SYMBOL
} = __webpack_require__(28);

let {
    initAST,
    reduceAST,
    appendToken
} = __webpack_require__(73);

/**
 * configuration = [stack, tokens]
 *
 * stack = [S₀X₁S₁...XmSm], Xi ϵ T U N, Si stands for state
 *
 * @param action function (state, termalSymbol) -> shift | reduce | accept | error
 *      return of action function, is a object: {type, production, errorMsg}
 *      production = [head, body:[]]
 */
module.exports = (ACTION, GOTO, {
    reduceHandler,
    acceptHandler
} = {}) => {
    // initial configuration
    let configuration = initConfiguration();

    // initial ast
    let ast = initAST(EXPAND_START_SYMBOL);

    let action = (state, token) => {
        let act = ACTION[state][token.name];
        if (!act) {
            return {
                type: 'error',
                errorMsg: `unexpected symbol (token.name) ${token.name}, token (token.text) is ${token.text}. Try to find ACTION from state ${state}.`
            };
        } else {
            return act;
        }
    };

    let goTo = (state, token) => {
        let nextState = GOTO[state][token.name];
        if (nextState === undefined) {
            throw new Error(`fail to goto state from ${state} and symbol (token.name) is ${token.name}, token (token.text) is ${token.text}. Try to do GOTO from state ${state}, but next state not exists.`);
        }
        return nextState;
    };

    let analysis = () => {
        let topState = getTopState(configuration);
        let token = getNextInputToken(configuration);
        // look up action
        let ret = action(topState, token);

        switch (ret.type) {
            case 'shift':
                shift(configuration, ret.state, token);
                ast = appendToken(ast, token);
                break;
            case 'reduce':
                // reduce production
                ast = reduce(ast, ret.production, configuration, goTo, reduceHandler);
                break;
            case 'error':
                // error handle
                throw new Error(ret.errorMsg);
            case 'accept':
                // clear configration
                configuration[1] = [];
                acceptHandler && acceptHandler(ast); // accept handle
                break;
            default:
                throw new Error(`unexpected action type ${ret.type}, when try to recoginise from [${topState}, ${token.name}]. Token is ${token.text}`);
        }
    };

    /**
     * @param token Object
     *   accept token as stream
     *   token = {
     *        name,
     *        other...
     *   }
     *
     *   if toke is null, means end of input
     */
    return (token) => {
        if (token === null) {
            // check state of the configuration
            configuration[1].push({
                name: END_SYMBOL
            });
            while (configuration[1].length) {
                analysis();
            }

            return ast;
        } else {
            // add token to configuration
            configuration[1].push(token);
            while (configuration[1].length > 1) {
                analysis();
            }
        }
    };
};

let initConfiguration = () => {
    // initial configuration
    return [
        [0], // stack
        [] // input
    ];
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
// S = GOTO(Sm, ai);
let shift = (configuration, state, token) => {
    let stack = configuration[0];
    let tokens = configuration[1];
    stack.push(token, state);
    tokens.shift();
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
// A → β, r = |β|
// S = GOTO(Sm₋r, A)
let reduce = (ast, [head, body], configuration, goTo, reduceHandler) => {
    let stack = configuration[0];
    let reducedTokens = [];
    for (let i = 0; i < body.length; i++) {
        stack.pop(); // pop state
        reducedTokens.push(stack.pop()); // pop token
    }
    let top = getTopState(configuration);
    stack.push(head);
    stack.push(goTo(top, {
        name: head,
        text: `[none terminal symbol] ${head}`
    }));

    let {newAst, midNode} = reduceAST(ast,
        ast.children.length - body.length, // start position
        ast.children.length - 1, // end position
        head);

    reduceHandler && reduceHandler([head, body], midNode, reducedTokens, ast);
    return newAst;
};

let getTopState = (configuration) => {
    let stack = configuration[0];
    return stack[stack.length - 1];
};

let getNextInputToken = (configuration) => {
    let tokens = configuration[1];
    return tokens[0];
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * reduce production to generate a AST
 *
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * current AST:
 *           S
 *        /  |  \
 *       /  / \  \
 *      α    β    ω
 *     / \  / \  / \
 *     ...  ...  ...
 *
 * reduce by A → β
 *
 * result AST:
 *           S
 *        /  |  \
 *       /   A   \
 *      /   / \   \
 *     α     β     ω
 *    / \   / \   / \
 *    ...   ...   ...
 *
 * AST data structure
 * node = {
 *      type: terminal | none-terminal,
 *      symbol,
 *      token,
 *      children: [node]
 * }
 *
 * reduce start point: a token list
 * reduce end point: S → r
 *
 * 1. init AST from a list of token
 *
 * 2. reduce production to expand AST
 */

let {
    map
} = __webpack_require__(3);

const TERMINAL_TYPE = 'terminal';
const NONE_TERMINAL_TYPE = 'none-terminal';

/**
 * @param startSymbol String
 * @param tokens Array
 *
 * @return ast Object
 *
 * tokens = [{
 *     name,
 *     text
 * }]
 */
let initAST = (startSymbol, tokens = []) => {
    return {
        type: NONE_TERMINAL_TYPE,
        symbol: startSymbol,
        children: map(tokens, tokenToLeaf)
    };
};

let tokenToLeaf = (token) => {
    return {
        type: TERMINAL_TYPE,
        symbol: token.name,
        token
    };
};

/**
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * @param ast
 * @param start
 * @param end
 * @param leftSymbol
 *
 * @return ast
 *
 * β = ast.children[start] ~ ast.children[end]
 *
 * 1. remove β from ast, replace with A
 * 2. make every elements of β as A's child
 */
let reduceAST = (ast, start = 0, end = 0, leftSymbol) => {
    // generate a new middle node, which will hang beta nodes
    let midNode = {
        type: NONE_TERMINAL_TYPE,
        symbol: leftSymbol
    };

    let beta = ast.children.splice(start, end - start + 1, midNode);
    midNode.children = beta;

    return {newAst: ast, midNode};
};

/**
 * @param ast
 * @param token
 */
let appendToken = (ast, token) => {
    ast.children.push(tokenToLeaf(token));
    return ast;
};

module.exports = {
    initAST,
    reduceAST,
    appendToken
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(29);

let {
    isFunction
} = __webpack_require__(0);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let LR1CanonicalCollection = __webpack_require__(76);
let {
    forEach, findIndex
} = __webpack_require__(3);
let GO = __webpack_require__(77);
let {
    LR1Itemer
} = __webpack_require__(78);
let {
    sameClosure
} = __webpack_require__(13);

module.exports = (grammer) => {
    let {
        END_SYMBOL, isTerminalSymbol, N
    } = grammer;

    let ACTION = [], // action table
        GOTO = []; // goto table

    let LR1Grammer = LR1Itemer(grammer);
    let go = GO(grammer, LR1Grammer);

    let C = LR1CanonicalCollection(grammer, LR1Grammer, go);

    forEach(C, (I, index) => {
        ACTION[index] = ACTION[index] || {};

        // item = [head, body, dotPosition, forwards]

        forEach(I.items, (item) => {
            // [S`→ S., $] ϵ Ii
            if (LR1Grammer.isAcceptItem(item)) {
                //
                ACTION[index][END_SYMBOL] = {
                    type: 'accept'
                };
            } else if (item.isReduceItem()) { // [A → α., a] ϵ Ii, A≠S`
                forEach(item.getForwards(), (a) => {
                    ACTION[index][a] = {
                        type: 'reduce',
                        production: item.getProduction()
                    };
                });
            } else if (isTerminalSymbol(item.getNextSymbol())) {
                let Ij = go(I, item.getNextSymbol());

                if (Ij && Ij.items.length) {
                    ACTION[index][item.getNextSymbol()] = {
                        type: 'shift',
                        state: getStateIndex(C, Ij)
                    };
                }
            }
        });
    });

    forEach(C, (I, index) => {
        GOTO[index] = GOTO[index] || {};
        forEach(N, (A) => {
            let Ij = go(I, A);
            if (Ij && Ij.items.length) {
                GOTO[index][A] = getStateIndex(C, Ij);
            }
        });
    });

    return {
        GOTO,
        ACTION
    };
};

let getStateIndex = (C, I) => findIndex(C, I, {
    eq: sameClosure
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    buildClosure
} = __webpack_require__(13);
let {
    reduce
} = __webpack_require__(3);

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = (grammer, LR1Grammer, go) => {
    let {
        symbols
    } = grammer;

    let initClosure = buildClosure([
        LR1Grammer.initItem(grammer)
    ], grammer, LR1Grammer);

    let C = [initClosure];
    let canonicalCollectionMap = {};
    canonicalCollectionMap[initClosure.serializedText] = true;

    let appendedC = C;

    while (true) { // eslint-disable-line
        let newAppendedC = [];

        for (let i = 0; i < appendedC.length; i++) {
            let I = appendedC[i];
            let gotoSet = getGoToSymbolsSet(symbols, I, go);

            for (let j = 0; j < gotoSet.length; j++) {
                let state = gotoSet[j];
                let serializedText = state.serializedText;

                if (!canonicalCollectionMap[serializedText]) {
                    // add new state
                    newAppendedC.push(state);
                    canonicalCollectionMap[serializedText] = true;
                }
            }
        }

        if (!newAppendedC.length) break;

        appendedC = newAppendedC;
        C = C.concat(appendedC);
    }

    return C;
};

let getGoToSymbolsSet = (symbols, I, go) => {
    // for every symbol
    let set = reduce(symbols, (pre, X) => {
        let newState = go(I, X);

        if (newState && newState.items.length) {
            pre.push(newState);
        }
        return pre;
    }, []);

    return set;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce, filter
} = __webpack_require__(3);

let {
    buildClosure
} = __webpack_require__(13);

/**
 * jump
 *
 * A→αX.β => A→α.Xβ
 *
 * J = go(I, X) = closure({A→αX.β | A→α.Xβ ϵ I})
 *
 * if one viable prefix of A→αX.β  of I is ρ=δα, then A→α.Xβ in J has viable prefix δαX.
 *
 * @param I
 *    [head, body, dotPosition]
 *
 * @param X
 *    symbol
 *
 * @param productions
 */
module.exports = (grammer, LR1Grammer) => {
    let getStartItems = (I, X) => {
        let nextSymbolX = filter(I.items, (item) => {
            return item.getNextSymbol() === X;
        });

        let startItems = reduce(nextSymbolX, (prev, item) => { // eslint-disable-line
            if (item.restIsNotEmpty()) {
                prev.push(item.nextPositionItem());
            }

            return prev;
        }, []);

        return startItems;
    };

    return (I, X) => {
        let targetClosure = null;

        I.cache_GOTO = I.cache_GOTO || {};

        if (I.cache_GOTO[X]) {
            targetClosure = I.cache_GOTO[X];
        } else {
            let startItems = getStartItems(I, X);

            targetClosure = buildClosure(
                startItems,

                grammer,

                LR1Grammer
            );

            I.cache_GOTO[X] = targetClosure;
        }

        return targetClosure;
    };
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let First = __webpack_require__(79);

let {
    union, reduce, filter, flat, map
} = __webpack_require__(3);

let LR1Itemer = (grammer) => {
    let {
        END_SYMBOL,
        isNoneTerminalSymbol,
        getProductionsOf
    } = grammer;

    let first = First(grammer);

    let buildLR1Item = (production, dotPosition, forwards) => {
        let {
            getHead, getBody, isTerminalSymbol, isEndSymbol
        } = grammer;

        // [A → α.Bβ, a]
        let getNextSymbol = () => {
            return getBody(production)[dotPosition];
        };

        let getForwards = () => forwards;

        let afterNextRest = () => getBody(production).slice(dotPosition + 1);

        let list = () => [getHead(production), getBody(production), dotPosition, forwards];

        // change the forwards
        let concatForwards = (newForwards) => {
            return buildLR1Item(production, dotPosition, union(forwards, newForwards));
        };

        let adjoints = null;

        // [A → α.Bβ, a], FIRST(βa)
        let getAdjoints = () => {
            if (adjoints === null) {
                let beta = afterNextRest();
                let forwards = getForwards();

                let ret = reduce(forwards, (prev, letter) => {
                    let firstSet = beta.length ? first(beta.concat([letter])) : [letter];
                    return prev.concat(filter(firstSet, (item) => isTerminalSymbol(item) || isEndSymbol(item)));
                }, []);

                adjoints = ret;

                return ret;
            } else {
                return adjoints;
            }
        };

        // rest = ε && a = $
        let isReducedItem = () => {
            return !afterNextRest().length && getForwards().length === 1 && isEndSymbol(getForwards()[0]);
        };

        let restIsNotEmpty = () => getBody(production).length && dotPosition < getBody(production).length;

        let nextPositionItem = () => {
            return buildLR1Item(production, dotPosition + 1, forwards, grammer);
        };

        let getGrammer = () => grammer;

        // [A → α., a] ϵ Ii, A≠S`
        let isReduceItem = () => {
            return dotPosition === getBody(production).length;
        };

        let getProduction = () => production;

        let serializeId = null;

        let serialize = () => {
            if (serializeId === null) {
                serializeId = JSON.stringify([production, dotPosition, forwards.sort()]);
            }
            return serializeId;
        };

        let serializePrefixId = null;
        let serializePrefix = () => {
            if (serializePrefixId === null) {
                serializePrefixId = JSON.stringify([production, dotPosition]);
            }

            return serializePrefixId;
        };

        return {
            getNextSymbol,
            getProduction,
            getForwards,
            afterNextRest,
            list,
            concatForwards,
            getAdjoints,
            isReducedItem,
            restIsNotEmpty,
            nextPositionItem,
            getGrammer,
            isReduceItem,
            serialize,
            serializePrefix
        };
    };

    // S` -> S.
    var acceptItem = () => {
        return buildLR1Item([grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]], 1, [grammer.END_SYMBOL]);
    };

    let isAcceptItem = (item) => {
        return sameItem(acceptItem(item.getGrammer()), item);
    };

    var sameItem = (item1, item2) => {
        return item1.serialize() === item2.serialize();
    };

    let initItem = () => {
        let item = buildLR1Item(
            [grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]],
            0, [grammer.END_SYMBOL]
        );

        return item;
    };

    let fromList = ([head, body, dotPosition, forwards]) => {
        return buildLR1Item([head, body], dotPosition, forwards);
    };

    /**
     * [B → .γ, b]
     */
    let supItem = (production, symbol) => {
        return buildLR1Item(production, 0, [symbol]);
    };

    let expandCacheMap = {};
    let expandItem = (item) => {
        let serializeId = item.serialize();

        if (expandCacheMap[serializeId]) {
            return expandCacheMap[serializeId].slice(0);
        }

        let {
            getNextSymbol,
            getAdjoints,
            isReducedItem
        } = item;
        let next = getNextSymbol();

        if (!next || !isNoneTerminalSymbol(next)) return [];

        let nextProductions = getProductionsOf(next);

        let newItems = flat(map(nextProductions, (production) => isReducedItem() ? [
            supItem(production, END_SYMBOL)
        ] : map(getAdjoints(), (b) => supItem(production, b))));

        expandCacheMap[serializeId] = newItems;

        return newItems;
    };

    return {
        expandItem,
        buildLR1Item,
        isAcceptItem,
        sameItem,
        initItem,
        fromList,
        supItem
    };
};

module.exports = {
    LR1Itemer
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain, union, reduce, difference, forEach
} = __webpack_require__(3);

let {
    isArray
} = __webpack_require__(0);

module.exports = (grammer) => {
    // cache first set
    let firstMap = {};

    /**
     * first set of sentential form
     *
     * α ϵ (T U N)*
     *
     * FIRST(α) = { a | α *=> a..., a ϵ T }
     *
     * if α *=> ε, then ε ϵ FIRST(α)
     *
     * A → ε => ['A', []]
     *
     * using null stand for ε
     */

    let first = (X) => {
        if (firstMap[X]) return firstMap[X];
        let ret = firstSet(X);
        firstMap[X] = ret;
        return ret;
    };

    let firstSet = (X) => {
        let {
            isTerminalSymbol,
            getProductionsOf,
            isEmptyProduction,
            getBody,
            EPSILON
        } = grammer;

        if (isTerminalSymbol(X)) {
            return [X];
        } else {
            // find all productions start with X
            let ps = getProductionsOf(X);

            return reduce(ps, (prev, production) => {
                let body = getBody(production);

                if (isEmptyProduction(production)) {
                    return union(prev, [EPSILON]); // union ε
                } else {
                    if (isTerminalSymbol(body[0])) {
                        return union(prev, [body[0]]);
                    } else {
                        return union(prev, firstList(body, grammer));
                    }
                }
            }, []);
        }
    };

    let firstListMap = {};
    /**
     * [...ab...]
     */
    let firstList = (body) => {
        let {
            EPSILON, getBodyId
        } = grammer;

        let bodyId = getBodyId(body);
        if (firstListMap[bodyId]) {
            return firstListMap[bodyId];
        }

        let ret = [];
        forEach(body, (y, index) => {
            let set = first(y);

            ret = union(ret, difference(set, [EPSILON]));
            if (!contain(set, EPSILON)) { // stop
                return true;
            }

            if (index === body.length - 1) {
                ret = union(ret, [EPSILON]);
            }
        });

        firstListMap[bodyId] = ret;
        return ret;
    };

    return (alpha) => {
        if (isArray(alpha)) {
            return firstList(alpha);
        } else {
            return first(alpha);
        }
    };
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *    left -> right
 *
 * production = [head, body]
 *
 * TODO validate
 */

const {
    END_SYMBOL, EXPAND_START_SYMBOL, EPSILON
} = __webpack_require__(28);

/**
 * context free grammer is read-only
 */

module.exports = ({
    startSymbol,
    T, N,
    productions
}) => {
    let symbols = T.concat(N);

    // cache
    let noneTerminalProductionMap = getNoneTerminalProductionMap(productions);
    let terminalMap = listToExistMap(T);
    let noneTerminalMap = listToExistMap(N);

    let isTerminalSymbol = (symbol) => !!terminalMap[symbol];
    let isNoneTerminalSymbol = (symbol) => !!noneTerminalMap[symbol];

    /**
     * get all the productions startSymbol with none terminal symbol
     */
    let getProductionsOf = (noneTerminal) => noneTerminalProductionMap[noneTerminal];

    // A -> ε
    let isEmptyProduction = (production) => { // eslint-disable-body
        return !getBody(production).length;
    };

    let getBody = (production) => production[1];

    let getHead = (production) => production[0];

    let isEndSymbol = (v) => v === END_SYMBOL;

    let getBodyId = (body) => JSON.stringify(body);

    return {
        isTerminalSymbol,
        isNoneTerminalSymbol,
        getProductionsOf,
        isEmptyProduction,
        getBody,
        getBodyId,
        getHead,
        EPSILON,
        END_SYMBOL,
        EXPAND_START_SYMBOL,
        startSymbol,
        productions,
        isEndSymbol,
        symbols,
        N
    };
};

let listToExistMap = (arr) => {
    let map = {};
    let tLen = arr.length;
    for (let i = 0; i < tLen; i++) {
        map[arr[i]] = true;
    }
    return map;
};

/**
 * get the production map, key is none terminal symbol, keys is the set of producitons
 */
let getNoneTerminalProductionMap = (producitons) => {
    let productionMap = {};

    let productionLen = producitons.length;
    for (let i = 0; i < productionLen; i++) {
        let production = producitons[i];
        let head = production[0];
        productionMap[head] = productionMap[head] || [];
        productionMap[head].push(production);
    }

    return productionMap;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    stringGraph,
    numberGraph
} = __webpack_require__(82);

let {
    buildFSM
} = __webpack_require__(23);

let FSM = __webpack_require__(6);
let {
    stateGraphDSL
} = FSM;

let {
    g,
    c,
    union,
    sequence,
    range,
    circle
} = stateGraphDSL;

let whitespace = union(' ', '\f', '\n', '\r', '\t', '\v', '\u00a0', '\u1680', '\u180e', '\u2000-', '\u200a', '\u2028', '\u2029', '\u202f', '\u205f', '\u3000', '\ufeff');

// .abcbf
// .0
// ._
let nodeName = g(sequence(
    '.',
    union('_', '%', range('a', 'z'), range('A', 'Z'), range('0', '9')),
    circle(union('_', '%', range('a', 'z'), range('A', 'Z'), range('0', '9')))
));

let variableName = g(sequence(
    union('_', range('a', 'z'), range('A', 'Z')),
    circle(union('_', range('a', 'z'), range('A', 'Z'), range('0', '9')))
));

let nodeNameVariable = g(sequence(
    '.',
    '[',

    circle(whitespace, g(sequence(
        union('_', range('a', 'z'), range('A', 'Z')),

        circle(union('_', range('a', 'z'), range('A', 'Z'), range('0', '9')),
            circle(whitespace,
                g(c(']'))
            ),
        ))))
));

module.exports = [

    {
        priority: 1,
        match: 'true',
        name: 'true'
    }, {
        priority: 1,
        match: 'false',
        name: 'false'
    }, {
        priority: 1,
        match: 'null',
        name: 'null'
    }, {
        priority: 1,
        match: buildFSM(stringGraph),
        name: 'string'
    }, {
        priority: 1,
        match: buildFSM(numberGraph),
        name: 'number'
    },

    {
        priority: 1,
        match: buildFSM(nodeName),
        name: 'nodeName'
    },
    {
        priority: 1,
        match: buildFSM(nodeNameVariable),
        name: 'nodeNameVariable'
    },
    {
        priority: 1,
        match: buildFSM(variableName),
        name: 'variableName'
    },
    {
        priority: 1,
        match: '=',
        name: 'assign'
    },
    {
        priority: 1,
        match: '-',
        name: 'delete'
    },
    {
        priority: 1,
        match: '+',
        name: 'append'
    },
    {
        priority: 1,
        match: ';',
        name: 'semicolon'
    },
    {
        priority: 1,
        match: '(',
        name: 'leftBracket'
    },
    {
        priority: 1,
        match: ')',
        name: 'rightBracket'
    },
    {
        priority: 1,
        match: ',',
        name: 'comma'
    },
    {
        priority: 1,
        match: buildFSM(g(
            c(whitespace)
        )),
        name: 'whitespace'
    }
];


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    stateGraphDSL
} = __webpack_require__(6);

let {
    g, c, union, range, sequence, circle, left, repeat
} = stateGraphDSL;

let numberGraph = g(c(union(null, '-'),
    g(
        c('0', g('decimal',
            c('.', circle(range('0', '9'), 'science')),
            c(null, g('science',
                c(null, 'accept'),
                sequence(
                    union('e', 'E'),
                    union('+', '-', null),
                    range('0', '9'),
                    circle(range('0', '9'), 'accept')
                )
            ))
        )),

        sequence(
            range('1', '9'),
            circle(range('0', '9'), 'decimal')
        )
    )
));

let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));

let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');

let stringGraph = g(
    c('"', g('enter',
        c('\\', g(
            c(escapeSymbols, 'enter'),
            c('u',
                g(repeat(hexDigit, 4, 'enter'))
            ))),
        c('"', 'accept'),
        c(left(), 'enter')
    )));

module.exports = {
    numberGraph,
    stringGraph
};


/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports={"GOTO":[{"PROGRAM":11,"EXPRESSION_LIST":12,"EXPRESSION":13,"UPDATE_EXPRESSION":14,"QUERY_EXPRESSION":15,"PATH":16,"ATOM_DATA":17},{"PATH":20},{"PATH":23},{},{"PATH":25},{"PATH":26},{},{},{},{},{},{},{},{},{},{},{},{},{"PATH":29},{"PATH":30},{},{"PATH":31},{"PATH":32},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":44,"PATH":45,"ATOM_DATA":46},{},{},{"EXPRESSION_LIST":47,"EXPRESSION":13,"UPDATE_EXPRESSION":14,"QUERY_EXPRESSION":15,"PATH":16,"ATOM_DATA":17},{"QUERY_EXPRESSION":48,"PATH":49,"ATOM_DATA":17},{},{},{},{},{"QUERY_EXPRESSION":50,"PATH":49,"ATOM_DATA":17},{},{},{"PATH":52},{"PATH":53},{},{},{},{},{},{},{},{},{},{},{},{},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":57,"PATH":45,"ATOM_DATA":46},{},{},{"QUERY_EXPRESSION":43,"QUERY_EXPRESSION_LIST":58,"PATH":45,"ATOM_DATA":46},{},{},{},{},{}],"ACTION":[{"$":{"type":"reduce","production":["EXPRESSION",[]]},"semicolon":{"type":"reduce","production":["EXPRESSION",[]]},"variableName":{"type":"shift","state":3},"delete":{"type":"shift","state":1},"append":{"type":"shift","state":2},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"leftBracket":{"type":"shift","state":24}},{"$":{"type":"reduce","production":["PATH",["nodeName"]]},"assign":{"type":"reduce","production":["PATH",["nodeName"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"assign":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"$":{"type":"reduce","production":["ATOM_DATA",["true"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["true"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["false"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["false"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["null"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["null"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["string"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["string"]]}},{"$":{"type":"reduce","production":["ATOM_DATA",["number"]]},"semicolon":{"type":"reduce","production":["ATOM_DATA",["number"]]}},{"$":{"type":"accept"}},{"$":{"type":"reduce","production":["PROGRAM",["EXPRESSION_LIST"]]}},{"$":{"type":"reduce","production":["EXPRESSION_LIST",["EXPRESSION"]]},"semicolon":{"type":"shift","state":27}},{"$":{"type":"reduce","production":["EXPRESSION",["UPDATE_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["EXPRESSION",["UPDATE_EXPRESSION"]]}},{"$":{"type":"reduce","production":["EXPRESSION",["QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["EXPRESSION",["QUERY_EXPRESSION"]]}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"assign":{"type":"shift","state":28}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]}},{"$":{"type":"reduce","production":["PATH",["nodeName"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["delete","PATH"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["delete","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"assign":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":21},"nodeNameVariable":{"type":"shift","state":22}},{"assign":{"type":"shift","state":33}},{"rightBracket":{"type":"shift","state":35},"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"$":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"assign":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"assign":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"$":{"type":"reduce","production":["EXPRESSION",[]]},"semicolon":{"type":"reduce","production":["EXPRESSION",[]]},"variableName":{"type":"shift","state":3},"delete":{"type":"shift","state":1},"append":{"type":"shift","state":2},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":4},"nodeNameVariable":{"type":"shift","state":5}},{"variableName":{"type":"shift","state":3},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"$":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"$":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"semicolon":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"assign":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"variableName":{"type":"shift","state":3},"true":{"type":"shift","state":6},"false":{"type":"shift","state":7},"null":{"type":"shift","state":8},"string":{"type":"shift","state":9},"number":{"type":"shift","state":10},"nodeName":{"type":"shift","state":18},"nodeNameVariable":{"type":"shift","state":19}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName"]]},"leftBracket":{"type":"shift","state":51}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]}},{"comma":{"type":"reduce","production":["PATH",["nodeName"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeName"]]},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeNameVariable"]]},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["ATOM_DATA",["true"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["true"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["false"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["false"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["null"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["null"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["string"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["string"]]}},{"comma":{"type":"reduce","production":["ATOM_DATA",["number"]]},"rightBracket":{"type":"reduce","production":["ATOM_DATA",["number"]]}},{"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION_LIST",["QUERY_EXPRESSION"]]},"comma":{"type":"shift","state":54}},{"rightBracket":{"type":"shift","state":55}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["ATOM_DATA"]]}},{"$":{"type":"reduce","production":["EXPRESSION_LIST",["EXPRESSION","semicolon","EXPRESSION_LIST"]]}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["PATH","assign","QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["PATH","assign","QUERY_EXPRESSION"]]}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["PATH"]]}},{"$":{"type":"reduce","production":["UPDATE_EXPRESSION",["append","PATH","assign","QUERY_EXPRESSION"]]},"semicolon":{"type":"reduce","production":["UPDATE_EXPRESSION",["append","PATH","assign","QUERY_EXPRESSION"]]}},{"rightBracket":{"type":"shift","state":56},"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"comma":{"type":"reduce","production":["PATH",["nodeName","PATH"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeName","PATH"]]}},{"comma":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]},"rightBracket":{"type":"reduce","production":["PATH",["nodeNameVariable","PATH"]]}},{"variableName":{"type":"shift","state":34},"true":{"type":"shift","state":38},"false":{"type":"shift","state":39},"null":{"type":"shift","state":40},"string":{"type":"shift","state":41},"number":{"type":"shift","state":42},"nodeName":{"type":"shift","state":36},"nodeNameVariable":{"type":"shift","state":37}},{"$":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]},"semicolon":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","rightBracket"]]}},{"rightBracket":{"type":"shift","state":59}},{"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION_LIST",["QUERY_EXPRESSION","comma","QUERY_EXPRESSION_LIST"]]}},{"comma":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]},"rightBracket":{"type":"reduce","production":["QUERY_EXPRESSION",["variableName","leftBracket","QUERY_EXPRESSION_LIST","rightBracket"]]}}]}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



// TODO reuse pfc-compiler

let {
    isObject,
    isFunction,
    isString
} = __webpack_require__(30);

let {
    T_ASSIGN,
    T_DELETE,
    T_VARIABLE_NAME,
    T_FUNCTION,
    T_PATH,
    T_NODE_NAME_VARIABLE,

    A_DEFAULT
} = __webpack_require__(14);

/**
 *
 * variableStub = {
 *    [variableName]: {
 *       type,
 *       default,  // default value of variable
 *       validate // function used to check dynamic
 *    }
 * }
 *
 *
 * TODO restraints checking
 */

// static check
let checkAST = (ast, {
    variableStub = {}
} = {}) => {
    let open = ast.slice(0);

    while (open.length) {
        let top = open.pop();
        let midType = top.type;

        if (midType === T_VARIABLE_NAME) {
            let varName = top.value;
            // must exist
            if (!variableStub.hasOwnProperty(varName)) {
                throw new Error(`missing variable ${varName} in [${Object.keys(variableStub).join(', ')}]`);
            }
        } else if (midType === T_FUNCTION) { // function
            let {
                funName,
                params
            } = top.value;
            let stub = variableStub[funName];
            if (!isObject(stub) || stub.type !== T_FUNCTION) {
                throw new Error(`missing function ${funName}, please check your variable map. Current variable map has keys [${Object.keys(variableStub).join(', ')}].`);
            }
            // push params
            let paramLen = params.length;
            for (let i = 0; i < paramLen; i++) {
                open.push(params[i]);
            }
        } else if (midType === T_ASSIGN) {
            open.push(top.value.path);
            open.push(top.value.value);
        } else if (midType === T_DELETE) {
            open.push(top.value.path);
        } else if (midType === T_PATH) {
            let path = top.value;
            for (let i = 0; i < path.length; i++) {
                let {
                    type,
                    value
                } = path[i];
                if (type === T_NODE_NAME_VARIABLE) {
                    let stub = variableStub[value];

                    if (!isObject(stub) || stub.type !== T_NODE_NAME_VARIABLE) {
                        throw new Error(`missing type attribute ${T_NODE_NAME_VARIABLE} for ${value}, please check your variable map. Current variable map has keys [${Object.keys(variableStub).join(', ')}].`);
                    }
                }
            }
        }
    }
};

let runTimeCheck = (variableStub, variableMap) => {
    for (let name in variableStub) {
        let stub = variableStub[name];
        // missing check
        if (!variableMap.hasOwnProperty(name) && !stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name} in variableMap whick keys are [${Object.keys(variableMap).join(', ')}].`);
        }

        // type match
        if (stub.type === T_FUNCTION && !isFunction(variableMap[name])) {
            throw new Error(`variable ${name} is not function as expected, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
        }

        if (stub.type === T_NODE_NAME_VARIABLE && !isString(variableMap[name])) {
            throw new Error(`variable ${name} is not string as expected, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
        }
    }
};

let getVariable = (name, variableMap, variableStub) => {
    let stub = variableStub[name] || {};
    let value = null;
    if (variableMap.hasOwnProperty(name)) {
        value = variableMap[name];
    } else {
        // try to using default
        if (!stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name}.`);
        } else {
            value = stub[A_DEFAULT];
        }
    }

    if (isObject(stub) && isFunction(stub.validate)) { // dynamic validation
        stub.validate(value);
    }

    return value;
};

module.exports = {
    checkAST,
    runTimeCheck,
    getVariable
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    parseArgs
} = __webpack_require__(4);

module.exports = (...args) => {
    let tagName = args[0];

    if (typeof tagName === 'string') {
        return n(...args);
    } else { // regard as lumine view
        let {
            attributes,
            childs
        } = parseArgs(args, {
            doParseStyle: false
        });

        return tagName({
            props: attributes,
            children: childs
        });
    }
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let rippleClassTables = __webpack_require__(87);
let Buttoner = __webpack_require__(89);
let {
    styles
} = __webpack_require__(2);

module.exports = Buttoner({
    defaultProps: {
        style: (theme) => styles(theme.oneLineBulk, {
            cursor: 'pointer'
        })
    },

    classTable: (theme) => {
        return Object.assign(rippleClassTables({
            theme
        }), {
            'btn:hover': theme.actions.hover,
            'btn:active': theme.actions.active,
            'btn:focus': theme.actions.focus
        });
    }
});


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

let ripple = __webpack_require__(88);

module.exports = ({
    theme,
    frameName = 'ripple',
    className = 'btn'
}) => {
    return {
        [`@keyframes ${frameName}`]: ripple,
        [`${className}::after`]: theme.flatRippleMask,
        [`${className}:focus:not(:active)::after`]: ({
            getClassName
        }) => {
            return {
                animation: `${getClassName(frameName)} 1s ease-out`
            };
        }
    }
};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = `
    0% {
        transform: scale(0, 0);
        opacity: 1;
    }
    20% {
        transform: scale(25, 25);
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: scale(40, 40);
    }`;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(4);
let lumineViewer = __webpack_require__(15);
let {
    Signal
} = __webpack_require__(11);
let {
    styles
} = __webpack_require__(2);

module.exports = lumineViewer(({
    props,
    children
}, {
    notify,
    getClassName
}) => {
    // TODO validate
    let attributes = {
        'class': `${getClassName('btn')}`,
        style: props.style,
        onclick: () => {
            notify(Signal('click'));
        }
    };
    if (props.id) {
        attributes.id = props.id;
    }
    return n('button', attributes, children[0]);
});


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(91);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
    getTreeScriptAst,
    updateTree
} = __webpack_require__(92);

const clientState = {
    localStorage: typeof localStorage !== 'undefined' && localStorage
};

/**
 * action flow
 */
const ACTION_SIGNAL_UPDATE_STATE = 'updateState';
const ACTION_SIGNAL_SEND_REQUEST = 'sendRequest';

/**
 * variableMap: global variable map
 *
 * TODO support general action flow
 */
const signalActionFlow = (signalActionMap, pageEnv, variableMap = {}, {
    variableStub
} = {}) => {
    parseSignalActionMap(signalActionMap, variableMap, {
        variableStub
    });

    // onsignal handler
    return (signal, viewState, ctx) => {
        let actions = signalActionMap[signal.type] || [];
        return runSignalActions(signal, actions, viewState, ctx, pageEnv);
    };
};

const runSignalActions = (signal, actions, viewState, ctx, pageEnv) => {
    return Promise.all(actions.map((action) => {
        return action.content(signal, viewState, ctx, pageEnv);
    }));
};

// TODO validate signalActionMap
const parseSignalActionMap = (signalActionMap, variableMap, {
    variableStub
}) => {
    for (let name in signalActionMap) {
        let actions = signalActionMap[name];
        if (!Array.isArray(actions)) {
            throw new Error(`Expect array for actions in signal action map. But got ${actions}.`);
        }

        for (let i = 0; i < actions.length; i++) {
            parseSignalAction(actions[i], variableMap, {
                variableStub
            });
        }
    }
};

/**
 * parse signal action
 *
 * {
 *   type,
 *   content,
 *   variableMap,
 *   variableStub,
 *   response: action,
 *   error: action
 * }
 */

const parseSignalAction = (signalAction, variableMap, {
    variableStub
}) => {
    const type = signalAction.type;
    const cnt = signalAction.content;

    if (typeof cnt !== 'string' && typeof cnt !== 'function') {
        throw new Error(`Content of action should be string or function, but got ${cnt}, in action ${type}.`);
    }

    let nextVariableMap = getVariableMap(variableMap, signalAction);
    let nextVariableStub = getVariableStub(variableStub, signalAction);

    if (type === ACTION_SIGNAL_UPDATE_STATE) { // update state
        if (typeof cnt === 'string') { // tree script
            // parse code to AST
            const ast = getTreeScriptAst(cnt, nextVariableStub);

            signalAction.content = (signal, viewState, ctx) => {
                return new Promise((resolve, reject) => {
                    try {
                        let data = Object.assign({
                            signal,
                            viewState
                        }, clientState);

                        updateTree(data, ast, nextVariableMap, nextVariableStub);

                        // update page, TODO, if expose signal
                        // TODO silient without update, used to do test
                        ctx.updateWithNotify();

                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            };
        }
    } else if (type === ACTION_SIGNAL_SEND_REQUEST) {
        if (typeof cnt === 'string') {
            let requestAst = getTreeScriptAst(cnt, nextVariableStub);
            let responseUpdate = getResponseHandler(signalAction.response, nextVariableMap, nextVariableStub);
            let errorUpdate = getErrorHandler(signalAction.error, nextVariableMap, nextVariableStub);

            signalAction.content = (signal, viewState, ctx, {
                runApi,
                apiMap
            }) => {
                let requestContext = Object.assign({}, nextVariableMap, apiMap);

                return runApi(
                    updateTree(viewState, requestAst, requestContext, nextVariableStub)
                ).then((response) => {
                    return responseUpdate && responseUpdate(response, viewState, ctx);
                }).catch((err) => {
                    errorUpdate && errorUpdate(err, viewState, ctx);
                    throw err;
                });
            };
        }
    } else {
        throw new Error(`unexpected action type for a signal action, type is ${type}`);
    }
};

const getResponseHandler = (response, variableMap, variableStub) => {
    if (typeof response === 'string') {
        let ast = getTreeScriptAst(response, variableStub);

        return (response, viewState, ctx) => {
            updateTree(Object.assign({
                response,
                viewState
            }, clientState), ast, variableMap, variableStub);

            // update page
            ctx.updateWithNotify();
        };
    } else if (typeof response === 'function') {
        return response;
    }

    return null;
};

const getErrorHandler = (error, variableMap, variableStub) => {
    if (typeof error === 'string') {
        let ast = getTreeScriptAst(error, variableStub);

        return (error, viewState, ctx) => {
            updateTree(Object.assign({
                errorMsg: error.toString(),
                error,
                viewState,
                ctx
            }, clientState), ast, variableMap, variableStub);

            // update page
            ctx.updateWithNotify();
        };
    } else if (typeof error === 'function') {
        return error;
    }

    return null;
};

const getVariableMap = (variableMap, action) => {
    if (!action.variableMap) return variableMap;
    return Object.assign({}, variableMap, action.variableMap);
};

const getVariableStub = (variableStub, action) => {
    if (!action.variableStub) return variableStub;
    return Object.assign({}, variableStub, action.variableStub);
};

module.exports = {
    signalActionFlow,
    runSignalActions
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
    parseStrToAst,
    checkAST,
    executeAST
} = __webpack_require__(22);

const JsonTree = __webpack_require__(21); // using json tree, right now

const getTreeScriptAst = (code, variableStub) => {
    let ast = parseStrToAst(code);

    if (variableStub) {
        checkAST(ast, {
            variableStub
        });
    }

    return ast;
};

const updateTree = (source, ast, variableMap, variableStub) => {
    let tree = JsonTree(source);

    return executeAST(ast, {
        queryByPath: tree.queryByPath,
        setByPath: tree.setByPath,
        removeByPath: tree.removeByPath,
        appendByPath: tree.appendByPath,
        variableMap,
        variableStub
    });
};

module.exports = {
    getTreeScriptAst,
    updateTree
};


/***/ })
/******/ ]);