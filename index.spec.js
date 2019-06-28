const util = require("util");
const path = require("path");
const { parseAtFile } = require("./parseAtFile");

const data = parseAtFile(path.join(__dirname, "test/Widget.at"));

console.log(util.inspect(data, { colors: true, depth: 1000 }));