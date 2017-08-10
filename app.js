const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const hb = require('express-handlebars');
const axios = require('axios');
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
const User = models.user;
const Favor = models.favor;
const selector = require('./selector');
const setupPassport = require('./passport');
const router = require('./router')(express);
const Redis = require('./redis');
//const port = process.env.PORT || 8080;

app.use(session({
    secret: 'supersecret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true }));
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

setupPassport(app);
app.use('/', router);

app.get('/stylesheet.css', function(req, res){
    res.sendFile(__dirname + '/stylesheet.css');
})

app.get('/login', function(req,res){
    selector.listStations()
        .then((lines) => {
            res.render('login', lines);
        })
})

app.get('/home/:language', function(req,res){
    selector.listStations()
        .then((lines) => {
            //console.log(req.user.dataValues.facebookId);
            if (req.params.language == 'english'){
                lines.inEnglish = true;
            } else {
                lines.inEnglish = false;
            }
            var fbPersonalInfo = [];
            Redis.get(req.user.dataValues.facebookId,function(err,data){
                if(err){
                    return console.log(err);
                }
                // console.log(data);
                fbPersonalInfo.push(JSON.parse(data));
            });
            lines.fbInfo = fbPersonalInfo;
            res.render('display', lines);
        })
})

app.get('/line/:id/:language', function(req,res){
    //console.log(req.params.id);
    selector.listStations()
        .then((lines) => {
            if (req.params.language == 'english'){
                lines.inEnglish = true;
            } else {
                lines.inEnglish = false;
            }
            Line_station.findAll({
                where:{
                    lineId:req.params.id
                },
                include:[{
                    model:Station,
                    required:true
                }]
            })
            .then((stations) => {
                //console.log(req.session.passport.user);
                var fbPersonalInfo = [];
                Redis.get(req.session.passport.user,function(err,data){
                    if(err){
                        return console.log(err);
                    }
                    fbPersonalInfo.push(JSON.parse(data));
                });
                lines.fbInfo = fbPersonalInfo;
                var arrStation = [];
                function compare(a,b) {
                  if (a.dataValues.sequel < b.dataValues.sequel)
                    return -1;
                  if (a.dataValues.sequel > b.dataValues.sequel)
                    return 1;
                  return 0;
                }
                stations.sort(compare);
                stations.forEach((val)=>{
                    var box = val.dataValues.station.dataValues;
                    box.cssId = req.params.id;
                    arrStation.push(box);
                })
                lines.list = arrStation;
                res.render('display', lines);
            })
            .catch((err)=>{
                console.log(err);
            })
        })
})

app.post('/addFavoriteStation',function(req, res){
    // console.log(req.session.passport.user);
    // console.log(req.body);
    Favor.findOne({where:{remark:req.body.remark}})
        .then((favor)=>{
            //console.log(favor);
            if(!favor){
                const favor = new Favor();
                Favor.create({
                    facebookId:req.session.passport.user,
                    remark:req.body.remark,
                    stationName:req.body.stationName
                })
            }
            res.redirect('/home/:language');
        })
})

app.get('/showFavor',function(req, res){
    Favor.findAll({where:{facebookId:req.session.passport.user}})
        .then((favors)=>{
            var arrFavor = [];
            var objFavor = {};
            favors.forEach((val)=>{
                arrFavor.push(val.dataValues);
            });
            var fbPersonalInfo = [];
            Redis.get(req.session.passport.user,function(err,data){
                if(err){
                    return console.log(err);
                }
                // console.log(data);
                fbPersonalInfo.push(JSON.parse(data));
            });
            objFavor.fbInfo = fbPersonalInfo;
            objFavor.showFavorList = arrFavor;
            res.render('favoriteList', objFavor);
        })
})

// allow handlebars files to use files in public folder
app.use(express.static('public'));

app.listen(8080);
