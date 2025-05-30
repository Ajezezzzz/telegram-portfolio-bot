// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// MongoDB setup
mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  firstName: String,
  username: String,
  dateStarted: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Telegram Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Your data
const skills = `
💻 Skills:
- Blockchain Dev
- EVM, Solidity
- Solana, Anchor
- XRP / Xrpl
- Node.js
- Mongo DB
- System admin
- Network admin
And more! (Just don't ask me for UI work 😅)
`;

const projects = `
🗪 Projects:
1. Solana vanity bot
github.com/Ajezezzzz/solana-vanity-bot
@VanitySolBot

(More coming soon!)
`;

const contact = `
📬 Contact:
- Telegram: @Ajezez
- Email: ajezezzzz@gmail.com
- GitHub: github.com/Ajezezzzz
`;

const kairox = `
Cofounder of KairoX ⏳
At KairoX, we seize the moment to shape the future of blockchain. From smart contracts to automation tools, visualization dashboards to on-chain helpers—we build purpose-driven apps that meet real market needs. Agile, creative, and deeply technical, we deliver the right solution at the right time.

KairoX. Built for the moment. Powered by purpose.
`

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const { id, first_name, username } = msg.from;

  // Save user info to DB
  try {
    await User.updateOne(
      { telegramId: id },
      { telegramId: id, firstName: first_name, username: username },
      { upsert: true }
    );
    console.log(`User logged: ${username || first_name} (${id})`);
  } catch (err) {
    console.error('DB Error:', err);
  }

  bot.sendMessage(chatId, `Hey ${first_name || ''}! I'm @Ajezez's portfolio bot. Use the buttons below:`, {
    reply_markup: {
      keyboard: [
        ['🧠 Skills', '📂 Projects'],
        ['📬 Contact', '⏳ KairoX']
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    }
  });
});

// Skills
bot.onText(/🧠 Skills/, (msg) => {
  bot.sendMessage(msg.chat.id, skills);
});

// Projects
bot.onText(/📂 Projects/, (msg) => {
  bot.sendMessage(msg.chat.id, projects, { disable_web_page_preview: true });
});

// Contact
bot.onText(/📬 Contact/, (msg) => {
  bot.sendMessage(msg.chat.id, contact);
});

// Kairox
bot.onText(/⏳ KairoX/, (msg) => {
  bot.sendMessage(msg.chat.id, kairox);
});
