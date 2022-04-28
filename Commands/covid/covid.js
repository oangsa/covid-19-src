const axios = require('axios');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "covid",
    description: "Get the latest covid-19 stats",
    options: [
        {
            name: "all",
            description: "Get all stats",
            type: "SUB_COMMAND",
            require: true,
        },
    ],
   /**
     * @param {Client} client
     * @param {CommandInteraction} interaction 
     */
     async execute(interaction, client) {
        const { options } = interaction;
        const data = await axios.get('https://covid19.ddc.moph.go.th/api/Cases/today-cases-all')
        const log = data.data[0];
        
        
        try {
            switch(options.getSubcommand()){
                case "all": {
                    const embed = new MessageEmbed()
                    .setDescription("Covid-19 Information Bot | Covid-19 Manager")
                    .setColor("GREY")
                    .addFields({ name: "🤒ยอดผู้ติดเชื้อ:", value: `\`\`\`${log.total_case}(+${log.new_case}) ราย\`\`\``, inline: true})
                    .addFields({ name: "😄ยอดรักษาหาย:", value: `\`\`\`${log.total_recovered}(+${log.new_recovered}) ราย\`\`\``, inline: true})
                    .addFields({ name: "💀ยอดผู้เสียชีวิต:", value: `\`\`\`${log.total_death}(+${log.new_death}) ราย\`\`\``, inline: false},{ name: "ฐานข้อมูลวันที่:", value: `\`\`\`${log.txn_date}\`\`\``, inline: false})
                    .setTimestamp()

                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
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