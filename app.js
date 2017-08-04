const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const hb = require('express-handlebars');
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
//const setupPassport = require('./passport');
const router = require('./router')(express);
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended:true }));
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//setupPassport(app);
app.use('/', router);




app.listen(port);
