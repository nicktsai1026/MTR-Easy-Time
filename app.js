const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const hb = require('express-handlebars');
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
const selector = require('./selector');
const setupPassport = require('./passport');
const router = require('./router')(express);
//const port = process.env.PORT || 8080;

app.use(session({
    secret: 'supersecret'
}));
app.use(bodyParser.urlencoded({extended:true }));
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

setupPassport(app);
app.use('/', router);

app.get('/stylesheet.css', function(req, res){
    res.sendFile(__dirname + '/stylesheet.css');
})

app.get('/corah', function(req,res){
    selector.listStations()
    .then((lines) => {
        res.render('display', lines);
    })
})

app.get('/line/:id', function(req,res){
    console.log(req.params.id);
    selector.listStations()
    .then((lines) => {
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
                arrStation.push(val.dataValues.station.dataValues);
            })
            lines.list = arrStation;
            res.render('display', lines);
        })
        .catch((err)=>{
            console.log(err);
        })
    })
})


// allow handlebars files to use files in public folder
app.use(express.static('public'));


app.listen(8080);
