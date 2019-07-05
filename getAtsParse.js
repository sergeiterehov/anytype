// @ts-check
const nearley = require("nearley");
const path = require("path");
const grammar = nearley.Grammar.fromCompiled(require("./grammar"));

const getAtsParser = (getSourceByName) => {
    const parseAtSource = (file, processedFiles = []) => {
        // Сохраняем информацию, что файл обработан.
        processedFiles.push(path.normalize(file));
    
        const parser = new nearley.Parser(grammar);
    
        const sample = getSourceByName(file)
        const results = parser.feed(sample).results;
    
        const types = {};
        let entry = null;
    
        const mapImport = (types, item) => {
            const src = path.resolve(
                path.dirname(file),
                item.file + (/\.at$/.test(item.file) ? "" : ".at"),
            );
    
            if (processedFiles.includes(src)) {
                return;
            }
    
            const data = parseAtSource(src, processedFiles);
    
            Object.entries(data.types).forEach(([key, value]) => types[key] = value);
        };
    
        const setDefintion = (types, path, def) => {
            setType(types, def.name, def.type);
    
            types[def.name].defined = true;
        };
    
        const setType = (types, path, type) => {
            if (types[path]) {
                return path;
            }
    
            if (type.$ === "type_rule") {
                return setTypeRule(types, path, type);
            }
    
            return path;
        };
    
        const setTypeRule = (types, path, type) => {
            if (type.type_rule === "object") {
                const rule = {
                    $: "object",
                    fields: type.fields.filter((field) => field.$ === "pair").map((field) => {
                        return {
                            name: field.name,
                            uses: field.uses,
                            type: setType(types, `${path}.${field.name}`, field.type),
                        };
                    }),
                };
    
                type.fields.filter((field) => field.$ === "with").forEach((item) => {
                    const type = types[item.name];
    
                    if (! type) {
                        throw new Error(`Object "${item.name}" not found`);
                    }
    
                    rule.fields.push(...type.fields);
                });
    
                types[path] = rule;
            } else if (type.type_rule === "one_of") {
                const rule = {
                    $: "one_of",
                    types: type.types.map((type, i) => {
                        return setType(types, `${path}(${i})`, type);
                    }),
                };
    
                types[path] = rule;
            } else if (type.type_rule === "array_of") {
                const rule = {
                    $: "array_of",
                    type: setType(types, `${path}[]`, type.type),
                };
    
                if (type.limits) {
                    rule.limits = type.limits;
                }
    
                types[path] = rule;
            } else if (type.type_rule === "name") {
                types[path] = {
                    $: type.name
                };
            } else if (type.type_rule === "value") {
                types[path] = {
                    $: "value",
                    type: type.type,
                    value: type.value,
                };
            } else {
                throw new Error(`Unknown type_rule "${type.type_rule}"`);
            }
    
            return path;
        };
    
        const mapResult = (types, lex) => {
            if (lex.$ === "entry") {
                if (lex.imports) {
                    lex.imports.forEach((item) => mapImport(types, item));
                }
    
                if (lex.statements) {
                    lex.statements.forEach((item) => mapResult(types, item));
                }
    
                if (lex.main) {
                    mapResult(types, lex.main);
                }
            } else if (lex.$ === "definition") {
                setDefintion(types, "", lex);
            } else if (lex.$ === "main") {
                entry = {
                    uses: lex.uses,
                    type: setType(types, "$", lex.type),
                };
            }
        };
    
        results.forEach((item) => mapResult(types, item));
    
        return {
            types,
            entry,
        };
    };

    return parseAtSource;
}

module.exports = {
    getAtsParser,
};
