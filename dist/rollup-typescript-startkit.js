(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.MCanvas = factory());
}(this, function () { 'use strict';

    var Lib = /** @class */ (function () {
        function Lib() {
            console.log("start lib");
        }
        return Lib;
    }());

    return Lib;

}));
//# sourceMappingURL=rollup-typescript-startkit.js.map
