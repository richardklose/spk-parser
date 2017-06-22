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
				thisGame.material = []
				for(let j = 0; j < 15; j++) {
					thisGame.material[j] = parseInt(splittedContent[++i]) === 1
				}
				break

			case '"Materialname"':
				thisGame.materialname = splittedContent[++i].replace('\"','').replace('\"','')
				break

			case '"Spieleart"':
				thisGame.gameType = splittedContent[++i].replace('\"','').replace('\"','')
				i++
				break

			case '"Hintergrund"':
				thisGame.background = splittedContent[++i] === '#TRUE'
            	break

			case '"Form 1"':
				thisGame.form[0] = parseInt(splittedContent[++i])
				break
			default:
                console.log(splittedContent[i])
                break
        }
    }
    console.log(thisGame)
}

module.exports = Parser