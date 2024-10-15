
require("tsconfig-paths/register");

import {
    Client,
    Collection,
    Events
} from "discord.js";

import {Command} from "@classes/Command"

import { config } from 'dotenv';
config();

import fs from 'node:fs';
import path from 'node:path';


const client = new Client({
    // Declaring bot intents
    intents:
        [
        ]
})

// Create a Commands Collection
let commands = new Collection<string, Command>();

// Get all commands in commands folder and put it in Commands Collection
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        import(filePath).then(
            exported => {
                commands.set(exported.command.name, exported.command)
            }
        )
    }
}

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN)

export { client, commands};

import "@handlers/InteractionCreateEvent"
import "@handlers/VoiceStateUpdateEvent"

