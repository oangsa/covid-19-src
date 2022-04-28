const { Perms } = require('../Validations/Permission');
const { Client } = require('discord.js');


/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Commands Loaded");

    CommandsArry = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const commands = require(file);

        if(!commands.name)
        return Table.addRow(file.split("/")[7], "🔸 FAILD", "Missing a name.")

        if(!commands.context && !commands.description)
        return Table.addRow(commands.name, "🔸 FAILD", "Missing a description.")
        if(commands.permission) {
            if(Perms.includes(commands.permission))
            commands.defaultPermission = false;
            else
            return Table.addRow(commands.name, "🔶 FAILD", "Permission is invalid.")
        }

        client.commands.set(commands.name, commands);
        CommandsArry.push(commands);

        await Table.addRow(commands.name, "🔷 SUCCESSFUL")
    });

    console.log(Table.toString());

    //Permission Check (NOT REQUIRED)

    client.on("ready", async () => {
        const clientId = "961476329839161394";

        client.application.commands.set(CommandsArry).then(async (commands) => {
            const Roles = (commandName) => {
                const cmdPerms = CommandsArry.find((c) => c.name === commandName).permission;
                if(!cmdPerms) return null;
            }
            const fullPermissions = commands.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if(!roles) return accumulator;

                const permissions = roles.reduce((a, r) => {
                    return [...a, {id: r.id, type: "ROLE", permissions: true}]
                }, []);

                return [...accumulator, {id: r.id, permissions}]
            }, []);
            // await client.application.commands.permissions.set({ fullPermissions });
        });
    });

}