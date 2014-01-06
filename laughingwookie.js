(function (root, slice) {
    "use strict";

    var /**
         * Unexpectedly, determines whether the provided argument is a Function or not.
         * @param {*} arg
         * @returns {Boolean}
         */
        isFunction = function (arg) {
            return (typeof arg === 'function');
        },

        /**
         * Executes the provided bdd test object with the provided arguments.
         * @private
         * @static
         * @param {Object} bdd
         * @param {Function} then
         * @param {Array} args
         * @param {Array} wands
         * @param {Array} tands
         */
        executeAsyncBdd = function (bdd, then, args, wands, tands) {
            if (!then) {
                throw new Error("There is no THEN to test!");
            }

            applyAnds(bdd, wands);
            bdd.THEN.apply(bdd, [then.func].concat(args).concat(then.args));
            applyAnds(bdd, tands);
        },

        /**
         * Creates an object that stores the provided function and the array of args
         * @private
         * @static
         * @param {Function} func
         * @param {Array}  args
         * @returns {{
         *     func: {Function},
         *     args: {Array}
         * }}
         */
        createCallbackObject = function (func, args) {
            return {
                "func": func,
                "args": args
            };
        },

        /**
         * Applies the provided array of AND callback objects to the provided bdd object.
         * @private
         * @static
         * @param {Object} bdd
         * @param {Array} ands
         */
        applyAnds = function (bdd, ands) {
            var and;
            while (ands.length > 0) {
                and = ands.shift();
                bdd.AND.apply(bdd, [and.func].concat(and.args));
            }
        },

        /**
         * Creates a bdd API object.
         * @public
         * @static
         * @param {Boolean} async - if specified, async bdd object will be created
         * @returns {{
         *     GIVEN: {Function},
         *     WHEN: {Function},
         *     THEN: {Function},
         *     AND: {Function}
         * }}
         */
        bdd = function (async) {
            var _current, _block;

            if (async === true) {
                return bdd.async();
            }

            _block = function (func) {
                var args = slice.call(arguments, 1);
                var array = [_current].concat(args);
                _current = (func.apply(this, array) || _current);
                return this;
            };

            return {
                "GIVEN": function (arg) {
                    var args = slice.call(arguments, 1);
                    _current = (!isFunction(arg) ? arg : arg.apply(this, args));
                    return this;
                },
                "WHEN": _block,
                "THEN": _block,
                "AND": _block
            }
        };

    /**
     * Creates an async bdd API object.
     * @public
     * @static
     * @returns {{
     *     GIVEN: {Function},
     *     WHEN: {Function},
     *     THEN: {Function},
     *     AND: {Function},
     *     execute: {Function}
     * }}
     */
    bdd.async = function () {
        var _bdd = bdd();
        var _ran = false;
        var _wands = [];
        var _tands = [];
        var _then, _array;

        var callback = function () {
            var args = slice.call(arguments);
            if (!_ran) {
                _ran = true;
                executeAsyncBdd(_bdd, _then, args, _wands, _tands);
            }
            return this;
        };

        return {
            "execute": callback,
            "GIVEN": function () {
                _bdd.GIVEN.apply(_bdd, arguments);
                return this;
            },
            "WHEN": function (func) {
                var args = slice.call(arguments, 1);
                func.apply(this, [callback].concat(args));

                if (!_ran) {
                    _array = _wands;
                }

                return this;
            },
            "AND": function (func) {
                var args = slice.call(arguments, 1);

                if (_array) { //register AND callbacks
                    _array.push(createCallbackObject(func, args));
                } else {
                    _bdd.AND.apply(_bdd, [func].concat(args));
                }

                return this;
            },
            "THEN": function (func) {
                var args = slice.call(arguments, 1);

                if (_ran) {
                    _bdd.THEN.apply(_bdd, [func].concat(args));
                } else { //register THEN callback
                    _then = createCallbackObject(func, args);
                    _array = _tands;
                }

                return this;
            }
        };
    };

    //expose
    if (typeof module === 'object' && typeof define !== 'function') { // CommonJS
        module.exports = bdd;
    } else if (typeof define === "function" && define.amd ) { // AMD
        define("bdd", [], function () {
            return bdd;
        });
    } else { // browser global
        root.bdd = bdd;
    }

}(this, Array.prototype.slice));