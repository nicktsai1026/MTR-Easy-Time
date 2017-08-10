const passport = require('passport');
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
var getstations = require('./table').getstations;
var getlines = require('./table').getlines;
const stationObj = {
    '1': ['調景嶺', '油塘', '藍田', '觀塘', '牛頭角', '九龍灣', '彩虹', '鑽石山', '黃大仙', '樂富', '九龍塘', '石硤尾', '太子', '旺角', '油麻地', '何文田', '黃埔'],
    '2': ['荃灣', '大窩口', '葵興', '葵芳', '荔景', '美孚', '荔枝角', '長沙灣', '深水埗', '太子', '旺角', '油麻地', '佐敦', '尖沙咀', '金鐘', '中環'],
    '3': ['堅尼地城', '香港大學', '西營盤', '上環', '中環', '金鐘', '灣仔', '銅鑼灣', '天后', '炮台山', '北角', '鰂魚涌', '太古', '西灣河', '筲箕灣', '杏花邨', '柴灣'],
    '4': ['金鐘', '海洋公園', '黃竹坑', '利東', '海怡半島'],
    '5': ['康城', '寶琳', '坑口', '將軍澳', '調景嶺', '油塘', '鰂魚涌', '北角'],
    '6': ['香港', '九龍', '奧運', '南昌', '荔景', '青衣', '欣澳', '迪士尼', '東涌'],
    '7': ['香港', '九龍', '青衣', '機場', '博覽館'],
    '8': ['紅磡', '旺角東', '九龍塘', '大圍', '沙田', '火炭', '馬場', '大學', '大埔墟', '太和', '粉嶺', '上水', '羅湖', '落馬洲'],
    '9': ['大圍', '車公廟', '沙田圍', '第一城', '石門', '大水坑', '恒安', '馬鞍山', '烏溪沙'],
    '10': ['紅磡', '尖東', '柯士甸', '南昌', '美孚', '荃灣西', '錦上路', '元朗', '朗屏', '天水圍', '兆康', '屯門']
};
const mtrInfo = {
    "Kennedy Town": ["83", "KET"], "HKU": ["82", "HKU"], "Sai Ying Pun": ["81", "SYP"], "Sheung Wan": ["26", "SHW"],
    "Central": ["1", "CEN"], "Admiralty": ["2", "ADM"], "Wan Chai": ["27", "WAC"], "Causeway Bay": ["28", "CAB"],
    "Tin Hau": ["29", "TIH"], "Fortress Hill": ["30", "FOH"], "North Point": ["31", "NOP"], "Quarry Bay": ["32", "QUB"],
    "Tai Koo": ["33", "TAK"], "Sai Wan Ho": ["34", "SWH"], "Shau Kei Wan": ["35", "SKW"], "Heng Fa Chuen": ["36", "HFC"],
    "Chai Wan": ["37", "CHW"], "Ocean Park": ["86", "OCP"], "Wong Chuk Hang": ["87", "WCH"],
    "Lei Tung": ["88", "LET"], "South Horizons": ["89", "SOH"], "Whampoa": ["85", "WHA"], "Ho Man Tin": ["84", "HOM"], "Yau Ma Tei": ["5", "YMT"],
    "Mong Kok": ["6", "MOK"], "Prince Edward": ["16", "PRE"], "Shek Kip Mei": ["7", "SKM"], "Kowloon Tong": ["8", "KOT"], "Lok Fu": ["9", "LOF"],
    "Wong Tai Sin": ["10", "WTS"], "Diamond Hill": ["11", "DIH"], "Choi Hung": ["12", "CHH"], "Kowloon Bay": ["13", "KOB"], "Ngau Tau Kok": ["14", "NTK"],
    "Kwun Tong": ["15", "KWT"], "Lam Tin": ["38", "LAT"], "Yau Tong": ["48", "YAT"], "Tiu Keng Leng": ["49", "TIK"], "Tsim Sha Tsui": ["3", "TST"],
    "Jordan": ["4", "JOR"], "Sham Shui Po": ["17", "SSP"], "Cheung Sha Wan": ["18", "CSW"], "Lai Chi Kok": ["19", "LCK"], "Mei Foo": ["20", "MEF"],
    "Lai King": ["21", "LAK"], "Kwai Fong": ["22", "KWF"], "Kwai Hing": ["23", "KWH"], "Tai Wo Hau": ["24", "TWH"], "Tsuen Wan": ["25", "TSW"],
    "Tseung Kwan O": ["50", "TKO"], "Hang Hau": ["51", "HAH"], "Po Lam": ["52", "POA"], "LOHAS Park": ["57", "LHP"], "Hong Kong": ["39", "HOK"],
    "Kowloon": ["40", "KOW"], "Olympic": ["41", "OLY"], "Nam Cheong": ["53", "NAC"], "Tsing Yi": ["42", "TSY"], "Tung Chung": ["43", "TUC"],
    "Sunny Bay": ["54", "SUN"], "Disneyland Resort": ["55", "DIS"], "Hung Hom": ["64", "HUH"], "Mong Kok East": ["65", "MKK"], "Tai Wai": ["67", "TAW"],
    "Sha Tin": ["68", "SHT"], "Fo Tan": ["69", "FOT"], "Racecourse": ["70", "RAC"], "University": ["71", "UNI"], "Tai Po Market": ["72", "TAP"],
    "Tai Wo": ["73", "TWO"], "Fanling": ["74", "FAN"], "Sheung Shui": ["75", "SHS"], "Lok Ma Chau": ["78", "LMC"], "Lo Wu": ["76", "LOW"],
    "Che Kung Temple": ["96", "CKT"], "Sha Tin Wai": ["97", "STW"], "City One": ["98", "CIO"], "Shek Mun": ["99", "SHM"], "Tai Shui Hang": ["100", "TSH"],
    "Heng On": ["101", "HEO"], "Ma On Shan": ["102", "MOS"], "Wu Kai Sha": ["103", "WKS"], "East Tsim Sha Tsui": ["80", "ETS"], "Austin": ["111", "AUS"],
    "Tsuen Wan West": ["114", "TWW"], "Kam Sheung Road": ["115", "KSR"], "Yuen Long": ["116", "YUL"], "Long Ping": ["117", "LOP"],
    "Tin Shui Wai": ["118", "TIS"], "Siu Hong": ["119", "SIH"], "Tuen Mun": ["120", "TUM"], "Airport": ["47", "AIR"], "AsiaWorld-Expo": ["56", "AWE"]
};
const lines_abbreviation = {
    'Kwun Tong Line': 'KTL',
    'Tseung Kwan O Line': 'TKOL',
    'Island Line': 'ISL',
    'South Island Line': 'SIL',
    'Tsuen Wan Line': 'TWL',
    'East Rail Line': 'ERL',
    'Ma On Shan Line': 'MOSL',
    'West Rail Line': 'WRL',
    'Tung Chung Line': 'TCL',
    'Airport Express': 'AEL'
};

