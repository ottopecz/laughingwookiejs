(function (root, slice) {

    var
        isFunction = function (arg) {
            return (typeof arg === 'function');
        },

        bdd = function () {
            var _current,
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

}(function () {
    return this;
}(), Array.prototype.slice));