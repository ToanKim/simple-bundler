const fs = require("fs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const nodePath = require("path");
const babelCore = require("@babel/core");

function buildAsset(filename) {
  const content = fs.readFileSync(filename, {
    encoding: "utf-8",
  });

  const ast = babelParser.parse(content, {
    sourceType: "module",
  });

  const dependencies = [];
  const dirname = nodePath.dirname(filename);

  babelTraverse(ast, {
    ImportDeclaration: ({ node }) => {
      const absolutePath = nodePath.join(dirname, node.source.value);
      node.source.value = absolutePath;

      dependencies.push(absolutePath);
    },
  });

  const { code } = babelCore.transformFromAstSync(ast, "", {
    presets: ["@babel/preset-env"],
  });

  return {
    filename,
    dependencies,
    code,
  };
}

function buildGraph(entry) {
  const mainAsset = buildAsset(entry);
  const queue = [mainAsset];
  const graph = {
    [mainAsset.filename]: mainAsset,
  };

  for (const asset of queue) {
    asset.dependencies.forEach((absolutePath) => {
      if (graph[absolutePath]) return;

      const child = buildAsset(absolutePath);
      graph[child.filename] = child;
      queue.push(child);
    });
  }

  return graph;
}

function bundle(graph, entry) {
  let modules = "";

  Object.values(graph).forEach((module) => {
    modules += `
        "${module.filename}": function (require, module, exports) {
          ${module.code}
        },
    `;
  });

  const result = `
    (function(modules) {

      const cache = {};

      function require(id) {
        if (cache[id]) {
          return cache[id].exports;
        }

        const fn = modules[id];

        const module = { exports: {} };

        fn(require, module, module.exports);

        cache[id] = module;

        return module.exports;
      }

      require("${entry}");
    })({ ${modules} })
  `;

  return result;
}

const entry = "src/index.js";
const graph = buildGraph(entry);
const result = bundle(graph, entry);

console.log(result);
