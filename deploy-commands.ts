import process from "node:process";

require("tsconfig-paths/register");
import { config } from 'dotenv';
config();

import path from "node:path";
import fs from "node:fs";
import { Command } from "@/classes/Command";
import {REST, Routes} from "discord.js";

//@ts-ignore
const commands = [];
const folderPath: string = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

async function loadCommands() {
    for (const dir of commandFolders) {
        const commandFolder: string = path.join(folderPath, dir);
        const commandFiles: string[] = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));

        console.log("Pasta: " + dir);
        console.log(commandFiles);

        for (const file of commandFiles) {
            const filePath = path.join(commandFolder, file);
            console.log(filePath);

            try {
                const exported  = await import(filePath);
                const command : Command = exported.command
                commands.push(command.data.toJSON());
            } catch (error) {
                console.error(`Erro ao importar ${filePath}:`, error);
            }
        }
    }

    // @ts-ignore
    const rest : REST = new REST().setToken(process.env.TOKEN);

    await (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                // @ts-ignore
                Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
                // @ts-ignore
                {body: commands},
            );

            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();

}

loadCommands();
