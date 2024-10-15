"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/index");
const discord_js_1 = require("discord.js");
index_1.client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        ChatInputHandler(interaction);
        return;
    }
    if (interaction.isButton()) {
        ButtonHandler(interaction);
        return;
    }
});
async function ChatInputHandler(interaction) {
    const command = index_1.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}
async function ButtonHandler(interaction) {
    let queryRegistry = index_1.extractor.isMessageRegistered(interaction.message.id);
    if (queryRegistry === null) {
        console.error(`No command matching ${interaction.message.id} was found.`);
    }
    let selectedSong = interaction.customId;
    // @ts-ignore
    let track = queryRegistry.tracks.find(t => t.id === selectedSong);
    if (!track) {
        throw new Error(`Track with id ${selectedSong} not found`);
    }
    index_1.audioplayer.enqueueTrack(track, index_1.extractor.downloadTrack(track).then((value) => index_1.audioplayer.createAudioResource(value)));
    //Generate view
    let label = interaction.component;
    const embeds = interaction.message.embeds;
    const newEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`${interaction.user.displayName} selecionou a música ${label.label}`);
    // @ts-ignore
    embeds.push(newEmbed);
    const buttons = interaction.message.components[0].components;
    const newRow = new discord_js_1.ActionRowBuilder();
    buttons.forEach((btn) => {
        newRow.addComponents(
        // @ts-ignore
        new discord_js_1.ButtonBuilder().setLabel(btn.label).setDisabled(true).setStyle(btn.style).setCustomId(btn.customId));
    });
    interaction.update({
        embeds: embeds,
        // @ts-ignore
        components: [newRow]
    });
}
