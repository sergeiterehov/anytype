// @ts-check
const fs = require("fs");
const { getAtsParser } = require("./getAtsParse");

const parseAtFile = getAtsParser((file) => {
    if (! fs.existsSync(file)) {
        throw new Error(`Importing file "${file}" not found`);
    }

    return fs.readFileSync(file, "utf8");
});

module.exports = {
    parseAtFile,
};
