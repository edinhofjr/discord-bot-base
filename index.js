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
exports.extractor = exports.audioplayer = exports.game = exports.commands = exports.client = void 0;
require("tsconfig-paths/register");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const discord_js_1 = require("discord.js");
const Game_1 = require("@/classes/Game");
const AudioPlayer_1 = require("@/classes/AudioPlayer");
const client = new discord_js_1.Client({
    // Declaring bot intents
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
exports.client = client;
// Create a Commands Collection
let commands = new discord_js_1.Collection();
exports.commands = commands;
// Get all commands in commands folder and put it in Commands Collection
const foldersPath = node_path_1.default.join(__dirname, 'commands');
const commandFolders = node_fs_1.default.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = node_path_1.default.join(foldersPath, folder);
    const commandFiles = node_fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = node_path_1.default.join(commandsPath, file);
        Promise.resolve(`${filePath}`).then(s => __importStar(require(s))).then(exported => {
            commands.set(exported.command.name, exported.command);
        });
    }
}
// When the client is ready, run this code (only once).
client.once(discord_js_1.Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(node_process_1.default.env.TOKEN);
const game = new Game_1.Game();
exports.game = game;
const audioplayer = new AudioPlayer_1.MyAudioPlayer(client);
exports.audioplayer = audioplayer;
const Extractor_1 = require("@/classes/Extractor");
const extractor = new Extractor_1.Extractor(client);
exports.extractor = extractor;
require("@handlers/InteractionCreateEvent");
require("@handlers/VoiceStateUpdateEvent");
