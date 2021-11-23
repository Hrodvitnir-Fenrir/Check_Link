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

let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

client.on("messageCreate", async (message) => {
    if (message.content.match(/(https?:\/\/(www\.)?twitch\.tv\/|https?:\/\/(www\.)?discord\.(gg|com)\/|https?:\/\/(www\.)?twitter\.com\/|https?:\/\/(www\.)?youtu.?be(\.com)?\/)/g)) {
        return;
    }
    if (message.content.match(urlRegex)) {
        let link = message.content.match(urlRegex).toString()
        console.log(link)
        virusTotal.urlScan(link).then(response => {
            let resource = response.resource;
            virusTotal.urlReport(resource).then(result => {
                console.log(result.positives);
            })
        });
    }
})

client.login(process.env.DISCORD_TOCKEN);