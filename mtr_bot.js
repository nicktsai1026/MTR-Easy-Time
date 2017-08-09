const TeleBot = require('telebot');
const axios = require('axios')
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
const mapsToken = 'AIzaSyBoFN8cy4YjlKB8EF6mccM6Re4DOzzMn04'

var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function (err) {
    console.log(err);
});

const BUTTONS = {
    home: {
        label: '🏠 Home',
        command: '/start'
    },
    types: {
        label: '🚇 Quick Check',
        command: '/check'
    },
    lines: {
        label: '🚉 Show lines',
        command: '/showStations'
    },
    map: {
        label: '🗺 Map',
        command: '/map'
    },
    hide: {
        label: '⌨️ Hide keyboard',
        command: '/hide'
    }
};

const bot = new TeleBot({
    token: '412251435:AAGYnnnmx0wbNpv_4zRM0p-7wv3cGMCmpRU',
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});

// On commands
bot.on(['/start', '/back'], msg => {
    let replyMarkup = bot.keyboard([
        [BUTTONS.home.label],
        [BUTTONS.lines.label, BUTTONS.types.label],
        [BUTTONS.hide.label]
    ], { resize: true });
    return bot.sendMessage(msg.from.id, 'Keyboard example.', { replyMarkup });

});

// Hide keyboard
bot.on('/hide', msg => {
    return bot.sendMessage(
        msg.from.id, 'Hide keyboard example. Type /back to show.', { replyMarkup: 'hide' }
    );
});

bot.on('text', msg => {
    console.log('Run first text')
    fromStation = msg.text;
    bot.sendMessage(msg.from.id, `First reply ${fromStation}`);
    bot.on('text', msg => {
        console.log('Run second text')
        toStation = msg.text;
        return bot.sendMessage(msg.from.id, `Second reply ${toStation}`);
    });
});

bot.on('/check', msg => {
    var fromStation = ''
    // 'Wan Chai' + ' Station, Hong Kong'
    var toStation = ''
    // 'Mong Kok' + ' Station, Hong Kong'
    // axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' +
    //     fromStation + '&destination=' + toStation + '&mode=transit&key=' + mapsToken)
    //     .then((response) => {
    //         console.log(response.data.routes[0].legs[0].duration.text)
    //         var time = response.data.routes[0].legs[0].duration.text
    //         let replyMarkup = bot.keyboard([[BUTTONS.home.label, BUTTONS.map.label]], { resize: true })
    //         bot.sendMessage(msg.from.id, `You said: ${text}`);
    //         bot.sendMessage(msg.from.id, 'From ' + fromStation +
    //             ' to ' + toStation + '\nEstimated time: ' + time);
    //         return bot.sendMessage(msg.from.id, 'There you go!', { replyMarkup });
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
})

bot.on('/map', msg => {
    client.get('to', function (err, data) {
        if (err) return console.log(err);
        console.log("Getting the map of " + data)
        Station.findOne({ where: { english: data } })
            .then((response) => {
                console.log(response.dataValues.mtrShort)
                var stationAbr = response.dataValues.mtrShort.toLowerCase()
                var links = 'http://www.mtr.com.hk/archive/ch/services/maps/' + stationAbr + '.pdf'
                let replyMarkup = bot.inlineKeyboard([[bot.inlineButton('maps here!', { url: links })]])
                return bot.sendMessage(msg.from.id, 'Check out the destinations map! ', { replyMarkup });
            })
    })
})

// Inline buttons
bot.on('/showStations', msg => {
    var allLines = {}
    var buttons = [];
    Line.findAll()
        .then((lines) => {
            lines.forEach((val) => {
                var abr = val.dataValues.id
                allLines[abr] = []
                allLines[abr].push(val.dataValues.chinese);
                allLines[abr].push(val.dataValues.english);
            });
            let replyMarkup = bot.keyboard([[BUTTONS.home.label]], { resize: true })
            bot.sendMessage(msg.from.id, 'Okay, first pick wher you are coming from', { replyMarkup });
        }).then(() => {
            for (var abr in allLines) {
                var button = [bot.inlineButton('' + allLines[abr][1], { callback: abr })]
                console.log(button)
                buttons.push(button)
            }
            console.log(buttons)
            let replyMarkup = bot.inlineKeyboard(buttons)
            return bot.sendMessage(msg.from.id, 'Onboard from?', { replyMarkup });
        })
        .catch((err) => {
            console.log(err)
        })
});

