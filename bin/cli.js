let program = require('commander')
let pkg = require('../package.json')
let Parser = require('../parser/parser.js')
program
    .version(pkg.version)
    .option('-i, --inputFile [path/to/file]','The spk-file')
    .parse(process.argv)

if (program.inputFile) {
    let parser = new Parser().readFile(program.inputFile)
} else {
    console.log('No file specified. Use -i to specify spk file.')
}