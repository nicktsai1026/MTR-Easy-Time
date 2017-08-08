const models = require('./models');
const Line = models.line;

function listStations() {
    return new Promise((resolve, reject) => {
        Line.findAll()
        .then((lines) => {
            var arrLine = [];
            var objLine = {};
            lines.forEach((val)=>{
                arrLine.push(val.dataValues);
            });
            objLine.show = arrLine;
            resolve(objLine);
        })
        .catch((err)=>{
            reject(err);
        })
    })
}

module.exports.listStations = listStations;
