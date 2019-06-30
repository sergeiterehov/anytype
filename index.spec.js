const util = require("util");
const path = require("path");
const fs = require("fs");
const { parseAtFile } = require("./parseAtFile");

const data = parseAtFile(path.join(__dirname, "test/Widget.at"));

console.log(util.inspect(data, { colors: true, depth: 1000 }));

fs.writeFileSync("./test/Widget.at.json", JSON.stringify(data));
