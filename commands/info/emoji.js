const { Command } = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            group: 'info',
            memberName: 'emoji',
            guildOnly: true,
            description: 'Makes your given emoji bigger, or sends all your server emojis!',
            examples: ['~emoji <emoji>'],
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [
              {
                key: 'emoji',
                prompt: 'Please give me an emoji to magnify!',
                type: 'string',
                default: ''
              }
            ]
        });
    }

    async run (message, args) {
        let emoji = message.content.split(/\s+/g).slice(1).join(" ")

        if(!emoji) {
            const emojis = message.guild.emojis;
            if (!emojis.size) return message.channel.send('You have no custom emoji.');

            return message.channel.send(`**Here's all the custom emojis in ${message.guild.name}[${emojis.size}]!**\n${emojis.map(e => e).join('')}`);

        } else {
          const args = message.content.split(" "); 
          
          emoji = args.join(' ').replace(/(<:\w+?:\d+?>)/g, '|$1|').split('|')
        
          if (emoji.length < 1) {
            message.channel.send('You must enter at least one emoji!');
          }
        
          let files = emoji.map(a => {
            const emoji = this.client.emojis.find(e => e.toString() === a)
        
            if (!emoji) {
              return null;
            }
        
            return emoji;
          }).filter(e => e);
        
          files.length = Math.min(10, files.length);
          files = files.map(e => {      
            return {
              attachment: e.url,
              name: `${e.name}-${e.id}.png`
            }
          })
        
          if (!files.length) {
            return message.channel.send('That emoji is not a custom emoji in this server!');
          }
        
          return message.channel.send({ files });
      }
    }
}