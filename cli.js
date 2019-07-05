const chalk = require('chalk');
const commander = require('commander');
const path = require('path');
const fs = require("fs");
const { parseAtFile } = require("./parseAtFile");

const packageJson = require('./package.json');

const program = new commander.Command(packageJson.name)
.version(packageJson.version)
.arguments("<main-ats-file>")
.usage(`${chalk.green("<main-ats-file>")} [options]`)
.action((fileName) => {
    console.log(`Compile ${fileName} ...`);

    const filePath = path.join(__dirname, fileName);
    const resultFilePath = `${filePath}.json`;

    const processedFiles = [];

    const data = parseAtFile(filePath, processedFiles);

    processedFiles.forEach((fileName) => {
        console.log(chalk.yellow(`Processed ${fileName}`));
    });

    const result = JSON.stringify(data);

    fs.writeFileSync(resultFilePath, result);

    console.log(chalk.green(`Done ${resultFilePath}`));
})
.on("--help", () => {
    console.log("This is help!");
})
.parse(process.argv);