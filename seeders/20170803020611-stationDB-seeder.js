'use strict';

const models = require('../models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
const stationObj = {
     'Kwun Tong Line' : ['調景嶺','油塘','藍田','觀塘','牛頭角','九龍灣','彩虹','鑽石山','黃大仙','樂富','九龍塘','石硤尾','太子','旺角','油麻地','何文田','黃埔'],
     'Tsuen Wan Line' : ['荃灣','大窩口','葵興','葵芳','荔景','美孚','荔枝角','長沙灣','深水埗','太子','旺角','油麻地','佐敦','尖沙咀','金鐘','中環'],
     'Island Line' : ['堅尼地城','香港大學','西營盤','上環','中環','金鐘','灣仔','銅鑼灣','天后','炮台山','北角','鰂魚涌','太古','西灣河','筲箕灣','杏花邨','柴灣'],
     'South Island Line' : ['金鐘','海洋公園','黃竹坑','利東','海怡半島'],
     'Tseung Kwan O Line' : ['康城','寶琳','坑口','將軍澳','調景嶺','油塘','鰂魚涌','北角'],
     'Tung Chung Line' : ['香港','九龍','奧運','南昌','荔景','青衣','欣澳','迪士尼','東涌'],
     'Airport Express' : ['香港','九龍','青衣','機場','博覽館'],
     'East Rail Line' : ['紅磡','旺角東','九龍塘','大圍','沙田','火炭','馬場','大學','大埔墟','太和','粉嶺','上水','羅湖','落馬洲'],
     'Ma On Shan Line' : ['大圍','車公廟','沙田圍','第一城','石門','大水坑','恒安','馬鞍山','烏溪沙'],
     'West Rail Line' : ['紅磡','尖東','柯士甸','南昌','美孚','荃灣西','錦上路','元朗','朗屏','天水圍','兆康','屯門']
};

module.exports = {
  up: function (queryInterface, Sequelize) {
      //const line_station = new Line_station();
    //   return line_station.save().then((line_stations)=>{
      //
    //   });
      for(var key in stationObj) {
          console.log("inside for/in");
          console.log(key);
          Line.findOne({where:{english:key}})
          .then((lines)=>{
              console.log(lines);
              var stationsArr = stationObj[key];
              stationArr.forEach((val,index)=>{
                  console.log(index + "first");
                  Station.findAll({where:val})
                  .then((stations)=>{
                      console.log(stations);
                      console.log(index + "second");
                      Line_station.create({
                          lineId:lines.id,
                          stationId:stations.id,
                          sequel:index
                      })
                  })
                  .catch((err)=>{
                      console.log(err);
                  })
              })

          })
          .catch((err)=>{
              console.log(err);
          })

      }
  },

  down: function (queryInterface, Sequelize) {
      return Line_station.truncate();
  }
};
