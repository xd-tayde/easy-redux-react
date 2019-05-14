(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    document.write('<script src="http://' + (location.host || "localhost").split(":")[0] + ':35729/livereload.js?snipver=1"></' + "script>")

    var Lib = /** @class */ (function () {
        function Lib() {
            console.log("start lib");
        }
        return Lib;
    }());

    // You can debug or use the instance from lib in here.
    var lib = new Lib();
    console.log(lib);

}));
//# sourceMappingURL=example.js.map
