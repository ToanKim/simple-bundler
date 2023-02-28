
    (function(modules) {

      const cache = {};

      function require(id) {
        if (cache[id]) {
          console.log('Use cache', id);
          return cache[id].exports;
        }

        const fn = modules[id];

        const module = { exports: {} };

        fn(require, module, module.exports);

        cache[id] = module;

        return module.exports;
      }

      require("src/index.js");
    })({ 
        "src/index.js": function (require, module, exports) {
          "use strict";

var _index = require("src/constant/index.js");
var _index2 = require("src/utils/index.js");
console.log((0, _index2.logName)("Hello", _index.NAME));
        },
    
        "src/constant/index.js": function (require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAME = exports.AUTHOR = void 0;
var NAME = "Thomas";
exports.NAME = NAME;
var AUTHOR = "Thomas";
exports.AUTHOR = AUTHOR;
        },
    
        "src/utils/index.js": function (require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logName = logName;
var _index = require("src/constant/index.js");
function logName(greet, name) {
  return "".concat(_index.AUTHOR, " ").concat(greet, " ").concat(name);
}
        },
     })
  
