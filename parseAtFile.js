// @ts-check
const util = require("util");
const fs = require("fs");
const path = require("path");
const nearley = require("nearley");
const grammar = nearley.Grammar.fromCompiled(require("./grammar"));

const parseAtFile = (file, processedFiles = []) => {
    // Сохраняем информацию, что файл обработан.
    processedFiles.push(path.normalize(file));

    if (! fs.existsSync(file)) {
        throw new Error(`Importing file "${file}" not found`);
    }

    const parser = new nearley.Parser(grammar);

    const sample = fs.readFileSync(file, "utf8");
    const results = parser.feed(sample).results;

    // console.log(util.inspect(results, { colors: true, depth: 1000 }));

    const schema = {};
    let entry = null;

    const mapImport = (item) => {
        const dir = path.dirname(path.normalize(file));
        const baseName = item.file + (/\.ne$/.test(item.file) ? "" : ".at");
        const src = path.join(dir, baseName);

        if (processedFiles.includes(src)) {
            return;
        }    

        const data = parseAtFile(src, processedFiles);

        Object.entries(data.schema).forEach(([key, value]) => schema[key] = value);
    };

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
            if (type.limits) {
                const [min, max] = type.limits;

                schema.min = min;
                schema.max = max;
            }

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
            if (lex.imports) {
                lex.imports.forEach(mapImport);
            }

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

    return {
        schema,
        entry,
    };
};

module.exports = {
    parseAtFile,
};
