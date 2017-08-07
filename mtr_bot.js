const TeleBot = require('telebot');

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

// Inline buttons
bot.on('/inlineKeyboard', msg => {
    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton('Kwun Tong Line', { callback: 'KTL' })],
        [bot.inlineButton('Island Line', { callback: 'ISL' })],
        [bot.inlineButton('Tuen Wan Line', { callback: 'TWL' })]
    ]);
    return bot.sendMessage(msg.from.id, 'Onboard from?', { replyMarkup });
});

bot.on(/^\/from (.+)$/, (msg, props) => {
    bot.sendMessage(msg.from.id, 'Ok! ', { replyMarkup: 'hide' });
    const text = props.match[1];
    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton('Kwun Tong Line', { callback: 'KTL' })],
        [bot.inlineButton('Island Line', { callback: 'ISL' })],
        [bot.inlineButton('Tuen Wan Line', { callback: 'TWL' })]
    ]);
    // return bot.sendMessage(msg.from.id, text, { replyToMessage: msg.message_id });
    return bot.sendMessage(msg.from.id, 'And where are you going?', { replyMarkup });
});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    if (msg.data == 'KTL') {
        var arr = ['調景嶺','油塘','藍田','觀塘','牛頭角','九龍灣','彩虹','鑽石山','黃大仙','樂富','九龍塘','石硤尾','太子','旺角','油麻地','何文田','黃埔']
        var keys = []
        for (var i = 0; i < arr.length; i++){
            keys.push(['/from ' + arr[i]])
        }
        var replyMarkup = bot.keyboard(keys)

        bot.sendMessage(msg.from.id, 'First callback', { replyMarkup });
        return bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true)

    } else if (msg.data == 'ISL') {
        var arr = ['堅尼地城','香港大學','西營盤','上環','中環','金鐘','灣仔','銅鑼灣','天后','炮台山','北角','鰂魚涌','太古','西灣河','筲箕灣','杏花邨','柴灣']
        var keys = []
        for (var i = 0; i < arr.length; i++){
            keys.push(['/from ' + arr[i]])
        }
        var replyMarkup = bot.keyboard(keys)

        bot.sendMessage(msg.from.id, 'First callback', { replyMarkup });
        return bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true)

    } else if (msg.data == 'TWA') {
        return bot.sendMessage(msg.from.id, 'Tuen Wan it is!');
    };
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
