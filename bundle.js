const fs = require("fs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const nodePath = require("path");
const babelCore = require("@babel/core");

let id = 0;

function buildAsset(filename) {
  const content = fs.readFileSync(filename, {
    encoding: "utf-8",
  });

  const ast = babelParser.parse(content, {
    sourceType: "module",
  });

  const dependencies = [];

  babelTraverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const { code } = babelCore.transformFromAstSync(ast, '', {
    presets: ['@babel/preset-env']
  });

  return {
    id: id++,
    filename,
    dependencies,
    code,
  };
}

function buildGraph(entry) {
  const mainAsset = buildAsset(entry);
  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = nodePath.dirname(asset.filename);

    asset.mapping = {};

    asset.dependencies.forEach((relativePath) => {
      const absolutePath = nodePath.join(dirname, relativePath);
      const child = buildAsset(absolutePath);

      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  return queue;
}

function bundle(graph) {
  let modules = "";

  graph.forEach(module => {
    modules += `
        ${module.id}: [
          function (require, module, exports) {
            ${module.code}
          },
          ${JSON.stringify(module.mapping)}
        ],
    `
  })

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };

        fn(localRequire, module, module.exports);

        return module.exports
      }

      require(0);
    })({ ${modules} })
  `

  return result;
}

const graph = buildGraph("./src/index.js");
const result = bundle(graph)

console.log(result);
