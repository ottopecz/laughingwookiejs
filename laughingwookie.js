(function (slice) {

    var isFunction = function (arg) {
        return (typeof arg === 'function');
    };

    var bdd = function () {
        var _current;
        var _block = function (func) {
            var args = slice.call(arguments, 1);
            var array = [_current].concat(args);

            _current = (func.apply(this, array) || _current);

            return this;
        };

        return {
            GIVEN: function (arg) {
                var args = slice.call(arguments, 1);
                _current = (!isFunction(arg) ? arg : arg.apply(this, args));
                return this;
            },
            WHEN: _block,
            THEN: _block,
            AND: _block
        }
    };

    if (typeof define === "function" && define.amd ) {
        define("bdd", [], function () {
            return bdd;
        });
    } else {
        window.bdd = bdd;
    }
}(Array.prototype.slice));