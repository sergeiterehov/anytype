// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "FullContent", "symbols": ["_", "Expression", "_"], "postprocess": (d) => d[1]},
    {"name": "Expression", "symbols": ["Statements", "__", "Main"], "postprocess": (d) => ({$: "entry", statements: d[0], main: d[2]})},
    {"name": "Expression", "symbols": ["Statements"], "postprocess": (d) => ({$: "entry", statements: d[0]})},
    {"name": "Expression", "symbols": ["Main"], "postprocess": (d) => ({$: "entry", main: d[0]})},
    {"name": "Main", "symbols": ["Uses", "__", "Type"], "postprocess": (d) => ({$: "main", uses: d[0], type: d[2]})},
    {"name": "Statements", "symbols": ["Statement"]},
    {"name": "Statements", "symbols": ["Statements", "__", "Statement"], "postprocess": (d) => [...d[0], d[2]]},
    {"name": "Statement$string$1", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"f"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement", "symbols": ["Statement$string$1", "__", "Name", "__", "Type"], "postprocess": (d) => ({$: "definition", name: d[2].name, type: d[4]})},
    {"name": "Statement$string$2", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"f"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement$string$3", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement", "symbols": ["Statement$string$2", "__", "Name", "__", "Statement$string$3", "__", "Type"], "postprocess": (d) => ({$: "definition", name: d[2].name, type: d[6]})},
    {"name": "Type$string$1", "symbols": [{"literal":"o"}, {"literal":"n"}, {"literal":"e"}, {"literal":" "}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Type", "symbols": ["Type$string$1", "_", "ListBody"], "postprocess": (d) => ({$: "type_rule", type_rule: "one_of", list: d[2]})},
    {"name": "Type$string$2", "symbols": [{"literal":"o"}, {"literal":"b"}, {"literal":"j"}, {"literal":"e"}, {"literal":"c"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Type", "symbols": ["Type$string$2", "_", "ObjectBody"], "postprocess": (d) => ({$: "type_rule", type_rule: "object", fileds: d[2]})},
    {"name": "Type$string$3", "symbols": [{"literal":"a"}, {"literal":"r"}, {"literal":"r"}, {"literal":"a"}, {"literal":"y"}, {"literal":" "}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Type", "symbols": ["Type$string$3", "__", "Type"], "postprocess": (d) => ({$: "type_rule", type_rule: "array_of", type: d[2]})},
    {"name": "Type", "symbols": ["Name"], "postprocess": (d) => ({$: "type_rule", type_rule: "name", name: d[0].name})},
    {"name": "Pair", "symbols": ["Uses", "__", "Name", "__", {"literal":"-"}, "__", "Type"], "postprocess": (d) => ({$: "pair", uses: d[0].uses, name: d[2].name, type: d[6]})},
    {"name": "Uses$subexpression$1$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"q"}, {"literal":"u"}, {"literal":"i"}, {"literal":"r"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Uses$subexpression$1", "symbols": ["Uses$subexpression$1$string$1"]},
    {"name": "Uses$subexpression$1$string$2", "symbols": [{"literal":"o"}, {"literal":"p"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Uses$subexpression$1", "symbols": ["Uses$subexpression$1$string$2"]},
    {"name": "Uses", "symbols": ["Uses$subexpression$1"], "postprocess": (d) => ({$: "uses", uses: d[0][0]})},
    {"name": "TypeList", "symbols": ["Type"]},
    {"name": "TypeList", "symbols": ["TypeList", "_", {"literal":","}, "_", "Type"], "postprocess": (d) => [...d[0], d[4]]},
    {"name": "PairList", "symbols": ["Pair"]},
    {"name": "PairList", "symbols": ["PairList", "_", {"literal":","}, "_", "Pair"], "postprocess": (d) => [...d[0], d[4]]},
    {"name": "ListBody", "symbols": [{"literal":"("}, "_", "TypeList", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "ListBody", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": (d) => []},
    {"name": "ObjectBody", "symbols": [{"literal":"("}, "_", "PairList", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "ObjectBody", "symbols": [{"literal":"("}, "_", {"literal":")"}]},
    {"name": "Name", "symbols": ["_name"], "postprocess": (d) => ({$: "name", name: d[0]})},
    {"name": "_name", "symbols": [/[a-zA-Z_]/], "postprocess": id},
    {"name": "_name", "symbols": ["_name", /[\w_]/], "postprocess": (d) => d[0] + d[1]}
]
  , ParserStart: "FullContent"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
