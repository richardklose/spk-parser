const fs = require('fs')
const iconvlite = require('iconv-lite')
const SPK = require('./spk')
let Parser = function() {

}

Parser.prototype.readFile = function(theFile) {
    fs.readFile(theFile, (err, data) => {
        if (err) throw err;
        else {
            let content = iconvlite.decode(data, 'win1252')
            this.contentToSPK(content)
        }
    })
}

Parser.prototype.contentToSPK = function(content) {
    let splittedContent = content.split('\r\n')
    let thisGame = new SPK();
    for (let i = 0; i < splittedContent.length; i++) {
        switch (splittedContent[i]) {

            case '"Spielnummer"':
                thisGame.gameId = splittedContent[++i].replace('\"','').replace('\"','')
                break

            case '"Titel"':
                thisGame.title = splittedContent[++i].replace('\"','').replace('\"','')
                break

			case '"gruppenpädagogische Kategorie"':
				for (let j = 0; j < 8; j++) {
					if( parseInt(splittedContent[++i]) === 1) {
						thisGame.groupCat = j
					}
				}
			break

			case '"Material"':
				if(splittedContent[i+1] === "1" || splittedContent[i+1] === "0") {
					thisGame.material = []
					for(let j = 0; j < 15; j++) {
						thisGame.material[j] = parseInt(splittedContent[++i]) === 1
					}
				} else {
					thisGame.materialDescription = splittedContent[++i].replace('\"','').replace('\"','')
				}
				break

			case '"Materialname"':
				thisGame.materialName = splittedContent[++i].replace('\"','').replace('\"','')
				break

			case '"Spieleart"':
				thisGame.gameType = parseInt(splittedContent[++i])
				i++
				break

			case '"Hintergrund"':
				thisGame.background = splittedContent[++i] === '#TRUE'
            	break

			case '"Form 1"':
				thisGame.form[0] = parseInt(splittedContent[++i])
				break

			case '"Form 2"':
				thisGame.form[1] = parseInt(splittedContent[++i])
				break

			case '"Character 1"':
				thisGame.character[0] = parseInt(splittedContent[++i])
				break

			case '"Character 2"':
				thisGame.character[1] = parseInt(splittedContent[++i])
				break

			case '"Ort 1"':
				thisGame.location[0] = parseInt(splittedContent[++i])
				break

			case '"Ort 2"':
				thisGame.location[1] = parseInt(splittedContent[++i])
				break

			case '"Spieler"':
				thisGame.playerCount = parseInt(splittedContent[++i])
				thisGame.playerText = splittedContent[++i].replace('\"','').replace('\"','')
				break

			case '"Spielregel"':
				thisGame.rules = ""
				let finished = false
				while (!finished) {
					let line = splittedContent[++i]
					if(line[line.length-1] === '"') {
						finished = true
					}
					thisGame.rules += line.replace('\"','').replace('\"','')
				}
				break

			case '"Wann 1"':
				thisGame.time[0] = parseInt(splittedContent[++i])
				break

			case '"Wann 2"':
				thisGame.time[1] = parseInt(splittedContent[++i])
				break

			default:
                 // console.log(splittedContent[i])
                break
        }
    }
    console.log(thisGame)
}

module.exports = Parser