const lineChi = ['觀塘綫','荃灣綫','港島綫','南港島綫','將軍澳綫','東涌綫','機場快綫','東鐵綫','馬鞍山綫','西鐵綫'];
const lineEng = ['Kwun Tong Line','Tsuen Wan Line','Island Line','South Island Line','Tseung Kwan O Line','Tung Chung Line','Airport Express','East Rail Line','Ma On Shan Line','West Rail Line'];

const stationChi = ['調景嶺','油塘','藍田','觀塘','牛頭角','九龍灣','彩虹','鑽石山','黃大仙','樂富','九龍塘','石硤尾','太子','旺角','油麻地','何文田','黃埔',
                '荃灣','大窩口','葵興','葵芳','荔景','美孚','荔枝角','長沙灣','深水埗','佐敦','尖沙咀','金鐘','中環',
                '堅尼地城','香港大學','西營盤','上環','灣仔','銅鑼灣','天后','炮台山','北角','鰂魚涌','太古','西灣河','筲箕灣','杏花邨','柴灣',
                '海洋公園','黃竹坑','利東','海怡半島',
                '康城','寶琳','坑口','將軍澳',
                '香港','九龍','奧運','南昌','青衣','欣澳','迪士尼','東涌','機場','博覽館',
                '紅磡','旺角東','大圍','沙田','火炭','馬場','大學','大埔墟','太和','粉嶺','上水','羅湖','落馬洲',
                '車公廟','沙田圍','第一城','石門','大水坑','恒安','馬鞍山','烏溪沙',
                '尖東','柯士甸','荃灣西','錦上路','元朗','朗屏','天水圍','兆康','屯門'];

const stationEng = ['Tiu Keng Leng','Yau Tong','Lam Tin','Kwun Tong','Ngau Tau Kok','Kowloon Bay','Choi Hung','Diamond Hill','Wong Tai Sin','Lok Fu','Kowloon Tong','Shek Kip Mei','Prince Edward','Mong Kok','Yau Ma Tei','Ho Man Tin','Whampoa',
                'Tsuen Wan','Tai Wo Hau','Kwai Hing','Kwai Fong','Lai King','Mei Foo','Lai Chi Kok','Cheung Sha Wan','Sham Shui Po','Jordan','Tsim Sha Tsui','Admiralty','Central',
                'Kennedy Town','HKU','Sai Ying Pun','Sheung Wan','Wan Chai','Causeway Bay','Tin Hau','Fortress Hill','North Point','Quarry Bay','Tai Koo','Sai Wan Ho','Shau Kei Wan','Heng Fa Chuen','Chai Wan',
                'Ocean Park','Wong Chuk Hang','Lei Tung','South Horizons',
                'LOHAS Park','Po Lam','Hang Hau','Tseung Kwan O',
                'Hong Kong','Kowloon','Olympic','Nam Cheong','Tsing Yi','Sunny Bay','Disneyland Resort','Tung Chung','Airport','AsiaWorld-Expo',
                'Hung Hom','Mong Kok East','Tai Wai','Sha Tin','Fo Tan','Racecourse','University','Tai Po Market','Tai Wo','Fanling','Sheung Shui','Lo Wu','Lok Ma Chau',
                'Che Kung Temple','Sha Tin Wai','City One','Shek Mun','Tai Shui Hang','Heng On','Ma On Shan','Wu Kai Sha',
                'East Tsim Sha Tsui','Austin','Tsuen Wan West','Kam Sheung Road','Yuen Long','Long Ping','Tin Shui Wai','Siu Hong','Tuen Mun'];

function getstations(num) {
    var stationArr = [];
    var stationGroup = {};

    for(var i = 0; i < stationEng.length; i++) {
        let obj = {
            chinese:stationChi[i],
            english:stationEng[i]
        };
        stationArr.push(obj);
    }
    stationGroup.station = stationArr;
    //console.log(stationGroup);
    return stationGroup;
}
//getstations(1);


function getlines(num) {
    var lineArr = [];
    var lineGroup = {};

    for(var i = 0; i < lineEng.length; i++) {
        let obj = {
            chinese:lineChi[i],
            english:lineEng[i]
        };
        lineArr.push(obj);
    }
    lineGroup.line = lineArr;
    //console.log(lineGroup);
    return lineGroup;
}
//getlines(1);