module.exports = (express) => {
    const router = express.Router();

    router.get('/public/stylesheet.css', function(req,res){
        res.sendFile(__dirname + '/public/stylesheet.css');
    });

    router.get('/',function(req, res){
        res.render('createLine');
    });

    router.post('/createline', function (req, res) {
        const line = new Line();
        const input = getlines(1);
        var lines = input.line;
        //console.log(lines);
        lines.forEach((val) => {
            // console.log(val.chinese);
            Line.create({
                chinese: val.chinese,
                english: val.english
            });
        })
        res.redirect('/createStation');
    });

    router.get('/createStation', function (req, res) {
        res.render('createStation');
    });

    router.post('/createstation', function (req, res) {
        const station = new Station();
        const input = getstations(1);
        var stations = input.station;

        stations.forEach((val) => {
            // console.log(val.chinese);
            Station.create({
                chinese: val.chinese,
                english: val.english
            });
        })
        res.redirect('/relation');
    });

    router.get('/relation', function (req, res) {
        Station.findAll()
            .then((stations) => {
                var arrStation = [];
                var objStation = {};
                //console.log(stations);
                stations.forEach((val) => {
                    //console.log(val.dataValues);
                    arrStation.push(val.dataValues);
                });
                objStation.show = arrStation;
                res.render('relation', objStation);
            })
            .catch((err) => {
                console.log(err);
            })
    });

    router.post('/getRelation', function (req, res) {
        for (var key in stationObj) {
            var stationsArr = stationObj[key];
            console.log(stationsArr);
            stationsArr.forEach((val, index) => {
                var currentLineId = key;
                console.log(index);
                Station.findOne({ where: { chinese: val } })
                    .then((station) => {
                        //console.log(station);
                        Line_station.create({
                            lineId: currentLineId,
                            stationId: station.dataValues.id,
                            sequel: index
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            });
        }
        res.redirect('/getRelation');
    });

    router.get('/getRelation', function (req, res) {
        Line_station.findAll({
            where: {
                lineId: 1
            },
            include: [{
                model: Station,
                required: true
            }, {
                model: Line,
                required: true
            }],
        })
            .then((stations) => {
                var allObj = {};
                var allArr = [];
                stations.forEach((val) => {
                    //console.log(val.dataValues);
                    allArr.push(val.dataValues);
                });
                //console.log(allArr);
                allObj.showing = allArr;
                res.render('getRelation', allObj);
            })
            .catch((err) => {
                console.log(err);
            })
    });

    router.post('/addmtrId', function (req, res) {
        for (var i in mtrInfo) {
            // console.log(mtrInfo[i][0]);
            Station.update(
                {
                    mtrId: mtrInfo[i][0],
                    mtrShort: mtrInfo[i][1]
                },
                {
                    where: { english: i }
                }
            );
        };
        res.redirect('/addmtrId');
    });

    router.get('/addmtrId', function (req, res) {
        res.render('addAbbreviation');
    });

    router.post('/addAbbre', function (req, res) {
        for (var key in lines_abbreviation) {
            console.log(key);
            console.log(lines_abbreviation[key])
            var abbreviation = lines_abbreviation[key]
            Line.update(
                {
                    linesAbbreviation: abbreviation
                },
                {
                    where: { english: key }
                }
            );
        };
        res.redirect('/login');
    });

    router.get('/auth/facebook',
      passport.authenticate('facebook'));

    router.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/home');
      });

    router.get('/home', function (req, res){
        res.redirect('/home/chinese');
    })

    return router;
};