bot.on(/^\/from (.+)$/, (msg, props) => {
    const text = props.match[1];
    console.log(msg)
    var departure = msg.text
    var re = /(\/)(from)( )/
    departure = departure.replace(re, '')
    client.set('from', departure, function (err, data) {
        if (err) return console.log(err);
    })
    var allLines = {}
    var buttons = [];
    Line.findAll()
        .then((lines) => {
            lines.forEach((val) => {
                var abr = val.dataValues.id
                allLines[abr] = []
                allLines[abr].push(val.dataValues.chinese);
                allLines[abr].push(val.dataValues.english);
            });
            let replyMarkup = bot.keyboard([[BUTTONS.home.label]], { resize: true })
            bot.sendMessage(msg.from.id, 'Okay got it!', { replyMarkup });
        })
        .then(() => {
            for (var abr in allLines) {
                var button = [bot.inlineButton('' + allLines[abr][1], { callback: abr + 't' })]
                buttons.push(button)
            }
            console.log(buttons)
            let replyMarkup = bot.inlineKeyboard(buttons)
            return bot.sendMessage(msg.from.id, 'And you are going to?', { replyMarkup });
        })
        .catch((err) => {
            console.log(err)
        })
});

bot.on(/^\/to (.+)$/, (msg, props) => {
    console.log(msg)
    var destination = msg.text
    var re = /(\/)(to)( )/
    destination = destination.replace(re, '')
    var fromStation = ''
    var toStation = ''
    var promiseArr = []
    client.set('to', destination, function (err, data) {
        if (err) return console.log(err);
    })
    client.get('from', function (err, data) {
        if (err) return console.log(err);
        console.log("The depart station is " + data)
        fromStation = data + ' Station, Hong Kong'
        client.get('to', function (err, data) {
            if (err) return console.log(err);
            console.log("The destination station is " + data)
            toStation = data + ' Station, Hong Kong'
            axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' +
                fromStation + '&destination=' + toStation + '&mode=transit&key=' + mapsToken)
                .then((response) => {
                    console.log(response.data.routes[0].legs[0].duration.text)
                    var time = response.data.routes[0].legs[0].duration.text
                    let replyMarkup = bot.keyboard([[BUTTONS.home.label, BUTTONS.map.label]], { resize: true })
                    bot.sendMessage(msg.from.id, 'There you go!', { replyMarkup });
                    return bot.sendMessage(msg.from.id, 'From ' + fromStation +
                        ' to ' + toStation + '\nEstimated time: ' + time);
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    });
});

// Inline button callback
bot.on('callbackQuery', msg => {
    var id = msg.data
    var re = /[t]$/
    var toCheck = re.test(id)
    if (toCheck) id = id.slice(0, -1);
    Line_station.findAll({
        where: {
            lineId: id
        },
        include: [{
            model: Station,
            required: true
        }],
    })
        .then((stations) => {
            var allArr = [];
            var getStations = [];
            var allStations = []
            function compare(a, b) {
                if (a.dataValues.sequel < b.dataValues.sequel)
                    return -1;
                if (a.dataValues.sequel > b.dataValues.sequel)
                    return 1;
                return 0;
            }
            stations.sort(compare);
            stations.forEach((val) => {
                console.log(val.dataValues.sequel)
                getStations.push(
                    Station.findOne({ where: { id: val.dataValues.stationId } })
                )
            });
            Promise.all(getStations)
                .then((allArr) => {
                    allArr.forEach(function (val) {
                        allStations.push(val.dataValues.english)
                    })
                    console.log(allStations)
                    var stations = allStations
                    var keys = []
                    for (var i = 0; i < stations.length; i++) {
                        if (toCheck) {
                            keys.push(['/to ' + stations[i]])
                        } else {
                            keys.push(['/from ' + stations[i]])
                        }
                    }
                    var replyMarkup = bot.keyboard(keys)
                    bot.sendMessage(msg.from.id, 'First callback', { replyMarkup });
                    return bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true)
                })
                .catch((err) => {
                    console.log(err);
                })
        })
});

bot.start();
