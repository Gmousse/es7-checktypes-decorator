class ArgumentTypeError extends TypeError {
    constructor(arg, argName, supportedTypes) {
        super();
        this.message = `${argName} expected as one of [${supportedTypes.join(', ')}], ` +
            `not as a ${typeof arg}${arg.constructor ? ` | ${arg.constructor.name}` : ''}.`;
    }
}

function getArgumentsNames(Func) {
    const funcString = Func.toString();
    const argumentsNames = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).match(/([^\s,]+)/g);
    if (!argumentsNames) { throw new TypeError('getParamNames only works with non exotic functions.'); }
    return argumentsNames;
}

function isOfType(variable, type) {
    return (typeof type === 'string') ? (
        (variable.constructor && variable.constructor.name === type) || (typeof variable === type.toLowerCase())
    ) : (
        variable instanceof type
    );
}

function checkArgType(arg, argName, expectedTypes) {
    if (!expectedTypes.reduce((p, n) => p || isOfType(arg, n), false)) {
        throw new ArgumentTypeError(arg, argName, expectedTypes);
    }
}

function checkArgumentsTypes(Func, types, isClass = false) {
    const argNames = getArgumentsNames(Func);
    return (...args) => {
        args.forEach((arg, index) => {
            if (types[index]) {
                checkArgType(arg, argNames[index], Array.isArray(types[index]) ? types[index] : [types[index]]);
            }
        });
        if (isClass) {
            return new Func(...args); // tricky part
        }
        return Func.call(this, ...args);
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
export default function checktypes(...types) {
    return (target, name, descriptor) => {
        if (!name && !descriptor) {
            return checkArgumentsTypes(target, types, true);
        }
        return {
            configurable: true,
            get() {
                const func = checkArgumentsTypes.call(this, descriptor.value, types);
                Object.defineProperty(this, name, {
                    value: func,
                    configurable: true,
                    writable: true,
                });
                return func;
            },
        };
    };
}
