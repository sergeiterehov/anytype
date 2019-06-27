const util = require("util");
const { xmlToObject } = require("./xmlToObject");
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
let entry = null;

const mapDefintion = (def) => {
    schema[def.name] = mapType(def.type)
};

const mapType = (type, required = false) => {
    let schema = {};

    if (type.type_rule === "object") {
        const keys = {};

        type.fields.forEach((field) => {
            if (field.$ === "with") {
                if (! schema.includes) {
                    schema.includes = [];
                }

                schema.includes.push(field.name);
            } else {
                keys[field.name] = mapType(field.type, field.uses === "required");
            }
        });

        schema.$type = "object";
        schema.keys = keys;
    } else if (type.type_rule === "one_of") {
        schema.$type = "group";
        schema.operation = "one";
        schema.list = type.list.map((type) => mapType(type, false));
    } else if (type.type_rule === "array_of") {
        schema.$type = "array";
        // TODO: array or object
        schema.element = mapType(type.type);
    } else if (type.type_rule === "name") {
        schema.$type = "custom";
        schema.name = type.name;
    } else if (type.type_rule === "value") {
        schema.$type = "value";
        schema.type = type.type;
        schema.value = type.value;
    }

    if (required) {
        return {
            $type: "group",
            operation: "all",
            list: [
                { $type: "required" },
                schema,
            ],
        };
    }

    return schema;
};

const mapResult = (lex) => {
    if (lex.$ === "entry") {
        if (lex.statements) {
            lex.statements.forEach(mapResult);
        }

        if (lex.main) {
            mapResult(lex.main);
        }
    } else if (lex.$ === "definition") {
        mapDefintion(lex);
    } else if (lex.$ === "main") {
        entry = mapType(lex.type, lex.uses === "required");
    }
};

results.forEach(mapResult);

// console.log(util.inspect({
//     schema,
//     entry,
// }, { colors: true, depth: 1000 }));


const xml = fs.readFileSync("./test/sample.xml");

// xmlToObject(xml).then((data) => console.log(util.inspect(data, { colors: true, depth: 1000 })));
