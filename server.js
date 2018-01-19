const express = require("express");
const settings = require("./settings.json");
const request = require('request');
const clear = require('clear');
const bodyParser = require("body-parser");
const {WebhookClient, RichEmbed} = require("discord.js");
const app = express();

var webhook;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3000, function () {
    clear();
    webhook = new WebhookClient(settings.id, settings.token);
    console.log("Listening on port %s...", server.address().port);
});

app.post('/', (req, res) => {
    console.log("got the post", res.req.body);
    let data = res.req.body;
    let title = data.title;
    let content = data.content;
    let message = new RichEmbed()
    .setTitle(`r/${data.subreddit}`)
    .setURL(data.url)
    .addField(data.title, data.content);
    if(data.imageURL != "http://ifttt.com/images/no_image_card.png"){
        message.setImage(data.imageURL);
    }
    
    let author = data.author;
    let subreddit = data.subreddit;
    let url = data.url;
    let image = data.imageURL;
    webhook.send("", {username: data.author, avatarURL:"http://i0.kym-cdn.com/entries/icons/original/000/022/240/jiji.png", embeds: [message]});
    console.log(author, title, content, subreddit, url, image);
    res.send("Done");
});