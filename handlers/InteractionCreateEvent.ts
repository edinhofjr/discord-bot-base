import { client, commands } from "@index"

import {
    Interaction
} from "discord.js";

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        ChatInputHandler(interaction);
        return;
    }
})

async function ChatInputHandler(interaction : Interaction ) {
}

async function ButtonHandler(interaction : Interaction ) {
}
