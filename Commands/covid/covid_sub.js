const axios = require('axios');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    name: "covid_sub",
    description: "Get the latest covid-19 stats",
    options: [
        {
            name: "enable",
            description: "getting covid-19 stats everyday",
            type: "SUB_COMMAND",
            require: true,
            options: [
                {
                    name: "channel",
                    description: "Set channel",
                    type: "CHANNEL",
                    require: true,
                }
            ]
        },
        {
            name: "disable",
            description: "unsend covid-19 stats everyday",
            type: "SUB_COMMAND",
            require: true,
        }
    ],
   /**
     * @param {Client} client
     * @param {CommandInteraction} interaction 
     */
     async execute(interaction, client) {
        const { options } = interaction;
        const channel = options.getChannel("channel");
        const data = await axios.get('https://covid19.ddc.moph.go.th/api/Cases/today-cases-all')
        const log = data.data[0];
        var rule = new schedule.RecurrenceRule();
        rule.second = 0;
        rule.minute = 0;
        rule.hour = 12;
        rule.tz = 'Asia/Bangkok';
        try {
            switch(options.getSubcommand()){
                case "enable": {
                    schedule.scheduleJob(rule, function(){
                        const embed = new MessageEmbed()
                        .setDescription("Covid-19 Information Bot | Covid-19 Manager")
                        .setColor("GREY")
                        .addFields({ name: "🤒ยอดผู้ติดเชื้อ:", value: `\`\`\`${log.total_case}(+${log.new_case}) ราย\`\`\``, inline: true})
                        .addFields({ name: "😄ยอดรักษาหาย:", value: `\`\`\`${log.total_recovered}(+${log.new_recovered}) ราย\`\`\``, inline: true})
                        .addFields({ name: "💀ยอดผู้เสียชีวิต:", value: `\`\`\`${log.total_death}(+${log.new_death}) ราย\`\`\``, inline: false},{ name: "ฐานข้อมูลวันที่:", value: `\`\`\`${log.txn_date}\`\`\``, inline: false})
                        .setTimestamp()
            
                        channel.send({
                            embeds: [embed]
                        });
                    });
                    return interaction.reply({
                        content: `I will sent covid 19 stats to ${channel} everyday at 12.00 AM (GMT+7)`,
                        ephemeral: true
                    })
                }
                case "disable":{
                    schedule.gracefulShutdown()
                    return interaction.reply({
                        content: `I will stop sending covid 19 stats everyday.`,
                    })
                }
            }

        } catch (error) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`⚠️ เตือน: ${error}`);
            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
        }
    }
}