const { Client, Collection } = require('discord.js');
const client = new Client({intents: 131071});
const { TOKEN } = require('./config.json');

const { promisify } = require("util");
const  { glob }  = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");


client.commands = new Collection();

module.exports = client;


["Events", "Commands"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii);
});

client.login(TOKEN);