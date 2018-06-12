#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const Parser = require('../parser/parser.js')
const path = require('path')
const fs = require('fs')

let output = {
    games: []
}

function processDir(dir) {
	const files = fs.readdirSync(dir)
	for(let file of files) {
        const filePath = path.join(dir, file)
		let stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
			processDir(filePath)
		} else if (stats.isFile() && path.extname(filePath) === '.spk'){
			processFile(filePath)
		}
	}
}

function processFile(file) {
	const filename = path.basename(file)
	const content = new Parser().readFile(file)
	output.games.push(content)

}

program
    .version(pkg.version)
    .option('-i, --inputFolder [path/to/folder]','The folder containing spk-files')
    .option('-o, --output [path/to/folder]', 'The folder where json files should be written')
    .parse(process.argv)

if (!program.inputFolder) {
	console.log('No input folder specified.')
} else if (!program.output) {
	console.log('No output folder specified.')
} else {
    processDir(program.inputFolder)
	fs.writeFile(path.join(program.output, 'spiele.json'), JSON.stringify(output, null, 2), (err, written, string) => {
			if (err) throw err
			else console.log('Done')
		})
}