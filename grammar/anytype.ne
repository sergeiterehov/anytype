@builtin "whitespace.ne"

FullContent -> _ Expression _ {% (d) => d[1] %}

Expression ->
    Statements __ Main {% (d) => ({$: "entry", statements: d[0], main: d[2]}) %}
    | Statements {% (d) => ({$: "entry", statements: d[0]}) %}
    | Main {% (d) => ({$: "entry", main: d[0]}) %}

Main -> Uses __ Type {% (d) => ({$: "main", uses: d[0], type: d[2]}) %}

Statements ->
    Statement
    | Statements __ Statement {% (d) => [...d[0], d[2]] %}

Statement ->
	"defined" __ Name __ Type {% (d) => ({$: "definition", name: d[2].name, type: d[4]}) %}
	| "defined" __ Name __ "is" __ Type {% (d) => ({$: "definition", name: d[2].name, type: d[6]}) %}
	
Type ->
	"one of" _ ListBody {% (d) => ({$: "type_rule", type_rule: "one_of", list: d[2]}) %}
	| "object" _ ObjectBody {% (d) => ({$: "type_rule", type_rule: "object", fileds: d[2]}) %}
	| "array of" __ Type {% (d) => ({$: "type_rule", type_rule: "array_of", type: d[2]}) %}
	| Name {% (d) => ({$: "type_rule", type_rule: "name", name: d[0].name}) %}

Pair -> Uses __ Name __ "-" __ Type {% (d) => ({$: "pair", uses: d[0].uses, name: d[2].name, type: d[6]}) %}

Uses -> ("required" | "option") {% (d) => ({$: "uses", uses: d[0][0]}) %}

TypeList ->
	Type
	| TypeList _ "," _ Type {% (d) => [...d[0], d[4]] %}

PairList ->
	Pair
	| PairList _ "," _ Pair {% (d) => [...d[0], d[4]] %}

ListBody ->
	"(" _ TypeList _ ")" {% (d) => d[2] %}
	| "(" _ ")" {% (d) => [] %}
	
ObjectBody ->
	"(" _ PairList _ ")" {% (d) => d[2] %}
	| "(" _ ")"

Name -> _name {% (d) => ({$: "name", name: d[0]}) %}
 
_name -> [a-zA-Z_] {% id %}
	| _name [\w_] {% (d) => d[0] + d[1] %}
