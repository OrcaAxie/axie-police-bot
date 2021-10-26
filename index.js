const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.telegram_token, { polling: true });
const fs = require('fs');

let keywords = new Array();
try {
    const data = fs.readFileSync('keywords.txt', 'utf8')
    keywords = data.split('\r\n');
} catch (err) {
    console.error(err)
}
console.log(keywords);

bot.on('message', (msg) => {
    let m = '';
    try {
        m = msg.text.toString().toLowerCase();
    } catch {
        m = msg.caption.toString().toLowerCase();
    }
    let score = 0;
    const n_keywords = keywords.length;
    for (let i = 0; i < n_keywords; i++) {
        if (m.indexOf(keywords[i]) >= 0) {
            score++;
            break;
        }
    }
    if (score !== 0) {
        try {
            bot.deleteMessage(msg.chat.id, msg.message_id);
        } catch (err) {
            console.log(err);
            bot.sendMessage(msg.chat.id, 'Hey, that message is not allowed here', {reply_to_message_id: msg.message_id});
        }
    }
});