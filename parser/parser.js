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
                SPK.gameId = splittedContent[i+1].replace('\"','').replace('\"','')
                break
            case '"Titel"':
                SPK.title = splittedContent[i+1].replace('\"','').replace('\"','')
            default:
                break
        }
    }
    console.log(SPK)
}

module.exports = Parser