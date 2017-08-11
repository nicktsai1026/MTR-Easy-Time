const TeleBot = require('telebot');
const axios = require('axios')
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;
const User = models.user;
const Favor = models.favor;
const mapsToken = 'AIzaSyBoFN8cy4YjlKB8EF6mccM6Re4DOzzMn04'
const Redis = require('./redis');

const BUTTONS = {
    home: {
        label: '🚀 Go!',
        command: '/start'
    },
    restart: {
        label: '🔙 Start again',
        command: '/restart'
    },
    types: {
        label: '🚇 Quick Check',
        command: '/check'
    },
    lines: {
        label: '🚉  All lines',
        command: '/showStations'
    },
    map: {
        label: '🗺 Map',
        command: '/map'
    },
    hide: {
        label: '⌨️ Favourite',
        command: '/fav'
    }
};

const bot = new TeleBot({
    token: '412251435:AAEgB88l9MVtKDGYEtfyiaqO3m-dK9E-AEU',
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});

// On commands
bot.on(['/start'], msg => {
    User.findOne({ where: { telegramId: msg.chat.id.toString() } })
        .then((user) => {
            if (!user) {
                User.create({ telegramId: msg.chat.id });
            }
        })
    let replyMarkup = bot.keyboard([
        [BUTTONS.home.label],
        [BUTTONS.lines.label, BUTTONS.types.label],
        [BUTTONS.hide.label]
    ], { resize: true });
    bot.sendMessage(msg.from.id, 'Welcome! Checking the time it takes' +
        ' for an MTR ride has never been so easy!')
        .then(() => {
            bot.sendMessage(msg.from.id, 'Press |🚇 Quick Check| to type out the departure' +
                ' and destination station.')
                .then(() => {
                    bot.sendMessage(msg.from.id, 'Or just press |🚉  All lines| and tap your' +
                        ' way to see the time it takes.')
                        .then(() => {
                            return bot.sendMessage(msg.from.id, 'Enjoy! 😇', { replyMarkup })
                        })
                })
        })
});

bot.on(['/restart'], msg => {
    let replyMarkup = bot.keyboard([
        [BUTTONS.home.label],
        [BUTTONS.lines.label, BUTTONS.types.label],
        [BUTTONS.hide.label]
    ], { resize: true });
    bot.sendMessage(msg.from.id, 'Just pick a mode and let me do the rest 💪🏼 ', { replyMarkup })
})

// Hide keyboard
bot.on('/fav', msg => {
    Redis.set('telegram', msg.chat.id, function (err, data) {
        if (err) return console.log(err);
    });
    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton('Add favourite', { url: 'http://174.138.24.195/login' }),
        bot.inlineButton('Get favourite', { callback: 'fav' })]
    ])
    return bot.sendMessage(
        msg.from.id, 'Manage your favourites here:', { replyMarkup }
    );
});

const stationList = {};
bot.on('*', (msg, props) => {
    const id = msg.chat.id;
    const ask = stationList[id];
    if (!ask) return;
    delete stationList[id];
    bot.event('ask.' + ask, msg, props);
});

bot.on('sendMessage', (args) => {
    const id = args[0];
    const opt = args[2] || {};
    const ask = opt.ask;
    if (ask) stationList[id] = ask;
});

bot.on('/check', msg => {
    return bot.sendMessage(msg.from.id, 'Tell us!', { ask: 'handleEmoji' })
})

bot.on('ask.handleEmoji', msg => {
    const departure = msg.text;
    return bot.sendMessage(msg.from.id, `Where are you now?`, { ask: 'departure' });
});

bot.on('ask.departure', msg => {
    const departure = msg.text;
    // Station.findOne({ where: { id: val.dataValues.stationId } })
    console.log(departure)
    Redis.set('from', departure, function (err, data) {
        if (err) return console.log(err);
    })
    return bot.sendMessage(msg.from.id, `Okay, ${departure} it is. Then where are you going?`, { ask: 'destination' });
});