module.exports.getstations = getstations;
module.exports.getlines = getlines;
/*
const mtrNum = {"Kennedy Town": "83","HKU": "82","Sai Ying Pun": "81","Sheung Wan": "26",
                "Central": "1","Admiralty": "2","Wan Chai": "27","Causeway Bay": "28","Tin Hau": "29",
                "Fortress Hill": "30","North Point": "31","Quarry Bay": "32","Tai Koo": "33","Sai Wan Ho": "34",
                "Shau Kei Wan": "35","Heng Fa Chuen": "36","Chai Wan": "37","Ocean Park": "86","Wong Chuk Hang": "87",
                "Lei Tung": "88","South Horizons": "89","Whampoa": "85","Ho Man Tin": "84","Yau Ma Tei": "5",
                "Mong Kok": "6","Prince Edward": "16","Shek Kip Mei": "7","Kowloon Tong": "8","Lok Fu": "9",
                "Wong Tai Sin": "10","Diamond Hill": "11","Choi Hung": "12","Kowloon Bay": "13","Ngau Tau Kok": "14",
                "Kwun Tong": "15","Lam Tin": "38","Yau Tong": "48","Tiu Keng Leng": "49","Tsim Sha Tsui": "3",
                "Jordan": "4","Sham Shui Po": "17","Cheung Sha Wan": "18","Lai Chi Kok": "19","Mei Foo": "20",
                "Lai King": "21","Kwai Fong": "22","Kwai Hing": "23","Tai Wo Hau": "24","Tsuen Wan": "25",
                "Tseung Kwan O": "50","Hang Hau": "51","Po Lam": "52","LOHAS Park": "57","Hong Kong": "39",
                "Kowloon": "40","Olympic": "41","Nam Cheong": "53","Tsing Yi": "42","Tung Chung": "43",
                "Sunny Bay": "54","Disneyland Resort": "55","Hung Hom": "64","Mong Kok East": "65","Tai Wai": "67",
                "Sha Tin": "68","Fo Tan": "69","Racecourse": "70","University": "71","Tai Po Market": "72",
                "Tai Wo": "73","Fanling": "74","Sheung Shui": "75","Lok Ma Chau": "78","Lo Wu": "76",
                "Che Kung Temple": "96","Sha Tin Wai": "97","City One": "98","Shek Mun": "99","Tai Shui Hang": "100",
                "Heng On": "101","Ma On Shan": "102","Wu Kai Sha": "103","East Tsim Sha Tsui": "80","Austin": "111",
                "Tsuen Wan West": "114","Kam Sheung Road": "115","Yuen Long": "116","Long Ping": "117",
                "Tin Shui Wai": "118","Siu Hong": "119","Tuen Mun": "120","Airport": "47","AsiaWorld-Expo": "56"
            };

const mtrKey = {"Kennedy Town": "KET","HKU": "HKU","Sai Ying Pun": "SYP","Sheung Wan": "SHW",
                "Central": "CEN","Admiralty": "ADM","Wan Chai": "WAC","Causeway Bay": "CAB","Tin Hau": "TIH",
                "Fortress Hill": "FOH","North Point": "NOP","Quarry Bay": "QUB","Tai Koo": "TAK","Sai Wan Ho": "SWH",
                "Shau Kei Wan": "SKW","Heng Fa Chuen": "HFC","Chai Wan": "CHW","Ocean Park": "OCP","Wong Chuk Hang": "WCH",
                "Lei Tung": "LET","South Horizons": "SOH","Whampoa": "WHA","Ho Man Tin": "HOM","Yau Ma Tei": "YMT",
                "Mong Kok": "MOK","Prince Edward": "PRE","Shek Kip Mei": "SKM","Kowloon Tong": "KOT","Lok Fu": "LOF",
                "Wong Tai Sin": "WTS","Diamond Hill": "DIH","Choi Hung": "CHH","Kowloon Bay": "KOB","Ngau Tau Kok": "NTK",
                "Kwun Tong": "KWT","Lam Tin": "LAT","Yau Tong": "YAT","Tiu Keng Leng": "TIK","Tsim Sha Tsui": "TST",
                "Jordan": "JOR","Sham Shui Po": "SSP","Cheung Sha Wan": "CSW","Lai Chi Kok": "LCK","Mei Foo": "MEF",
                "Lai King": "LAK","Kwai Fong": "KWF","Kwai Hing": "KWH","Tai Wo Hau": "TWH","Tsuen Wan": "TSW",
                "Tseung Kwan O": "TKO","Hang Hau": "HAH","Po Lam": "POA","LOHAS Park": "LHP","Hong Kong": "HOK",
                "Kowloon": "KOW","Olympic": "OLY","Nam Cheong": "NAC","Tsing Yi": "TSY","Tung Chung": "TUC",
                "Sunny Bay": "SUN","Disneyland Resort": "DIS","Hung Hom": "HUH","Mong Kok East": "MKK","Tai Wai": "TAW",
                "Sha Tin": "SHT","Fo Tan": "FOT","Racecourse": "RAC","University": "UNI","Tai Po Market": "TAP",
                "Tai Wo": "TWO","Fanling": "FAN","Sheung Shui": "SHS","Lok Ma Chau": "LMC","Lo Wu": "LOW",
                "Che Kung Temple": "CKT","Sha Tin Wai": "STW","City One": "CIO","Shek Mun": "SHM","Tai Shui Hang": "TSH",
                "Heng On": "HEO","Ma On Shan": "MOS","Wu Kai Sha": "WKS","East Tsim Sha Tsui": "ETS","Austin": "AUS",
                "Tsuen Wan West": "TWW","Kam Sheung Road": "KSR","Yuen Long": "YUL","Long Ping": "LOP",
                "Tin Shui Wai": "TIS","Siu Hong": "SIH","Tuen Mun": "TUM","Airport": "AIR","AsiaWorld-Expo": "AWE"
            };
            */
