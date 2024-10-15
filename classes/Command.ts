import {SlashCommandBuilder, SlashCommandOptionsOnlyBuilder} from "discord.js";

type CommandType = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

export class Command {
    data : CommandType
    execute : Function

    constructor(data: CommandType, execute: Function) {
        this.data = data;
        this.execute = execute;
    }

    get name (): string {
        return this.data.name;
    }
}

