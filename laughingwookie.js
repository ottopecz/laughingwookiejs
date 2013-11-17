(function () {
    var that = {},
        _chain = function () {
            var args = Array.prototype.slice.call(arguments),
                ret;

            if (args.length === 1) {
                ret = args[0].call(this);
            } else if (args.length === 2) {
                ret = args[0].call(this, args[1]);
            } else if (args.length === 3) {
                ret = args[0].call(this, args[1], args[2]);
            }

            return ret;
        };

    that.GIVEN = function () {

        this.plus = [];

        this.given = _chain.apply(this, arguments);

        return this;
    };

    that.PLUS = function () {

        this.plus.push(_chain.apply(this, arguments));

        return this;
    };

    that.WHEN = function () {

        this.when = _chain.apply(this, arguments);

        return this;
    };

    that.THEN = function () {

        _chain.apply(this, arguments);

        return this;
    };

    that.AND = function () {
        return this.THEN.apply(this, arguments);
    };

    if ( typeof define === "function" && define.amd ) {
        define( "bdd", [], function () { return that; } );
    } else {
        window.bdd = that;
    }
}());
