'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = checktypes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArgumentTypeError = function (_TypeError) {
    (0, _inherits3.default)(ArgumentTypeError, _TypeError);

    function ArgumentTypeError(arg, argName, supportedTypes) {
        (0, _classCallCheck3.default)(this, ArgumentTypeError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ArgumentTypeError.__proto__ || (0, _getPrototypeOf2.default)(ArgumentTypeError)).call(this));

        _this.message = argName + ' expected as one of [' + supportedTypes.join(', ') + '], ' + ('not as a ' + (typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) + (arg.constructor ? ' | ' + arg.constructor.name : '') + '.');
        return _this;
    }

    return ArgumentTypeError;
}(TypeError);

function getArgumentsNames(Func) {
    var funcString = Func.toString();
    var argumentsNames = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).match(/([^\s,]+)/g);
    if (!argumentsNames) {
        throw new TypeError('getParamNames only works with non exotic functions.');
    }
    return argumentsNames;
}

function isOfType(variable, type) {
    return typeof type === 'string' ? variable.constructor && variable.constructor.name === type || (typeof variable === 'undefined' ? 'undefined' : (0, _typeof3.default)(variable)) === type.toLowerCase() : variable instanceof type;
}

function checkArgType(arg, argName, expectedTypes) {
    if (!expectedTypes.reduce(function (p, n) {
        return p || isOfType(arg, n);
    }, false)) {
        throw new ArgumentTypeError(arg, argName, expectedTypes);
    }
}

function checkArgumentsTypes(Func, types) {
    var _this2 = this;

    var isClass = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var argNames = getArgumentsNames(Func);
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        args.forEach(function (arg, index) {
            if (types[index]) {
                checkArgType(arg, argNames[index], Array.isArray(types[index]) ? types[index] : [types[index]]);
            }
        });
        if (isClass) {
            return new (Function.prototype.bind.apply(Func, [null].concat(args)))(); // tricky part
        }
        return Func.call.apply(Func, [_this2].concat(args));
    };
}

/**
 * Decorator checking constructor or methods arguments types. When types aren't appropriate, a TypeError is thrown.
 * @param {String | Object | Array} ...types The types of the arguments. Can be an array if an argument can be of one of multiple types.
 * You can pass a String, checking constructor.name or typeof, or an Object checking by instaceof.
 * @return {Function} The function used with the decorator if no error is thrown.
 * @example
 * @checktypes('Number', CustomClass)
 * class Example {
 *  constructor(arg1, arg2) {}
 *
 *  @checktypes('String', 'Number')
 *  methodExample(arg1, arg2) {}
 *
 *  @checktypes(Array, Date, CustomClass)
 *  function example(arg1, arg2, arg3) {}
 *
 *  @checktypes(['String', CustomClass], ['Number', Number])
 *  function example(arg1, arg2) {}
 * }
 */
function checktypes() {
    for (var _len2 = arguments.length, types = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        types[_key2] = arguments[_key2];
    }

    return function (target, name, descriptor) {
        if (!name && !descriptor) {
            return checkArgumentsTypes(target, types, true);
        }
        return {
            configurable: true,
            get: function get() {
                var func = checkArgumentsTypes.call(this, descriptor.value, types);
                (0, _defineProperty2.default)(this, name, {
                    value: func,
                    configurable: true,
                    writable: true
                });
                return func;
            }
        };
    };
}