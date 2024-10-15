"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = __importDefault(require("node:process"));
require("tsconfig-paths/register");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const discord_js_1 = require("discord.js");
//@ts-ignore
const commands = [];
const folderPath = node_path_1.default.join(__dirname, 'commands');
const commandFolders = node_fs_1.default.readdirSync(folderPath);
async function loadCommands() {
    for (const dir of commandFolders) {
        const commandFolder = node_path_1.default.join(folderPath, dir);
        const commandFiles = node_fs_1.default.readdirSync(commandFolder).filter(file => file.endsWith('.js'));
        console.log("Pasta: " + dir);
        console.log(commandFiles);
        for (const file of commandFiles) {
            const filePath = node_path_1.default.join(commandFolder, file);
            console.log(filePath);
            try {
                const exported = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
                const command = exported.command;
                commands.push(command.data.toJSON());
            }
            catch (error) {
                console.error(`Erro ao importar ${filePath}:`, error);
            }
        }
    }
    // @ts-ignore
    const rest = new discord_js_1.REST().setToken(node_process_1.default.env.TOKEN);
    await (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
            // @ts-ignore
            discord_js_1.Routes.applicationGuildCommands(node_process_1.default.env.CLIENTID, node_process_1.default.env.GUILDID), 
            // @ts-ignore
            { body: commands });
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}
loadCommands();
