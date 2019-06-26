const util = require("util");
const fs = require("fs");
const nearley = require("nearley");
const grammar = require("./grammar");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const sample = fs.readFileSync("./test/sample.at", "utf8");

// Parse something!
parser.feed(sample);

const results = parser.results;

// parser.results is an array of possible parsings.
console.log(util.inspect(results, { colors: true, depth: 1000 }));

const schema = {};

const mapDefintion = (def) => {
    schema[def.name] = mapType(def.type)
};

const mapType = (type) => {
    return type.rule;
};

const mapResult = (lex) => {
    if (lex.$ === "entry") {
        lex.statements.forEach(mapResult)
    } else if (lex.$ === "definition") {
        mapDefintion(lex);
    }
};

results.forEach(mapResult);

console.log(util.inspect(schema, { colors: true, depth: 1000 }));