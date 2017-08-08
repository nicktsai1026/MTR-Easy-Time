const TeleBot = require('telebot');
const models = require('./models');
const Line = models.line;
const Station = models.station;
const Line_station = models.line_station;

const BUTTONS = {
    hello: {
        label: '👋 Hello',
        command: '/buttons'
    },
    world: {
        label: '🚊 Show lines',
        command: '/inlineKeyboard'
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
        ['/start'],
        // ['/buttons', '/inlineKeyboard'],
        [BUTTONS.hello.label, BUTTONS.world.label],
        [BUTTONS.hide.label]
        // ['/hide']
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Keyboard example.', { replyMarkup });

});

// Buttons
bot.on('/buttons', msg => {

    let replyMarkup = bot.keyboard([
        [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
        ['/back', '/hide']
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Button example.', { replyMarkup });

});

// Hide keyboard
bot.on('/hide', msg => {
    return bot.sendMessage(
        msg.from.id, 'Hide keyboard example. Type /back to show.', { replyMarkup: 'hide' }
    );
});

// On location on contact message
bot.on(['location', 'contact'], (msg, self) => {
    return bot.sendMessage(msg.from.id, `Thank you for ${self.type}.`);
});

bot.on(/^\/from (.+)$/, (msg, props) => {
    const text = props.match[1];
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
        }).then(() => {
            for (var abr in allLines) {
                var button = [bot.inlineButton('' + allLines[abr][1], { callback: abr})]
                buttons.push(button)
            }
            console.log(buttons)
            let replyMarkup = bot.inlineKeyboard(buttons)
            return bot.sendMessage(msg.from.id, 'And you are going to?', { replyMarkup });
        })
});

// Inline buttons
bot.on('/inlineKeyboard', msg => {
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
});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    console.log(msg.data)
    Line_station.findAll({
        where: {
            lineId: msg.data
        },
        include: [{
            model: Station,
            required: true
        }],
    }).then((stations) => {
        console.log('This is before promise')
        var allArr = [];
        var getStations = [];
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
            getStations.push(Station.findOne({ where: { id: val.dataValues.stationId } })
                .then((station) => {
                    allArr.push(station.english);
                    return allArr
                }))
        });
        Promise.all(getStations).then((allArr) => {
            var stations = allArr.pop();
            var keys = []
            for (var i = 0; i < stations.length; i++) {
                keys.push(['/from ' + stations[i]])
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

// Inline query
bot.on('inlineQuery', msg => {

    const query = msg.query;
    const answers = bot.answerList(msg.id);

    answers.addArticle({
        id: 'query',
        title: 'Inline Query',
        description: `Your query: ${query}`,
        message_text: 'Click!'
    });

    return bot.answerQuery(answers);

});

bot.start();
