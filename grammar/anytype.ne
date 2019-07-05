@builtin "whitespace.ne"

File ->
	_ Expression _ {% (d) => d[1] %}
	| _ Imports __ Expression _ {% (d) => ({...d[3], imports: d[1]}) %}

Imports ->
	Import
	| Imports __ Import {% (d) => [...d[0], d[2]] %}

Import -> "import" __ String {% (d) => ({$: "import", file: d[2]}) %}

Expression ->
    Statements __ Main {% (d) => ({$: "entry", statements: d[0], main: d[2]}) %}
    | Statements {% (d) => ({$: "entry", statements: d[0]}) %}
    | Main {% (d) => ({$: "entry", main: d[0]}) %}

Main -> Uses __ Type {% (d) => ({$: "main", uses: d[0].uses, type: d[2]}) %}

Statements ->
    Statement
    | Statements __ Statement {% (d) => [...d[0], d[2]] %}

Statement ->
	"defined" __ CommentedName __ Type {% (d) => ({$: "definition", name: d[2].name, type: d[4], comment: d[2].comment}) %}
	| "defined" __ CommentedName __ "is" __ Type {% (d) => ({$: "definition", name: d[2].name, type: d[6], comment: d[2].comment}) %}

Type ->
	"one of" _ ListBody {% (d) => ({$: "type_rule", type_rule: "one_of", types: d[2]}) %}
	| "object" _ ObjectBody {% (d) => ({$: "type_rule", type_rule: "object", fields: d[2]}) %}
	| "array of" __ Type {% (d) => ({$: "type_rule", type_rule: "array_of", type: d[2]}) %}
	| "array" __ "[" _ Integer _ ".." _ Integer "]" __ "of" __ Type {% (d) => ({$: "type_rule", type_rule: "array_of", type: d[13], limits: [d[4], d[8]]}) %}
	| "single" __ Type {% (d) => ({$: "type_rule", type_rule: "array_of", type: d[2], limits: [1, 1]}) %}
	| "value" __ String {% (d) => ({$: "type_rule", type_rule: "value", type: "string", value: d[2]}) %}
	| "value" __ Float {% (d) => ({$: "type_rule", type_rule: "value", type: "float", value: d[2]}) %}
	| "value" __ Integer {% (d) => ({$: "type_rule", type_rule: "value", type: "integer", value: d[2]}) %}
	| "name" __ String {% (d) => ({$: "type_rule", type_rule: "name", name: d[2]}) %}
	| Name {% (d) => ({$: "type_rule", type_rule: "name", name: d[0].name}) %}

Pair -> Uses __ CommentedName __ "-" __ Type {% (d) => ({$: "pair", uses: d[0].uses, name: d[2].name, type: d[6], comment: d[2].comment}) %}

Uses -> ("required" | "option") {% (d) => ({$: "uses", uses: d[0][0]}) %}

TypeList ->
	_typeOfList
	| TypeList _ "," _ _typeOfList {% (d) => [...d[0], d[4]] %}
	
_typeOfList ->
	Type {% id %}
	| "with" __ Name {% (d) => ({$: "with", name: d[2].name}) %}
	| "with" __ String {% (d) => ({$: "with", name: d[2]}) %}

PairList ->
	_pairOfList
	| PairList _ "," _ _pairOfList {% (d) => [...d[0], d[4]] %}

_pairOfList ->
	Pair {% id %}
	| "with" __ Name {% (d) => ({$: "with", name: d[2].name}) %}
	| "with" __ String {% (d) => ({$: "with", name: d[2]}) %}

ListBody ->
	"(" _ TypeList _ ")" {% (d) => d[2] %}
	| "(" _ ")" {% (d) => [] %}
	
ObjectBody ->
	"(" _ PairList _ ")" {% (d) => d[2] %}
	| "(" _ ")"

Name -> _name {% (d) => ({$: "name", name: d[0]}) %}

CommentedName ->
	Name {% id %}
	| Name __ HumanComment {% (d) => ({...d[0], comment: d[2]}) %}
 
_name -> [a-zA-Z_] {% id %}
	| _name [\w_] {% (d) => d[0] + d[1] %}

Float -> Integer "." Integer   {% (d) => parseFloat(d[0] + d[1] + d[2]) %}

Integer -> [0-9]:+ {% (d) => Number(d[0].join("")) %}

String -> "\"" _string "\"" {% (d) => d[1] %}
 
_string ->
	null {% () => "" %}
	| _string _stringchar {% (d) => d[0] + d[1] %}
 
_stringchar ->
	[^\\"] {% id %}
	| "\\" [^] {% (d) => JSON.parse("\"" + d[0] + d[1] + "\"") %}

HumanComment -> "(" _humanComment ")" {% (d) => d[1] %}

_humanComment ->
	null {% () => "" %}
	| [а-яА-Яa-zA-Z\-_\,\.\!\;\:\+\`\?\\\/\'\"\@\#\$\*\s\t\n]:+ {% (d) => d[0].join('') %}
	| _humanComment HumanComment _humanComment {% (d) => `${d[0]}(${d[1]})${d[2]}` %}
