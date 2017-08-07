const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const hb = require('express-handlebars');
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
const setupPassport = require('./passport');
const router = require('./router')(express);
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended:true }));
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

setupPassport(app);
app.use('/', router);

app.get('/stylesheet.css', function(req, res){
    res.sendFile(__dirname + '/stylesheet.css');
})

app.get('/corah', function(req,res){
    Line.findAll()
        .then((lines) => {
            var arrLine = [];
            var objLine = {};
            //console.log(stations);
            lines.forEach((val)=>{
                //console.log(val.dataValues);
                arrLine.push(val.dataValues);
            });
            objLine.show = arrLine;
            res.render('display',objLine);
        })
        .catch((err)=>{
            console.log(err);
        })
})
// app.post('/'

app.listen(port);