bot.on('ask.destination', msg => {
    var fromStation = ''
    var toStation = ''
    const destination = msg.text;

    Redis.set('to', destination, function (err, data) {
        if (err) return console.log(err);
        console.log(data)
    })
    bot.sendMessage(msg.from.id, `You are going to ${destination}. Alright!`);

    Redis.get('from', function (err, data) {
        if (err) return console.log(err);
        console.log("The depart station is " + data)
        fromStation = data + ' Station, Hong Kong'

        Redis.get('to', function (err, data) {
            if (err) return console.log(err);
            console.log("The destination station is " + data)
            toStation = data + ' Station, Hong Kong'

            axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' +
                fromStation + '&destination=' + toStation + '&mode=transit&key=' + mapsToken)
                .then((response) => {
                    console.log(response.data.routes[0].legs[0].duration.text)
                    var time = response.data.routes[0].legs[0].duration.text
                    let replyMarkup = bot.keyboard([
                        [BUTTONS.map.label], [BUTTONS.restart.label]
                    ], { resize: true })
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

bot.on('/map', msg => {
    Redis.get('to', function (err, data) {
        if (err) return console.log(err);
        console.log("Getting the map of " + data)
        var data = data.toLowerCase()
        Station.findOne({ where: { lowerCaseName: data } })
            .then((response) => {
                var stationAbr = response.dataValues.mtrShort.toLowerCase()
                var links = 'http://www.mtr.com.hk/archive/ch/services/maps/' + stationAbr + '.pdf'
                let replyMarkup = bot.inlineKeyboard([[bot.inlineButton('maps here!', { url: links })]])
                return bot.sendMessage(msg.from.id, 'Check out the destinations map! ', { replyMarkup });
            })
            .catch((err) => {
                console.log(err)
                return bot.sendMessage(msg.from.id, 'Sorry! Something has gone wrong! Come back again later!');
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
            let replyMarkup = bot.keyboard([[BUTTONS.restart.label]], { resize: true })
            bot.sendMessage(msg.from.id, 'Okay, first pick wher you are coming from', { replyMarkup });
        }).then(() => {
            for (var abr in allLines) {
                var button = [bot.inlineButton('' + allLines[abr][1], { callback: abr })]
                console.log(button)
                buttons.push(button)
            }
            let replyMarkup = bot.inlineKeyboard(buttons)
            return bot.sendMessage(msg.from.id, 'These are all the lines:', { replyMarkup });
        })
        .catch((err) => {
            console.log(err)
        })
});

bot.on(/^\/from (.+)$/, (msg, props) => {
    const text = props.match[1];
    var departure = msg.text
    var re = /(\/)(from)( )/
    departure = departure.replace(re, '')
    Redis.set('from', departure, function (err, data) {
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
            let replyMarkup = bot.keyboard([[BUTTONS.restart.label]], { resize: true })
            bot.sendMessage(msg.from.id, 'Okay got it!', { replyMarkup });
        })
        .then(() => {
            for (var abr in allLines) {
                var button = [bot.inlineButton('' + allLines[abr][1], { callback: abr + 't' })]
                buttons.push(button)
            }
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
    Redis.set('to', destination, function (err, data) {
        if (err) return console.log(err);
    })
    Redis.get('from', function (err, data) {
        if (err) return console.log(err);
        console.log("The depart station is " + data)
        fromStation = data + ' Station, Hong Kong'
        Redis.get('to', function (err, data) {
            if (err) return console.log(err);
            console.log("The destination station is " + data)
            toStation = data + ' Station, Hong Kong'
            axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' +
                fromStation + '&destination=' + toStation + '&mode=transit&key=' + mapsToken)
                .then((response) => {
                    console.log(response.data)
                    var time = response.data.routes[0].legs[0].duration.text
                    let replyMarkup = bot.keyboard([
                        [BUTTONS.map.label], [BUTTONS.restart.label]
                    ], { resize: true })
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
    if (msg.data == 'fav') {
        User.findOne({
            where: {
                telegramId: msg.from.id.toString()
            }
        })
            .then((user) => {
                console.log("The second then " + user)
                var fbId = user.facebookId
                Favor.findAll({
                    where: {
                        facebookId: fbId
                    },
                })
                    .then((items) => {
                        console.log(items.dataValues)
                        console.log(items.dataValues.stationName)
                        var departure = items.dataValues.stationName
                        console.log('it works!')
                        var arrFav = [];
                        items.forEach((val) => {
                            arrFav.push('/from ' + val.dataValues);
                        });
                        var keys = []
                        for (var i = 0; i < arrFav.length; i++) {
                            keys.push(['/from ' + stations[i]])
                        }
                        return bot.sendMessage(msg.from.id, 'nice!', { replyMarkup });
                    })
            })

    } else {
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
                    getStations.push(
                        Station.findOne({ where: { id: val.dataValues.stationId } })
                    )
                });
                Promise.all(getStations)
                    .then((allArr) => {
                        allArr.forEach(function (val) {
                            allStations.push(val.dataValues.english)
                        })
                        var keys = []
                        for (var i = 0; i < allStations.length; i++) {
                            if (toCheck) {
                                keys.push(['/to ' + stations[i]])
                            } else {
                                keys.push(['/from ' + stations[i]])
                            }
                        }
                        var replyMarkup = bot.keyboard(keys)
                        bot.sendMessage(msg.from.id, 'nice!', { replyMarkup });
                        return bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
    }
});

bot.start();
