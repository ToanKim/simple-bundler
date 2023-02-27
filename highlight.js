(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(relativePath) {
      return require(mapping[relativePath]);
    }

    const module = { exports: {} };

    fn(localRequire, module, module.exports);

    console.log(module);

    return module.exports;
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      "use strict";

      var _index = require("./constant/index.js");
      var _index2 = require("./utils/index.js");
      console.log((0, _index2.logName)("Hello", _index.NAME));
    },
    { "./constant/index.js": 1, "./utils/index.js": 2 },
  ],

  1: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.NAME = exports.AUTHOR = void 0;
      var NAME = "Thomas";
      exports.NAME = NAME;
      var AUTHOR = "Thomas";
      exports.AUTHOR = AUTHOR;
    },
    {},
  ],

  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.logName = logName;
      var _index = require("../constant/index.js");
      function logName(greet, name) {
        return "".concat(_index.AUTHOR, " ").concat(greet, " ").concat(name);
      }
    },
    { "../constant/index.js": 3 },
  ],

  3: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.NAME = exports.AUTHOR = void 0;
      var NAME = "Thomas";
      exports.NAME = NAME;
      var AUTHOR = "Thomas";
      exports.AUTHOR = AUTHOR;
    },
    {},
  ],
});
