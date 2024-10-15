import { client } from "@/index";
import { Events } from "discord.js";
import { game } from "@/index"

client.on(Events.VoiceStateUpdate, async(oldVoice, newVoice) => {
    // Enter event
    if (!oldVoice.channelId && newVoice.channelId) {
        let date = new Date()
        // @ts-ignore
        let entry = `${newVoice.member.user.tag} entrou - ${newVoice.channel.name} às ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        console.log(entry);
    }

    // Leave event
    if (oldVoice.channelId && !newVoice.channelId) {
        let date = new Date()
        // @ts-ignore
        let entry = `${newVoice.member.user.tag} saiu - ${oldVoice.channel.name} às ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        console.log(entry);
    }


    // Discard event, if was a microphone change.
    if (oldVoice.mute !== newVoice.mute) {
        console.log("EVENTO CANCELADO, motivo: disparado por evento 'mute'")
        return;
    }

    // Discard event, if was a deaf change.
    if (oldVoice.deaf !== newVoice.deaf) {
        console.log("EVENTO CANCELADO, motivo: disparado por evento 'deaf'")
        return;
    }

    // Discard event, if game is not running
    if (!game.isRunning()) {
        return;
    }

    // Discard event
    // @ts-ignore
    if (newVoice.guild.id !== game.voiceChannel.id) {
        console.log("EVENTO CANCELADO, motivo: disparado por evento em outro canal de voz.")
    }

    console.log("JOGADORES JOGANDO:")
    game.showPlayers()

    console.log("MEMBROS NO CANAL DE VOZ DO JOGO")
    game.showMembersInVoiceChannel()

    game.scan()
})