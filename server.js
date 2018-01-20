const express = require("express");
const request = require('request');
const clear = require('clear');
const bodyParser = require("body-parser");
const {WebhookClient, RichEmbed} = require("discord.js");
const Child = require("child_process");
const app = express();

var webhooks = new Map();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3000, function () {
    clear();
    console.log("Listening on port %s...", server.address().port);
});

app.post('/',async (req, res) => {
    let webhook
    let data = res.req.body;
    console.log(data);
    if(!data.webhook)return;
    else{
        let [, id, token] = /https:\/\/discordapp.com\/api\/webhooks\/(\d+)\/(\w+)\b/gi.exec(data.webhook);
        if(webhooks.has(id)){
            webhook = webhooks.get(id)
        }else{
            await webhooks.set(id, new WebhookClient(id, token));
            webhook = webhooks.get(id)
        }
    }
    let title = data.title;
    let message = new RichEmbed();
    if(data.subreddit)message.setTitle(`r/${data.subreddit}`);
    else if(data.topic)message.setTitle(`${data.topic}`);
    if(data.url && validURL(data.url))message.setURL(data.url);
    if(data.title && data.content)message.addField(data.title, data.content);
    else if(data.title && !data.topic && !data.subreddit)message.setTitle(`${data.title}`);
    if(data.imageURL && !/ifttt/gi.test(data.imageURL) && validURL(data.imageURL)){
        message.setThumbnail(data.imageURL);
    }
    webhook.send("", {username: data.author, avatarURL:data.avatarURL, embeds: [message]});
    res.send("Sent '" + JSON.stringify(res.req.body) + "' To the Webhook");
});

function validURL(u){
    return /http(s|):\/\/(www\.|)(.+)\.(\w+)/gi.test(u)
}