"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/index");
const discord_js_1 = require("discord.js");
const index_2 = require("@/index");
index_1.client.on(discord_js_1.Events.VoiceStateUpdate, async (oldVoice, newVoice) => {
    // Enter event
    if (!oldVoice.channelId && newVoice.channelId) {
        let date = new Date();
        // @ts-ignore
        let entry = `${newVoice.member.user.tag} entrou - ${newVoice.channel.name} às ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log(entry);
    }
    // Leave event
    if (oldVoice.channelId && !newVoice.channelId) {
        let date = new Date();
        // @ts-ignore
        let entry = `${newVoice.member.user.tag} saiu - ${oldVoice.channel.name} às ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log(entry);
    }
    // Discard event, if was a microphone change.
    if (oldVoice.mute !== newVoice.mute) {
        console.log("EVENTO CANCELADO, motivo: disparado por evento 'mute'");
        return;
    }
    // Discard event, if was a deaf change.
    if (oldVoice.deaf !== newVoice.deaf) {
        console.log("EVENTO CANCELADO, motivo: disparado por evento 'deaf'");
        return;
    }
    // Discard event, if game is not running
    if (!index_2.game.isRunning()) {
        return;
    }
    // Discard event
    // @ts-ignore
    if (newVoice.guild.id !== index_2.game.voiceChannel.id) {
        console.log("EVENTO CANCELADO, motivo: disparado por evento em outro canal de voz.");
    }
    console.log("JOGADORES JOGANDO:");
    index_2.game.showPlayers();
    console.log("MEMBROS NO CANAL DE VOZ DO JOGO");
    index_2.game.showMembersInVoiceChannel();
    index_2.game.scan();
});
