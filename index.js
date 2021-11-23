require("dotenv/config");
const Discord = require("discord.js");
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, Message, Permissions } = require('discord.js');
const VirusTotalApi = require("virustotal-api");
const virusTotal = new VirusTotalApi(process.env.API_KEY);

client.once("ready", async () => {
    console.log("En ligne !");
    client.user.setPresence({ status: 'dnd', activities: [{ type: "WATCHING", name: "des liens d'arnaque" }] });

});

const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
const urlIgnoreRegex = /((https?:\/\/)(www\.)?(twitch|discord|twitter|youtu(be)?)(\.com|\.tv|\.gg|\.be))/g;

client.on("messageCreate", async (message) => {
    if (message.content.match(urlRegex)) {
        let urls = message.content.match(urlRegex);
        urls = urls.filter(url => {
            return !url.match(urlIgnoreRegex);
        });
        let totalWarning = 0;
        for (let url of urls) {
            totalWarning += await getWarningOfLink(url);
        }
        if (totalWarning /* != 0 */) {
            message.delete();
        }
    }
});

async function getWarningOfLink(link) {
    try {
        const response = await virusTotal.urlScan(link);
        try {
            const result = await virusTotal.urlReport(response.resource);
            return result.positives;
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
    return 0;
}

client.login(process.env.DISCORD_TOCKEN);