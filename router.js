const passport = require('passport-facebook');

const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
var getstations = require('./table').getstations;
var getlines = require('./table').getlines;
const stationObj = {
     '1' : ['調景嶺','油塘','藍田','觀塘','牛頭角','九龍灣','彩虹','鑽石山','黃大仙','樂富','九龍塘','石硤尾','太子','旺角','油麻地','何文田','黃埔'],
     '2' : ['荃灣','大窩口','葵興','葵芳','荔景','美孚','荔枝角','長沙灣','深水埗','太子','旺角','油麻地','佐敦','尖沙咀','金鐘','中環'],
     '3' : ['堅尼地城','香港大學','西營盤','上環','中環','金鐘','灣仔','銅鑼灣','天后','炮台山','北角','鰂魚涌','太古','西灣河','筲箕灣','杏花邨','柴灣'],
     '4' : ['金鐘','海洋公園','黃竹坑','利東','海怡半島'],
     '5' : ['康城','寶琳','坑口','將軍澳','調景嶺','油塘','鰂魚涌','北角'],
     '6' : ['香港','九龍','奧運','南昌','荔景','青衣','欣澳','迪士尼','東涌'],
     '7' : ['香港','九龍','青衣','機場','博覽館'],
     '8' : ['紅磡','旺角東','九龍塘','大圍','沙田','火炭','馬場','大學','大埔墟','太和','粉嶺','上水','羅湖','落馬洲'],
     '9' : ['大圍','車公廟','沙田圍','第一城','石門','大水坑','恒安','馬鞍山','烏溪沙'],
     '10' : ['紅磡','尖東','柯士甸','南昌','美孚','荃灣西','錦上路','元朗','朗屏','天水圍','兆康','屯門']
};

module.exports = (express) => {
    const router = express.Router();

    router.get('/',function(req, res){
        res.render('createLine');
    });

    router.post('/createline',function(req, res){
        const line = new Line();
        const input = getlines(1);
        var lines = input.line;
        //console.log(lines);
        lines.forEach((val)=>{
            // console.log(val.chinese);
            Line.create({
                chinese: val.chinese,
                english: val.english
            });
        })
        res.redirect('/createStation');
    });

    router.get('/createStation',function(req, res){
        res.render('createStation');
    });

    router.post('/createstation',function(req, res){
        const station = new Station();
        const input = getstations(1);
        var stations = input.station;

        stations.forEach((val)=>{
            // console.log(val.chinese);
            Station.create({
                chinese: val.chinese,
                english: val.english
            });
        })
        res.redirect('/relation');
    });

    router.get('/relation',function(req, res){
        Station.findAll()
            .then((stations)=>{
                var arrStation = [];
                var objStation = {};
                //console.log(stations);
                stations.forEach((val)=>{
                    //console.log(val.dataValues);
                    arrStation.push(val.dataValues);
                });
                objStation.show = arrStation;
                res.render('relation',objStation);
            })
            .catch((err)=>{
                        console.log(err);
            })
    });

    router.post('/getRelation',function(req, res){
        for(var key in stationObj) {
            var stationsArr = stationObj[key];
            console.log(stationsArr);
            stationsArr.forEach((val,index)=>{
                var currentLineId = key;
                console.log(index);
                Station.findOne({where:{chinese:val}})
                    .then((station)=>{
                        //console.log(station);
                        Line_station.create({
                            lineId:currentLineId,
                            stationId:station.dataValues.id,
                            sequel:index
                        });
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            });
        }
    });

    router.get('/getRelation',function(req, res){
        // Line.findOne({where:{id:1}})
        //     .then((line)=>{
        //         console.log(line);
                Line_station.findAll({
                    where:{
                        lineId:1
                    },
                    include:[{
                        model:Station,
                        required:true
                    },{
                        model: Line,
                        required:true
                    }],
                })
                .then((stations)=>{
                    var allObj = {};
                    var allArr = [];
                    stations.forEach((val)=>{
                        //console.log(val.dataValues);
                        allArr.push(val.dataValues);
                    });
                    console.log(allArr);
                    allObj.showing = allArr;
                    res.render('getRelation',allObj);
                })
                .catch((err)=>{
                    console.log(err);
                })
            // })
    });

    return router;
};
