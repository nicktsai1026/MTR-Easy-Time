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
                'Tsuen Wan','Tai Wo Hau','Kwai Hing','Kwai Fong','Lai King','Mei Foo','Lai Chi Kok','Cheung Sha Wan','Sham Shui Po','Jordan','Tsim Sha Tsui','Admiralty','central',
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
